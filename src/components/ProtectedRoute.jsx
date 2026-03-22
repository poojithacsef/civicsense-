import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { checkAdminRole } from '../firebase/services';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
         const isAdmin = await checkAdminRole(currentUser.uid);
         if (isAdmin) {
             setUser(currentUser);
         } else {
             setUser(null);
         }
      } else {
         setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-saffron" size={48} />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <Outlet />;
}
