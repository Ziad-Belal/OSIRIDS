import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="py-24 space-y-32">
      {/* Our Origin */}
      <section className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="space-y-12">
          <div className="space-y-4">
            <p className="text-pharoic-gold text-sm font-bold tracking-[0.4em] uppercase">The Genesis</p>
            <h1 className="text-6xl font-serif font-bold text-white tracking-tight leading-tight">BORN FROM <br /> THE NILE</h1>
          </div>
          <p className="text-white/60 text-lg leading-relaxed max-w-xl">
            Osirids was founded on a simple yet profound realization: the stories of our ancestors are too powerful to be left in the past. We set out to create more than just a clothing brand—we created a bridge between the ancient wisdom of Egypt and the modern landscape of high-fashion.
          </p>
          <div className="flex gap-12">
            <div>
              <h4 className="text-pharoic-gold text-2xl font-serif font-bold mb-1 italic">Est. 2026</h4>
              <p className="text-white/40 text-xs font-bold tracking-widest uppercase">Legacy Starts</p>
            </div>
            <div>
              <h4 className="text-pharoic-gold text-2xl font-serif font-bold mb-1 italic">Premium</h4>
              <p className="text-white/40 text-xs font-bold tracking-widest uppercase">Craftsmanship</p>
            </div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-4 border border-pharoic-gold/10 -z-10 group-hover:scale-105 transition-transform duration-700" />
          <img 
            src="https://images.unsplash.com/photo-1539106397933-7bb303553229?q=80&w=1000&auto=format&fit=crop" 
            alt="Craftsmanship" 
            className="w-full aspect-[4/5] object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-white/[0.02] py-32 border-y border-white/5">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-12">
          <h2 className="text-4xl font-serif font-bold text-white uppercase tracking-widest italic">The Osiris Philosophy</h2>
          <p className="text-xl text-white/70 font-light leading-relaxed italic">
            "Like Osiris, we believe in the cycle of rebirth. We take the timeless symbols of our heritage and breathe new life into them through contemporary design and sustainable materials."
          </p>
          <div className="w-16 h-px bg-pharoic-gold mx-auto" />
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 text-center space-y-12">
        <h2 className="text-5xl font-serif font-bold text-white uppercase tracking-tighter">Join the Legacy</h2>
        <p className="text-white/40 max-w-xl mx-auto text-lg">
          Experience the fusion of history and style. Each piece in our collection is a testament to the enduring power of Egyptian culture.
        </p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-3">
          EXPLORE THE COLLECTION <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
};

export default About;
