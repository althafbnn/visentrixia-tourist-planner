import React from 'react';
import { Compass, Phone } from 'lucide-react';

export const Footer = ({ onOpenSafetyModal, onAdminClick }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-amber-800 flex items-center justify-center text-amber-200">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-bold text-white">VisEntrixia</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-md">
              Local Tourist Day-Visit Planner and Information System for Akkaraipattu, Eastern Province, Sri Lanka. Designed to foster sustainable regional heritage tourism and assist travelers exploring within a 25 km radius.
            </p>
            <div className="text-[11px] text-stone-500 pt-1">
              Developed for University of Moratuwa (ITE2953) · Academic Project
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">
              Explorer Services
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#attractions" className="hover:text-amber-400 transition-colors">
                  Attraction Directory (25km)
                </a>
              </li>
              <li>
                <a href="#map" className="hover:text-amber-400 transition-colors">
                  OpenStreetMap Navigation
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenSafetyModal}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Emergency Contacts & Hotlines
                </button>
              </li>
              <li>
                <button
                  onClick={onAdminClick}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Admin Content Management
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>Emergency Hotlines</span>
            </h4>
            <div className="space-y-1.5 text-xs text-stone-400">
              <div className="flex justify-between border-b border-stone-800 pb-1">
                <span>Tourism Police:</span>
                <span className="font-mono text-amber-300 font-bold">1912</span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-1">
                <span>Free Ambulance:</span>
                <span className="font-mono text-amber-300 font-bold">1990</span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-1">
                <span>Akkaraipattu Hospital:</span>
                <span className="font-mono text-stone-300">+94 67 227 7222</span>
              </div>
              <div className="flex justify-between">
                <span>Akkaraipattu Police:</span>
                <span className="font-mono text-stone-300">+94 67 227 7223</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>
            © {new Date().getFullYear()} VisEntrixia. Academic demonstration project — not an official government tourism portal.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={onOpenSafetyModal} className="hover:text-stone-300 underline">
              Safety & Terms
            </button>
            <span>·</span>
            <span>Akkaraipattu, Ampara District, Sri Lanka</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
