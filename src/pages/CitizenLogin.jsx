import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { auth } from '../firebase/config';
import { saveUserRole } from '../firebase/services';
import { useNavigate } from 'react-router-dom';
import { User, Mail, ArrowRight, Loader2, UserCircle2, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CitizenLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isLogin ? "Signing in..." : "Creating account...");
    try {
      let result;
      if (isLogin) {
        result = await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully!", { id: toastId });
      } else {
        result = await createUserWithEmailAndPassword(auth, email, password);
        await saveUserRole(result.user.uid, result.user.email, "citizen");
        toast.success("Account created successfully!", { id: toastId });
      }
      navigate('/');
    } catch (error) {
      toast.error(error.message, { id: toastId });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    const toastId = toast.loading("Creating guest session...");
    try {
      const result = await signInAnonymously(auth);
      await saveUserRole(result.user.uid, "Guest", "citizen");
      toast.success("Logged in as Guest", { id: toastId });
      navigate('/');
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-w-sm animate-in fade-in zoom-in-95 duration-500">
         <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-tr from-saffron to-orange-400 p-3 rounded-2xl text-white shadow-lg shadow-orange-500/30 mb-4">
              <User size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome, Citizen</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium text-center">
              {isLogin ? "Login to report and track issues" : "Create an account to track issues"}
            </p>
         </div>

         <form onSubmit={handleAuth} className="space-y-4 mb-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-saffron focus:bg-white transition-all text-sm font-semibold text-slate-700 tracking-wider" placeholder="citizen@example.com" />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-saffron focus:bg-white transition-all text-sm font-semibold text-slate-700 tracking-wider" placeholder="••••••••" minLength={6} />
              </div>
            </div>
            
            <button disabled={loading} type="submit" className="w-full py-3.5 mt-2 bg-saffron text-white font-bold rounded-xl shadow-md shadow-saffron/20 hover:bg-orange-600 transition-all active:scale-95 text-sm uppercase tracking-wider flex justify-center items-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? <>Login <ArrowRight size={18} /></> : <>Sign Up <ArrowRight size={18} /></>)}
            </button>
            
            <div className="text-center mt-4">
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-xs font-bold text-saffron hover:text-orange-600 transition-colors uppercase tracking-wider">
                {isLogin ? "New Citizen? Create Account" : "Already have an account? Login"}
              </button>
            </div>
         </form>
         
         <div className="relative flex items-center justify-center my-6">
           <hr className="w-full border-slate-100" />
           <span className="absolute bg-white px-3 text-[10px] font-bold text-slate-300 uppercase tracking-widest">OR</span>
         </div>
         
         <button disabled={loading} type="button" onClick={handleGuest} className="w-full py-3 border-2 border-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95 text-xs uppercase tracking-wider flex justify-center items-center gap-2">
           <UserCircle2 size={16} /> Continue as Guest
         </button>
      </div>
    </div>
  );
}
