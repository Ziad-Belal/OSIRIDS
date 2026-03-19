import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart, Product } from '../context/CartContext';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [added, setAdded]       = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProducts((data as Product[]) || []);
        setLoading(false);
      });
  }, []);

  const handleAdd = (product: Product) => {
    addToCart(product);
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <div className="py-10 space-y-10">

      {/* Minimal header */}
      <div className="text-center space-y-3 animate-fade-up">
        <p className="text-pharoic-gold text-[10px] font-bold tracking-[0.5em] uppercase">The Collection</p>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
          OSIRIDS
        </h1>
        <div className="w-12 h-px bg-pharoic-gold mx-auto" />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-sm" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-32 space-y-4 animate-fade-in">
          <div className="text-6xl opacity-10">𓃭</div>
          <p className="text-white/30 text-sm tracking-widest uppercase">No products yet</p>
          <p className="text-white/20 text-xs">Add products from the Admin panel</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 animate-fade-up delay-200">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="group flex flex-col gap-3 cursor-pointer animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Image */}
              <div className="aspect-[3/4] overflow-hidden bg-zinc-900 relative rounded-sm">
                <img
                  src={product.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0"
                />
                {/* Add to cart overlay */}
                <button
                  onClick={() => handleAdd(product)}
                  className={`
                    absolute bottom-0 left-0 right-0 py-3 text-xs font-bold tracking-[0.2em] uppercase
                    flex items-center justify-center gap-2
                    transition-all duration-300
                    ${added === product.id
                      ? 'bg-white text-pharoic-black opacity-100 translate-y-0'
                      : 'bg-pharoic-gold text-pharoic-black opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                    }
                  `}
                >
                  {added === product.id
                    ? <>✓ ADDED</>
                    : <><ShoppingBag size={13} /> ADD TO CART</>
                  }
                </button>
              </div>

              {/* Info */}
              <div className="flex justify-between items-start px-0.5">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <h3 className="text-sm font-serif font-bold text-white tracking-wide uppercase truncate">{product.name}</h3>
                  <p className="text-white/30 text-[10px] font-medium uppercase tracking-widest">{product.category}</p>
                </div>
                <p className="text-pharoic-gold font-bold text-sm flex-shrink-0 ml-2">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Products;