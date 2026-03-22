import { Globe, Mic, Bell, LogOut, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [notifsEnabled, setNotifsEnabled] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };
  
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-saffron text-white p-6 pt-10 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="p-5 space-y-6 overflow-y-auto pb-8">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2">Preferences</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 border-b border-slate-50 transition-colors">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-500"><Globe size={20} /></div>
              <span className="font-semibold text-slate-700 flex-1 text-left">Language</span>
              <span className="text-sm font-bold text-saffron">English <ChevronRight size={16} className="inline text-slate-300"/></span>
            </button>
            <div className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 border-b border-slate-50 transition-colors">
              <div className="bg-purple-50 p-2 rounded-xl text-purple-500"><Mic size={20} /></div>
              <span className="font-semibold text-slate-700 flex-1">Voice-to-Text</span>
              <div 
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${voiceEnabled ? 'bg-indiaGreen' : 'bg-slate-200'}`}
                onClick={() => setVoiceEnabled(!voiceEnabled)}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${voiceEnabled ? 'translate-x-6' : ''}`}></div>
              </div>
            </div>
            <div className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 border-b border-slate-50 transition-colors">
              <div className="bg-orange-50 p-2 rounded-xl text-orange-500"><Bell size={20} /></div>
              <span className="font-semibold text-slate-700 flex-1">Notifications</span>
              <div 
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notifsEnabled ? 'bg-indiaGreen' : 'bg-slate-200'}`}
                onClick={() => setNotifsEnabled(!notifsEnabled)}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${notifsEnabled ? 'translate-x-6' : ''}`}></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2">Account</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 hover:bg-red-50 text-red-500 transition-colors">
              <div className="bg-red-50 p-2 rounded-xl text-red-500"><LogOut size={20} /></div>
              <span className="font-semibold flex-1 text-left">Log Out</span>
            </button>
          </div>
        </div>
        
        <p className="text-center text-xs text-slate-400 font-medium">Civic Issue System v1.0 <br/> Open Source Government PWA</p>
      </div>
    </div>
  );
}
