import { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Mic, Send, ChevronRight, CheckCircle2, LocateFixed, Loader2 } from 'lucide-react';
import { addReport, syncOfflineReports, getRecentReports } from '../../firebase/services';
import { checkSimilarity } from '../../utils/similarity';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

export default function ReportStepper() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ category: '', description: '', location: null });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSpeechResult = (text) => {
    setFormData(prev => ({ ...prev, description: (prev.description + ' ' + text).trim() }));
  };

  const { isListening, micStatus, startListening, stopListening } = useSpeechRecognition({
    onResult: handleSpeechResult,
    onError: (err) => toast.error(err)
  });

  const categories = ["Roads", "Sanitation", "Electrical", "Water Supply", "Public Safety", "Other"];

  useEffect(() => {
    if (navigator.onLine) syncOfflineReports();
    window.addEventListener('online', syncOfflineReports);
    return () => window.removeEventListener('online', syncOfflineReports);
  }, []);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('fileSizeError') || "File size must be under 5MB");
        return;
      }
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
      nextStep();
    }
  };

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      const loadId = toast.loading(t('acquiringGPS') || "Acquiring GPS fix...");
      navigator.geolocation.getCurrentPosition(
        position => {
          setFormData({
            ...formData, 
            location: { lat: position.coords.latitude, lng: position.coords.longitude, address: "Detected via GPS" }
          });
          toast.success(t('gpsLocked') || "Location locked successfully!", { id: loadId });
        },
        error => toast.error((t('gpsError') || "GPS Error: ") + error.message, { id: loadId })
      );
    } else {
      toast.error(t('geoNotSupported') || "Geolocation not supported by this browser.");
    }
  };

  const submitReport = async (skipDedupe = false) => {
    if (!formData.category || !formData.location) {
        toast.error(t('completeFields') || "Please ensure category and location are complete.");
        return;
    }
    setSubmitting(true);
    const loadingToast = toast.loading(t('submitting') || "Submitting report...");
    try {
      if (skipDedupe !== true) {
         const recent = await getRecentReports();
         const duplicateMatch = checkSimilarity(formData, recent);
         if (duplicateMatch) {
            toast.dismiss(loadingToast);
            setSubmitting(false);
            if (window.confirm(t('similarWarning') || "Similar report already exists. Do you still want to submit?")) {
               setFormData(prev => ({ ...prev, possibleDuplicate: true }));
               // Directly call addReport without running deduplication again
               setSubmitting(true);
               const newToast = toast.loading(t('submitting') || "Submitting report...");
               await addReport({...formData, possibleDuplicate: true}, mediaFile);
               toast.success(t('submitSuccess') || "Report successfully added to database!", { id: newToast });
               navigate('/');
            }
            return;
         }
      }
      await addReport(formData, mediaFile);
      toast.success(t('submitSuccess') || "Report successfully added to database!", { id: loadingToast });
      navigate('/');
    } catch (e) {
      console.error(e);
      toast.error(t('networkIssue') || "Network issue. Saved offline, will sync later.", { id: loadingToast });
      navigate('/'); 
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="bg-saffron text-white p-4 pt-6 shadow-sm sticky top-0 z-10 flex flex-col justify-end">
        <h1 className="text-xl font-bold">{t('newReport')}</h1>
        <div className="flex justify-between mt-4">
          {[1,2,3,4].map(s => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                ${step >= s ? 'bg-white text-saffron border-white shadow-md shadow-white/20' : 'bg-transparent text-white/50 border-white/50'}`}>
                {step > s ? <CheckCircle2 size={16} /> : s}
              </div>
              {s !== 4 && (
                <div className={`h-[2px] w-full mt-[-16px] ml-[50%] z-[-1] transition-colors duration-500
                  ${step > s ? 'bg-white' : 'bg-white/30'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] mt-2 font-bold opacity-90 px-2 tracking-wide uppercase">
          <span>Category</span><span className="pl-2">Details</span><span className="pl-4">Evidence</span><span>Review</span>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">{t('selectCategory')}</h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => { setFormData({...formData, category: cat}); nextStep(); }}
                  className={`p-4 rounded-2xl border-2 text-left font-bold transition-all active:scale-95 ${
                    formData.category === cat 
                      ? 'border-saffron bg-orange-50 text-saffron shadow-sm shadow-orange-100' 
                      : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t(cat) || cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">{t('incidentDetails')}</h2>
            <div className="flex justify-between items-center mb-6">
               <p className="text-slate-500 text-sm">{t('describeIssue')}</p>
               {micStatus !== "Stopped" && <p className={`text-xs font-bold ${isListening ? 'text-red-500 animate-pulse' : 'text-saffron'}`}>Mic: {micStatus}</p>}
            </div>
            <div className="relative group">
              <textarea 
                rows={6}
                className="w-full border-2 border-slate-100 rounded-2xl p-4 focus:outline-none focus:border-saffron text-slate-700 bg-slate-50 transition-colors shadow-inner"
                placeholder={t('descPlaceholder') || "E.g., Huge pothole in the middle of the road causing danger to bikers during nights..."}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
              <button 
                className={`absolute bottom-4 right-4 shadow-md p-3 rounded-full transition-all active:scale-90 ${isListening ? 'bg-red-50 text-red-500 animate-pulse border border-red-200' : 'bg-white text-slate-400 hover:text-saffron'}`}
                onClick={isListening ? stopListening : startListening}
              >
                <Mic size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
             <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">{t('uploadEvidence')}</h2>
             <p className="text-slate-500 text-sm mb-6">{t('addPhotos')}</p>
             
             <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
             
             {mediaPreview ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm">
                  <img src={mediaPreview} className="w-full h-48 object-cover" />
                  <button onClick={() => { setMediaFile(null); setMediaPreview(null); }} className="absolute top-2 right-2 bg-black/50 backdrop-blur text-white p-2 rounded-full text-xs font-bold hover:bg-black/70 transition-colors">{t('retake')}</button>
                </div>
             ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-500 gap-3 cursor-pointer hover:bg-slate-100 hover:border-saffron hover:text-saffron transition-all shadow-inner active:scale-95"
                >
                  <div className="bg-white p-4 rounded-full shadow-sm text-saffron"><Camera size={32} /></div>
                  <span className="font-bold text-slate-700">{t('tapCamera')}</span>
                  <span className="text-xs font-medium">{t('chooseGallery')}</span>
               </div>
             )}
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
             <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">{t('confirmLocation')}</h2>
             <p className="text-slate-500 text-sm mb-6">{t('pinpointArea')}</p>
             
             {!formData.location ? (
                <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl py-12 flex flex-col items-center justify-center gap-4">
                   <div className="bg-white p-4 rounded-full text-blue-500 shadow-sm"><LocateFixed size={32} /></div>
                   <button onClick={requestLocation} className="bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-md active:scale-95">{t('autoDetectGPS')}</button>
                </div>
             ) : (
                 <div className="animate-in zoom-in-95 duration-300">
                   <div className="bg-slate-100 rounded-2xl h-48 mb-4 border-2 border-slate-200 relative overflow-hidden flex items-center justify-center shadow-inner">
                      <div className="absolute inset-0 bg-blue-50/50 backdrop-blur-[1px]"></div>
                      <MapPin size={40} className="absolute text-red-500 drop-shadow-md z-10 animate-bounce" />
                      <div className="bg-white/80 backdrop-blur-sm absolute bottom-3 text-xs font-bold text-slate-600 px-3 py-1.5 rounded-md shadow-sm">
                        {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                      </div>
                   </div>
                   <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{t('detectedAddress')}</h4>
                     <p className="font-bold text-slate-700 flex items-center gap-2"><CheckCircle2 size={16} className="text-indiaGreen"/> {formData.location.address}</p>
                   </div>
                 </div>
             )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white flex justify-between gap-4 pb-8 safe-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        {step > 1 ? (
          <button disabled={submitting} onClick={prevStep} className="px-6 py-3.5 text-slate-500 font-bold bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50">
            {t('back')}
          </button>
        ) : <div/>}

        {step < 4 ? (
          <button onClick={nextStep} disabled={step === 1 && !formData.category} className="flex-1 flex justify-center items-center gap-2 px-6 py-3.5 bg-saffron text-white font-bold rounded-xl shadow-[0_4px_14px_rgba(255,153,51,0.3)] hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none">
            {t('next')} <ChevronRight size={18} />
          </button>
        ) : (
          <button onClick={submitReport} disabled={submitting || !formData.category || !formData.location} className="flex-1 flex justify-center items-center gap-2 px-6 py-3.5 bg-indiaGreen text-white font-bold rounded-xl shadow-[0_4px_14px_rgba(19,136,8,0.3)] hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none">
            {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> {t('submitReport')}</>}
          </button>
        )}
      </div>
    </div>
  );
}
