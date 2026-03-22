import { useState } from 'react';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, CheckCircle, Loader, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface CheckoutForm {
  phone:   string;
  address: string;
  city:    string;
  country: string;
  notes:   string;
}

const emptyForm: CheckoutForm = {
  phone: '', address: '', city: '', country: '', notes: '',
};

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const { user, profile } = useAuth();

  const shipping = cartItems.length > 0 ? 15 : 0;
  const total    = subtotal + shipping;

  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm]   = useState<CheckoutForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');
  const [orderSummary, setOrderSummary] = useState<{
    orderId: string;
    customerName: string;
    items: { name: string; price: number; quantity: number }[];
    subtotal: number;
    shipping: number;
    total: number;
    phone: string;
    address: string;
    city: string;
    country: string;
    notes: string;
  } | null>(null);

  const set = (key: keyof CheckoutForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Use profile name/email if logged in, fallback to generic
    const customerName  = profile?.full_name  || user?.email?.split('@')[0] || 'Customer';
    const customerEmail = profile?.email       || user?.email               || '';

    try {
      // 1 ── Save order ──────────────────────────────────────
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert([{
          user_id:       user?.id   || null,
          status:        'pending',
          total,
          shipping_cost: shipping,
          full_name:     customerName,
          email:         customerEmail,
          address:       form.address,
          city:          form.city,
          country:       form.country,
          notes:         form.notes,
        }])
        .select()
        .single();

      if (orderErr) throw new Error(orderErr.message);

      // 2 ── Save order items ────────────────────────────────
      const { error: itemsErr } = await supabase.from('order_items').insert(
        cartItems.map(item => ({
          order_id:   orderData.id,
          product_id: item.id,
          name:       item.name,
          price:      item.price,
          quantity:   item.quantity,
          image_url:  item.image_url,
        }))
      );
      if (itemsErr) throw new Error(itemsErr.message);

      // 3 ── Send Telegram notification to admin ────────────
      const BOT_TOKEN = '8327094438:AAG4DdWj0Z7TMpukkZRKB_SSd8CoK_BXQe0';
      const CHAT_ID   = '6671717853';
      const orderId   = orderData.id.slice(0, 8).toUpperCase();

      const message = `
🏺 *NEW ORDER #${orderId}*

👤 *Customer*
Name: ${customerName}
Email: ${customerEmail}
Phone: ${form.phone}

📦 *Items Ordered*
${cartItems.map(i => `• ${i.name} × ${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`).join('\n')}

💰 *Price*
Subtotal: EGP ${subtotal.toFixed(2)}
Shipping: EGP ${shipping.toFixed(2)}
*Total: EGP ${total.toFixed(2)}*

📍 *Delivery Address*
${form.address}
${form.city}, ${form.country}
${form.notes ? `\n📝 Notes: ${form.notes}` : ''}
      `.trim();

      fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id:    CHAT_ID,
          text:       message,
          parse_mode: 'Markdown',
        }),
      }).catch(err => console.warn('Telegram notification failed:', err));

      // Save summary BEFORE clearing cart
      setOrderSummary({
        orderId:      orderData.id.slice(0, 8).toUpperCase(),
        customerName,
        items:        cartItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
        subtotal, shipping, total,
        phone:   form.phone,
        address: form.address,
        city:    form.city,
        country: form.country,
        notes:   form.notes,
      });

      clearCart();
      setSuccess(true);

    } catch (err: any) {
      console.error('Order error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = 'w-full bg-pharoic-black border border-white/10 p-3 focus:border-pharoic-gold outline-none transition-colors text-sm text-white placeholder:text-white/20';
  const lbl = 'text-[10px] font-bold text-pharoic-gold tracking-widest uppercase mb-1 block';

  // ── SUCCESS ───────────────────────────────────────────────
  if (success && orderSummary) {
    return (
      <div className="py-12 max-w-2xl mx-auto animate-scale-in space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <CheckCircle size={64} className="text-pharoic-gold mx-auto" strokeWidth={1} />
          <h1 className="text-4xl font-serif font-bold text-white uppercase tracking-widest">Order Placed!</h1>
          <p className="text-white/40 text-sm">Screenshot this page for your records</p>
          <div className="w-16 h-px bg-pharoic-gold mx-auto" />
        </div>

        {/* Order card */}
        <div className="border border-pharoic-gold/30 bg-white/[0.02] p-8 space-y-6">

          {/* Order ID */}
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <p className="text-[10px] font-bold text-pharoic-gold tracking-[0.4em] uppercase">Order Number</p>
            <p className="text-white font-bold text-lg tracking-widest">#{orderSummary.orderId}</p>
          </div>

          {/* Customer */}
          <div className="space-y-2 pb-4 border-b border-white/10">
            <p className="text-[10px] font-bold text-pharoic-gold tracking-[0.4em] uppercase mb-3">Customer</p>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Name</span>
              <span className="text-white font-medium">{orderSummary.customerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Phone</span>
              <span className="text-white font-medium">{orderSummary.phone}</span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3 pb-4 border-b border-white/10">
            <p className="text-[10px] font-bold text-pharoic-gold tracking-[0.4em] uppercase mb-3">Items Ordered</p>
            {orderSummary.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-white/60">{item.name} <span className="text-white/30">× {item.quantity}</span></span>
                <span className="text-white font-medium">EGP {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 pb-4 border-b border-white/10">
            <div className="flex justify-between text-sm text-white/40">
              <span>Subtotal</span><span>EGP {orderSummary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-white/40">
              <span>Shipping</span><span>EGP {orderSummary.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-pharoic-gold pt-1">
              <span>Total</span><span>EGP {orderSummary.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-pharoic-gold tracking-[0.4em] uppercase mb-3">Delivery Address</p>
            <p className="text-white/60 text-sm">{orderSummary.address}, {orderSummary.city}, {orderSummary.country}</p>
            {orderSummary.notes && (
              <p className="text-white/40 text-xs">Notes: {orderSummary.notes}</p>
            )}
          </div>
        </div>

        {/* Note */}
        <div className="text-center space-y-2">
          <p className="text-white/30 text-xs leading-relaxed">
            Payment is collected upon delivery.<br/>
            We will contact you shortly to confirm your order.
          </p>
        </div>

        <Link
          to="/"
          className="btn-primary w-full flex items-center justify-center gap-2 text-sm font-bold tracking-widest py-4"
        >
          CONTINUE SHOPPING <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 space-y-12">

      {/* Header */}
      <div className="space-y-4 animate-fade-up">
        <p className="text-pharoic-gold text-xs font-bold tracking-[0.3em] uppercase">Shopping Bag</p>
        <h1 className="text-5xl font-serif font-bold text-white tracking-tight uppercase">Your Selection</h1>
        <div className="w-12 h-px bg-pharoic-gold animate-line-grow delay-300" />
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-24 space-y-8 bg-white/5 border border-white/10 animate-scale-in">
          <ShoppingBag size={64} className="mx-auto text-white/10" />
          <p className="text-white/40 text-xl font-medium uppercase tracking-widest">Your bag is empty.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            CONTINUE SHOPPING <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Items */}
          <div className="lg:col-span-2 border-t border-white/10">
            {cartItems.map((item, i) => (
              <div key={item.id} className="flex gap-8 py-8 border-b border-white/10 group animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-28 aspect-[3/4] overflow-hidden bg-zinc-900 rounded-sm border border-white/5 flex-shrink-0">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-lg font-serif font-bold text-white tracking-wide uppercase">{item.name}</h3>
                      <p className="text-white/40 text-xs font-medium uppercase tracking-widest">{item.category}</p>
                    </div>
                    <p className="text-pharoic-gold font-bold">EGP {item.price}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-white/10 p-2 gap-4">
                      <button onClick={() => updateQuantity(item.id, -1)} className="text-white/40 hover:text-white transition-colors"><Minus size={13} /></button>
                      <span className="text-sm font-bold text-white w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id,  1)} className="text-white/40 hover:text-white transition-colors"><Plus  size={13} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-white/20 hover:text-red-500 transition-colors flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                      <Trash2 size={14} /> REMOVE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-6 animate-slide-right delay-200">
            <div className="bg-white/5 p-8 border border-pharoic-gold/10 space-y-6">
              <h2 className="text-xl font-serif font-bold text-white uppercase tracking-wider">Summary</h2>
              <div className="space-y-4 text-sm font-medium tracking-widest uppercase">
                <div className="flex justify-between text-white/50"><span>Subtotal</span><span>EGP {subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-white/50"><span>Shipping</span><span>EGP {shipping.toFixed(2)}</span></div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between text-lg font-bold text-pharoic-gold"><span>Total</span><span>EGP {total.toFixed(2)}</span></div>
              </div>
              <button onClick={() => setShowCheckout(true)} className="w-full btn-primary py-4 font-bold tracking-[0.2em] text-sm">
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CHECKOUT MODAL ── */}
      {showCheckout && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">

            {/* Header */}
            <div className="flex justify-between items-center p-8 border-b border-white/10 sticky top-0 bg-[#0D0D0D] z-10">
              <div>
                <p className="text-pharoic-gold text-[10px] font-bold tracking-[0.4em] uppercase">Checkout</p>
                <h2 className="text-2xl font-serif font-bold text-white uppercase mt-1">Delivery Details</h2>
              </div>
              <button onClick={() => setShowCheckout(false)} className="text-white/30 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleOrder} className="p-8 space-y-6">

              {/* Who is ordering */}
              {user && (
                <div className="bg-white/5 border border-white/10 p-4 space-y-1">
                  <p className="text-[10px] font-bold text-pharoic-gold tracking-widest uppercase">Ordering as</p>
                  <p className="text-white font-bold text-sm">{profile?.full_name || user.email}</p>
                  <p className="text-white/40 text-xs">{user.email}</p>
                </div>
              )}

              {/* Order summary */}
              <div className="bg-white/5 border border-white/10 p-4 space-y-2">
                <p className="text-[10px] font-bold text-pharoic-gold tracking-widest uppercase mb-3">Your Order</p>
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-white/60">{item.name} <span className="text-white/30">× {item.quantity}</span></span>
                    <span className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="h-px bg-white/10 mt-2" />
                <div className="flex justify-between font-bold text-pharoic-gold">
                  <span>Total</span><span>EGP {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={lbl}>Phone Number *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  className={inp}
                  placeholder="+20 100 000 0000"
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-pharoic-gold tracking-widest uppercase border-b border-white/10 pb-2">Delivery Address</p>
                <div>
                  <label className={lbl}>Street Address *</label>
                  <input type="text" value={form.address} onChange={set('address')} className={inp} placeholder="123 Nile Street, Apt 4B" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>City *</label>
                    <input type="text" value={form.city}    onChange={set('city')}    className={inp} placeholder="Cairo"  required />
                  </div>
                  <div>
                    <label className={lbl}>Country *</label>
                    <input type="text" value={form.country} onChange={set('country')} className={inp} placeholder="Egypt"  required />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className={lbl}>Notes (optional)</label>
                <textarea value={form.notes} onChange={set('notes')} className={`${inp} h-20 resize-none`} placeholder="Any special instructions..." />
              </div>

              {error && (
                <p className="text-red-400 text-xs border border-red-400/20 bg-red-400/5 p-4">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-5 font-bold tracking-[0.2em] text-sm flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {loading
                  ? <><Loader size={16} className="animate-spin" /> PLACING ORDER...</>
                  : <>PLACE ORDER — EGP {total.toFixed(2)}</>
                }
              </button>

              <p className="text-center text-white/20 text-xs">
                Payment collected upon delivery.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;