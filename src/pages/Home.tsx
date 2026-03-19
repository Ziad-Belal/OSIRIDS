import { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ContentItem {
  id: string; page: string; section: string; content: string; image_url?: string;
}

const Home = () => {
  const [content, setContent] = useState<Record<string, ContentItem>>({});

  useEffect(() => {
    supabase.from('content').select('*').eq('page', 'home').then(({ data }) => {
      if (!data) return;
      const map = data.reduce((acc: Record<string, ContentItem>, item: ContentItem) => {
        acc[item.section] = item; return acc;
      }, {});
      setContent(map);
    });
  }, []);

  const txt = (section: string, fallback = '') => content[section]?.content  || fallback;
  const img = (section: string, fallback = '') => content[section]?.image_url || fallback;

  return (
    <div className="space-y-24">

      {/* ── Hero ── */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 animate-scale-in" style={{ animationDuration: '1.4s' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-pharoic-black/20 via-pharoic-black/60 to-pharoic-black z-10" />
          <img
            src={img('hero_image', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080&auto=format&fit=crop')}
            alt="Hero"
            className="w-full h-full object-cover scale-110"
          />
        </div>
        <div className="relative z-20 text-center max-w-4xl px-4 space-y-8">
          <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight text-white leading-tight animate-fade-up delay-200">
            {txt('hero_title', 'LEGACY OF')} <br />
            <span className="text-pharoic-gold italic animate-gold-glow">
              {txt('hero_subtitle', 'THE ANCIENTS')}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed animate-fade-up delay-400">
            {txt('hero_description', 'Modern aesthetics meets timeless heritage. Discover our pharoic-inspired collection crafted for the bold.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 animate-fade-up delay-600">
            <Link to="/products" className="btn-primary flex items-center gap-2 group">
              {txt('hero_button1', 'SHOP COLLECTION')}
              <ShoppingBag size={18} className="group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <Link to="/about" className="btn-outline flex items-center gap-2 group">
              {txt('hero_button2', 'EXPLORE STORY')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-pharoic-gold to-transparent animate-fade-in delay-1000" />
      </section>

      {/* ── Featured Collections ── */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12 animate-fade-up delay-100">
          <div className="space-y-4">
            <h2 className="text-4xl font-serif font-bold text-white uppercase tracking-widest">Featured</h2>
            <div className="w-20 h-1 bg-pharoic-gold animate-line-grow" />
          </div>
          <Link to="/products" className="text-pharoic-gold hover:underline flex items-center gap-2 font-medium text-sm">
            VIEW ALL <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['1523381235312-d87f73099fd1', '1539106397933-7bb303553229', '1554412933-514a83d2f3c8'].map((id, i) => (
            <div key={id} className="group relative aspect-[3/4] overflow-hidden bg-zinc-900 cursor-pointer animate-fade-up" style={{ animationDelay: `${200 + i * 150}ms` }}>
              <img
                src={`https://images.unsplash.com/photo-${id}?q=80&w=1000&auto=format&fit=crop`}
                alt={`Collection ${i + 1}`}
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

      {/* ── Brand Identity ── */}
      <section className="bg-[#0D0D0D] py-24 overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-slide-left delay-100">
            <h2 className="text-5xl font-serif font-bold text-white leading-tight">
              INSPIRED BY <br />
              <span className="text-pharoic-gold underline decoration-pharoic-gold/30 underline-offset-8 italic animate-gold-glow">OSIRIS</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              At Osirids, we believe that fashion is a bridge between eras. Every stitch carries the wisdom of the Nile, redesigned for the contemporary world.
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
          <div className="relative aspect-square animate-slide-right delay-200">
            <div className="absolute -inset-4 border border-pharoic-gold/20 -z-10 animate-spin-slow" />
            <img
              src={img('brand_image', 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop')}
              alt="Brand"
              className="w-full h-full object-cover grayscale brightness-75"
            />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;