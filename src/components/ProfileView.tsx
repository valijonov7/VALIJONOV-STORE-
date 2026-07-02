import React from 'react';
import { Product, Order, UserAddress } from '../types';
import { Heart, History, MapPin, Globe, Bell, Sparkles, Award, Star, ArrowRight, ShieldCheck, Trash2, Eye } from 'lucide-react';

interface ProfileViewProps {
  wishlist: string[];
  products: Product[];
  orders: Order[];
  addresses: UserAddress[];
  onSelectProduct: (product: Product) => void;
  onRemoveFromWishlist: (productId: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  notifications: { promo: boolean; shipping: boolean; broadcasts: boolean };
  setNotifications: React.Dispatch<React.SetStateAction<{ promo: boolean; shipping: boolean; broadcasts: boolean }>>;
  userPoints: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  wishlist,
  products,
  orders,
  addresses,
  onSelectProduct,
  onRemoveFromWishlist,
  language,
  setLanguage,
  notifications,
  setNotifications,
  userPoints,
}) => {
  const wishlistedItems = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      {/* 1. Profile Elite Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[60px]" />
        
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-600 to-indigo-800 border-2 border-slate-800 shadow-xl flex items-center justify-center text-xl font-black text-white">
            AR
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h2 className="text-xl font-black text-white">Alex Rivers</h2>
              <span className="text-[9px] font-mono font-bold tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10">ELITE</span>
            </div>
            <p className="text-xs text-slate-500 font-medium font-mono">ID: @rivers_alex • Joined Jun 2026</p>
          </div>
        </div>

        {/* Loyalty Points display */}
        <div className="w-full sm:w-auto bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex justify-between items-center gap-6">
          <div>
            <span className="text-[9px] text-slate-500 uppercase font-mono font-bold">Lumina Level Coins</span>
            <div className="text-2xl font-mono font-black text-blue-400">{userPoints}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Top 2% client of the store</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Award className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Grid: Wishlist (Left) & Order History / Settings (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Wishlist */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Saved Wishlist ({wishlistedItems.length})
              </h3>
            </div>

            {wishlistedItems.length === 0 ? (
              <div className="text-center py-10 space-y-2 border border-dashed border-slate-800/80 rounded-2xl">
                <span className="text-xs text-slate-500 block">No saved favorites yet</span>
                <p className="text-[10px] text-slate-500 max-w-[180px] mx-auto">Tap the heart icon on tech cards to pin products here.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {wishlistedItems.map((product) => (
                  <div 
                    key={product.id}
                    className="p-3 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 group transition-all"
                  >
                    <div 
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                      onClick={() => onSelectProduct(product)}
                    >
                      <div className="w-10 h-10 rounded-xl border border-slate-800 overflow-hidden flex-shrink-0" style={{ background: product.images[0] }}>
                        <div className="w-5 h-5 rounded-full bg-white/10 mx-auto mt-2.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-blue-400 transition-colors">{product.name}</h4>
                        <span className="text-xs font-mono text-blue-400">${product.price}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="p-1.5 text-slate-500 hover:text-white bg-slate-950/40 hover:bg-slate-950 border border-slate-800/60 rounded-xl"
                        title="View specifications"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(product.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 bg-slate-950/40 hover:bg-slate-950 border border-slate-800/60 rounded-xl"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Addresses Directory */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-500" /> Saved Addresses
            </h3>
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="p-3 bg-slate-900/40 border border-slate-800 rounded-2xl text-left relative">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-200">{addr.title}</span>
                    {addr.isDefault && <span className="text-[8px] font-mono font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">Default</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{addr.street}, {addr.city} {addr.postalCode}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order History & User Preferences */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Order History */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <History className="w-4 h-4 text-blue-400" /> Order History
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-10 space-y-2 border border-dashed border-slate-800/80 rounded-2xl">
                <span className="text-xs text-slate-500 block">No historic purchases found</span>
                <p className="text-[10px] text-slate-500 max-w-xs mx-auto">Checkout active items in your cart to build order histories!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {[...orders].reverse().map((order) => (
                  <div key={order.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3 text-left">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                      <div>
                        <span className="text-xs font-mono font-black text-white">{order.id}</span>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{order.date}</span>
                      </div>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded border ${
                        order.status === 'Delivered' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        order.status === 'Shipped' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 animate-pulse' :
                        order.status === 'Cancelled' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                        'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Order products list */}
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-3 items-center text-xs">
                          <div className="w-8 h-8 rounded-lg border border-slate-800 flex-shrink-0 flex items-center justify-center" style={{ background: item.productImage }}>
                            <div className="w-4 h-4 rounded-full bg-white/15" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-slate-300 truncate">{item.productName}</h5>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                            </span>
                          </div>
                          <span className="font-mono text-slate-400 font-bold">${item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Totals panel */}
                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-900 font-mono text-xs">
                      <span className="text-slate-500">Total amount paid:</span>
                      <span className="text-blue-400 font-black">${order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings & Preferences */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-400" /> Language & Interface Settings
            </h3>
            
            <div className="space-y-4">
              {/* Language selection */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Display Language</span>
                <div className="flex gap-1.5">
                  {['English', 'Español', 'Deutsch'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-colors cursor-pointer ${
                        language === lang ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="border-t border-slate-900 pt-4 space-y-3 text-left">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-blue-400" /> Push Alert Toggles
                </span>

                <div className="space-y-2 text-xs">
                  {[
                    { key: 'promo', title: 'Promotions & Discounts', desc: 'Get updates on sales and seasonal tech drops' },
                    { key: 'shipping', title: 'Delivery Status Tracking', desc: 'Real-time parcel routing notifications' },
                    { key: 'broadcasts', title: 'Telegram Broadcast Feeds', desc: 'Receive instant store alerts from admin' }
                  ].map((notif) => (
                    <label key={notif.key} className="flex gap-3 items-start p-2 hover:bg-slate-900/30 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(notifications as any)[notif.key]}
                        onChange={(e) => setNotifications(prev => ({ ...prev, [notif.key]: e.target.checked }))}
                        className="mt-0.5 accent-blue-500 rounded"
                      />
                      <div>
                        <span className="font-bold text-slate-200 block">{notif.title}</span>
                        <span className="text-[10px] text-slate-500">{notif.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
