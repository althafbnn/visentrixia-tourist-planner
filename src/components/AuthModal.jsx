import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { X, ShieldAlert, Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';

export const AuthModal = () => {
  const {
    authModalOpen,
    authModalMode,
    promptReason,
    closeAuthModal,
    openAuthModal,
    login,
    register
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      if (authModalMode === 'register') {
        await register({ name, email, password, contactNumber });
      } else {
        await login({ email, password });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@visentrixia.lk');
    setPassword('Admin@1234');
    setErrorMsg(null);
  };

  const handleFillDemoTourist = () => {
    setEmail('tourist@visentrixia.lk');
    setPassword('Tourist@1234');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="relative bg-white max-w-md w-full rounded-2xl border border-stone-200 shadow-2xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 id="auth-modal-title" className="font-serif text-xl font-bold text-stone-900">
              {authModalMode === 'register'
                ? 'Create Tourist Account'
                : authModalMode === 'admin'
                ? 'Administrator Portal'
                : 'Sign In to VisEntrixia'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {authModalMode === 'register'
                ? 'Save your itineraries and access your personal day-plans.'
                : authModalMode === 'admin'
                ? 'Restricted access for system administrators only.'
                : 'Welcome back. Access your saved Akkaraipattu itineraries.'}
            </p>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {promptReason && (
          <div className="bg-amber-50 border-b border-amber-200 p-3.5 text-xs text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{promptReason}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs" autoComplete="off">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {authModalMode === 'register' && (
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ahamed BA"
                  autoComplete="off"
                  className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:border-amber-700 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="off"
                className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:border-amber-700 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:border-amber-700 outline-none"
              />
            </div>
            {authModalMode === 'register' && (
              <span className="text-[11px] text-stone-500 mt-1 block">
                Must be at least 8 characters, include 1 number and 1 special symbol.
              </span>
            )}
          </div>

          {authModalMode === 'register' && (
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Contact Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+94 77 123 4567"
                  autoComplete="off"
                  className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:border-amber-700 outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-amber-800 hover:bg-amber-900 active:bg-amber-950 text-white font-semibold rounded-lg shadow-xs transition-colors"
          >
            {isSubmitting
              ? 'Processing...'
              : authModalMode === 'register'
              ? 'Complete Registration'
              : authModalMode === 'admin'
              ? 'Access Admin Dashboard'
              : 'Sign In'}
          </button>

          <div className="pt-2 border-t border-stone-100 flex flex-col gap-1.5 text-stone-500">
            <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">
              Quick Test Credentials:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleFillDemoTourist}
                className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 text-[11px] transition-colors"
              >
                Use Tourist (tourist@visentrixia.lk)
              </button>
              <button
                type="button"
                onClick={handleFillDemoAdmin}
                className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 text-[11px] transition-colors"
              >
                Use Admin (admin@visentrixia.lk)
              </button>
            </div>
          </div>

          <div className="pt-2 text-center text-stone-600">
            {authModalMode === 'register' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="font-semibold text-amber-800 hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : authModalMode === 'admin' ? (
              <p>
                Tourist user?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="font-semibold text-amber-800 hover:underline"
                >
                  Tourist Login
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="font-semibold text-amber-800 hover:underline"
                >
                  Register as Tourist
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};