import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingBag, Filter, LayoutGrid, List } from 'lucide-react';
import { useCart, Product } from '../context/CartContext';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!supabase) throw new Error('Supabase client not initialized');
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-12 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <p className="text-pharoic-gold text-sm font-bold tracking-[0.3em] uppercase">Collections</p>
          <h1 className="text-5xl font-serif font-bold text-white tracking-tight">EXPLORE THE LINEUP</h1>
        </div>
        <div className="flex items-center gap-6 w-full md:w-auto border-b border-white/10 pb-4 md:border-0 md:pb-0">
          <div className="flex items-center gap-2 text-white/40 hover:text-pharoic-gold cursor-pointer transition-colors group">
            <Filter size={18} />
            <span className="text-sm font-medium">FILTER</span>
          </div>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'text-pharoic-gold bg-white/5' : 'text-white/40 hover:text-white'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'text-pharoic-gold bg-white/5' : 'text-white/40 hover:text-white'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 space-y-4">
          <p className="text-white/40 text-lg">No products found in our collection yet.</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>RETRY FETCHING</button>
        </div>
      ) : (
        <div className={viewMode === 'grid'
          ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12"
          : "flex flex-col gap-8"
        }>
          {products.map((product) => (
            <div key={product.id} className="group relative flex flex-col space-y-4 cursor-pointer">
              <div className="aspect-[3/4] overflow-hidden bg-zinc-900 relative rounded-sm">
                <img
                  src={product.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={() => addToCart(product)}
                  className="absolute bottom-4 left-4 right-4 bg-pharoic-gold text-pharoic-black font-bold py-3 text-xs opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={14} /> ADD TO CART
                </button>
              </div>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-bold text-white tracking-wide uppercase">{product.name}</h3>
                  <p className="text-white/40 text-xs font-medium uppercase tracking-widest">{product.category}</p>
                </div>
                <p className="text-pharoic-gold font-bold text-lg">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
