import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from 'C:/Users/Ziad/OneDrive/Documents/OSIRIDS/src/components/Authmodal.tsx';

const Navbar = () => {
  const [isOpen, setIsOpen]               = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode]           = useState<'login' | 'signup'>('login');
  const [showUserMenu, setShowUserMenu]   = useState(false);

  const { totalItems }                               = useCart();
  const { user, profile, isAdmin, signOut, loading } = useAuth();

  const openLogin  = () => { setAuthMode('login');  setShowAuthModal(true); setIsOpen(false); };
  const openSignup = () => { setAuthMode('signup'); setShowAuthModal(true); setIsOpen(false); };
  const handleSignOut = async () => { await signOut(); setShowUserMenu(false); };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Account';

  return (
    <>
      <nav className="border-b border-white/10 bg-pharoic-black/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-2 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/o.png"
              alt="Osirids"
              className="w-32 h-32 object-contain drop-shadow-[0_0_16px_rgba(212,175,55,0.4)]"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            <Link to="/" className="text-[11px] font-bold tracking-[0.25em] text-white/60 hover:text-pharoic-gold transition-colors">
              COLLECTION
            </Link>
            <Link to="/about" className="text-[11px] font-bold tracking-[0.25em] text-white/60 hover:text-pharoic-gold transition-colors">
              OUR STORY
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-[11px] font-bold tracking-[0.25em] text-pharoic-gold border border-pharoic-gold/40 px-3 py-1 hover:bg-pharoic-gold hover:text-pharoic-black transition-all">
                ⚙ ADMIN
              </Link>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
              <ShoppingCart size={19} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-pharoic-gold text-pharoic-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {!loading && (
              <div className="hidden md:flex items-center gap-3">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-white/50 hover:text-white border border-white/10 px-3 py-2 hover:border-white/30 transition-colors"
                    >
                      <User size={13} />
                      <span className="max-w-[90px] truncate">{displayName}</span>
                      <ChevronDown size={11} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-2 w-52 bg-[#0D0D0D] border border-white/10 shadow-2xl z-50 animate-fade-up">
                        <div className="p-4 border-b border-white/10">
                          <p className="text-white/30 text-[9px] tracking-widest uppercase">Signed in as</p>
                          <p className="text-white text-xs font-bold mt-1 truncate">{user.email}</p>
                          {isAdmin && <span className="inline-block mt-2 text-[9px] font-bold tracking-widest bg-pharoic-gold text-pharoic-black px-2 py-0.5">ADMIN</span>}
                        </div>
                        <div className="p-2 space-y-1">
                          {isAdmin && (
                            <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-3 py-2 text-[11px] text-pharoic-gold hover:bg-pharoic-gold/10 transition-colors font-bold tracking-widest">
                              ⚙ ADMIN PANEL
                            </Link>
                          )}
                          <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-red-400 hover:bg-red-400/10 transition-colors font-bold tracking-widest">
                            <LogOut size={13} /> SIGN OUT
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <button onClick={openLogin}  className="text-[11px] font-bold tracking-widest text-white/50 hover:text-white transition-colors">SIGN IN</button>
                    <button onClick={openSignup} className="btn-primary text-[11px] py-2 px-4 font-bold tracking-widest">JOIN</button>
                  </>
                )}
              </div>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors">
              {isOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {/* Mobile */}
        {isOpen && (
          <div className="md:hidden bg-pharoic-black border-b border-white/10 py-8 px-6 flex flex-col gap-6 animate-fade-up">
            <Link to="/"      onClick={() => setIsOpen(false)} className="text-base font-serif font-bold tracking-widest hover:text-pharoic-gold transition-colors">COLLECTION</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="text-base font-serif font-bold tracking-widest hover:text-pharoic-gold transition-colors">OUR STORY</Link>
            {isAdmin && <Link to="/admin" onClick={() => setIsOpen(false)} className="text-base font-serif font-bold tracking-widest text-pharoic-gold">⚙ ADMIN</Link>}
            <div className="border-t border-white/10 pt-5">
              {user ? (
                <div className="space-y-3">
                  <p className="text-white/30 text-xs truncate">{user.email}</p>
                  <button onClick={() => { handleSignOut(); setIsOpen(false); }} className="text-sm font-bold tracking-widest text-red-400">SIGN OUT</button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button onClick={openLogin}  className="btn-outline text-[11px] font-bold tracking-widest flex-1 py-3">SIGN IN</button>
                  <button onClick={openSignup} className="btn-primary text-[11px] font-bold tracking-widest flex-1 py-3">JOIN</button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {showAuthModal && <AuthModal defaultMode={authMode} onClose={() => setShowAuthModal(false)} />}
    </>
  );
};

export default Navbar;