import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { Product } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct]     = useState<Product | null>(null);
  const [loading, setLoading]     = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded]         = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setProduct(data as Product);
        setLoading(false);
      });
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-pharoic-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <p className="text-white/40 text-sm tracking-widest uppercase">Product not found</p>
      <button onClick={() => navigate('/')} className="btn-outline text-xs font-bold tracking-widest">
        BACK TO SHOP
      </button>
    </div>
  );

  // Support multiple images stored as JSON array or single URL
  let images: string[] = [];
  try {
    const parsed = JSON.parse(product.image_url);
    images = Array.isArray(parsed) ? parsed : [product.image_url];
  } catch {
    images = product.image_url ? [product.image_url] : [];
  }

  const prev = () => setActiveImg(i => (i - 1 + images.length) % images.length);
  const next = () => setActiveImg(i => (i + 1) % images.length);

  return (
    <div className="py-10 animate-fade-in">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase mb-10"
      >
        <ArrowLeft size={16} /> BACK
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* ── Images ── */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 rounded-sm">
            {images.length > 0 ? (
              <img
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/10 text-6xl">𓃭</div>
            )}

            {/* Arrows — only if multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-pharoic-gold hover:text-pharoic-black text-white p-2 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-pharoic-gold hover:text-pharoic-black text-white p-2 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-20 aspect-[3/4] overflow-hidden border-2 transition-all ${
                    activeImg === i ? 'border-pharoic-gold' : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="space-y-8 lg:sticky lg:top-32">
          <div className="space-y-3">
            <p className="text-pharoic-gold text-[10px] font-bold tracking-[0.5em] uppercase">{product.category}</p>
            <h1 className="text-4xl font-serif font-bold text-white uppercase tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-pharoic-gold">EGP {product.price}</p>
          </div>

          <div className="w-12 h-px bg-pharoic-gold" />

          {product.description && (
            <p className="text-white/50 text-sm leading-relaxed">{product.description}</p>
          )}

          <button
            onClick={handleAdd}
            className={`w-full py-5 font-bold tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all ${
              added
                ? 'bg-white text-pharoic-black'
                : 'btn-primary'
            }`}
          >
            {added
              ? <>✓ ADDED TO BAG</>
              : <><ShoppingBag size={18} /> ADD TO BAG</>
            }
          </button>

          <div className="border border-white/5 p-6 space-y-3">
            <p className="text-[10px] font-bold text-pharoic-gold tracking-widest uppercase">Delivery</p>
            <p className="text-white/40 text-xs leading-relaxed">
              Orders are delivered within 3–7 business days. Payment collected upon delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;