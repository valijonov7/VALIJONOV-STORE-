import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { CATEGORIES } from '../data';
import { Search, Heart, Star, ShoppingBag, Eye, Zap, AlertCircle } from 'lucide-react';

interface ExploreViewProps {
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: string[];
  addToast: (text: string, type: 'success' | 'error' | 'info') => void;
  onAddToCartDirect: (product: Product) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  products,
  searchQuery,
  setSearchQuery,
  onSelectProduct,
  onToggleWishlist,
  wishlist,
  addToast,
  onAddToCartDirect,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  // Trigger brief skeleton loader on category or query update for premium responsive feel
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  // Filters logic
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuickAdd = (p: Product) => {
    onAddToCartDirect(p);
    addToast(`Added 1x ${p.name} to Cart`, 'success');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      {/* Search status caption if query exists */}
      {searchQuery && (
        <div className="text-xs text-slate-500 font-mono">
          FOUND {filteredProducts.length} EXCLUSIVES MATCHING <span className="text-blue-400 font-bold uppercase">"{searchQuery}"</span>
        </div>
      )}

      {/* Categories Scroller row */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 border border-blue-500'
                : 'bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID OR SKELETON LOADERS */}
      {isLoading ? (
        // Pulsing skeletons
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-slate-900/30 p-4 rounded-3xl border border-slate-800/80 space-y-4">
              <div className="aspect-[4/3] bg-slate-800 rounded-2xl animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-800 rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-slate-800 rounded w-1/2 animate-pulse" />
              </div>
              <div className="h-8 bg-slate-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        // No results layout
        <div className="text-center py-16 space-y-3 bg-slate-900/20 border border-slate-800/80 rounded-3xl max-w-md mx-auto">
          <div className="w-12 h-12 bg-slate-950 rounded-full flex items-center justify-center border border-slate-800 mx-auto text-slate-500">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-300">No matching tech found</h4>
            <p className="text-xs text-slate-500 max-w-[220px] mx-auto mt-1">We couldn't locate any products matching your query. Try resetting filters.</p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="bg-slate-800 text-xs text-slate-300 px-4 py-1.5 rounded-full hover:bg-slate-700 hover:text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        // Beautiful products catalog cards
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900/40 p-3 md:p-4 rounded-3xl border border-slate-800/80 hover:border-blue-500/30 hover:bg-slate-900/60 transition-all duration-300 relative group flex flex-col justify-between"
            >
              {/* Wishlist toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(product.id);
                }}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-950 text-slate-400 hover:text-rose-500 flex items-center justify-center border border-slate-800/80 transition-colors"
              >
                <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-rose-500 stroke-rose-500 text-rose-500' : ''}`} />
              </button>

              <div 
                className="cursor-pointer"
                onClick={() => onSelectProduct(product)}
              >
                <div 
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3.5 flex items-center justify-center border border-slate-800 shadow-inner" 
                  style={{ background: product.images[0] }}
                >
                  {/* Decorative glass shape */}
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xs transition-transform group-hover:scale-105 duration-500">
                    <div className="w-10 h-10 rounded-full bg-white/10" />
                  </div>

                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                    <span className="text-[10px] font-bold text-white bg-blue-600 px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Eye className="w-3 h-3" /> View Specifications
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[9px] font-bold text-blue-400 uppercase tracking-widest font-mono">
                    <span>{product.category}</span>
                    <div className="flex items-center text-amber-400">
                      <Star className="w-2.5 h-2.5 fill-current mr-0.5" /> {product.rating}
                    </div>
                  </div>
                  <h4 className="text-xs md:text-sm font-bold text-slate-100 line-clamp-1 group-hover:text-blue-400 transition-colors">{product.name}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 leading-snug">{product.tagline}</p>
                </div>
              </div>

              {/* Pricing & instant basket */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/60">
                <span className="font-mono text-xs md:text-sm font-black text-slate-200">${product.price}</span>
                <button
                  onClick={() => handleQuickAdd(product)}
                  className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600 text-blue-400 hover:text-white flex items-center justify-center transition-all cursor-pointer scale-90"
                  title="Add to basket"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
