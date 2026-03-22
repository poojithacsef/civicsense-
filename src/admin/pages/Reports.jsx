import { useState, useEffect } from 'react';
import { subscribeToReports, updateReportStatus } from '../../firebase/services';
import { Search, Filter, Camera, AlignLeft, CheckCircle2, ChevronRight, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateNotes, setUpdateNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    // Real-time listener using onSnapshot
    const unsubscribe = subscribeToReports(data => {
      // Sort: High -> Medium -> Low
      const priorityWeights = { 'High': 3, 'Medium': 2, 'Low': 1 };
      const sorted = [...data].sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority]);
      setReports(sorted);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleUpdateClick = (report) => {
    setSelectedReport(report);
    setUpdateNotes('');
    setModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedReport) return;
    
    // Require notes & media check for Resolved (simplified for demo, usually involves actually uploading files here)
    if (newStatus === 'Resolved' && (!updateNotes || updateNotes.length < 5)) {
      toast.error("Please provide detailed resolution notes.");
      return;
    }
    
    const loadingToast = toast.loading(`Updating status to ${newStatus}...`);
    try {
      await updateReportStatus(selectedReport.id, newStatus, {
        notes: updateNotes,
        updatedBy: "Admin User", 
        // mediaUrl is mocked or omitted here unless we add a file picker to the admin modal too
      });
      toast.success(`${selectedReport.title} updated to ${newStatus}`, { id: loadingToast });
      setModalOpen(false);
    } catch (error) {
       toast.error("Failed to update status", { id: loadingToast });
       console.error(error);
    }
  };

  const statusOptions = ["Received", "Acknowledged", "In Progress", "Resolved", "Verified"];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports Management</h1>
          <p className="text-slate-500 text-sm mt-1">Live updates from Firestore. Sorts by High Priority.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search ID or Title..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-saffron focus:border-saffron focus:outline-none w-64 text-sm" />
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm text-slate-700 hover:bg-slate-50 transition-colors font-semibold text-sm">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Grid: 3 cards per row responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
        {reports.map(report => (
          <div key={report.id} className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border-t-[5px] flex flex-col overflow-hidden relative group animate-in fade-in duration-300
            ${report.priority === 'High' ? 'border-t-red-500' : report.priority === 'Medium' ? 'border-t-orange-500' : 'border-t-indiaGreen'}
          `}>
             {report.priority === 'High' && (
                <div className="absolute top-0 right-0 p-3 pointer-events-none z-10">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
             )}
             
             <div className="p-5 flex-1 flex flex-col relative z-0">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex gap-2 items-center">
                     <span className="text-xs font-bold text-slate-500 bg-slate-100/80 px-2 py-1 rounded-lg">#{report.id.substring(0,6)}</span>
                     <span className="text-[10px] font-bold px-2 py-1.5 rounded-lg uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-100 shadow-sm truncate max-w-[100px]">{report.category}</span>
                   </div>
                   <button onClick={() => handleUpdateClick(report)} className="text-white font-bold text-[11px] uppercase tracking-wider bg-saffron px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:bg-orange-600 shadow-md">
                     Update <ChevronRight size={14} />
                   </button>
                </div>

                <div className="flex gap-4 mb-4">
                   <div className="relative">
                     <img src={report.mediaUrls && report.mediaUrls.length > 0 ? report.mediaUrls[0] : 'https://images.unsplash.com/photo-1541888031525-452fdeabf3d8?auto=format&fit=crop&q=80'} className="w-16 h-16 rounded-xl object-cover shadow-sm bg-slate-100 flex-shrink-0" alt="Thumbnail" />
                     <div className="absolute inset-0 bg-black/10 rounded-xl pointer-events-none"></div>
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-900 text-[17px] leading-tight mb-1">{report.title}</h3>
                     <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                       {report.description || "No description provided."}
                     </p>
                     <span className="text-[11px] text-indiaGreen font-bold mt-1.5 inline-block hover:underline cursor-pointer">See More</span>
                   </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 grid grid-cols-2 gap-y-3 gap-x-2 bg-slate-50/50 -mx-5 px-5 pb-1">
                   <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Location</span>
                      <span className="text-xs font-semibold text-slate-700 truncate block pr-2">{report.location?.address || `${report.location?.lat.toFixed(4)}, ${report.location?.lng.toFixed(4)}`}</span>
                   </div>
                   <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Reported On</span>
                      <span className="text-xs font-semibold text-slate-700 truncate block">{report.createdAtStr}</span>
                   </div>
                   <div className="pb-3 pt-1">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Reporter</span>
                      <span className="text-xs font-semibold text-slate-700 truncate block">{report.reporterPhone.replace(/.(?=.{4})/g, '*')}</span>
                   </div>
                   <div className="pb-3 pt-1">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Status</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm inline-flex items-center gap-1
                        ${report.status === 'Resolved' ? 'bg-green-100 text-green-700 border border-green-200' :
                        report.status === 'In Progress' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${report.status === 'Resolved' ? 'bg-green-500' : report.status === 'In Progress' ? 'bg-blue-500' : 'bg-orange-500'}`}></span>
                        {report.status}
                      </span>
                   </div>
                </div>
             </div>
          </div>
        ))}
        {reports.length === 0 && (
          <div className="col-span-3 text-center py-20 text-slate-400 font-semibold">
             Fetching live reports from Firestore...
          </div>
        )}
      </div>

      {/* Update Modal */}
      {modalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm shadow-2xl drop-shadow-2xl">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/20">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 tracking-tight">
                Update Status <span className="bg-white px-2 py-0.5 rounded shadow-sm text-saffron border border-orange-100 text-sm">#{selectedReport.id.substring(0,6)}</span>
              </h2>
              <button disabled={uploading} onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white p-1.5 rounded-full shadow-sm hover:shadow transition-all"><X size={18} strokeWidth={3}/></button>
            </div>
            
            <div className="p-6">
              <div className="mb-8 p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-inner">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">Status Flow <span className="flex-1 h-px bg-slate-200"></span></h3>
                <div className="flex flex-wrap gap-2.5">
                  {statusOptions.map((status, i) => {
                    const isActive = selectedReport.status === status;
                    const isPast = statusOptions.indexOf(selectedReport.status) > i;
                    return (
                      <button 
                        key={status}
                        disabled={uploading}
                        onClick={() => handleStatusUpdate(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm
                          ${isActive ? 'bg-gradient-to-tr from-saffron to-orange-400 text-white border-orange-500 shadow-orange-500/30' : 
                            isPast ? 'bg-green-50 text-indiaGreen border-green-200 hover:bg-green-100' : 
                            'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                      >
                        {isPast && <CheckCircle2 size={14} />}
                        {status}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-5">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">Verification Actions <span className="flex-1 h-px bg-slate-200"></span></h3>
                 <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2 flex items-center gap-1.5"><AlignLeft size={16} className="text-slate-400"/> Resolution Notes</label>
                    <textarea 
                      rows={3}
                      className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl p-3 focus:outline-none focus:border-saffron focus:bg-white transition-all text-sm font-medium text-slate-700 placeholder-slate-400"
                      placeholder="Add specific details about the resolution or current progress..."
                      value={updateNotes}
                      onChange={e => setUpdateNotes(e.target.value)}
                    />
                 </div>
                 
                 <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2 flex items-center gap-1.5"><Camera size={16} className="text-slate-400"/> Attach Proof image/video</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 bg-slate-50 cursor-pointer hover:bg-orange-50 hover:border-saffron hover:text-saffron transition-all group">
                       <div className="bg-white p-3 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform"><Camera size={24} /></div>
                       <span className="text-sm font-bold">Click or drag files to append</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
