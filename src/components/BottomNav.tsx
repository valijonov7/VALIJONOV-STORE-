import React from 'react';
import { Home, Compass, ShoppingBag, Heart, User, ShieldAlert } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  cartCount: number;
  wishlistCount: number;
  openCart: () => void;
  unreadBroadcastsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount,
  openCart,
  unreadBroadcastsCount,
}) => {
  return (
    <nav className="h-20 bg-slate-950/85 backdrop-blur-2xl border-t border-slate-900 px-4 md:px-8 flex items-center justify-between sticky bottom-0 z-50 transition-all">
      {/* Home Tab */}
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-1 flex-1 transition-all ${
          activeTab === 'home' ? 'text-blue-500 scale-105 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5 md:w-6 h-6" />
        <span className="text-[10px] uppercase tracking-tighter">Home</span>
      </button>

      {/* Explore Tab */}
      <button
        onClick={() => setActiveTab('explore')}
        className={`flex flex-col items-center gap-1 flex-1 transition-all ${
          activeTab === 'explore' ? 'text-blue-500 scale-105 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Compass className="w-5 h-5 md:w-6 h-6" />
        <span className="text-[10px] uppercase tracking-tighter">Explore</span>
      </button>

      {/* Floating Shopping Cart Action */}
      <div className="relative -top-6 flex-1 flex justify-center">
        <button
          onClick={openCart}
          className="w-14 h-14 md:w-16 h-16 bg-blue-600 hover:bg-blue-500 rounded-full border-[6px] border-slate-950 shadow-2xl flex items-center justify-center text-white scale-110 active:scale-95 hover:scale-115 transition-all cursor-pointer relative"
        >
          <ShoppingBag className="w-6 h-6 md:w-7 h-7" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-5.5 h-5.5 rounded-full border-2 border-slate-950 flex items-center justify-center animate-bounce">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Wishlist Tab */}
      <button
        onClick={() => setActiveTab('wishlist')}
        className={`flex flex-col items-center gap-1 flex-1 transition-all ${
          activeTab === 'wishlist' ? 'text-blue-500 scale-105 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Heart className={`w-5 h-5 md:w-6 h-6 ${activeTab === 'wishlist' ? 'fill-blue-500 stroke-blue-500' : ''}`} />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-400 w-2.5 h-2.5 rounded-full border border-slate-950" />
          )}
        </div>
        <span className="text-[10px] uppercase tracking-tighter">Wishlist</span>
      </button>

      {/* Profile Tab */}
      <button
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center gap-1 flex-1 transition-all ${
          activeTab === 'profile' ? 'text-blue-500 scale-105 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <User className="w-5 h-5 md:w-6 h-6" />
          {unreadBroadcastsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 w-2.5 h-2.5 rounded-full border border-slate-950 animate-ping" />
          )}
        </div>
        <span className="text-[10px] uppercase tracking-tighter">Profile</span>
      </button>

      {/* Admin Dashboard Entry Tab */}
      <button
        onClick={() => setActiveTab('admin')}
        className={`flex flex-col items-center gap-1 flex-1 transition-all ${
          activeTab === 'admin' ? 'text-indigo-400 scale-105 font-semibold border-indigo-500/20' : 'text-slate-400 hover:text-indigo-300'
        }`}
      >
        <ShieldAlert className="w-5 h-5 md:w-6 h-6" />
        <span className="text-[10px] uppercase tracking-tighter font-mono">Admin</span>
      </button>
    </nav>
  );
};
