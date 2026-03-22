import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function PWALayout() {
  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 w-full md:max-w-md md:mx-auto md:border-x md:border-gray-200 md:shadow-2xl relative overflow-hidden">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
