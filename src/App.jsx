import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PWALayout from './pwa/layouts/PWALayout';
import Home from './pwa/pages/Home';
import ReportStepper from './pwa/pages/ReportStepper';
import Profile from './pwa/pages/Profile';
import Settings from './pwa/pages/Settings';
import AdminLayout from './admin/layouts/AdminLayout';
import Reports from './admin/pages/Reports';
import Analytics from './admin/pages/Analytics';
import Heatmap from './admin/pages/Heatmap';
import Login from './admin/pages/Login';
import LoginOptions from './pages/LoginOptions';
import CitizenLogin from './pages/CitizenLogin';
import ProtectedRoute from './components/ProtectedRoute';
import PWAAuthRoute from './components/PWAAuthRoute';
import PublicRoute from './components/PublicRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Auth Portals */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginOptions />} />
          <Route path="/login/citizen" element={<CitizenLogin />} />
          <Route path="/admin/login" element={<Login />} />
        </Route>

        {/* Protected PWA Routes */}
        <Route element={<PWAAuthRoute />}>
           <Route path="/" element={<PWALayout />}>
             <Route index element={<Home />} />
             <Route path="report" element={<ReportStepper />} />
             <Route path="profile" element={<Profile />} />
             <Route path="settings" element={<Settings />} />
           </Route>
        </Route>
        
        {/* Admin Routes */}
        
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="reports" replace />} />
            <Route path="reports" element={<Reports />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="heatmap" element={<Heatmap />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
