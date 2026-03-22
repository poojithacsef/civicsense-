import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, User, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function BottomNav() {
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/report", icon: PlusCircle, label: "Report", isFab: true },
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="absolute bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-200 px-6 py-2 pt-3 safe-bottom flex justify-between items-center z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        if (item.isFab) {
          return (
            <NavLink key={item.to} to={item.to} className="relative -top-6 outline-none">
              <div className="bg-gradient-to-tr from-saffron to-orange-400 text-white p-[18px] rounded-full shadow-[0_8px_16px_rgba(255,153,51,0.4)] hover:scale-105 active:scale-95 transition-transform">
                <Icon size={28} strokeWidth={2.5} />
              </div>
            </NavLink>
          );
        }
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 min-w-[64px] transition-all",
                isActive ? "text-indiaGreen font-semibold" : "text-gray-400 hover:text-gray-600"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} className="transition-all" />
                <span className="text-[10px] leading-none">{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
