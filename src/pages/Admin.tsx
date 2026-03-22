import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus, Trash2, Edit2, Package, LayoutDashboard,
  Settings, Save, X, FileText,
  Upload, RefreshCw, Eye, LogOut,
} from 'lucide-react';

interface Product {
  id: string; name: string; price: number;
  description: string; image_url: string; category: string;
}
interface Content {
  id: string; page: string; section: string; content: string; image_url?: string;
}

const TABS = [
  { id: 'overview', label: 'OVERVIEW', Icon: LayoutDashboard },
  { id: 'products', label: 'PRODUCTS', Icon: Package },
  { id: 'content',  label: 'CONTENT',  Icon: FileText },
  { id: 'settings', label: 'SETTINGS', Icon: Settings },
];

const SECTION_PRESETS: Record<string, { section: string; label: string; type: 'text' | 'image' }[]> = {
  home: [
    { section: 'hero_title',       label: 'Hero Title',            type: 'text'  },
    { section: 'hero_subtitle',    label: 'Hero Subtitle',         type: 'text'  },
    { section: 'hero_description', label: 'Hero Description',      type: 'text'  },
    { section: 'hero_button1',     label: 'Button 1 Text',         type: 'text'  },
    { section: 'hero_button2',     label: 'Button 2 Text',         type: 'text'  },
    { section: 'hero_image',       label: 'Hero Background Image', type: 'image' },
    { section: 'brand_image',      label: 'Brand Section Image',   type: 'image' },
  ],
  about: [
    { section: 'origin_label',       label: 'Origin Label',       type: 'text'  },
    { section: 'origin_title',       label: 'Origin Title',       type: 'text'  },
    { section: 'origin_subtitle',    label: 'Origin Subtitle',    type: 'text'  },
    { section: 'origin_description', label: 'Origin Description', type: 'text'  },
    { section: 'origin_image',       label: 'Origin Image',       type: 'image' },
    { section: 'philosophy_title',   label: 'Philosophy Title',   type: 'text'  },
    { section: 'philosophy_quote',   label: 'Philosophy Quote',   type: 'text'  },
  ],
  footer: [
    { section: 'footer_copy', label: 'Footer Copyright Text', type: 'text' },
  ],
};

