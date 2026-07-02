import React from 'react';
import { Search, Sun, Moon, Sparkles, UserCheck } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  userPoints: number;
  userRank: string;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  theme,
  toggleTheme,
  activeTab,
  setActiveTab,
  userPoints,
  userRank,
}) => {
  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-50 transition-all">
      {/* Brand Logo */}
      <div 
        className="flex items-center gap-2 md:gap-3 cursor-pointer select-none"
        onClick={() => setActiveTab('home')}
      >
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40 transform hover:scale-105 transition-transform">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <span className="text-lg md:text-xl font-bold tracking-wider text-white italic">LUMINA</span>
      </div>

      {/* Dynamic Search Bar */}
      <div className="flex-1 max-w-xs md:max-w-md mx-3 md:mx-6">
        <div className="relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'explore') {
                setActiveTab('explore');
              }
            }}
            placeholder="Search exclusive tech..."
            className="w-full bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/60 rounded-full py-2 pl-9 pr-4 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Actions & Badges */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 bg-slate-800/50 hover:bg-slate-800/90 border border-slate-700/50 text-slate-400 hover:text-blue-400 rounded-full transition-all duration-300"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Account Info Quick Peek */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="hidden sm:flex items-center gap-3 bg-slate-800/30 border border-slate-700/40 rounded-full pl-3 pr-1 py-0.5 hover:bg-slate-800/60 transition-colors cursor-pointer select-none"
        >
          <div className="flex flex-col items-end leading-none">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold font-mono">
              {userRank}
            </span>
            <span className="text-xs font-bold text-blue-400 font-mono mt-0.5">
              {userPoints} pts
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border border-slate-700/60 flex items-center justify-center text-xs font-black text-white shadow-md">
            AR
          </div>
        </div>

        {/* Mini avatar for mobile profile navigation */}
        <button
          onClick={() => setActiveTab('profile')}
          className="sm:hidden w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border border-slate-700/60 flex items-center justify-center text-xs font-black text-white"
        >
          AR
        </button>
      </div>
    </header>
  );
};
