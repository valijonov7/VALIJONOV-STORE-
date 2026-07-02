import React, { useState } from 'react';
import { Product } from '../types';
import { MOCK_REVIEWS } from '../data';
import { ChevronLeft, Star, Heart, Share2, ShoppingBag, ShieldCheck, Truck, RotateCcw, ZoomIn } from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, options: { color?: string; size?: string }) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: string[];
  similarProducts: Product[];
  onSelectProduct: (product: Product) => void;
  addToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBack,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  similarProducts,
  onSelectProduct,
  addToast,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ backgroundPosition: 'center' });
  const [isZoomed, setIsZoomed] = useState(false);

  // Initialize variants
  React.useEffect(() => {
    const defaults: { [key: string]: string } = {};
    product.variants.forEach(v => {
      defaults[v.name] = v.options[0];
    });
    setSelectedVariants(defaults);
    setSelectedImageIndex(0);
    setQuantity(1);
  }, [product]);

  // Image Zoom on Hover Simulation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%',
    });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomStyle({ backgroundPosition: 'center', backgroundSize: 'cover' });
  };

  const handleShare = () => {
    const simulatedLink = `${window.location.origin}/product/${product.id}`;
    navigator.clipboard.writeText(simulatedLink).then(() => {
      addToast(`Product link copied to clipboard: ${product.name}`, 'success');
    }).catch(() => {
      addToast('Failed to copy product link', 'error');
    });
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity, {
      color: selectedVariants['Color'] || selectedVariants['Finish'] || selectedVariants['Colorway'],
      size: selectedVariants['Size (US)'] || selectedVariants['Band Size'] || selectedVariants['Fit'],
    });
    addToast(`Added ${quantity}x ${product.name} to Cart`, 'success');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors py-1 cursor-pointer select-none"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Store
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images & Slideshow Column */}
        <div className="space-y-4">
          <div 
            className="aspect-square rounded-3xl overflow-hidden border border-slate-800/80 relative cursor-zoom-in group select-none"
            style={{ 
              backgroundImage: isZoomed ? product.images[selectedImageIndex] : 'none',
              background: !isZoomed ? product.images[selectedImageIndex] : 'none',
              ...zoomStyle 
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {!isZoomed && (
              <div className="w-full h-full flex items-center justify-center relative p-8">
                {/* Simulated product glass circle */}
                <div className="w-48 h-48 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-2xl transition-transform group-hover:scale-105 duration-500">
                  <div className="w-32 h-32 rounded-full bg-white/10 animate-pulse" />
                </div>
                <div className="absolute bottom-4 right-4 bg-slate-950/80 text-white text-[10px] font-mono px-3 py-1.5 rounded-full flex items-center gap-1 border border-slate-800 backdrop-blur-sm">
                  <ZoomIn className="w-3.5 h-3.5" /> Hover to zoom
                </div>
              </div>
            )}
          </div>

          {/* Image Carousels Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-16 h-16 rounded-2xl border transition-all overflow-hidden relative flex-shrink-0 cursor-pointer ${
                    selectedImageIndex === i ? 'border-blue-500 scale-105' : 'border-slate-800 hover:border-slate-700'
                  }`}
                  style={{ background: img }}
                >
                  <div className="absolute inset-0 bg-slate-950/10 hover:bg-transparent transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Specs Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/10">
                {product.category}
              </span>
              {product.flashSale && (
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest font-mono bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/10">
                  Flash Deal
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">{product.name}</h1>
            <p className="text-sm font-semibold text-slate-400 italic font-mono">{product.tagline}</p>
          </div>

          {/* Pricing & Rating Summary */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Price</span>
              <div className="flex items-baseline gap-2 leading-none">
                <span className="text-2xl font-mono font-black text-blue-400">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xs font-mono text-slate-500 line-through">${product.originalPrice}</span>
                )}
              </div>
            </div>
            <div className="text-right space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Feedback</span>
              <div className="flex items-center justify-end gap-1.5">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-35'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-bold font-mono text-slate-200">{product.rating}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono font-semibold">({product.reviewCount} users)</span>
            </div>
          </div>

          {/* Description text */}
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{product.description}</p>

          {/* Variants selectors */}
          {product.variants.length > 0 && (
            <div className="space-y-4">
              {product.variants.map((variant) => (
                <div key={variant.name} className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Select {variant.name}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: option }))}
                        className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer ${
                          selectedVariants[variant.name] === option
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/30'
                            : 'bg-slate-900/50 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions Suite */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            {/* Quantity Controls */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Purchase quantity</span>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                <button
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none text-sm cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center font-mono font-bold text-sm text-slate-100">{quantity}</span>
                <button
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none text-sm cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Quick stock warning */}
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 3 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-ping'}`} />
              <span className="text-xs font-semibold text-slate-400">
                {product.stock > 3 ? `Units available: ${product.stock} items` : `Only ${product.stock} units remaining - order fast!`}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCartClick}
                className="flex-1 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer select-none"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors cursor-pointer select-none ${
                  wishlist.includes(product.id)
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-500/25'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-rose-400 stroke-rose-400' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="w-12 h-12 rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 flex items-center justify-center transition-all cursor-pointer select-none"
                title="Share product link"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Trust assurances badges */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800/50 text-[10px] text-slate-400 font-mono font-bold uppercase">
            <div className="flex flex-col items-center gap-1.5 text-center p-2 rounded-xl bg-slate-900/20 border border-slate-800/40">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>3-Yr Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center p-2 rounded-xl bg-slate-900/20 border border-slate-800/40">
              <Truck className="w-4 h-4 text-blue-400" />
              <span>Free Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center p-2 rounded-xl bg-slate-900/20 border border-slate-800/40">
              <RotateCcw className="w-4 h-4 text-blue-400" />
              <span>30-Day Refund</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Reviews */}
      <section className="space-y-4 pt-6 border-t border-slate-800/80">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">User Reviews</h3>
        <div className="space-y-3">
          {MOCK_REVIEWS.map((review) => (
            <div key={review.id} className="p-4 rounded-2xl bg-slate-900/20 border border-slate-800/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={review.userAvatar} alt={review.userName} className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{review.userName}</h4>
                    <span className="text-[9px] text-slate-500 font-mono">{review.date}</span>
                  </div>
                </div>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'opacity-20'}`} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Similar / Recommended Products Slider */}
      {similarProducts.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-800/80">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Similar Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {similarProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all cursor-pointer group"
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-3 flex items-center justify-center border border-slate-800/60" style={{ background: p.images[0] }}>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/5 shadow-md">
                    <ShoppingBag className="w-4 h-4 text-white/50" />
                  </div>
                </div>
                <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-blue-400 transition-colors">{p.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-mono font-bold text-blue-400">${p.price}</span>
                  <div className="flex items-center text-[9px] text-amber-400 font-mono">
                    <Star className="w-2.5 h-2.5 fill-current mr-0.5" /> {p.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
