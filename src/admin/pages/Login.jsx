import { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { checkAdminRole } from '../../firebase/services';
import { useNavigate } from 'react-router-dom';
import { FileSearch } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Authenticating Admin Credentials...");
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      
      // Strict Role Verification
      const isAdmin = await checkAdminRole(userCred.user.uid);
      if (!isAdmin) {
          await signOut(auth);
          toast.error("Access Denied: You do not have Admin privileges.", { id: loadingToast });
          return;
      }

      toast.success("Secure Admin Login verified!", { id: loadingToast });
      navigate('/admin/reports');
    } catch (error) {
       toast.error(error.message, { id: loadingToast });
    }
  };

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
         <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-tr from-saffron to-orange-400 p-3.5 rounded-2xl text-white shadow-lg shadow-orange-500/30 mb-4">
              <FileSearch size={32} strokeWidth={2.5}/>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">CivicAdmin</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Authorized Personnel Only</p>
         </div>

         <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl p-3 focus:outline-none focus:border-saffron focus:bg-white transition-all text-sm font-semibold text-slate-700 placeholder-slate-400" placeholder="admin@gov.in" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl p-3 focus:outline-none focus:border-saffron focus:bg-white transition-all text-sm font-semibold text-slate-700" placeholder="••••••••" />
            </div>
            
            <button type="submit" className="w-full py-3.5 mt-4 bg-slate-900 text-white font-bold rounded-xl shadow-md shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 text-sm uppercase tracking-wider">
              Secure Login
            </button>
         </form>
         
         <div className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
           Protected by Firebase Authentication
         </div>
      </div>
    </div>
  );
}
