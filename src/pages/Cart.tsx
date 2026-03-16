import { ShoppingBag, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from 'C:/Users/Ziad/OneDrive/Documents/OSIRIDS/src/context/CartContext.tsx';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();
  const shipping = cartItems.length > 0 ? 15 : 0;
  const total = subtotal + shipping;

  return (
    <div className="py-12 space-y-12">
      <div className="space-y-4">
        <p className="text-pharoic-gold text-xs font-bold tracking-[0.3em] uppercase">Shopping Bag</p>
        <h1 className="text-5xl font-serif font-bold text-white tracking-tight uppercase">Your Selection</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-24 space-y-8 bg-white/5 border border-white/10 rounded-sm">
          <div className="flex justify-center"><ShoppingBag size={64} className="text-white/10" /></div>
          <p className="text-white/40 text-xl font-medium uppercase tracking-widest">Your bag is currently empty.</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">CONTINUE SHOPPING <ArrowRight size={18} /></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
            <div className="border-t border-white/10">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-8 py-8 border-b border-white/10 group">
                  <div className="w-32 aspect-[3/4] overflow-hidden bg-zinc-900 rounded-sm border border-white/5">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="text-xl font-serif font-bold text-white tracking-wide uppercase">{item.name}</h3>
                        <p className="text-white/40 text-xs font-medium uppercase tracking-widest">{item.category}</p>
                      </div>
                      <p className="text-pharoic-gold font-bold text-xl">${item.price}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border border-white/10 p-2 gap-4">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-white/40 hover:text-white transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold text-white w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-white/40 hover:text-white transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-white/20 hover:text-red-500 transition-colors flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
                      >
                        <Trash2 size={16} /> REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            <div className="bg-white/5 p-10 border border-pharoic-gold/10 space-y-10 rounded-sm">
              <h2 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">Summary</h2>
              <div className="space-y-6 text-sm font-medium tracking-widest uppercase">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between text-xl font-bold text-pharoic-gold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button className="w-full btn-primary py-5 font-bold tracking-[0.2em] text-sm">PROCEED TO CHECKOUT</button>
              <div className="flex items-center gap-4 justify-center pt-4 opacity-40">
                <div className="w-10 h-10 bg-white/10 rounded-sm" />
                <div className="w-10 h-10 bg-white/10 rounded-sm" />
                <div className="w-10 h-10 bg-white/10 rounded-sm" />
              </div>
            </div>

            <div className="p-8 border border-white/5 bg-white/[0.02] space-y-4 rounded-sm">
              <h4 className="text-xs font-bold text-pharoic-gold tracking-[0.3em] uppercase">Need Assistance?</h4>
              <p className="text-white/40 text-xs leading-relaxed font-medium">Our curators are available Monday through Friday from 9:00 AM to 6:00 PM EST to assist you with any questions.</p>
              <p className="text-white/60 text-xs font-bold tracking-widest hover:text-pharoic-gold transition-colors cursor-pointer">CONTACT SUPPORT</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
