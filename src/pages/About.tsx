import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ContentItem {
  id: string; page: string; section: string; content: string; image_url?: string;
}

const About = () => {
  const [content, setContent] = useState<Record<string, ContentItem>>({});

  useEffect(() => {
    supabase.from('content').select('*').eq('page', 'about').then(({ data }) => {
      if (!data) return;
      const map = data.reduce((acc: Record<string, ContentItem>, item: ContentItem) => {
        acc[item.section] = item; return acc;
      }, {});
      setContent(map);
    });
  }, []);

  const txt = (s: string, fallback = '') => content[s]?.content   || fallback;
  const img = (s: string, fallback = '') => content[s]?.image_url || fallback;

  return (
    <div className="py-24 space-y-32">

      {/* Origin */}
      <section className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center overflow-hidden">
        <div className="space-y-12 animate-slide-left delay-100">
          <div className="space-y-4">
            <p className="text-pharoic-gold text-sm font-bold tracking-[0.4em] uppercase animate-fade-in delay-200">
              {txt('origin_label', 'The Genesis')}
            </p>
            <h1 className="text-6xl font-serif font-bold text-white tracking-tight leading-tight animate-fade-up delay-300">
              {txt('origin_title', 'BORN FROM')} <br />
              {txt('origin_subtitle', 'THE NILE')}
            </h1>
          </div>
          <p className="text-white/60 text-lg leading-relaxed max-w-xl animate-fade-up delay-400">
            {txt('origin_description', 'Osirids was founded on a simple yet profound realization: the stories of our ancestors are too powerful to be left in the past. We created a bridge between the ancient wisdom of Egypt and the modern landscape of high-fashion.')}
          </p>
          <div className="flex gap-12 animate-fade-up delay-500">
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
        <div className="relative group animate-slide-right delay-200">
          <div className="absolute -inset-4 border border-pharoic-gold/10 -z-10 group-hover:scale-105 transition-transform duration-700" />
          <img
            src={img('origin_image', 'https://images.unsplash.com/photo-1539106397933-7bb303553229?q=80&w=1000&auto=format&fit=crop')}
            alt="Craftsmanship"
            className="w-full aspect-[4/5] object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-white/[0.02] py-32 border-y border-white/5 animate-fade-in delay-200">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-12">
          <h2 className="text-4xl font-serif font-bold text-white uppercase tracking-widest italic animate-fade-up delay-100">
            {txt('philosophy_title', 'The Osiris Philosophy')}
          </h2>
          <p className="text-xl text-white/70 font-light leading-relaxed italic animate-fade-up delay-300">
            {txt('philosophy_quote', '"Like Osiris, we believe in the cycle of rebirth. We take the timeless symbols of our heritage and breathe new life into them through contemporary design and sustainable materials."')}
          </p>
          <div className="w-16 h-px bg-pharoic-gold mx-auto animate-line-grow delay-500" />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 text-center space-y-12 animate-fade-up delay-100">
        <h2 className="text-5xl font-serif font-bold text-white uppercase tracking-tighter">Join the Legacy</h2>
        <p className="text-white/40 max-w-xl mx-auto text-lg">
          Experience the fusion of history and style. Each piece is a testament to the enduring power of Egyptian culture.
        </p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-3">
          EXPLORE THE COLLECTION <ArrowRight size={20} />
        </Link>
      </section>

    </div>
  );
};

export default About;