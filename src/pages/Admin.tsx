import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Edit2, Package, LayoutDashboard, Settings, LogIn, Save, X, Image, FileText, Upload } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
}

interface Content {
  id: string;
  page: string;
  section: string;
  content: string;
  image_url?: string;
}

interface ImageFile {
  id: string;
  name: string;
  url: string;
  uploaded_at: string;
}

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [currentTab, setCurrentTab] = useState('overview');

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    image_url: '',
    category: ''
  });

  const [contentForm, setContentForm] = useState({
    page: 'home',
    section: 'hero_title',
    content: '',
    image_url: ''
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
      fetchContent();
      fetchImages();
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

  const fetchContent = async () => {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');

      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('page');

      if (error) throw error;
      setContent(data || []);
    } catch (err) {
      console.error('Error fetching content:', err);
    }
  };

  const fetchImages = async () => {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');

      const { data, error } = await supabase.storage
        .from('images')
        .list();

      if (error) throw error;
      const imageFiles = (data || []).map((file: any) => ({
        id: file.id || file.name,
        name: file.name,
        url: supabase.storage.from('images').getPublicUrl(file.name).data.publicUrl,
        uploaded_at: file.created_at || new Date().toISOString()
      }));
      setImages(imageFiles);
    } catch (err) {
      console.error('Error fetching images:', err);
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

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!supabase) throw new Error('Supabase client not initialized');

      const existing = content.find(c => c.page === contentForm.page && c.section === contentForm.section);

      if (existing) {
        const { error } = await supabase
          .from('content')
          .update({ content: contentForm.content, image_url: contentForm.image_url })
          .eq('id', existing.id);

        if (error) throw error;
        setContent(content.map(c => c.id === existing.id ? { ...c, content: contentForm.content, image_url: contentForm.image_url } : c));
      } else {
        const { data, error } = await supabase
          .from('content')
          .insert([contentForm])
          .select();

        if (error) throw error;
        setContent([...(data || []), ...content]);
      }
      setContentForm({ page: 'home', section: 'hero_title', content: '', image_url: '' });
    } catch (err) {
      console.error('Error saving content:', err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (!supabase) throw new Error('Supabase client not initialized');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (error) throw error;

      fetchImages(); // Refresh images
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };

  const deleteImage = async (name: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      if (!supabase) throw new Error('Supabase client not initialized');

      const { error } = await supabase.storage
        .from('images')
        .remove([name]);

      if (error) throw error;
      fetchImages();
    } catch (err) {
      console.error('Error deleting image:', err);
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
          <button
            onClick={() => setCurrentTab('overview')}
            className={`flex items-center gap-4 font-bold text-sm tracking-widest p-4 rounded-sm transition-colors ${currentTab === 'overview' ? 'text-pharoic-gold bg-white/5' : 'text-white/40 hover:text-pharoic-gold'
              }`}
          >
            <LayoutDashboard size={18} /> OVERVIEW
          </button>
          <button
            onClick={() => setCurrentTab('products')}
            className={`flex items-center gap-4 font-bold text-sm tracking-widest p-4 rounded-sm transition-colors ${currentTab === 'products' ? 'text-pharoic-gold bg-white/5' : 'text-white/40 hover:text-pharoic-gold'
              }`}
          >
            <Package size={18} /> PRODUCTS
          </button>
          <button
            onClick={() => setCurrentTab('content')}
            className={`flex items-center gap-4 font-bold text-sm tracking-widest p-4 rounded-sm transition-colors ${currentTab === 'content' ? 'text-pharoic-gold bg-white/5' : 'text-white/40 hover:text-pharoic-gold'
              }`}
          >
            <FileText size={18} /> CONTENT
          </button>
          <button
            onClick={() => setCurrentTab('images')}
            className={`flex items-center gap-4 font-bold text-sm tracking-widest p-4 rounded-sm transition-colors ${currentTab === 'images' ? 'text-pharoic-gold bg-white/5' : 'text-white/40 hover:text-pharoic-gold'
              }`}
          >
            <Image size={18} /> IMAGES
          </button>
          <button
            onClick={() => setCurrentTab('settings')}
            className={`flex items-center gap-4 font-bold text-sm tracking-widest p-4 rounded-sm transition-colors ${currentTab === 'settings' ? 'text-pharoic-gold bg-white/5' : 'text-white/40 hover:text-pharoic-gold'
              }`}
          >
            <Settings size={18} /> SETTINGS
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-12">
        {currentTab === 'overview' && (
          <div className="space-y-8">
            <h1 className="text-4xl font-serif font-bold text-white uppercase tracking-wider">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 p-8 border border-white/10">
                <h3 className="text-pharoic-gold font-bold text-sm tracking-widest uppercase mb-4">Total Products</h3>
                <p className="text-3xl font-bold text-white">{products.length}</p>
              </div>
              <div className="bg-white/5 p-8 border border-white/10">
                <h3 className="text-pharoic-gold font-bold text-sm tracking-widest uppercase mb-4">Total Images</h3>
                <p className="text-3xl font-bold text-white">{images.length}</p>
              </div>
              <div className="bg-white/5 p-8 border border-white/10">
                <h3 className="text-pharoic-gold font-bold text-sm tracking-widest uppercase mb-4">Content Sections</h3>
                <p className="text-3xl font-bold text-white">{content.length}</p>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'products' && (
          <>
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
          </>
        )}

        {currentTab === 'content' && (
          <div className="space-y-12">
            <div className="flex flex-col sm:flex-row justify-between items-center border-b border-white/10 pb-8 gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <h1 className="text-4xl font-serif font-bold text-white uppercase tracking-wider">Content Management</h1>
                <p className="text-white/40 text-sm font-medium">Edit website text and images.</p>
              </div>
            </div>

            <form onSubmit={handleContentSubmit} className="bg-white/5 p-12 border border-pharoic-gold/10 space-y-8">
              <h2 className="text-2xl font-serif font-bold text-pharoic-gold uppercase italic">Edit Content</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-pharoic-gold tracking-widest uppercase">Page</label>
                  <select
                    value={contentForm.page}
                    onChange={e => setContentForm({ ...contentForm, page: e.target.value })}
                    className="w-full bg-pharoic-black border border-white/10 p-4 focus:border-pharoic-gold outline-none transition-colors"
                  >
                    <option value="home">Home</option>
                    <option value="about">About</option>
                    <option value="products">Products</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-pharoic-gold tracking-widest uppercase">Section</label>
                  <input
                    type="text"
                    value={contentForm.section}
                    onChange={e => setContentForm({ ...contentForm, section: e.target.value })}
                    className="w-full bg-pharoic-black border border-white/10 p-4 focus:border-pharoic-gold outline-none transition-colors"
                    placeholder="e.g. hero_title"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-pharoic-gold tracking-widest uppercase">Content</label>
                <textarea
                  value={contentForm.content}
                  onChange={e => setContentForm({ ...contentForm, content: e.target.value })}
                  className="w-full bg-pharoic-black border border-white/10 p-4 h-32 focus:border-pharoic-gold outline-none transition-colors"
                  placeholder="Enter content..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-pharoic-gold tracking-widest uppercase">Image URL (optional)</label>
                <input
                  type="text"
                  value={contentForm.image_url}
                  onChange={e => setContentForm({ ...contentForm, image_url: e.target.value })}
                  className="w-full bg-pharoic-black border border-white/10 p-4 focus:border-pharoic-gold outline-none transition-colors"
                  placeholder="https://..."
                />
              </div>
              <button type="submit" className="btn-primary font-bold tracking-widest text-sm flex items-center gap-2">
                <Save size={18} /> SAVE CONTENT
              </button>
            </form>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold text-white uppercase">Current Content</h3>
              {content.map(item => (
                <div key={item.id} className="bg-white/5 p-6 border border-white/10">
                  <p className="text-pharoic-gold font-bold">{item.page} - {item.section}</p>
                  <p className="text-white mt-2">{item.content}</p>
                  {item.image_url && <img src={item.image_url} alt="" className="w-32 h-32 object-cover mt-4" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'images' && (
          <div className="space-y-12">
            <div className="flex flex-col sm:flex-row justify-between items-center border-b border-white/10 pb-8 gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <h1 className="text-4xl font-serif font-bold text-white uppercase tracking-wider">Image Library</h1>
                <p className="text-white/40 text-sm font-medium">Upload and manage website images.</p>
              </div>
              <label className="btn-primary flex items-center gap-2 text-sm tracking-widest font-bold whitespace-nowrap cursor-pointer">
                <Upload size={18} /> UPLOAD IMAGE
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {images.map(image => (
                <div key={image.id} className="bg-white/5 p-6 border border-white/10">
                  <img src={image.url} alt={image.name} className="w-full h-48 object-cover mb-4" />
                  <p className="text-white font-medium mb-2">{image.name}</p>
                  <button
                    onClick={() => deleteImage(image.name)}
                    className="text-red-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'settings' && (
          <div className="space-y-12">
            <h1 className="text-4xl font-serif font-bold text-white uppercase tracking-wider">Settings</h1>
            <p className="text-white/40">Settings panel coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
