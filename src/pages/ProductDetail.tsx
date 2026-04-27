import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { Product, SHIPPING_COST } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct]       = useState<Product | null>(null);
  const [loading, setLoading]       = useState(true);
  const [activeImg, setActiveImg]   = useState(0);
  const [added, setAdded]           = useState(false);
  const [selectedSize, setSelectedSize]     = useState<string | undefined>(undefined);
  const [selectedColour, setSelectedColour] = useState<string | undefined>(undefined);

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
    addToCart(product, selectedSize, selectedColour);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, selectedSize, selectedColour);
    navigate('/cart?checkout=true');
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

  const hasSizes   = product.sizes   && product.sizes.length   > 0;
  const hasColours = product.colours && product.colours.length > 0;

  // Colour hex map for swatches
  const colourHex: Record<string, string> = {
    Black:    '#0A0A0A',
    White:    '#F5F5F5',
    Beige:    '#E8D5B7',
    Navy:     '#001F5B',
    Olive:    '#556B2F',
    Camel:    '#C19A6B',
    Charcoal: '#36454F',
    Burgundy: '#800020',
  };

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
            {images.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-pharoic-gold hover:text-pharoic-black text-white p-2 transition-all">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-pharoic-gold hover:text-pharoic-black text-white p-2 transition-all">
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

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

          {/* ── Size selector ── */}
          {hasSizes && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-pharoic-gold tracking-widest uppercase">Size</p>
                {selectedSize
                  ? <span className="text-white text-xs font-bold tracking-widest">{selectedSize}</span>
                  : <span className="text-white/20 text-xs tracking-widest">None selected</span>
                }
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes!.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(prev => prev === size ? undefined : size)}
                    className={`min-w-[48px] px-3 py-2 text-xs font-bold tracking-widest border transition-all ${
                      selectedSize === size
                        ? 'border-pharoic-gold bg-pharoic-gold text-pharoic-black'
                        : 'border-white/20 text-white/60 hover:border-white/50 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Colour selector ── */}
          {hasColours && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-pharoic-gold tracking-widest uppercase">Colour</p>
                {selectedColour
                  ? <span className="text-white text-xs font-bold tracking-widest">{selectedColour}</span>
                  : <span className="text-white/20 text-xs tracking-widest">None selected</span>
                }
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colours!.map(colour => (
                  <button
                    key={colour}
                    onClick={() => setSelectedColour(prev => prev === colour ? undefined : colour)}
                    title={colour}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColour === colour
                        ? 'border-pharoic-gold scale-110 shadow-[0_0_0_2px_rgba(212,175,55,0.3)]'
                        : 'border-white/20 hover:border-white/60'
                    }`}
                    style={{ backgroundColor: colourHex[colour] ?? '#888' }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Actions ── */}
          <div className="space-y-3">
            <button
              onClick={handleAdd}
              className={`w-full py-5 font-bold tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all ${
                added ? 'bg-white text-pharoic-black' : 'btn-primary'
              }`}
            >
              {added ? <>✓ ADDED TO BAG</> : <><ShoppingBag size={18} /> ADD TO BAG</>}
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-5 font-bold tracking-[0.2em] text-sm text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
            >
              BUY NOW
            </button>
          </div>

          {/* ── Delivery ── */}
          <div className="border border-white/5 p-6 space-y-3">
            <p className="text-[10px] font-bold text-pharoic-gold tracking-widest uppercase">Delivery</p>
            <p className="text-white/40 text-xs leading-relaxed">
              Orders are delivered within 3–7 business days. Payment collected upon delivery.
            </p>
            <p className="text-white/30 text-xs">
              Shipping: <span className="text-pharoic-gold font-bold">EGP {SHIPPING_COST}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;