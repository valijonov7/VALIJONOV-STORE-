import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Sparkles, Heart, Flame, ShieldCheck, Star, Award, Zap, ArrowRight, Eye } from 'lucide-react';

interface HomeViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: string[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onSelectProduct,
  onToggleWishlist,
  wishlist,
}) => {
  // Flash sale countdown state starting from 08h 24m 59s
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 24, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 8, minutes: 24, seconds: 59 }; // Loop/reset
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (t: typeof timeLeft) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(t.hours)}:${pad(t.minutes)}:${pad(t.seconds)}`;
  };

  const featured = products.filter(p => p.featured);
  const bestSellers = products.filter(p => p.bestSeller);
  const newArrivals = products.filter(p => p.newArrival);
  const flashSales = products.filter(p => p.flashSale);

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      {/* 1. Hero Promo Banner */}
      <div className="relative rounded-[2rem] p-6 md:p-10 bg-gradient-to-r from-blue-700 via-indigo-900 to-slate-900 overflow-hidden min-h-[220px] md:min-h-[280px] flex flex-col justify-center shadow-xl border border-blue-500/10 group">
        <div className="absolute -right-12 -bottom-12 w-64 md:w-80 h-64 md:h-80 bg-blue-500/20 rounded-full blur-[80px]" />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-32 md:w-48 h-32 md:h-48 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 hidden sm:flex">
          <div className="w-20 md:w-32 h-20 md:h-32 bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-full opacity-60 animate-pulse" />
        </div>

        <div className="relative z-10 max-w-sm md:max-w-lg space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider text-blue-200 border border-white/5">
            <Sparkles className="w-3.5 h-3.5" /> New Season drop
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            Air Buds <br />
            <span className="text-blue-300">Pro Max v2</span>
          </h2>
          <p className="text-slate-300 text-xs md:text-sm max-w-xs md:max-w-md line-clamp-2">
            Intelligent spatial acoustics with real-time active noise cancelation. Experience pure acoustic heaven.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                const bud = products.find(p => p.id === 'prod-1');
                if (bud) onSelectProduct(bud);
              }}
              className="bg-white hover:bg-slate-100 text-blue-900 px-5 md:px-7 py-2.5 rounded-full font-bold text-xs md:text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Shop Exclusive Max
            </button>
          </div>
        </div>
      </div>

      {/* 2. Popular Categories */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Popular Categories</h3>
          <span className="text-xs text-blue-400 font-bold flex items-center gap-1 cursor-pointer hover:underline">
            See all <ArrowRight className="w-3 h-3" />
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Smart Devices', count: 12, gradient: 'from-purple-500/20 to-indigo-500/5' },
            { name: 'Audio & Sound', count: 18, gradient: 'from-cyan-500/20 to-blue-500/5' },
            { name: 'Wearables', count: 24, gradient: 'from-amber-500/20 to-rose-500/5' },
            { name: 'Home Studio', count: 9, gradient: 'from-emerald-500/20 to-teal-500/5' }
          ].map((cat, i) => (
            <div 
              key={i} 
              className={`p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between hover:border-slate-700 transition-all cursor-pointer group`}
            >
              <div>
                <div className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-300 mb-3 group-hover:text-blue-400 group-hover:bg-blue-600/10 transition-colors">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-200">{cat.name}</h4>
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-2 font-bold">{cat.count} Products</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Flash Sale & Countdown */}
      <section className="bg-gradient-to-br from-slate-900/60 to-slate-900/30 border border-slate-800 rounded-3xl p-5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Lumina Flash Sale</h3>
              <p className="text-xs text-slate-500 font-medium">Limited stocks, updated daily</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/40 px-4 py-2 rounded-2xl border border-slate-700/40 self-start md:self-auto">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Ends In</span>
            <div className="text-lg font-mono font-black text-white tracking-widest">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Flash Sale Product Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {flashSales.map((product) => (
            <div 
              key={product.id}
              className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 hover:border-blue-500/30 transition-all group cursor-pointer"
              onClick={() => onSelectProduct(product)}
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 flex items-center justify-center border border-slate-800" style={{ background: product.images[0] }}>
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                  -{product.discountPercentage}%
                </div>
                {/* Simulated luxury device shape */}
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/15 shadow-2xl transition-transform group-hover:scale-110 duration-500">
                  <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-start gap-1">
                  <h4 className="text-xs font-bold text-slate-100 truncate group-hover:text-blue-400 transition-colors">{product.name}</h4>
                  <div className="flex items-center text-[10px] text-amber-400 font-mono">
                    <Star className="w-3 h-3 fill-current mr-0.5" /> {product.rating}
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold font-mono text-blue-400">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-[10px] font-mono text-slate-500 line-through">${product.originalPrice}</span>
                  )}
                </div>
                {/* Stock progress */}
                <div className="pt-2">
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono mb-1">
                    <span>Stock: {product.stock} units</span>
                    <span className="text-amber-400 font-bold">Selling fast!</span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full" style={{ width: `${(product.stock / 25) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Tech Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-black text-white">Curated Masterpieces</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono font-bold uppercase">Featured Range</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {featured.map((product) => (
            <div 
              key={product.id}
              className="bg-slate-900/40 p-4 rounded-3xl border border-slate-800/80 hover:border-blue-500/30 hover:bg-slate-900/60 transition-all duration-300 relative group flex flex-col justify-between"
            >
              {/* Wishlist quick-tap */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(product.id);
                }}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-950 text-slate-400 hover:text-rose-500 flex items-center justify-center border border-slate-800 transition-colors"
              >
                <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-rose-500 stroke-rose-500 text-rose-500' : ''}`} />
              </button>

              <div 
                className="cursor-pointer"
                onClick={() => onSelectProduct(product)}
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 flex items-center justify-center border border-slate-800 shadow-inner" style={{ background: product.images[0] }}>
                  {/* Neon decorative ring inside image */}
                  <div className="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center backdrop-blur-xs">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-white/15 to-transparent rotate-12 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white/50" />
                    </div>
                  </div>
                  {/* Hover visual scan indicator */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                    <span className="text-[10px] font-bold text-white bg-blue-600 px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> View Specs
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest font-mono">{product.category}</span>
                  <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">{product.name}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{product.tagline}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/60">
                <span className="font-mono text-xs md:text-sm font-black text-slate-200">${product.price}</span>
                {product.stock <= 3 ? (
                  <span className="text-[8px] font-bold text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                    Only {product.stock} left
                  </span>
                ) : (
                  <span className="text-[8px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                    In Stock
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Best Sellers Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Top Best Sellers</h3>
        <div className="space-y-3">
          {bestSellers.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="bg-slate-900/30 hover:bg-slate-900/50 p-3 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex gap-4 items-center group"
            >
              <div className="w-16 h-16 rounded-xl flex items-center justify-center border border-slate-800/80 overflow-hidden flex-shrink-0" style={{ background: product.images[0] }}>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Award className="w-4 h-4 text-white/40" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs md:text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">{product.name}</h4>
                  <span className="text-xs font-mono font-bold text-blue-400">${product.price}</span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">{product.tagline}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-amber-400 text-[9px] font-mono items-center">
                    <Star className="w-3 h-3 fill-current mr-0.5" /> {product.rating}
                  </div>
                  <span className="text-[9px] text-slate-500">({product.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
