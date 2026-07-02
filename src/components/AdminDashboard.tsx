import React, { useState } from 'react';
import { Product, Order, Coupon } from '../types';
import { 
  BarChart2, Package, ShoppingCart, Users, Sparkles, Send, 
  Trash2, Edit, Plus, Check, Search, Percent, AlertTriangle, TrendingUp, DollarSign 
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  coupons: Coupon[];
  onAddCoupon: (newCoupon: Coupon) => void;
  onSendBroadcast: (title: string, body: string) => void;
  addToast: (text: string, type: 'success' | 'error' | 'info' | 'broadcast', title?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  setProducts,
  orders,
  setOrders,
  coupons,
  onAddCoupon,
  onSendBroadcast,
  addToast,
}) => {
  const [adminTab, setAdminTab] = useState<'analytics' | 'products' | 'orders' | 'customers' | 'coupons' | 'broadcast'>('analytics');
  
  // Product Edit States
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // New Product fields
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(199);
  const [newProdStock, setNewProdStock] = useState(10);
  const [newProdCategory, setNewProdCategory] = useState('Smart Devices');
  const [newProdTagline, setNewProdTagline] = useState('Elevate your lifestyle.');
  const [newProdDesc, setNewProdDesc] = useState('');
  
  // Coupon creator fields
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState(15);
  const [newCouponDesc, setNewCouponDesc] = useState('Special store discount');
  
  // Broadcast fields
  const [broadcastTitle, setBroadcastTitle] = useState('Midnight Tech Drop');
  const [broadcastBody, setBroadcastBody] = useState('A brand-new set of Air Buds is now in stock! Use coupon LUMINA20 at checkout for 20% off.');

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
  const totalItemsSold = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.items.reduce((s, i) => s + i.quantity, 0) : sum, 0);
  const activeProductsCount = products.length;

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdDesc) {
      addToast('Please fill out all product details', 'error');
      return;
    }

    if (editingProduct) {
      // Edit mode
      setProducts(prev => 
        prev.map(p => p.id === editingProduct.id ? {
          ...p,
          name: newProdName,
          price: newProdPrice,
          stock: newProdStock,
          category: newProdCategory,
          tagline: newProdTagline,
          description: newProdDesc,
        } : p)
      );
      addToast(`Updated product specifications: ${newProdName}`, 'success');
      setEditingProduct(null);
    } else {
      // Add mode
      const newProductItem: Product = {
        id: `prod-${Date.now()}`,
        name: newProdName,
        tagline: newProdTagline,
        description: newProdDesc,
        price: newProdPrice,
        rating: 4.5,
        reviewCount: 1,
        category: newProdCategory,
        // Procedurally styled deep luxury blue/purple gradient image representation
        images: ['linear-gradient(135deg, #4f46e5 0%, #0c0a0f 100%)'],
        variants: [
          { name: 'Model', options: ['Premium v1', 'Custom Pro'] }
        ],
        stock: newProdStock,
        newArrival: true,
      };

      setProducts(prev => [newProductItem, ...prev]);
      addToast(`Added new product to store catalog: ${newProdName}`, 'success');
    }

    // Reset forms
    setNewProdName('');
    setNewProdPrice(199);
    setNewProdStock(10);
    setNewProdTagline('Elevate your lifestyle.');
    setNewProdDesc('');
    setShowAddProductModal(false);
  };

  const handleEditProductClick = (p: Product) => {
    setEditingProduct(p);
    setNewProdName(p.name);
    setNewProdPrice(p.price);
    setNewProdStock(p.stock);
    setNewProdCategory(p.category);
    setNewProdTagline(p.tagline);
    setNewProdDesc(p.description);
    setShowAddProductModal(true);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    addToast('Product deleted from inventory', 'info');
  };

  const handleOrderStatusUpdate = (orderId: string, nextStatus: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled') => {
    setOrders(prev => 
      prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o)
    );
    addToast(`Order ${orderId} marked as ${nextStatus}`, 'success');
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    onAddCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountType: 'fixed',
      value: newCouponValue,
      description: newCouponDesc
    });
    addToast(`New coupon registered: ${newCouponCode}`, 'success');
    setNewCouponCode('');
    setNewCouponValue(15);
    setNewCouponDesc('Special store discount');
  };

  const handleDispatchBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastBody) return;
    onSendBroadcast(broadcastTitle, broadcastBody);
    addToast(`Simulating broadcast in-app alert!`, 'info');
    
    // Also trigger instant glass broadcast notification
    addToast(broadcastBody, 'broadcast', broadcastTitle);
  };

  // Mock analytics weeks
  const mockWeeklySales = [1200, 1850, 2400, 2900, 3400, totalRevenue];

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      
      {/* Mini Tabs Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-indigo-400" /> Executive Center
        </h2>
        <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest">STORE TELEMETRY DESK</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
          { id: 'products', label: 'Inventory (CRUD)', icon: <Package className="w-4 h-4" /> },
          { id: 'orders', label: 'Orders Desk', icon: <ShoppingCart className="w-4 h-4" /> },
          { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
          { id: 'coupons', label: 'Coupons', icon: <Percent className="w-4 h-4" /> },
          { id: 'broadcast', label: 'Broadcast Feed', icon: <Send className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setAdminTab(tab.id as any);
              setEditingProduct(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-tight flex items-center gap-1.5 transition-all cursor-pointer ${
              adminTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/40'
                : 'bg-slate-900/50 border border-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ADMIN TAB 1: ANALYTICS & CHARTS */}
      {adminTab === 'analytics' && (
        <div className="space-y-6">
          {/* Quick Metrics KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
              <div className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider">Gross Sales Revenue</div>
              <div className="text-xl font-black text-blue-400 font-mono mt-1">${totalRevenue.toFixed(0)}</div>
              <div className="text-[9px] text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +18.4% this week
              </div>
            </div>
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
              <div className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider">Total Sales Units</div>
              <div className="text-xl font-black text-white font-mono mt-1">{totalItemsSold} units</div>
              <p className="text-[9px] text-slate-500 mt-1 font-mono">Conversion rate: 3.4%</p>
            </div>
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
              <div className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider">Active Inventory</div>
              <div className="text-xl font-black text-white font-mono mt-1">{activeProductsCount} Items</div>
              <p className="text-[9px] text-slate-500 mt-1 font-mono">Categories: 4 groups</p>
            </div>
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
              <div className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider">Order Conversion</div>
              <div className="text-xl font-black text-indigo-400 font-mono mt-1">{orders.length} orders</div>
              <div className="text-[9px] text-emerald-400 mt-1">98% fulfillment speed</div>
            </div>
          </div>

          {/* Interactive custom SVGs Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sales Revenue Trend Chart */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-5 space-y-4 text-left">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Revenue trend chart</h4>
                <p className="text-[10px] text-slate-500">Live transaction progression</p>
              </div>
              <div className="h-44 relative flex items-end">
                {/* Custom SVG line area graph with gradient */}
                <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="25" x2="300" y2="25" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
                  <line x1="0" y1="50" x2="300" y2="50" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
                  <line x1="0" y1="75" x2="300" y2="75" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
                  
                  {/* Fill Area */}
                  <path d="M 0 90 Q 50 75 100 50 T 200 30 T 300 15 L 300 100 L 0 100 Z" fill="url(#areaGrad)" />
                  {/* Solid stroke */}
                  <path d="M 0 90 Q 50 75 100 50 T 200 30 T 300 15" fill="none" stroke="#3b82f6" strokeWidth="2" />
                  
                  {/* Hot points */}
                  <circle cx="100" cy="50" r="3" fill="#60a5fa" />
                  <circle cx="200" cy="30" r="3" fill="#60a5fa" />
                  <circle cx="300" cy="15" r="4" fill="#3b82f6" />
                </svg>
                {/* Horizontal scale */}
                <div className="absolute -bottom-1 left-0 w-full flex justify-between text-[8px] text-slate-500 font-mono">
                  <span>Wk 1</span>
                  <span>Wk 2</span>
                  <span>Wk 3</span>
                  <span>Wk 4</span>
                  <span>Wk 5</span>
                  <span>Now</span>
                </div>
              </div>
            </div>

            {/* Weekly Sales Volume Bar Chart */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-5 space-y-4 text-left">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Sales Unit Volume Distribution</h4>
                <p className="text-[10px] text-slate-500">Weekly sales logs</p>
              </div>
              <div className="h-44 flex items-end justify-between px-4 pt-4 border-b border-slate-800 relative">
                {mockWeeklySales.map((val, i) => {
                  const maxVal = Math.max(...mockWeeklySales) || 1000;
                  const pct = Math.max(10, (val / maxVal) * 100);
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 w-7 md:w-9 group">
                      {/* Tooltip bar */}
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-1 bg-indigo-600 border border-indigo-500 text-[8px] font-bold font-mono px-1.5 py-0.5 rounded text-white transition-opacity pointer-events-none">
                        ${val.toFixed(0)}
                      </span>
                      <div className="w-full bg-gradient-to-t from-indigo-800 to-indigo-500 hover:to-indigo-400 rounded-t-lg transition-all" style={{ height: `${pct * 0.8}px` }} />
                      <span className="text-[8px] text-slate-500 font-mono">W{i+1}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Low Stock Warning Telemetry Alert */}
          {products.some(p => p.stock <= 3) && (
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3 text-amber-400 text-xs">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-bounce" />
              <div>
                <span className="font-bold uppercase tracking-wider block font-mono">Inventory telemetry warning</span>
                <p className="text-slate-400 mt-0.5">The following items are running extremely low on stock and need replenishment: <span className="text-slate-200 font-bold">{products.filter(p => p.stock <= 3).map(p => `${p.name} (${p.stock} units)`).join(', ')}</span>.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ADMIN TAB 2: PRODUCT MANAGEMENT CRUD */}
      {adminTab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">Catalog Inventory List ({products.length})</span>
            <button
              onClick={() => {
                setEditingProduct(null);
                setNewProdName('');
                setNewProdPrice(199);
                setNewProdStock(10);
                setNewProdTagline('Elevate your lifestyle.');
                setNewProdDesc('');
                setShowAddProductModal(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Product
            </button>
          </div>

          {/* Modal / Overlay for Add & Edit Product */}
          {showAddProductModal && (
            <form onSubmit={handleCreateProductSubmit} className="bg-slate-900 border border-slate-800/80 p-5 rounded-3xl space-y-4 animate-fade-in text-left">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">
                {editingProduct ? `Modify Specs: ${editingProduct.name}` : 'Register New Device'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold font-mono">Product Name</label>
                  <input type="text" placeholder="e.g. Lumina Pro Band" value={newProdName} onChange={e => setNewProdName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white" required />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold font-mono">Category</label>
                  <select value={newProdCategory} onChange={e => setNewProdCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white">
                    <option>Smart Devices</option>
                    <option>Audio & Sound</option>
                    <option>Wearables</option>
                    <option>Home Studio</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold font-mono">Unit Cost ($)</label>
                  <input type="number" value={newProdPrice} onChange={e => setNewProdPrice(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white" required />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold font-mono">Available Stock</label>
                  <input type="number" value={newProdStock} onChange={e => setNewProdStock(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white" required />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold font-mono">Short Brand Tagline</label>
                <input type="text" placeholder="e.g. Walk on pure air." value={newProdTagline} onChange={e => setNewProdTagline(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white" />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold font-mono">Detailed Specifications & Description</label>
                <textarea rows={3} placeholder="Complete documentation..." value={newProdDesc} onChange={e => setNewProdDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white" required />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddProductModal(false)} className="px-4 py-2 border border-slate-800 text-xs text-slate-400 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 bg-indigo-600 text-white text-xs font-bold rounded-xl">{editingProduct ? 'Commit Changes' : 'Publish Product'}</button>
              </div>
            </form>
          )}

          {/* List of active products */}
          <div className="space-y-2">
            {products.map((p) => (
              <div key={p.id} className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl border border-slate-800 flex-shrink-0" style={{ background: p.images[0] }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-200 truncate">{p.name}</h4>
                      <span className="text-[8px] font-mono font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{p.category}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">${p.price} • Stock: <span className={p.stock <= 3 ? 'text-amber-400 font-bold' : 'text-slate-400'}>{p.stock} units</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEditProductClick(p)} className="p-1.5 text-slate-400 hover:text-white bg-slate-950 border border-slate-800/60 rounded-xl">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-950 border border-slate-800/60 rounded-xl">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN TAB 3: ORDER ROUTING DESK */}
      {adminTab === 'orders' && (
        <div className="space-y-4 text-left">
          <span className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider block">Customer Orders Logs ({orders.length})</span>

          {orders.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-800/80 rounded-2xl text-xs text-slate-500">
              No orders registered yet
            </div>
          ) : (
            <div className="space-y-3">
              {[...orders].reverse().map((order) => (
                <div key={order.id} className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                    <div>
                      <span className="text-xs font-mono font-black text-white">{order.id}</span>
                      <span className="text-[9px] text-slate-500 block font-mono mt-0.5">{order.date} • {order.address.fullName}</span>
                    </div>
                    <span className={`text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded border ${
                      order.status === 'Delivered' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                      order.status === 'Shipped' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                      order.status === 'Cancelled' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                      'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Order items lists */}
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-xs text-slate-400">
                        • <span className="text-slate-300 font-bold">{item.productName}</span> x {item.quantity} {item.selectedColor ? `[${item.selectedColor}]` : ''}
                      </p>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-500">Destination:</span>
                    <span className="text-slate-300">{order.address.city}, {order.address.postalCode}</span>
                  </div>

                  {/* Shipment triggers */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-900">
                    <button onClick={() => handleOrderStatusUpdate(order.id, 'Pending')} className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-[9px] font-bold font-mono text-slate-400 hover:text-white rounded">Mark Pending</button>
                    <button onClick={() => handleOrderStatusUpdate(order.id, 'Shipped')} className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-[9px] font-bold font-mono text-blue-400 hover:text-blue-200 rounded">Mark Shipped</button>
                    <button onClick={() => handleOrderStatusUpdate(order.id, 'Delivered')} className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-[9px] font-bold font-mono text-emerald-400 hover:text-emerald-200 rounded">Mark Delivered</button>
                    <button onClick={() => handleOrderStatusUpdate(order.id, 'Cancelled')} className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-[9px] font-bold font-mono text-rose-400 hover:text-rose-200 rounded">Cancel Order</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADMIN TAB 4: CUSTOMERS LIST */}
      {adminTab === 'customers' && (
        <div className="space-y-4 text-left">
          <span className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider block">Loyal Customer Profiles</span>
          <div className="space-y-2">
            {[
              { name: 'Alex Rivers', email: 'novablox370@gmail.com', points: 2480, tier: 'Elite Client', handle: '@rivers_alex' },
              { name: 'Marcus Sterling', email: 'marcus@sterling.co', points: 1240, tier: 'VIP Client', handle: '@marcus_sterling' },
              { name: 'Elena Rostova', email: 'elena@rostova.com', points: 950, tier: 'Member', handle: '@elena_rost' }
            ].map((cust, i) => (
              <div key={i} className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-200">{cust.name}</h4>
                    <span className="text-[8px] font-mono font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{cust.tier}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{cust.email} • {cust.handle}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-black text-blue-400">{cust.points} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN TAB 5: COUPONS */}
      {adminTab === 'coupons' && (
        <div className="space-y-6 text-left">
          {/* Add coupon form */}
          <form onSubmit={handleCreateCouponSubmit} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-indigo-400 uppercase font-mono tracking-wider block">Add Active Coupon Code</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold font-mono">Code</label>
                <input type="text" placeholder="e.g. ULTRA30" value={newCouponCode} onChange={e => setNewCouponCode(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white" required />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold font-mono">Discount ($)</label>
                <input type="number" value={newCouponValue} onChange={e => setNewCouponValue(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white" required />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold font-mono">Description</label>
              <input type="text" placeholder="e.g. $15 store wide discount" value={newCouponDesc} onChange={e => setNewCouponDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
              <Percent className="w-3.5 h-3.5" /> Publish Promo Code
            </button>
          </form>

          {/* Coupons List */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider block">Registered Store Promo Codes ({coupons.length})</span>
            {coupons.map((coupon) => (
              <div key={coupon.code} className="p-3 bg-slate-900/40 border border-slate-800 rounded-2xl flex justify-between items-center text-xs font-mono">
                <div>
                  <span className="text-blue-400 font-bold">{coupon.code}</span>
                  <p className="text-[10px] text-slate-500">{coupon.description}</p>
                </div>
                <div className="font-bold text-slate-200">
                  {coupon.discountType === 'percentage' ? `${coupon.value}% Off` : `$${coupon.value} Off`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN TAB 6: BROADCAST DISPATCHER */}
      {adminTab === 'broadcast' && (
        <form onSubmit={handleDispatchBroadcast} className="bg-slate-900/30 border border-slate-800 rounded-3xl p-5 space-y-4 text-left">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Send className="w-4 h-4 text-blue-400" /> Telegram Broadcast Dispatcher
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Send custom push alert notifications directly into the client user feeds.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold font-mono">Broadcast Title</label>
              <input 
                type="text" 
                value={broadcastTitle} 
                onChange={(e) => setBroadcastTitle(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white" 
                required 
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold font-mono">Message Body</label>
              <textarea 
                rows={4} 
                value={broadcastBody} 
                onChange={(e) => setBroadcastBody(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white" 
                required 
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-1.5 shadow-lg shadow-blue-900/40"
            >
              <Send className="w-3.5 h-3.5" /> Dispatch Alert broadcast
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
