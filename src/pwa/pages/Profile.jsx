import { useState, useEffect } from 'react';
import { User, Phone, Award, Star, History, Mail } from 'lucide-react';
import { subscribeToReports } from '../../firebase/services';
import { auth } from '../../firebase/config';
import toast from 'react-hot-toast';

export default function Profile() {
  const [reports, setReports] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(auth.currentUser);
    const unsubscribe = subscribeToReports(data => {
      setReports(data);
    });
    return () => unsubscribe();
  }, []);

  const contact = user ? (user.email || user.phoneNumber || "Guest") : "Anonymous";
  const myReports = reports.filter(r => r.reporterPhone === contact);
  const totalUpvotes = myReports.reduce((sum, r) => sum + (r.upvotes || 0), 0);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-saffron text-white p-6 pt-10 rounded-b-[2rem] shadow-md text-center relative">
        <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-lg mb-3">
          <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
            <User size={40} />
          </div>
        </div>
        <h2 className="text-2xl font-bold">{user?.displayName || "Citizen Reporter"}</h2>
        <p className="text-white/80 flex items-center justify-center gap-1 mt-1 text-sm">
          {user?.email ? <Mail size={14} /> : <Phone size={14} />} {contact}
        </p>
      </div>

      <div className="p-5 flex-1 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
            <span className="text-3xl font-bold text-saffron mb-1">{myReports.length}</span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Reports</span>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
            <span className="text-3xl font-bold text-indiaGreen mb-1">{totalUpvotes}</span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Upvotes</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3 ml-1">Your Badges</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <div className="min-w-[120px] bg-orange-50 border border-orange-100 p-3 rounded-2xl flex flex-col items-center flex-shrink-0">
              <div className="bg-orange-100 p-2 rounded-full text-saffron mb-2"><Award size={24} /></div>
              <span className="text-xs font-bold text-slate-700 text-center leading-tight">Active<br/>Reporter</span>
            </div>
            {myReports.length > 2 && (
              <div className="min-w-[120px] bg-green-50 border border-green-100 p-3 rounded-2xl flex flex-col items-center flex-shrink-0 animate-in zoom-in-90 duration-500">
                <div className="bg-green-100 p-2 rounded-full text-indiaGreen mb-2"><Star size={24} /></div>
                <span className="text-xs font-bold text-slate-700 text-center leading-tight">Community<br/>Helper</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <button onClick={() => toast.success('You have viewed your report history')} className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 border-b border-slate-50 transition-colors">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-500"><History size={20} /></div>
            <span className="font-semibold text-slate-700 flex-1 text-left">Report History</span>
          </button>
          <button onClick={() => window.location.href = 'tel:112'} className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
            <div className="bg-red-50 p-2 rounded-xl text-red-500"><Phone size={20} /></div>
            <span className="font-semibold text-slate-700 flex-1 text-left">Emergency Helpline (112)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
