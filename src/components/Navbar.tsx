import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from 'C:/Users/Ziad/OneDrive/Documents/OSIRIDS/src\context/CartContext.tsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="border-b border-white/10 bg-pharoic-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/o.png" alt="Osirids Logo" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-serif font-bold tracking-widest text-pharoic-gold uppercase">
            Osirids
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/products" className="text-xs font-bold tracking-[0.2em] hover:text-pharoic-gold transition-colors">
            COLLECTIONS
          </Link>
          <Link to="/products" className="text-xs font-bold tracking-[0.2em] hover:text-pharoic-gold transition-colors">
            NEW ARRIVALS
          </Link>
          <Link to="/about" className="text-xs font-bold tracking-[0.2em] hover:text-pharoic-gold transition-colors">
            OUR STORY
          </Link>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <Link to="/admin" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <User size={20} />
          </Link>
          <Link to="/cart" className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-pharoic-gold text-pharoic-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-pharoic-black border-b border-white/10 py-8 px-4 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <Link
            to="/products"
            onClick={() => setIsOpen(false)}
            className="text-lg font-serif font-bold tracking-widest text-white hover:text-pharoic-gold"
          >
            COLLECTIONS
          </Link>
          <Link
            to="/products"
            onClick={() => setIsOpen(false)}
            className="text-lg font-serif font-bold tracking-widest text-white hover:text-pharoic-gold"
          >
            NEW ARRIVALS
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="text-lg font-serif font-bold tracking-widest text-white hover:text-pharoic-gold"
          >
            OUR STORY
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
