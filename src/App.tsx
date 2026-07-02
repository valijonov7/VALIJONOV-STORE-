import React, { useState, useEffect } from 'react';
import { Product, CartItem, UserAddress, Order, Coupon } from './types';
import { 
  INITIAL_PRODUCTS, INITIAL_COUPONS, DEFAULT_ADDRESSES 
} from './data';

// Component imports
import { ToastContainer, ToastMessage } from './components/Toast';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { ExploreView } from './components/ExploreView';
import { ProductDetailView } from './components/ProductDetailView';
import { CheckoutModal } from './components/CheckoutModal';
import { ProfileView } from './components/ProfileView';
import { AdminDashboard } from './components/AdminDashboard';

import { Sparkles, ShoppingBag } from 'lucide-react';

export default function App() {
  // --- Persistent Storage State Synchronizers ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lumina_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lumina_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('lumina_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [addresses, setAddresses] = useState<UserAddress[]>(() => {
    const saved = localStorage.getItem('lumina_addresses');
    return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('lumina_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('lumina_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  // --- Core Application States ---
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'wishlist' | 'profile' | 'admin'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [unreadBroadcasts, setUnreadBroadcasts] = useState(1);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [userPoints, setUserPoints] = useState(2480);
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState({ promo: true, shipping: true, broadcasts: true });

  // Toast States
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Synchronize localStorage on state updates
  useEffect(() => {
    localStorage.setItem('lumina_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('lumina_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('lumina_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('lumina_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('lumina_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('lumina_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Initial welcome notification
  useEffect(() => {
    const timer = setTimeout(() => {
      addToast(
        'Welcome back, Alex. Elite rank rewards have been refreshed!', 
        'info', 
        'SYSTEM STATUS'
      );
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers & Actions ---
  const addToast = (text: string, type: 'success' | 'error' | 'info' | 'broadcast', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type, title }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    addToast(`Theme toggled to ${theme === 'dark' ? 'Light' : 'Dark'} mode`, 'info');
  };

  const handleToggleWishlist = (productId: string) => {
    let active = false;
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        addToast('Removed product from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        active = true;
        addToast('Saved product to wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
    addToast('Removed product from wishlist', 'info');
  };

  const handleAddToCart = (product: Product, qty: number, options: { color?: string; size?: string }) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + qty) }
            : item
        );
      }
      return [...prev, { product, quantity: qty, selectedColor: options.color, selectedSize: options.size }];
    });
  };

  const handleAddToCartDirect = (product: Product) => {
    handleAddToCart(product, 1, {
      color: product.variants[0]?.options[0],
      size: product.variants[1]?.options[0],
    });
  };

  const handleAddAddress = (newAddr: Omit<UserAddress, 'id' | 'isDefault'>) => {
    setAddresses((prev) => [
      ...prev.map((a) => ({ ...a, isDefault: false })),
      { id: `addr-${Date.now()}`, ...newAddr, isDefault: true },
    ]);
  };

  const handleCompleteCheckout = (orderPayload: Omit<Order, 'id' | 'date' | 'status'>) => {
    const orderId = `LMN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString(),
      status: 'Pending',
      ...orderPayload,
    };
    
    setOrders((prev) => [...prev, newOrder]);
    
    // Reward points for purchasing! (10% of total)
    const pointsGained = Math.round(orderPayload.total * 0.1);
    setUserPoints((prev) => prev + pointsGained);
    addToast(`Order ${orderId} placed successfully! Gained ${pointsGained} loyalty points.`, 'success');
  };

  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const handleSendBroadcast = (title: string, body: string) => {
    setUnreadBroadcasts((prev) => prev + 1);
  };

  // Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filter similar products
  const getSimilarProducts = (product: Product) => {
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  };

  return (
    <div 
      className={`min-h-screen w-full transition-colors duration-300 font-sans flex flex-col justify-center items-center p-0 md:p-4 ${
        theme === 'dark' ? 'bg-[#06080b]' : 'bg-slate-100'
      }`}
    >
      {/* Premium Web App Shell mimicking luxury Telegram environment */}
      <div 
        id="applet-shell" 
        className={`w-full max-w-full md:max-w-md lg:max-w-5xl md:h-[860px] md:rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl relative border-0 md:border-8 transition-colors ${
          theme === 'dark' 
            ? 'bg-[#0A0C10] text-slate-200 border-slate-900/90' 
            : 'bg-white text-slate-800 border-slate-200'
        }`}
      >
        
        {/* Sticky Header with Search */}
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          theme={theme}
          toggleTheme={toggleTheme}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedProduct(null);
          }}
          userPoints={userPoints}
          userRank="ELITE"
        />

        {/* Primary Scrollable Canvas Body */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6 scrollbar-thin">
          
          {/* Detailed Product Page overrides normal tab grids */}
          {selectedProduct ? (
            <ProductDetailView 
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlist={wishlist}
              similarProducts={getSimilarProducts(selectedProduct)}
              onSelectProduct={setSelectedProduct}
              addToast={addToast}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeView 
                  products={products}
                  onSelectProduct={setSelectedProduct}
                  onToggleWishlist={handleToggleWishlist}
                  wishlist={wishlist}
                />
              )}

              {activeTab === 'explore' && (
                <ExploreView 
                  products={products}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onSelectProduct={setSelectedProduct}
                  onToggleWishlist={handleToggleWishlist}
                  wishlist={wishlist}
                  addToast={addToast}
                  onAddToCartDirect={handleAddToCartDirect}
                />
              )}

              {activeTab === 'wishlist' && (
                <div className="space-y-6 text-left">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Your Saved Favourites</span>
                  <ExploreView 
                    products={products.filter(p => wishlist.includes(p.id))}
                    searchQuery=""
                    setSearchQuery={() => {}}
                    onSelectProduct={setSelectedProduct}
                    onToggleWishlist={handleToggleWishlist}
                    wishlist={wishlist}
                    addToast={addToast}
                    onAddToCartDirect={handleAddToCartDirect}
                  />
                </div>
              )}

              {activeTab === 'profile' && (
                <ProfileView 
                  wishlist={wishlist}
                  products={products}
                  orders={orders}
                  addresses={addresses}
                  onSelectProduct={setSelectedProduct}
                  onRemoveFromWishlist={handleRemoveFromWishlist}
                  language={language}
                  setLanguage={setLanguage}
                  notifications={notifications}
                  setNotifications={setNotifications}
                  userPoints={userPoints}
                />
              )}

              {activeTab === 'admin' && (
                <AdminDashboard 
                  products={products}
                  setProducts={setProducts}
                  orders={orders}
                  setOrders={setOrders}
                  coupons={coupons}
                  onAddCoupon={handleAddCoupon}
                  onSendBroadcast={handleSendBroadcast}
                  addToast={addToast}
                />
              )}
            </>
          )}

        </main>

        {/* Fixed Floating Shopping Cart Button (Matches Apple Store / Telegram layouts) */}
        {cartCount > 0 && !selectedProduct && (
          <button
            onClick={() => setShowCheckoutModal(true)}
            className="fixed md:absolute bottom-28 right-6 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full p-4 shadow-2xl flex items-center gap-2 border border-blue-400/20 active:scale-95 transition-all select-none"
          >
            <ShoppingBag className="w-5 h-5 animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Checkout ({cartCount})</span>
          </button>
        )}

        {/* Bottom Glassmorphic Navigation Bar */}
        <BottomNav 
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedProduct(null);
            if (tab === 'profile') {
              setUnreadBroadcasts(0); // clear count upon reading
            }
          }}
          cartCount={cartCount}
          wishlistCount={wishlist.length}
          openCart={() => setShowCheckoutModal(true)}
          unreadBroadcastsCount={unreadBroadcasts}
        />

        {/* Modular Interactive Checkout Wizards */}
        <CheckoutModal 
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          cart={cart}
          setCart={setCart}
          addresses={addresses}
          onAddAddress={handleAddAddress}
          coupons={coupons}
          onCompleteCheckout={handleCompleteCheckout}
          addToast={addToast}
        />

        {/* Global Toast Alerts Containers */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />

      </div>
    </div>
  );
}
