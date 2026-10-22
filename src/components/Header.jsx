import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { ShieldAlert, User, LogOut, ShieldCheck } from 'lucide-react';
const logoImg = '/assets/images/1000451070 (1).jpg';

export const Header = ({ activeTab, setActiveTab, onOpenSafetyModal }) => {
  const { user, logout, openAuthModal } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('browse')}
            className="group flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 rounded-sm"
          >
            <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center bg-stone-900">
              <img src={logoImg} alt="VisEntrixia Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 leading-none block">
                VisEntrixia
              </span>
              <span className="text-[11px] font-sans font-medium text-stone-500 tracking-wider uppercase block">
                Akkaraipattu Day-Visit Planner
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('browse')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'browse'
                ? 'border-amber-800 text-stone-900 font-semibold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Attractions
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'map'
                ? 'border-amber-800 text-stone-900 font-semibold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Interactive Map
          </button>

          <button
            onClick={() => setActiveTab('planner')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'planner'
                ? 'border-amber-800 text-stone-900 font-semibold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            My Itinerary
          </button>

          {user && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'dashboard'
                  ? 'border-amber-800 text-stone-900 font-semibold'
                  : 'border-transparent hover:text-stone-900'
              }`}
            >
              Dashboard
            </button>
          )}

          <button
            onClick={onOpenSafetyModal}
            className="flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:text-amber-900"
          >
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>Safety & Hotlines</span>
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'admin'
                  ? 'border-amber-800 text-stone-900 font-semibold'
                  : 'border-transparent hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Admin CMS</span>
            </button>
          )}
        </nav>

        {/* User Profile / Logout */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-right hidden xl:block hover:opacity-80 transition-opacity cursor-pointer"
                title="Open User Dashboard"
              >
                <span className="block text-xs font-semibold text-stone-900 truncate max-w-[120px]">
                  {user.name}
                </span>
                <span className="block text-[10px] text-stone-500 uppercase tracking-wider font-mono">
                  {user.role}
                </span>
              </button>
              <button
                onClick={logout}
                className="p-2 text-stone-600 hover:text-rose-700 hover:bg-stone-100 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pl-1">
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>

              <button
                onClick={() => openAuthModal('admin')}
                className="hidden lg:inline-flex text-[11px] font-mono text-stone-500 hover:text-stone-800 px-2 py-1 rounded hover:bg-stone-100"
                title="System Administrator Login"
              >
                Admin
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200 bg-stone-50/80 px-2 py-1.5 text-xs font-medium text-stone-600">
        <button
          onClick={() => setActiveTab('browse')}
          className={`py-1 px-2 rounded ${activeTab === 'browse' ? 'text-amber-900 font-bold bg-stone-200/60' : ''}`}
        >
          Attractions
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`py-1 px-2 rounded ${activeTab === 'map' ? 'text-amber-900 font-bold bg-stone-200/60' : ''}`}
        >
          Map View
        </button>
        <button
          onClick={() => setActiveTab('planner')}
          className={`py-1 px-2 rounded ${activeTab === 'planner' ? 'text-amber-900 font-bold bg-stone-200/60' : ''}`}
        >
          My Itinerary
        </button>
        {user && (
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-1 px-2 rounded ${activeTab === 'dashboard' ? 'text-amber-900 font-bold bg-stone-200/60' : ''}`}
          >
            Dashboard
          </button>
        )}
      </div>
    </header>
  );
};