import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus, Trash2, Edit2, Package, LayoutDashboard,
  Settings, Save, X, Image, FileText, Upload,
  Palette, Layout, RefreshCw, Eye, LogOut,
} from 'lucide-react';

interface Product {
  id: string; name: string; price: number;
  description: string; image_url: string; category: string;
}
interface Content {
  id: string; page: string; section: string; content: string; image_url?: string;
}
interface ImageFile {
  id: string; name: string; url: string;
}

const TABS = [
  { id: 'overview', label: 'OVERVIEW', Icon: LayoutDashboard },
  { id: 'products', label: 'PRODUCTS', Icon: Package },
  { id: 'content', label: 'CONTENT', Icon: FileText },
  { id: 'layout', label: 'LAYOUT', Icon: Layout },
  { id: 'images', label: 'IMAGES', Icon: Image },
  { id: 'design', label: 'DESIGN', Icon: Palette },
  { id: 'settings', label: 'SETTINGS', Icon: Settings },
];

const SECTION_PRESETS: Record<string, { section: string; label: string; type: 'text' | 'image' }[]> = {
  home: [
    { section: 'hero_title', label: 'Hero Title', type: 'text' },
    { section: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
    { section: 'hero_description', label: 'Hero Description', type: 'text' },
    { section: 'hero_button1', label: 'Button 1 Text', type: 'text' },
    { section: 'hero_button2', label: 'Button 2 Text', type: 'text' },
    { section: 'hero_image', label: 'Hero Background Img', type: 'image' },
    { section: 'brand_image', label: 'Brand Section Img', type: 'image' },
  ],
  about: [
    { section: 'origin_label', label: 'Origin Label', type: 'text' },
    { section: 'origin_title', label: 'Origin Title', type: 'text' },
    { section: 'origin_subtitle', label: 'Origin Subtitle', type: 'text' },
    { section: 'origin_description', label: 'Origin Description', type: 'text' },
    { section: 'origin_image', label: 'Origin Image', type: 'image' },
    { section: 'philosophy_title', label: 'Philosophy Title', type: 'text' },
    { section: 'philosophy_quote', label: 'Philosophy Quote', type: 'text' },
  ],
  footer: [
    { section: 'footer_copy', label: 'Footer Copyright Text', type: 'text' },
  ],
};

const Admin = () => {
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [flash, setFlash] = useState('');
  const [selectedPage, setSelectedPage] = useState('home');

  const [form, setForm] = useState({ name: '', price: 0, description: '', image_url: '', category: '' });
  const [quickEdit, setQuickEdit] = useState<Record<string, { content: string; image_url: string }>>({});
  const [design, setDesign] = useState(() => {
    const s = localStorage.getItem('osirids_design');
    return s ? JSON.parse(s) : {
      primaryColor: '#D4AF37', backgroundColor: '#0A0A0A', accentColor: '#002366',
      fontHeading: 'Playfair Display', fontBody: 'Inter',
      heroHeight: '85vh', productColumns: '4',
    };
  });

  // Redirect non-admins
  useEffect(() => {
    if (!authLoading && !isAdmin) navigate('/');
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    const map: Record<string, { content: string; image_url: string }> = {};
    content.forEach(c => { map[`${c.page}__${c.section}`] = { content: c.content, image_url: c.image_url || '' }; });
    setQuickEdit(map);
  }, [content]);

  const showFlash = (msg: string) => { setFlash(msg); setTimeout(() => setFlash(''), 3000); };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchContent(), fetchImages()]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin, fetchAll]);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const fetchContent = async () => {
    const { data } = await supabase.from('content').select('*').order('page');
    setContent(data || []);
  };

  const fetchImages = async () => {
    const { data } = await supabase.storage.from('images').list();
    if (!data) return;
    setImages(data.map((f: { id: string | null; name: string }) => ({
      id: f.id || f.name,
      name: f.name,
      url: supabase.storage.from('images').getPublicUrl(f.name).data.publicUrl,
    })));
  };

  // ── Content save ──────────────────────────────────────────
  const saveSection = async (page: string, section: string) => {
    const key = `${page}__${section}`;
    const val = quickEdit[key] || { content: '', image_url: '' };
    setSavingKey(key);
    const existing = content.find(c => c.page === page && c.section === section);
    if (existing) {
      await supabase.from('content').update({ content: val.content, image_url: val.image_url }).eq('id', existing.id);
    } else {
      await supabase.from('content').insert([{ page, section, content: val.content, image_url: val.image_url }]);
    }
    await fetchContent();
    setSavingKey(null);
    showFlash(`✓ "${section}" saved`);
  };

  // ── Product CRUD ──────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('products').update(form).eq('id', editingId);
    } else {
      await supabase.from('products').insert([form]);
    }
    setForm({ name: '', price: 0, description: '', image_url: '', category: '' });
    setShowForm(false); setEditingId(null);
    await fetchProducts();
    showFlash(editingId ? '✓ Product updated' : '✓ Product added');
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({ name: p.name, price: p.price, description: p.description, image_url: p.image_url, category: p.category });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showFlash('✓ Product deleted');
  };

  // ── Image upload/delete ───────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileName = `${Date.now()}.${file.name.split('.').pop()}`;
    await supabase.storage.from('images').upload(fileName, file);
    await fetchImages();
    showFlash('✓ Image uploaded');
  };

  const deleteImage = async (name: string) => {
    if (!confirm('Delete this image?')) return;
    await supabase.storage.from('images').remove([name]);
    await fetchImages();
    showFlash('✓ Image deleted');
  };

  const saveDesign = () => {
    localStorage.setItem('osirids_design', JSON.stringify(design));
    showFlash('✓ Design saved — refresh the site to apply');
  };

  // ─────────────────────────────────────────────────────────
  const inp = 'w-full bg-pharoic-black border border-white/10 p-3 focus:border-pharoic-gold outline-none transition-colors text-sm text-white placeholder:text-white/20';
  const lbl = 'text-[10px] font-bold text-pharoic-gold tracking-widest uppercase mb-1 block';
  const presets = SECTION_PRESETS[selectedPage] || [];

  if (authLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <RefreshCw size={32} className="animate-spin text-pharoic-gold" />
    </div>
  );

  if (!isAdmin) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-[80vh] animate-fade-in -mx-4">

      {/* Flash */}
      {flash && (
        <div className="fixed top-6 right-6 z-50 bg-pharoic-gold text-pharoic-black px-6 py-3 font-bold text-sm tracking-widest animate-fade-in shadow-xl">
          {flash}
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside className="w-full md:w-56 bg-white/[0.03] border-r border-white/10 flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <p className="text-pharoic-gold text-[10px] font-bold tracking-[0.4em] uppercase opacity-60">Control Panel</p>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">ADMIN</h2>
          <p className="text-white/30 text-[10px] mt-1 truncate">{user?.email}</p>
        </div>
        <nav className="p-3 flex flex-col gap-1">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-bold tracking-widest transition-all rounded-sm ${tab === id ? 'text-pharoic-gold bg-pharoic-gold/10 border border-pharoic-gold/20' : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2 mt-auto">
          <Link to="/" className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors">
            <Eye size={13} /> VIEW SITE
          </Link>
          <button onClick={signOut} className="flex items-center gap-2 text-xs text-red-400/60 hover:text-red-400 transition-colors">
            <LogOut size={13} /> SIGN OUT
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 p-8 space-y-10 overflow-x-auto">

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-8 animate-fade-up">
            <h1 className="text-3xl font-serif font-bold text-white uppercase">Dashboard</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Products', value: products.length },
                { label: 'Images', value: images.length },
                { label: 'Content Sections', value: content.length },
                { label: 'Pages', value: 3 },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 p-6 border border-white/10">
                  <p className="text-pharoic-gold text-[10px] font-bold tracking-widest uppercase">{s.label}</p>
                  <p className="text-4xl font-bold text-white mt-2">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white/5 p-6 border border-pharoic-gold/10 space-y-3">
              <h3 className="text-pharoic-gold font-bold text-xs tracking-widest uppercase">Quick Guide</h3>
              <ul className="text-white/40 text-sm space-y-2 list-disc list-inside">
                <li><strong className="text-white/70">Products</strong> — Add, edit, delete store items</li>
                <li><strong className="text-white/70">Content</strong> — Edit all page text & images</li>
                <li><strong className="text-white/70">Layout</strong> — Toggle sections, change columns & hero height</li>
                <li><strong className="text-white/70">Images</strong> — Upload, copy URL, delete images</li>
                <li><strong className="text-white/70">Design</strong> — Brand colors, fonts, live preview</li>
              </ul>
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === 'products' && (
          <div className="space-y-8 animate-fade-up">
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
              <div>
                <h1 className="text-3xl font-serif font-bold text-white uppercase">Inventory</h1>
                <p className="text-white/40 text-sm mt-1">{products.length} products</p>
              </div>
              <button
                onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', price: 0, description: '', image_url: '', category: '' }); }}
                className="btn-primary flex items-center gap-2 text-sm tracking-widest font-bold"
              >
                {showForm && !editingId ? <><X size={16} /> CANCEL</> : <><Plus size={16} /> ADD PRODUCT</>}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="bg-white/5 p-8 border border-pharoic-gold/10 space-y-6 animate-fade-up">
                <h2 className="text-xl font-serif font-bold text-pharoic-gold uppercase">{editingId ? 'Edit Product' : 'New Product'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className={lbl}>Name</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inp} placeholder="THE ANUBIS TEE" required /></div>
                  <div><label className={lbl}>Price ($)</label><input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} className={inp} placeholder="0.00" required /></div>
                  <div><label className={lbl}>Category</label><input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inp} placeholder="T-SHIRTS" required /></div>
                  <div><label className={lbl}>Image URL</label><input type="text" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className={inp} placeholder="https://..." required /></div>
                </div>
                <div><label className={lbl}>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inp} h-24`} placeholder="Describe this piece..." required /></div>
                <div className="flex gap-4">
                  <button type="submit" className="btn-primary text-sm font-bold tracking-widest flex items-center gap-2"><Save size={15} /> {editingId ? 'UPDATE' : 'SAVE'}</button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-outline text-sm font-bold tracking-widest">CANCEL</button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto border border-white/5">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    {['IMAGE', 'NAME', 'CATEGORY', 'PRICE', 'ACTIONS'].map(h => (
                      <th key={h} className="p-5 text-[10px] font-bold text-pharoic-gold tracking-widest uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan={5} className="p-12 text-center text-white/30">Loading...</td></tr>
                  ) : products.length === 0 ? (
                    <tr><td colSpan={5} className="p-12 text-center text-white/30">No products yet. Add your first one above.</td></tr>
                  ) : products.map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-5">
                        <img src={p.image_url} alt={p.name} className="w-12 h-16 object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all" />
                      </td>
                      <td className="p-5 font-serif font-bold text-white">{p.name}</td>
                      <td className="p-5 text-white/40 text-sm">{p.category}</td>
                      <td className="p-5 text-pharoic-gold font-bold">${p.price}</td>
                      <td className="p-5 text-right space-x-4">
                        <button onClick={() => handleEdit(p)} className="text-white/40 hover:text-pharoic-gold transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(p.id)} className="text-white/40 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CONTENT ── */}
        {tab === 'content' && (
          <div className="space-y-8 animate-fade-up">
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
              <div>
                <h1 className="text-3xl font-serif font-bold text-white uppercase">Content Editor</h1>
                <p className="text-white/40 text-sm mt-1">Edit every piece of text & image on the site</p>
              </div>
              <button onClick={fetchContent} className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors font-bold tracking-widest">
                <RefreshCw size={13} /> REFRESH
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(SECTION_PRESETS).map(pg => (
                <button key={pg} onClick={() => setSelectedPage(pg)}
                  className={`px-4 py-2 text-xs font-bold tracking-widest uppercase border transition-all ${selectedPage === pg ? 'border-pharoic-gold bg-pharoic-gold/10 text-pharoic-gold' : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                    }`}
                >{pg}</button>
              ))}
            </div>
            <div className="space-y-4">
              {presets.map(preset => {
                const key = `${selectedPage}__${preset.section}`;
                const val = quickEdit[key] || { content: '', image_url: '' };
                const saving = savingKey === key;
                return (
                  <div key={key} className="bg-white/5 p-6 border border-white/10 space-y-3">
                    <div className="flex justify-between">
                      <label className={lbl}>{preset.label}</label>
                      <span className="text-white/20 text-[9px] font-mono tracking-widest">{preset.section}</span>
                    </div>
                    {preset.type === 'text' ? (
                      <textarea
                        value={val.content}
                        onChange={e => setQuickEdit(prev => ({ ...prev, [key]: { ...val, content: e.target.value } }))}
                        className={`${inp} h-20 resize-none`}
                        placeholder={`Enter ${preset.label.toLowerCase()}...`}
                      />
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={val.image_url}
                          onChange={e => setQuickEdit(prev => ({ ...prev, [key]: { ...val, image_url: e.target.value } }))}
                          className={inp}
                          placeholder="https://image-url.com/photo.jpg"
                        />
                        {val.image_url && (
                          <img src={val.image_url} alt="" className="h-20 w-auto object-cover border border-white/10" />
                        )}
                      </div>
                    )}
                    <button onClick={() => saveSection(selectedPage, preset.section)} disabled={saving}
                      className="btn-primary text-xs font-bold tracking-widest flex items-center gap-2 py-2 disabled:opacity-60"
                    >
                      {saving ? <><RefreshCw size={13} className="animate-spin" /> SAVING...</> : <><Save size={13} /> SAVE</>}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── LAYOUT ── */}
        {tab === 'layout' && (
          <div className="space-y-8 animate-fade-up">
            <div className="border-b border-white/10 pb-6">
              <h1 className="text-3xl font-serif font-bold text-white uppercase">Layout Controls</h1>
              <p className="text-white/40 text-sm mt-1">Control page structure and section settings</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 p-6 border border-white/10 space-y-5">
                <h2 className="text-pharoic-gold font-bold text-xs tracking-widest uppercase">Grid & Dimensions</h2>
                <div className="space-y-2">
                  <label className={lbl}>Product Columns</label>
                  <select value={design.productColumns} onChange={e => setDesign((d: typeof design) => ({ ...d, productColumns: e.target.value }))} className={inp}>
                    <option value="2">2 Columns</option>
                    <option value="3">3 Columns</option>
                    <option value="4">4 Columns (Default)</option>
                    <option value="5">5 Columns</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={lbl}>Hero Height</label>
                  <select value={design.heroHeight} onChange={e => setDesign((d: typeof design) => ({ ...d, heroHeight: e.target.value }))} className={inp}>
                    <option value="60vh">60vh — Short</option>
                    <option value="75vh">75vh — Medium</option>
                    <option value="85vh">85vh — Tall (Default)</option>
                    <option value="100vh">100vh — Full Screen</option>
                  </select>
                </div>
              </div>
            </div>
            <button onClick={saveDesign} className="btn-primary font-bold tracking-widest text-sm flex items-center gap-2">
              <Save size={15} /> SAVE LAYOUT
            </button>
          </div>
        )}

        {/* ── IMAGES ── */}
        {tab === 'images' && (
          <div className="space-y-8 animate-fade-up">
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
              <div>
                <h1 className="text-3xl font-serif font-bold text-white uppercase">Image Library</h1>
                <p className="text-white/40 text-sm mt-1">Upload images, then copy their URL into Content fields</p>
              </div>
              <label className="btn-primary flex items-center gap-2 text-sm tracking-widest font-bold cursor-pointer">
                <Upload size={15} /> UPLOAD
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            {images.length === 0 ? (
              <p className="text-white/30 text-sm">No images yet. Upload one above.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map(img => (
                  <div key={img.id} className="bg-white/5 border border-white/10 p-4 space-y-3">
                    <img src={img.url} alt={img.name} className="w-full h-40 object-cover" />
                    <p className="text-white/40 text-xs font-mono truncate">{img.name}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { navigator.clipboard.writeText(img.url); showFlash('✓ URL copied!'); }}
                        className="flex-1 text-xs text-pharoic-gold border border-pharoic-gold/30 py-2 hover:bg-pharoic-gold/10 transition-colors font-bold tracking-widest"
                      >
                        COPY URL
                      </button>
                      <button onClick={() => deleteImage(img.name)} className="px-3 border border-white/10 text-white/30 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── DESIGN ── */}
        {tab === 'design' && (
          <div className="space-y-8 animate-fade-up">
            <div className="border-b border-white/10 pb-6">
              <h1 className="text-3xl font-serif font-bold text-white uppercase">Design Settings</h1>
              <p className="text-white/40 text-sm mt-1">Brand colors and typography</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 p-6 border border-white/10 space-y-6">
                <h2 className="text-pharoic-gold font-bold text-xs tracking-widest uppercase">Brand Colors</h2>
                {[
                  { key: 'primaryColor', label: 'Gold / Primary Color' },
                  { key: 'backgroundColor', label: 'Background Color' },
                  { key: 'accentColor', label: 'Accent Color' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-white/50 text-sm">{label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white/30 text-xs font-mono">{design[key as keyof typeof design]}</span>
                      <input type="color" value={design[key as keyof typeof design] as string}
                        onChange={e => setDesign((d: typeof design) => ({ ...d, [key]: e.target.value }))}
                        className="w-10 h-10 rounded cursor-pointer border border-white/10 bg-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 p-6 border border-white/10 space-y-6">
                <h2 className="text-pharoic-gold font-bold text-xs tracking-widest uppercase">Typography</h2>
                <div className="space-y-2">
                  <label className={lbl}>Heading Font</label>
                  <select value={design.fontHeading} onChange={e => setDesign((d: typeof design) => ({ ...d, fontHeading: e.target.value }))} className={inp}>
                    <option>Playfair Display</option>
                    <option>Cormorant Garamond</option>
                    <option>EB Garamond</option>
                    <option>Cinzel</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={lbl}>Body Font</label>
                  <select value={design.fontBody} onChange={e => setDesign((d: typeof design) => ({ ...d, fontBody: e.target.value }))} className={inp}>
                    <option>Inter</option>
                    <option>DM Sans</option>
                    <option>Lato</option>
                    <option>Open Sans</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Live preview */}
            <div className="p-8 border border-pharoic-gold/20 space-y-4" style={{ background: design.backgroundColor }}>
              <p className="text-xs tracking-widest uppercase" style={{ color: design.primaryColor, fontFamily: design.fontBody }}>Preview</p>
              <h3 className="text-4xl font-bold" style={{ color: '#fff', fontFamily: design.fontHeading }}>OSIRIDS</h3>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: design.fontBody }}>Modern aesthetics meets timeless heritage.</p>
              <span className="inline-block px-5 py-2 text-xs font-bold" style={{ background: design.primaryColor, color: design.backgroundColor }}>SHOP NOW</span>
            </div>

            <button onClick={saveDesign} className="btn-primary font-bold tracking-widest text-sm flex items-center gap-2">
              <Save size={15} /> SAVE DESIGN
            </button>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {tab === 'settings' && (
          <div className="space-y-8 animate-fade-up">
            <h1 className="text-3xl font-serif font-bold text-white uppercase">Settings</h1>
            <div className="bg-white/5 p-6 border border-white/10 space-y-4">
              <h2 className="text-pharoic-gold font-bold text-xs tracking-widest uppercase">Admin Account</h2>
              <p className="text-white/40 text-sm">Signed in as: <span className="text-white font-bold">{user?.email}</span></p>
              <p className="text-white/40 text-sm">Role: <span className="text-pharoic-gold font-bold">ADMIN</span></p>
              <button onClick={signOut} className="btn-outline text-xs font-bold tracking-widest flex items-center gap-2 mt-4">
                <LogOut size={14} /> SIGN OUT
              </button>
            </div>
            <div className="bg-white/5 p-6 border border-white/10 space-y-3">
              <h2 className="text-pharoic-gold font-bold text-xs tracking-widest uppercase">Database</h2>
              <p className="text-white/40 text-sm">Connected to Supabase project: <code className="text-white/60">ejvsxpqogmrssudjghuk</code></p>
              <p className="text-white/40 text-sm">Tables: <code className="text-white/60">profiles, products, content, orders, order_items, wishlist</code></p>
              <button onClick={fetchAll} className="btn-outline text-xs font-bold tracking-widest flex items-center gap-2">
                <RefreshCw size={13} /> REFRESH ALL DATA
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Admin;