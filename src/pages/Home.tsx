import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-pharoic-black/20 via-pharoic-black/60 to-pharoic-black z-10" />
          <img 
            src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080&auto=format&fit=crop" 
            alt="Hero Fashion" 
            className="w-full h-full object-cover scale-110 animate-pulse-slow"
          />
        </div>

        <div className="relative z-20 text-center max-w-4xl px-4 space-y-8">
          <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight text-white leading-tight">
            LEGACY OF <br />
            <span className="text-pharoic-gold italic">THE ANCIENTS</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            Modern aesthetics meets timeless heritage. Discover our pharoic-inspired collection crafted for the bold.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link to="/products" className="btn-primary flex items-center gap-2 group">
              SHOP COLLECTION
              <ShoppingBag size={18} className="group-hover:translate-y-[-2px] transition-transform" />
            </Link>
            <Link to="/about" className="btn-outline flex items-center gap-2 group">
              EXPLORE STORY
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-pharoic-gold to-transparent" />
      </section>

      {/* Featured Collections */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-serif font-bold text-white uppercase tracking-widest">
              Featured
            </h2>
            <div className="w-20 h-1 bg-pharoic-gold" />
          </div>
          <Link to="/products" className="text-pharoic-gold hover:underline flex items-center gap-2 font-medium">
            VIEW ALL <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="group relative aspect-[3/4] overflow-hidden bg-zinc-900 cursor-pointer">
              <img 
                src={`https://images.unsplash.com/photo-${item === 1 ? '1523381235312-d87f73099fd1' : item === 2 ? '1539106397933-7bb303553229' : '1554412933-514a83d2f3c8'}?q=80&w=1000&auto=format&fit=crop`} 
                alt={`Collection ${item}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pharoic-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-pharoic-gold text-xs font-bold tracking-[0.2em] mb-2">CATEGORY</p>
                <h3 className="text-2xl font-serif font-bold text-white">THE PHAROAH SERIES</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Identity */}
      <section className="bg-[#0D0D0D] py-24">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-serif font-bold text-white leading-tight">
              INSPIRED BY <br />
              <span className="text-pharoic-gold underline decoration-pharoic-gold/30 underline-offset-8 italic">OSIRIS</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              At Osirids, we believe that fashion is a bridge between eras. Every stitch carries the wisdom of the Nile, redesigned for the contemporary world. Our mission is to provide apparel that resonates with power, elegance, and history.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <h4 className="text-pharoic-gold font-bold text-2xl mb-1">100%</h4>
                <p className="text-white/40 text-sm">Egyptian Cotton</p>
              </div>
              <div>
                <h4 className="text-pharoic-gold font-bold text-2xl mb-1">Ethical</h4>
                <p className="text-white/40 text-sm">Sustainable Production</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-square">
            <div className="absolute -inset-4 border border-pharoic-gold/20 -z-10 animate-spin-slow" />
            <img 
              src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop" 
              alt="Brand Story" 
              className="w-full h-full object-cover grayscale brightness-75"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
