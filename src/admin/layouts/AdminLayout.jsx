import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Map, LogOut, FileSearch } from 'lucide-react';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };
  const navItems = [
    { to: "/admin/reports", icon: FileText, label: "Reports" },
    { to: "/admin/analytics", icon: LayoutDashboard, label: "Analytics" },
    { to: "/admin/heatmap", icon: Map, label: "Map Heatmap" },
  ];

  return (
    <div className="flex h-[100dvh] w-full bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20 hidden md:flex">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-saffron p-2 rounded-lg text-white">
              <FileSearch size={24} />
            </div>
            <div>
              <h1 className="text-white font-bold tracking-wide leading-tight">CivicAdmin</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Government</p>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 ml-1">Menu</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? "bg-saffron text-white shadow-md shadow-orange-900/50" : "hover:bg-slate-800 hover:text-white"}`}
              >
                <Icon size={20} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-medium">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Flow */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Administrator Dashboard</h2>
          <div className="flex gap-4 items-center">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-saffron font-bold text-sm">A</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
