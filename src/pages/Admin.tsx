import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Edit2, Package, LayoutDashboard, Settings, LogIn, Save, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
}

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    image_url: '',
    category: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'osirids2026') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect passcode');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    setLoading(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        setProducts(products.map(p => p.id === editingId ? { ...p, ...formData } : p));
        setEditingId(null);
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([formData])
          .select();

        if (error) throw error;
        setProducts([...(data || []), ...products]);
        setShowAddForm(false);
      }
      setFormData({ name: '', price: 0, description: '', image_url: '', category: '' });
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      image_url: product.image_url,
      category: product.category
    });
    setShowAddForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      if (!supabase) throw new Error('Supabase client not initialized');

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white/5 p-12 border border-white/10 space-y-8 w-full max-w-md text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-serif font-bold text-pharoic-gold uppercase">Admin Access</h1>
            <p className="text-white/40 text-sm">Please enter your curator passcode to continue.</p>
          </div>
          <input
            type="password"
            value={passcode}
            onChange={e => setPasscode(e.target.value)}
            className="w-full bg-pharoic-black border border-white/10 p-4 focus:border-pharoic-gold outline-none transition-colors text-center"
            placeholder="PASSCODE"
            required
          />
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            <LogIn size={18} /> ENTER DASHBOARD
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-12 py-12">
      {/* Sidebar */}
      <aside className="w-full md:w-64 space-y-12">
        <div className="space-y-4 text-center md:text-left">
          <p className="text-pharoic-gold text-xs font-bold tracking-[0.3em] uppercase opacity-50">Admin Panel</p>
          <h2 className="text-3xl font-serif font-bold text-white tracking-tight uppercase">Dashboard</h2>
        </div>
        <nav className="flex flex-col gap-6">
          <button className="flex items-center gap-4 text-pharoic-gold font-bold text-sm tracking-widest bg-white/5 p-4 rounded-sm">
            <LayoutDashboard size={18} /> OVERVIEW
          </button>
          <button className="flex items-center gap-4 text-white/40 hover:text-pharoic-gold transition-colors font-bold text-sm tracking-widest p-4">
            <Package size={18} /> PRODUCTS
          </button>
          <button className="flex items-center gap-4 text-white/40 hover:text-pharoic-gold transition-colors font-bold text-sm tracking-widest p-4">
            <Settings size={18} /> SETTINGS
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-white/10 pb-8 gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-4xl font-serif font-bold text-white uppercase tracking-wider">Inventory</h1>
            <p className="text-white/40 text-sm font-medium">Manage your product collection and stock levels.</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingId(null);
              setFormData({ name: '', price: 0, description: '', image_url: '', category: '' });
            }}
            className="btn-primary flex items-center gap-2 text-sm tracking-widest font-bold whitespace-nowrap"
          >
            {showAddForm && !editingId ? <X size={18} /> : <Plus size={18} />}
            {showAddForm && !editingId ? 'CANCEL' : 'ADD NEW PRODUCT'}
          </button>
        </div>

        {/* Add/Edit Product Form */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="bg-white/5 p-12 border border-pharoic-gold/10 space-y-8 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-2xl font-serif font-bold text-pharoic-gold uppercase italic">
              {editingId ? 'Edit Product' : 'New Product Details'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-pharoic-gold tracking-widest uppercase">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-pharoic-black border border-white/10 p-4 focus:border-pharoic-gold outline-none transition-colors"
                  placeholder="e.g. THE ANUBIS TEE"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-pharoic-gold tracking-widest uppercase">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full bg-pharoic-black border border-white/10 p-4 focus:border-pharoic-gold outline-none transition-colors"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-pharoic-gold tracking-widest uppercase">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-pharoic-black border border-white/10 p-4 focus:border-pharoic-gold outline-none transition-colors"
                  placeholder="e.g. T-SHIRTS"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-pharoic-gold tracking-widest uppercase">Image URL</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-pharoic-black border border-white/10 p-4 focus:border-pharoic-gold outline-none transition-colors"
                  placeholder="https://..."
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-pharoic-gold tracking-widest uppercase">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-pharoic-black border border-white/10 p-4 h-32 focus:border-pharoic-gold outline-none transition-colors"
                placeholder="Describe the piece..."
                required
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="btn-primary font-bold tracking-widest text-sm flex items-center gap-2">
                <Save size={18} /> {editingId ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                }}
                className="btn-outline font-bold tracking-widest text-sm"
              >
                CANCEL
              </button>
            </div>
          </form>
        )}

        {/* Product Table */}
        <div className="overflow-x-auto border border-white/5 rounded-sm">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-6 text-xs font-bold text-pharoic-gold tracking-widest uppercase">IMAGE</th>
                <th className="p-6 text-xs font-bold text-pharoic-gold tracking-widest uppercase">NAME</th>
                <th className="p-6 text-xs font-bold text-pharoic-gold tracking-widest uppercase">CATEGORY</th>
                <th className="p-6 text-xs font-bold text-pharoic-gold tracking-widest uppercase">PRICE</th>
                <th className="p-6 text-xs font-bold text-pharoic-gold tracking-widest uppercase text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="p-12 text-center text-white/40">Loading your inventory...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center text-white/40">Your inventory is empty. Start adding products.</td></tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <img src={product.image_url} alt={product.name} className="w-16 h-20 object-cover rounded-sm border border-white/10 grayscale group-hover:grayscale-0 transition-all" />
                    </td>
                    <td className="p-6 font-serif font-bold text-white tracking-wide">{product.name}</td>
                    <td className="p-6 text-white/40 font-medium">{product.category}</td>
                    <td className="p-6 font-bold text-pharoic-gold">${product.price}</td>
                    <td className="p-6 text-right space-x-4">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-white/40 hover:text-pharoic-gold transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-white/40 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Admin;
