import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { checkAdminRole } from '../firebase/services';
import { Loader2 } from 'lucide-react';

export default function PublicRoute() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const adminStatus = await checkAdminRole(currentUser.uid);
        setIsAdmin(adminStatus);
      } else {
        setUser(null);
        setIsAdmin(false);
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

  if (user) {
    if (isAdmin) {
      return <Navigate to="/admin/reports" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
