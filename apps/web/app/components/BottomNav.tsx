'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    
    const handleDarkModeChange = () => {
      const newDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(newDarkMode);
    };
    
    window.addEventListener('storage', handleDarkModeChange);
    window.addEventListener('darkModeChange', handleDarkModeChange);
    
    return () => {
      window.removeEventListener('storage', handleDarkModeChange);
      window.removeEventListener('darkModeChange', handleDarkModeChange);
    };
  }, []);

  return darkMode;
}

export default function BottomNav() {
  const pathname = usePathname();
  const darkMode = useDarkMode();

  return (
    <nav className={`fixed bottom-0 left-0 right-0 w-full z-50 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 ${darkMode ? 'bg-slate-800/95 backdrop-blur-md border-t border-slate-700' : 'glass-nav'}`}>
      <div className="flex items-center justify-around w-full px-2">
        
        {/* Home */}
        <Link href="/" className="flex flex-col items-center justify-center w-16 group">
          {pathname === '/' ? (
            <>
              <div className={`relative p-1.5 rounded-xl mb-1 transition-colors ${darkMode ? 'bg-red-500/20' : 'bg-brand-50'}`}>
                <i className={`ph-fill ph-house text-2xl ${darkMode ? 'text-red-400' : 'text-brand-600'}`}></i>
              </div>
              <span className={`text-[10px] font-bold ${darkMode ? 'text-red-400' : 'text-brand-600'}`}>Home</span>
            </>
          ) : (
            <>
              <div className="relative p-1.5 mb-1 transition-transform group-active:scale-95">
                <i className={`ph ph-house text-2xl ${darkMode ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-600'}`}></i>
              </div>
              <span className={`text-[10px] font-medium ${darkMode ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-600'}`}>Home</span>
            </>
          )}
        </Link>

        {/* Categories */}
        <Link href="/contractor-categories" className="flex flex-col items-center justify-center w-16 group">
          {pathname === '/contractor-categories' ? (
            <>
              <div className={`relative p-1.5 rounded-xl mb-1 transition-colors ${darkMode ? 'bg-red-500/20' : 'bg-brand-50'}`}>
                <i className={`ph-fill ph-squares-four text-2xl ${darkMode ? 'text-red-400' : 'text-brand-600'}`}></i>
              </div>
              <span className={`text-[10px] font-bold ${darkMode ? 'text-red-400' : 'text-brand-600'}`}>Categories</span>
            </>
          ) : (
            <>
              <div className="relative p-1.5 mb-1 transition-transform group-active:scale-95">
                <i className={`ph ph-squares-four text-2xl ${darkMode ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-600'}`}></i>
              </div>
              <span className={`text-[10px] font-medium ${darkMode ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-600'}`}>Categories</span>
            </>
          )}
        </Link>

        {/* Search (Main Action) */}
        <Link href="/search" className="flex flex-col items-center justify-center w-16 group relative -top-5">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 transition-transform transform group-active:scale-95 ${darkMode ? 'bg-red-600 shadow-red-600/40 border-slate-800' : 'bg-brand-600 shadow-brand-600/40 border-white'}`}>
            <i className="ph-bold ph-magnifying-glass text-2xl text-white"></i>
          </div>
          <span className={`text-[10px] font-medium mt-1 absolute -bottom-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Search</span>
        </Link>

        {/* Profile */}
        <Link href="/profile" className="flex flex-col items-center justify-center w-16 group">
          {pathname === '/profile' || pathname === '/settings' ? (
            <>
              <div className={`relative p-1.5 rounded-xl mb-1 transition-colors ${darkMode ? 'bg-red-500/20' : 'bg-brand-50'}`}>
                <i className={`ph-fill ph-user text-2xl ${darkMode ? 'text-red-400' : 'text-brand-600'}`}></i>
              </div>
              <span className={`text-[10px] font-bold ${darkMode ? 'text-red-400' : 'text-brand-600'}`}>Profile</span>
            </>
          ) : (
            <>
              <div className="relative p-1.5 mb-1 transition-transform group-active:scale-95">
                <i className={`ph ph-user text-2xl ${darkMode ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-600'}`}></i>
              </div>
              <span className={`text-[10px] font-medium ${darkMode ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-600'}`}>Profile</span>
            </>
          )}
        </Link>

      </div>
    </nav>
  );
}