const Admin = () => {
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts]   = useState<Product[]>([]);
  const [content, setContent]     = useState<Content[]>([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState('overview');
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [flash, setFlash]         = useState('');
  const [uploadingImg, setUploadingImg] = useState(false);
  const [selectedPage, setSelectedPage] = useState('home');

  const emptyForm = { name: '', price: 0, description: '', image_url: '', category: '' };
  const [form, setForm] = useState(emptyForm);

  // Multiple images stored as array
  const [productImages, setProductImages] = useState<string[]>([]);

  const [quickEdit, setQuickEdit] = useState<Record<string, { content: string; image_url: string }>>({});

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate('/');
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin]);

  useEffect(() => {
    const map: Record<string, { content: string; image_url: string }> = {};
    content.forEach(c => {
      map[`${c.page}__${c.section}`] = { content: c.content, image_url: c.image_url || '' };
    });
    setQuickEdit(map);
  }, [content]);

  const showFlash = (msg: string) => { setFlash(msg); setTimeout(() => setFlash(''), 3000); };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchContent()]);
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const fetchContent = async () => {
    const { data } = await supabase.from('content').select('*').order('page');
    setContent(data || []);
  };

  // ── Upload image — tries Storage, falls back to base64 ────
  const uploadImage = async (file: File): Promise<string> => {
    try {
      const ext      = file.name.split('.').pop();
      const fileName = `${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, { upsert: true });

      if (!error && data) {
        return supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl;
      }
    } catch {}

    // Fallback to base64
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImg(true);
    try {
      const urls = await Promise.all(Array.from(files).map(uploadImage));
      setProductImages(prev => [...prev, ...urls]);
      showFlash(`✓ ${urls.length} photo${urls.length > 1 ? 's' : ''} added`);
    } finally {
      setUploadingImg(false);
    }
  };

  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    setProductImages(prev => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  // ── Product CRUD ──────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productImages.length === 0) { showFlash('✗ Add at least one photo'); return; }

    // Store images as JSON array string
    const imageValue = productImages.length === 1
      ? productImages[0]
      : JSON.stringify(productImages);

    const payload = { ...form, image_url: imageValue };

    if (editingId) {
      await supabase.from('products').update(payload).eq('id', editingId);
      showFlash('✓ Product updated');
    } else {
      await supabase.from('products').insert([payload]);
      showFlash('✓ Product published');
    }
    setForm(emptyForm);
    setProductImages([]);
    setShowForm(false);
    setEditingId(null);
    await fetchProducts();
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({ name: p.name, price: p.price, description: p.description, image_url: p.image_url, category: p.category });
    // Parse existing images
    try {
      const parsed = JSON.parse(p.image_url);
      setProductImages(Array.isArray(parsed) ? parsed : [p.image_url]);
    } catch {
      setProductImages(p.image_url ? [p.image_url] : []);
    }
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showFlash('✓ Deleted');
  };

  // ── Content save ──────────────────────────────────────────
  const saveSection = async (page: string, section: string) => {
    const key     = `${page}__${section}`;
    const val     = quickEdit[key] || { content: '', image_url: '' };
    setSavingKey(key);
    const existing = content.find(c => c.page === page && c.section === section);
    if (existing) {
      await supabase.from('content').update({ content: val.content, image_url: val.image_url }).eq('id', existing.id);
    } else {
      await supabase.from('content').insert([{ page, section, content: val.content, image_url: val.image_url }]);
    }
    await fetchContent();
    setSavingKey(null);
    showFlash('✓ Saved');
  };

  const inp     = 'w-full bg-pharoic-black border border-white/10 p-3 focus:border-pharoic-gold outline-none transition-colors text-sm text-white placeholder:text-white/20';
  const lbl     = 'text-[10px] font-bold text-pharoic-gold tracking-widest uppercase mb-1 block';
  const presets = SECTION_PRESETS[selectedPage] || [];

  if (authLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <RefreshCw size={28} className="animate-spin text-pharoic-gold" />
    </div>
  );
  if (!isAdmin) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-[80vh] animate-fade-in -mx-4">

      {flash && (
        <div className="fixed top-6 right-6 z-50 bg-pharoic-gold text-pharoic-black px-6 py-3 font-bold text-sm tracking-widest shadow-xl animate-fade-in">
          {flash}
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-52 bg-white/[0.03] border-r border-white/10 flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <p className="text-pharoic-gold text-[10px] font-bold tracking-[0.4em] uppercase opacity-60">Control Panel</p>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">ADMIN</h2>
          <p className="text-white/25 text-[10px] mt-1 truncate">{user?.email}</p>
        </div>
        <nav className="p-3 flex flex-col gap-1 flex-1">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-bold tracking-widest transition-all rounded-sm ${
                tab === id ? 'text-pharoic-gold bg-pharoic-gold/10 border border-pharoic-gold/20' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link to="/" className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors">
            <Eye size={13} /> VIEW SITE
          </Link>
          <button onClick={signOut} className="flex items-center gap-2 text-xs text-red-400/50 hover:text-red-400 transition-colors">
            <LogOut size={13} /> SIGN OUT
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 space-y-8 overflow-x-auto">

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-8 animate-fade-up">
            <h1 className="text-3xl font-serif font-bold text-white uppercase">Dashboard</h1>
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: 'Products', value: products.length },
                { label: 'Content',  value: content.length  },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 p-6 border border-white/10">
                  <p className="text-pharoic-gold text-[10px] font-bold tracking-widest uppercase">{s.label}</p>
                  <p className="text-4xl font-bold text-white mt-2">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {tab === 'products' && (
          <div className="space-y-8 animate-fade-up">
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
              <div>
                <h1 className="text-3xl font-serif font-bold text-white uppercase">Products</h1>
                <p className="text-white/30 text-sm mt-1">{products.length} items</p>
              </div>
              <button
                onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); setProductImages([]); }}
                className="btn-primary flex items-center gap-2 text-sm font-bold tracking-widest"
              >
                {showForm && !editingId ? <><X size={15} /> CANCEL</> : <><Plus size={15} /> ADD PRODUCT</>}
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <form onSubmit={handleSubmit} className="bg-white/5 border border-pharoic-gold/15 p-8 animate-fade-up space-y-6">
                <h2 className="text-lg font-serif font-bold text-pharoic-gold uppercase tracking-widest">
                  {editingId ? 'Edit Product' : 'New Product'}
                </h2>

                {/* Photos */}
                <div className="space-y-3">
                  <label className={lbl}>Photos * {productImages.length > 0 && <span className="text-white/30 normal-case">({productImages.length} added — first is the cover)</span>}</label>

                  {/* Photo grid */}
                  {productImages.length > 0 && (
                    <div className="flex gap-3 flex-wrap">
                      {productImages.map((img, i) => (
                        <div key={i} className="relative w-24 h-32 border border-white/10 overflow-hidden rounded-sm group">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          {/* Cover badge */}
                          {i === 0 && (
                            <span className="absolute top-1 left-1 bg-pharoic-gold text-pharoic-black text-[8px] font-bold px-1.5 py-0.5 tracking-wider">
                              COVER
                            </span>
                          )}
                          {/* Actions */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                            {i > 0 && (
                              <button
                                type="button"
                                onClick={() => moveImage(i, i - 1)}
                                className="text-white hover:text-pharoic-gold text-xs font-bold"
                                title="Move left"
                              >
                                ←
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X size={14} />
                            </button>
                            {i < productImages.length - 1 && (
                              <button
                                type="button"
                                onClick={() => moveImage(i, i + 1)}
                                className="text-white hover:text-pharoic-gold text-xs font-bold"
                                title="Move right"
                              >
                                →
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Add more */}
                      <label className={`w-24 h-32 border-2 border-dashed border-white/10 hover:border-pharoic-gold/40 flex flex-col items-center justify-center cursor-pointer transition-all ${uploadingImg ? 'opacity-50 pointer-events-none' : ''}`}>
                        {uploadingImg
                          ? <RefreshCw size={18} className="animate-spin text-pharoic-gold" />
                          : <Plus size={18} className="text-white/30" />
                        }
                        <span className="text-[9px] text-white/20 mt-1 font-bold tracking-widest uppercase">Add more</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleImageFiles(e.target.files)} />
                      </label>
                    </div>
                  )}

                  {/* Initial upload (no images yet) */}
                  {productImages.length === 0 && (
                    <label className={`
                      flex flex-col items-center justify-center w-full h-48 border-2 border-dashed
                      border-white/10 hover:border-pharoic-gold/40 cursor-pointer transition-all
                      ${uploadingImg ? 'opacity-50 pointer-events-none' : ''}
                    `}>
                      {uploadingImg
                        ? <><RefreshCw size={28} className="animate-spin text-pharoic-gold mb-2" /><span className="text-white/30 text-xs tracking-widest uppercase">Uploading...</span></>
                        : <><Upload size={28} className="text-white/20 mb-2" /><span className="text-white/30 text-xs tracking-widest uppercase">Tap to add photos</span><span className="text-white/15 text-[10px] mt-1">You can add multiple</span></>
                      }
                      <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleImageFiles(e.target.files)} />
                    </label>
                  )}
                </div>

                {/* Name + Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={lbl}>Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inp} placeholder="THE ANUBIS TEE" required />
                  </div>
                  <div>
                    <label className={lbl}>Price ($) *</label>
                    <input type="number" step="0.01" min="0" value={form.price || ''} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} className={inp} placeholder="49.99" required />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className={lbl}>Category *</label>
                  <input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inp} placeholder="T-SHIRTS" required />
                </div>

                {/* Description */}
                <div>
                  <label className={lbl}>Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inp} h-20 resize-none`} placeholder="Short description (optional)" />
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={productImages.length === 0 || uploadingImg} className="btn-primary text-sm font-bold tracking-widest flex items-center gap-2 disabled:opacity-40">
                    <Save size={14} /> {editingId ? 'UPDATE' : 'PUBLISH'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); setProductImages([]); }} className="btn-outline text-sm font-bold tracking-widest">
                    CANCEL
                  </button>
                </div>
              </form>
            )}

            {/* Product list */}
            <div className="space-y-3">
              {loading ? (
                <p className="text-white/30 text-sm p-8 text-center">Loading...</p>
              ) : products.length === 0 ? (
                <p className="text-white/30 text-sm p-8 text-center">No products yet.</p>
              ) : products.map(p => {
                // Get first image for thumbnail
                let thumb = p.image_url;
                try { const arr = JSON.parse(p.image_url); if (Array.isArray(arr)) thumb = arr[0]; } catch {}
                // Count images
                let imgCount = 1;
                try { const arr = JSON.parse(p.image_url); if (Array.isArray(arr)) imgCount = arr.length; } catch {}

                return (
                  <div key={p.id} className="flex items-center gap-5 bg-white/5 border border-white/5 p-4 hover:border-white/10 transition-all group">
                    <div className="w-14 flex-shrink-0 overflow-hidden border border-white/10 rounded-sm" style={{ height: '72px' }}>
                      <img src={thumb} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-serif font-bold uppercase tracking-wide truncate">{p.name}</p>
                      <p className="text-white/30 text-xs uppercase tracking-widest mt-0.5">{p.category}</p>
                      {imgCount > 1 && <p className="text-pharoic-gold/50 text-[10px] mt-0.5">{imgCount} photos</p>}
                    </div>
                    <p className="text-pharoic-gold font-bold text-lg flex-shrink-0">EGP {p.price}</p>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button onClick={() => handleEdit(p)}      className="text-white/30 hover:text-pharoic-gold transition-colors p-1"><Edit2  size={15} /></button>
                      <button onClick={() => handleDelete(p.id)} className="text-white/30 hover:text-red-500 transition-colors p-1"><Trash2 size={15} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CONTENT */}
        {tab === 'content' && (
          <div className="space-y-8 animate-fade-up">
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
              <div>
                <h1 className="text-3xl font-serif font-bold text-white uppercase">Content</h1>
                <p className="text-white/30 text-sm mt-1">Edit page text and images</p>
              </div>
              <button onClick={fetchContent} className="flex items-center gap-2 text-xs text-white/30 hover:text-white font-bold tracking-widest transition-colors">
                <RefreshCw size={13} /> REFRESH
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(SECTION_PRESETS).map(pg => (
                <button key={pg} onClick={() => setSelectedPage(pg)}
                  className={`px-4 py-2 text-xs font-bold tracking-widest uppercase border transition-all ${
                    selectedPage === pg ? 'border-pharoic-gold bg-pharoic-gold/10 text-pharoic-gold' : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                  }`}
                >{pg}</button>
              ))}
            </div>
            <div className="space-y-4">
              {presets.map(preset => {
                const key    = `${selectedPage}__${preset.section}`;
                const val    = quickEdit[key] || { content: '', image_url: '' };
                const saving = savingKey === key;
                return (
                  <div key={key} className="bg-white/5 p-5 border border-white/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <label className={lbl}>{preset.label}</label>
                      <span className="text-white/15 text-[9px] font-mono">{preset.section}</span>
                    </div>
                    {preset.type === 'text' ? (
                      <textarea value={val.content} onChange={e => setQuickEdit(prev => ({ ...prev, [key]: { ...val, content: e.target.value } }))} className={`${inp} h-20 resize-none`} placeholder={`Enter ${preset.label.toLowerCase()}...`} />
                    ) : (
                      <div className="space-y-2">
                        <label className={`inline-flex items-center gap-2 px-4 py-2 border border-white/15 hover:border-pharoic-gold text-white/40 hover:text-pharoic-gold transition-all cursor-pointer text-xs font-bold tracking-widest uppercase ${uploadingImg ? 'opacity-50 pointer-events-none' : ''}`}>
                          <Upload size={12} /> {uploadingImg ? 'UPLOADING...' : 'UPLOAD FROM DEVICE'}
                          <input type="file" accept="image/*" className="hidden" onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingImg(true);
                            const url = await uploadImage(file);
                            setQuickEdit(prev => ({ ...prev, [key]: { ...val, image_url: url } }));
                            setUploadingImg(false);
                            showFlash('✓ Image ready');
                          }} />
                        </label>
                        <input type="text" value={val.image_url} onChange={e => setQuickEdit(prev => ({ ...prev, [key]: { ...val, image_url: e.target.value } }))} className={inp} placeholder="https://... (auto-filled after upload)" />
                        {val.image_url && <img src={val.image_url} alt="" className="h-20 w-auto object-cover border border-white/10 rounded-sm" />}
                      </div>
                    )}
                    <button onClick={() => saveSection(selectedPage, preset.section)} disabled={saving} className="btn-primary text-xs font-bold tracking-widest flex items-center gap-2 py-2 disabled:opacity-60">
                      {saving ? <><RefreshCw size={12} className="animate-spin" /> SAVING...</> : <><Save size={12} /> SAVE</>}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <div className="space-y-8 animate-fade-up">
            <h1 className="text-3xl font-serif font-bold text-white uppercase">Settings</h1>
            <div className="bg-white/5 p-6 border border-white/10 space-y-4">
              <p className="text-pharoic-gold text-[10px] font-bold tracking-widest uppercase">Account</p>
              <p className="text-white/40 text-sm">Email: <span className="text-white font-bold">{user?.email}</span></p>
              <p className="text-white/40 text-sm">Role: <span className="text-pharoic-gold font-bold">ADMIN</span></p>
              <button onClick={signOut} className="btn-outline text-xs font-bold tracking-widest flex items-center gap-2">
                <LogOut size={13} /> SIGN OUT
              </button>
            </div>
            <div className="bg-white/5 p-6 border border-white/10 space-y-3">
              <p className="text-pharoic-gold text-[10px] font-bold tracking-widest uppercase">Database</p>
              <p className="text-white/40 text-sm">Supabase: <code className="text-white/60 text-xs">ejvsxpqogmrssudjghuk</code></p>
              <button onClick={fetchAll} className="btn-outline text-xs font-bold tracking-widest flex items-center gap-2">
                <RefreshCw size={13} /> REFRESH DATA
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Admin;