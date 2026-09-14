import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(formData.email, formData.password);
      showToast('Welcome back to LpuHustle!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 p-8 shadow-card space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-brand text-white flex items-center justify-center mx-auto shadow-md shadow-brand-500/20">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Log in to LpuHustle
          </h1>
          <p className="text-xs text-slate-500">
            Access your university notes, track uploads, and discover PYQs.
          </p>
        </div>

        {/* Quick Demo Credentials Box */}
        <div className="p-3.5 rounded-2xl bg-brand-50/70 border border-brand-100 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-brand-900">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Quick Demo Accounts (1-Click Fill):</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              id="demo-student-fill-btn"
              onClick={() => handleQuickDemoLogin('rahul.sharma@lpuhustle.com', 'Student@123')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-brand-200 hover:border-brand-400 font-semibold text-brand-700 text-left transition shadow-2xs"
            >
              <div className="text-[10px] text-slate-400 uppercase font-bold">Student</div>
              <div className="truncate">Rahul Sharma</div>
            </button>
            <button
              type="button"
              id="demo-admin-fill-btn"
              onClick={() => handleQuickDemoLogin('admin@lpuhustle.com', 'Admin@123')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 hover:border-amber-400 font-semibold text-amber-700 text-left transition shadow-2xs"
            >
              <div className="text-[10px] text-slate-400 uppercase font-bold">Admin</div>
              <div className="truncate">Moderator</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              University Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                id="login-email-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@lpuhustle.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                id="login-password-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="login-submit-btn"
            className="w-full py-3 rounded-xl font-bold text-sm text-white gradient-brand hover:opacity-95 shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            id="login-to-register-link"
            className="font-bold text-brand-600 hover:text-brand-700"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
