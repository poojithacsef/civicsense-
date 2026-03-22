import { ShieldAlert, User, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginOptions() {
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-slate-50 p-6 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-100/40 via-slate-50 to-slate-50 pointer-events-none"></div>
      
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-w-sm animate-in fade-in zoom-in-95 duration-500 relative z-10">
         <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">CivicSense</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Select your portal</p>
         </div>

         <div className="space-y-4">
            <button 
              onClick={() => navigate('/login/citizen')}
              className="w-full group bg-slate-50 hover:bg-orange-50 border-2 border-slate-100 hover:border-saffron p-4 rounded-xl transition-all flex items-center gap-4 text-left active:scale-95"
            >
               <div className="bg-white p-3 rounded-full text-saffron shadow-sm group-hover:scale-110 transition-transform">
                 <User size={24} />
               </div>
               <div className="flex-1">
                 <h2 className="font-bold text-slate-800">Citizen Login</h2>
                 <p className="text-xs text-slate-500 font-medium">Report civic issues</p>
               </div>
               <ChevronRight size={20} className="text-slate-300 group-hover:text-saffron transition-colors" />
            </button>

            <button 
              onClick={() => navigate('/admin/login')}
              className="w-full group bg-slate-50 hover:bg-slate-800 border-2 border-slate-100 hover:border-slate-800 p-4 rounded-xl transition-all flex items-center gap-4 text-left active:scale-95 hover:shadow-lg"
            >
               <div className="bg-white p-3 rounded-full text-slate-700 shadow-sm group-hover:scale-110 transition-transform group-hover:bg-slate-700 group-hover:text-white">
                 <ShieldAlert size={24} />
               </div>
               <div className="flex-1">
                 <h2 className="font-bold text-slate-800 group-hover:text-white transition-colors">Admin Dashboard</h2>
                 <p className="text-xs text-slate-500 font-medium group-hover:text-slate-400 transition-colors">Manage & verify</p>
               </div>
               <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </button>
         </div>
      </div>
    </div>
  );
}
