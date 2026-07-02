import React, { useState } from 'react';
import { CartItem, UserAddress, Coupon, Order } from '../types';
import { Trash2, MapPin, Truck, CreditCard, Percent, Sparkles, Check, ChevronRight, X, PlusCircle } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addresses: UserAddress[];
  onAddAddress: (newAddr: Omit<UserAddress, 'id' | 'isDefault'>) => void;
  coupons: Coupon[];
  onCompleteCheckout: (orderData: Omit<Order, 'id' | 'date' | 'status'>) => void;
  addToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  setCart,
  addresses,
  onAddAddress,
  coupons,
  onCompleteCheckout,
  addToast,
}) => {
  const [step, setStep] = useState<'cart' | 'address' | 'delivery' | 'payment' | 'confirmation'>('cart');
  
  // States
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || '');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  
  // New Address form state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('Home');
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrZip, setNewAddrZip] = useState('');

  // Finished order state (stored upon success to display on final screen)
  const [finalOrder, setFinalOrder] = useState<any>(null);

  if (!isOpen) return null;

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Coupon validation
  const handleApplyCoupon = () => {
    const codeClean = couponCode.trim().toUpperCase();
    const found = coupons.find(c => c.code === codeClean);
    if (!found) {
      addToast('Invalid coupon code. Try LUMINA20 or VIPFREE.', 'error');
      return;
    }
    if (found.minSpend && subtotal < found.minSpend) {
      addToast(`This coupon requires a minimum spend of $${found.minSpend}.`, 'error');
      return;
    }
    setAppliedCoupon(found);
    addToast(`Successfully applied discount: ${found.description}`, 'success');
  };

  const discount = appliedCoupon 
    ? (appliedCoupon.discountType === 'percentage' 
        ? subtotal * (appliedCoupon.value / 100) 
        : appliedCoupon.value)
    : 0;

  const shippingCost = deliveryMethod === 'express' ? 20 : 0;
  const total = Math.max(0, subtotal - discount + shippingCost);

  const handleUpdateQty = (prodId: string, diff: number) => {
    setCart(prev => 
      prev.map(item => {
        if (item.product.id === prodId) {
          const newQty = Math.min(item.product.stock, Math.max(1, item.quantity + diff));
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (prodId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== prodId));
    addToast('Product removed from Cart', 'info');
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrName || !newAddrStreet || !newAddrCity || !newAddrZip) {
      addToast('Please fill out all address fields', 'error');
      return;
    }
    onAddAddress({
      title: newAddrTitle,
      fullName: newAddrName,
      phone: newAddrPhone,
      street: newAddrStreet,
      city: newAddrCity,
      postalCode: newAddrZip
    });
    addToast('New delivery address saved', 'success');
    setShowAddAddress(false);
  };

  const handleCheckoutSubmit = () => {
    const address = addresses.find(a => a.id === selectedAddressId) || addresses[0];
    if (!address) {
      addToast('Please select or add a delivery address', 'error');
      setStep('address');
      return;
    }

    const orderPayload = {
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        price: item.product.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize
      })),
      subtotal,
      shipping: shippingCost,
      discount,
      total,
      address,
      paymentMethod: paymentMethod === 'card' ? 'Visa •••• 4242' : paymentMethod === 'crypto' ? 'USDT (TRC20)' : paymentMethod === 'telegram' ? 'Telegram Pay' : 'Cash on Delivery',
      deliveryMethod: deliveryMethod === 'express' ? 'Express Courier' : 'Standard Parcel'
    };

    onCompleteCheckout(orderPayload);
    
    // Store mock order details for confirmation screen
    setFinalOrder({
      id: `LMN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString(),
      ...orderPayload
    });

    setCart([]); // Empty cart
    setAppliedCoupon(null);
    setCouponCode('');
    setStep('confirmation');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0A0C10] border border-slate-800/80 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-slate-100">
        
        {/* Header bar */}
        <div className="h-14 px-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-bold uppercase tracking-wider font-mono">
              {step === 'cart' ? 'Shopping Cart Review' :
               step === 'address' ? 'Delivery Address' :
               step === 'delivery' ? 'Shipment Option' :
               step === 'payment' ? 'Secure Checkout' : 'Order Placed!'}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors cursor-pointer p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Wizard Steps indicator */}
        {step !== 'confirmation' && (
          <div className="grid grid-cols-4 border-b border-slate-900 text-[10px] uppercase font-mono font-bold tracking-tighter text-center">
            <button onClick={() => setStep('cart')} className={`py-2.5 ${step === 'cart' ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500'}`}>Review</button>
            <button onClick={() => cart.length > 0 && setStep('address')} className={`py-2.5 ${step === 'address' ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500'}`} disabled={cart.length === 0}>Address</button>
            <button onClick={() => cart.length > 0 && setStep('delivery')} className={`py-2.5 ${step === 'delivery' ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500'}`} disabled={cart.length === 0}>Delivery</button>
            <button onClick={() => cart.length > 0 && setStep('payment')} className={`py-2.5 ${step === 'payment' ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500'}`} disabled={cart.length === 0}>Pay</button>
          </div>
        )}

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* STEP 1: CART REVIEW */}
          {step === 'cart' && (
            <div className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto border border-slate-800">
                    <Trash2 className="w-6 h-6 text-slate-500" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-300">Your basket is currently empty</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">Explore our high-fidelity range of tech devices to add accessories here!</p>
                  <button onClick={onClose} className="mt-4 bg-blue-600 text-white text-xs px-5 py-2 rounded-full font-bold">Discover Store</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4 p-3 rounded-2xl bg-slate-900/30 border border-slate-800/80 items-center">
                      <div className="w-12 h-12 rounded-xl border border-slate-800 flex-shrink-0 flex items-center justify-center" style={{ background: item.product.images[0] }}>
                        <div className="w-6 h-6 rounded-full bg-white/10" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-200 truncate">{item.product.name}</h4>
                          <span className="text-xs font-mono font-bold text-blue-400">${item.product.price * item.quantity}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {item.selectedColor ? `${item.selectedColor}` : ''} {item.selectedSize ? `• ${item.selectedSize}` : ''}
                        </p>
                        
                        {/* Inline adjustments */}
                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-0.5 scale-90 origin-left">
                            <button onClick={() => handleUpdateQty(item.product.id, -1)} className="w-6 h-6 text-xs text-slate-400 hover:text-white">-</button>
                            <span className="w-6 text-center font-mono text-[11px] font-bold">{item.quantity}</span>
                            <button onClick={() => handleUpdateQty(item.product.id, 1)} className="w-6 h-6 text-xs text-slate-400 hover:text-white">+</button>
                          </div>
                          <button onClick={() => handleRemoveItem(item.product.id)} className="text-slate-500 hover:text-rose-400 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Promo Coupons Input */}
                  <div className="pt-4 border-t border-slate-900 space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Add promo coupon</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. LUMINA20"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 uppercase placeholder-slate-600 focus:outline-none flex-1"
                      />
                      <button onClick={handleApplyCoupon} className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-4 rounded-xl font-bold flex items-center gap-1.5">
                        <Percent className="w-3.5 h-3.5" /> Apply
                      </button>
                    </div>
                    {appliedCoupon && (
                      <div className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 flex items-center justify-between">
                        <span>Applied: {appliedCoupon.code} (-${discount.toFixed(0)})</span>
                        <button onClick={() => setAppliedCoupon(null)} className="text-emerald-500 hover:text-emerald-300 font-mono">✕ Remove</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: ADDRESS SELECTION */}
          {step === 'address' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Select shipment address</span>
                <button onClick={() => setShowAddAddress(!showAddAddress)} className="text-xs font-bold text-blue-400 flex items-center gap-1">
                  <PlusCircle className="w-4 h-4" /> {showAddAddress ? 'Cancel' : 'New Address'}
                </button>
              </div>

              {showAddAddress ? (
                <form onSubmit={handleCreateAddress} className="space-y-3 p-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl animate-fade-in">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">Label</label>
                      <input type="text" value={newAddrTitle} onChange={e => setNewAddrTitle(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-100" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">Full Name</label>
                      <input type="text" placeholder="Alex Rivers" value={newAddrName} onChange={e => setNewAddrName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-100" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">Phone Number</label>
                    <input type="text" placeholder="+1 (555) 019-3829" value={newAddrPhone} onChange={e => setNewAddrPhone(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-100" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">Street Address</label>
                    <input type="text" placeholder="9000 Innovation Hills" value={newAddrStreet} onChange={e => setNewAddrStreet(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-100" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">City</label>
                      <input type="text" placeholder="San Francisco" value={newAddrCity} onChange={e => setNewAddrCity(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-100" required />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">ZIP Code</label>
                      <input type="text" placeholder="94103" value={newAddrZip} onChange={e => setNewAddrZip(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-100" required />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl text-xs font-bold">Save New Destination</button>
                </form>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-3.5 items-start ${
                        selectedAddressId === addr.id
                          ? 'bg-blue-600/10 border-blue-500'
                          : 'bg-slate-900/20 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <MapPin className={`w-5 h-5 mt-0.5 ${selectedAddressId === addr.id ? 'text-blue-400' : 'text-slate-500'}`} />
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-200">{addr.title}</h4>
                          {addr.isDefault && <span className="text-[8px] font-mono font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">Default</span>}
                        </div>
                        <p className="text-xs text-slate-300 font-medium mt-1">{addr.fullName} • {addr.phone}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{addr.street}, {addr.city} {addr.postalCode}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedAddressId === addr.id ? 'border-blue-500 bg-blue-600' : 'border-slate-700'}`}>
                        {selectedAddressId === addr.id && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: DELIVERY METHOD */}
          {step === 'delivery' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Select Delivery Method</span>
              <div className="space-y-3">
                <div
                  onClick={() => setDeliveryMethod('standard')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center justify-between ${
                    deliveryMethod === 'standard' ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-900/20 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-300 border border-slate-800">
                      <Truck className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Standard Delivery</h4>
                      <p className="text-[10px] text-slate-500">Arrives in 5-7 business days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400">FREE</span>
                  </div>
                </div>

                <div
                  onClick={() => setDeliveryMethod('express')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center justify-between ${
                    deliveryMethod === 'express' ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-900/20 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-300 border border-slate-800">
                      <Truck className="w-5 h-5 text-blue-400 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Express Courier</h4>
                      <p className="text-[10px] text-slate-500">Premium fast shipping: 1-2 days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-blue-400">+$20.00</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT OPTIONS */}
          {step === 'payment' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Secure Payment Options</span>
              <div className="space-y-3">
                {[
                  { id: 'card', title: 'Credit / Debit Card', desc: 'Pay instantly via encrypted Stripe gateway', icon: <CreditCard className="w-5 h-5 text-blue-400" /> },
                  { id: 'telegram', title: 'Telegram Pay', desc: 'Secure one-click in-app checkout', icon: <Sparkles className="w-5 h-5 text-indigo-400" /> },
                  { id: 'crypto', title: 'Cryptocurrency (USDT)', desc: 'Pay using TRC20 wallet address', icon: <Check className="w-5 h-5 text-emerald-400" /> },
                  { id: 'cod', title: 'Cash on Delivery', desc: 'Pay upon receiving item package', icon: <MapPin className="w-5 h-5 text-slate-400" /> }
                ].map((pay) => (
                  <div
                    key={pay.id}
                    onClick={() => setPaymentMethod(pay.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center justify-between ${
                      paymentMethod === pay.id ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-900/20 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800">
                        {pay.icon}
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-slate-200">{pay.title}</h4>
                        <p className="text-[10px] text-slate-500">{pay.desc}</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === pay.id ? 'border-blue-500 bg-blue-600' : 'border-slate-700'}`}>
                      {paymentMethod === pay.id && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: ORDER CONFIRMATION */}
          {step === 'confirmation' && finalOrder && (
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-blue-900/30">
                <Check className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">Order Confirmed!</h3>
                <p className="text-xs text-blue-400 font-mono font-bold uppercase">{finalOrder.id}</p>
              </div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Thank you for shopping at Lumina. Your order has been registered and is now being packaged. 
                Estimated delivery: <span className="text-slate-200 font-bold">{deliveryMethod === 'express' ? 'Tomorrow by 6:00 PM' : 'In 5-7 business days'}</span>.
              </p>

              {/* Mini receipt detail */}
              <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 text-left text-xs font-mono space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>Ship To:</span>
                  <span className="text-slate-300 font-bold">{finalOrder.address.fullName}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Payment Mode:</span>
                  <span className="text-slate-300 font-bold">{finalOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-slate-500 border-t border-slate-900 pt-2 font-bold text-sm">
                  <span className="text-slate-300">Total Charged:</span>
                  <span className="text-blue-400">${finalOrder.total}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-blue-900/40"
              >
                Continue Shopping
              </button>
            </div>
          )}

        </div>

        {/* Footer Order Summary Bar */}
        {step !== 'confirmation' && cart.length > 0 && (
          <div className="p-6 border-t border-slate-900 bg-slate-900/10 space-y-4">
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Basket Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Shipping ({deliveryMethod === 'express' ? 'Express' : 'Standard'})</span>
                <span>{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'FREE'}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-900">
                <span className="text-slate-200">Total Amount</span>
                <span className="text-blue-400 text-base">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Stepper Buttons */}
            <div className="flex gap-3">
              {step !== 'cart' && (
                <button
                  onClick={() => {
                    if (step === 'address') setStep('cart');
                    else if (step === 'delivery') setStep('address');
                    else if (step === 'payment') setStep('delivery');
                  }}
                  className="px-5 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-bold text-slate-300 hover:text-white"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => {
                  if (step === 'cart') setStep('address');
                  else if (step === 'address') setStep('delivery');
                  else if (step === 'delivery') setStep('payment');
                  else if (step === 'payment') handleCheckoutSubmit();
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-2xl font-black text-xs md:text-sm shadow-xl shadow-blue-900/30 flex items-center justify-center gap-1 cursor-pointer"
              >
                {step === 'payment' ? 'Complete Secure Payment' : 'Next Step'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
