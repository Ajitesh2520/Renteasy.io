import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Tenants from './pages/Tenants';
import RentCollection from './pages/RentCollection';
import PaymentHistory from './pages/PaymentHistory';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import axiosClient from './api/axiosClient';
import LoginPage from './pages/LoginPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

// // function LoginPage() {
// //   const { login } = useAuth();
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setError('');
// //     setLoading(true);
// //     try {
// //       await login(email, password);
// //     } catch (err: any) {
// //       setError(err.response?.data?.message || 'Invalid credentials');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-lg border border-slate-200 w-full max-w-sm p-8">
//         <div className="text-center mb-8">
//           <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
//             <span className="text-white font-bold text-lg">R</span>
//           </div>
//           <h1 className="text-2xl font-bold text-slate-900">RentManager</h1>
//           <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
//         </div>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
//             <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="you@example.com" />
//           </div>
//           <div>
//             <label className="block text-xs font-medium text-slate-600 mb-1">Password</label>
//             <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />
//           </div>
//           {error && <p className="text-xs text-red-500 text-center">{error}</p>}
//           <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
//             {loading && <Loader2 size={15} className="animate-spin" />}
//             Sign In
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="tenants" element={<Tenants />} />
        <Route path="rent" element={<RentCollection />} />
        <Route path="payments" element={<PaymentHistory />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
