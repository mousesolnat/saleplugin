
import React, { useState } from 'react';
import { Product, StoreSettings, Order, Page, BlogPost, Review } from '../types';
import { CURRENCIES } from '../constants';
import { 
  Plus, Edit, Trash2, X, Save, Search, Image as ImageIcon, 
  ArrowLeft, Lock, LogIn, LayoutGrid, Package, ShoppingCart, 
  Settings, TrendingUp, DollarSign, Users, ExternalLink, Globe, Share2,
  CheckCircle, AlertCircle, AlertTriangle, Sparkles, MapPin, FileText,
  BarChart, Download, Palette, LayoutTemplate, BookOpen, Calendar, PenTool,
  CreditCard, Type, PaintBucket, MessageSquare, Star, Check, Shield, Anchor
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  onAdd: (p: Product) => void;
  onUpdate: (p: Product) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  storeSettings: StoreSettings;
  onUpdateSettings: (s: StoreSettings) => void;
  // Pages Props
  pages: Page[];
  onAddPage: (p: Page) => void;
  onUpdatePage: (p: Page) => void;
  onDeletePage: (id: string) => void;
  // Blog Props
  blogPosts: BlogPost[];
  onAddPost: (p: BlogPost) => void;
  onUpdatePost: (p: BlogPost) => void;
  onDeletePost: (id: string) => void;
  // Orders Props
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
}

type Tab = 'overview' | 'products' | 'orders' | 'pages' | 'blog' | 'reviews' | 'settings';
type SettingsSubTab = 'general' | 'design' | 'payment' | 'checkout' | 'footer' | 'seo' | 'social' | 'security';

// Helper to generate a nice placeholder image
const generatePlaceholder = (name: string, category: string) => {
  const bgColors: Record<string, string> = {
    'Builders & Addons': '2563eb', // blue
    'SEO & Marketing': '059669', // emerald
    'eCommerce': '7c3aed', // violet
    'Forms & Leads': 'db2777', // pink
    'Performance': 'd97706', // amber
    'Booking & Events': 'dc2626', // red
    'LMS & Education': '0891b2', // cyan
    'Plugins & Tools': '475569' // slate
  };
  
  const color = bgColors[category] || '475569';
  const text = encodeURIComponent(name);
  return `https://placehold.co/600x400/${color}/ffffff?text=${text}`;
};

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      active
        ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <span className={active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}>
      {icon}
    </span>
    {label}
  </button>
);

const StatCard = ({ title, value, icon, change }: { title: string, value: string, icon: React.ReactNode, change: string }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
    </div>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-bold text-slate-900">{value}</span>
      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${change.includes('+') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
        {change}
      </span>
    </div>
  </div>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, onAdd, onUpdate, onDelete, onClose, storeSettings, onUpdateSettings,
  pages, onAddPage, onUpdatePage, onDeletePage,
  blogPosts, onAddPost, onUpdatePost, onDeletePost,
  orders, onUpdateOrder
}) => {
  // Login State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Dashboard State
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [settingsSubTab, setSettingsSubTab] = useState<SettingsSubTab>('general');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // Feedback State
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'product' | 'page' | 'post' | 'review'>('product');
  const [reviewToDelete, setReviewToDelete] = useState<{productId: string, reviewId: string} | null>(null);

  // Product State
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);

  // Page State
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [pageForm, setPageForm] = useState<Partial<Page>>({});
  const [isAddingPage, setIsAddingPage] = useState(false);

  // Blog State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState<Partial<BlogPost>>({});
  const [isAddingPost, setIsAddingPost] = useState(false);

  // Settings State
  const [tempSettings, setTempSettings] = useState<StoreSettings>(storeSettings);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(products.map(p => p.category)));

  // Review Helpers
  const allReviews = products.flatMap(p => (p.reviews || []).map(r => ({
      ...r,
      productName: p.name,
      productImage: p.image
  })));

  const filteredReviews = allReviews.filter(r => {
      if (reviewFilter === 'all') return true;
      if (reviewFilter === 'pending') return r.status === 'pending';
      if (reviewFilter === 'approved') return !r.status || r.status === 'approved'; // Legacy handled as approved
      if (reviewFilter === 'rejected') return r.status === 'rejected';
      return true;
  });

  // --- Helpers ---
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'on-hold': return 'bg-orange-100 text-orange-700';
      case 'cancelled': return 'bg-slate-100 text-slate-700';
      case 'refunded': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  // --- Auth Handler ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === (storeSettings.adminPassword || 'admin')) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  // --- Product Handlers ---
  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
    setIsAdding(false);
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditForm({
      name: '',
      price: 0,
      category: 'Plugins & Tools',
      description: 'New product description.',
      image: '',
      seoTitle: '',
      seoDescription: ''
    });
  };

  const handleSaveProduct = () => {
    if (!editForm.name || !editForm.price) {
      showToast('Name and Price are required', 'error');
      return;
    }

    if (isAdding) {
      let finalImage = editForm.image;
      if (!finalImage || finalImage.trim() === '') {
        finalImage = generatePlaceholder(editForm.name || 'Product', editForm.category || 'Plugins & Tools');
      }

      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        name: editForm.name || 'New Product',
        price: Number(editForm.price),
        category: editForm.category || 'Plugins & Tools',
        description: editForm.description || '',
        image: finalImage,
        seoTitle: editForm.seoTitle || '',
        seoDescription: editForm.seoDescription || ''
      };
      onAdd(newProduct);
      setIsAdding(false);
      showToast('Product added successfully');
    } else if (editingId) {
      onUpdate({ ...editForm, id: editingId } as Product);
      setEditingId(null);
      showToast('Product updated successfully');
    }
    setEditForm({});
  };

  // --- Page Handlers ---
  const handleEditPageClick = (page: Page) => {
    setEditingPageId(page.id);
    setPageForm({ ...page });
    setIsAddingPage(false);
  };

  const handleAddPageClick = () => {
    setIsAddingPage(true);
    setEditingPageId(null);
    setPageForm({ title: '', slug: '', content: '' });
  };

  const handleSavePage = () => {
     if (!pageForm.title || !pageForm.content) {
       showToast('Title and Content are required', 'error');
       return;
     }
     
     const slug = pageForm.slug || pageForm.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

     if (isAddingPage) {
        const newPage: Page = {
          id: `page_${Date.now()}`,
          title: pageForm.title || 'Untitled',
          slug: slug,
          content: pageForm.content || ''
        };
        onAddPage(newPage);
        setIsAddingPage(false);
        showToast('Page created');
     } else if (editingPageId) {
        onUpdatePage({ ...pageForm, id: editingPageId, slug } as Page);
        setEditingPageId(null);
        showToast('Page updated');
     }
     setPageForm({});
  };

  // --- Blog Handlers ---
  const handleEditPostClick = (post: BlogPost) => {
    setEditingPostId(post.id);
    setPostForm({ ...post });
    setIsAddingPost(false);
  };

  const handleAddPostClick = () => {
    setIsAddingPost(true);
    setEditingPostId(null);
    setPostForm({ title: '', slug: '', content: '', excerpt: '', author: 'Admin', category: 'News', date: new Date().toISOString().split('T')[0] });
  };

  const handleSavePost = () => {
     if (!postForm.title || !postForm.content) {
       showToast('Title and Content are required', 'error');
       return;
     }
     
     const slug = postForm.slug || postForm.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
     
     const finalImage = postForm.image || `https://placehold.co/600x400/4f46e5/ffffff?text=${encodeURIComponent(postForm.title || 'Blog')}`;

     if (isAddingPost) {
        const newPost: BlogPost = {
          id: `post_${Date.now()}`,
          title: postForm.title || 'Untitled',
          slug: slug,
          content: postForm.content || '',
          excerpt: postForm.excerpt || '',
          author: postForm.author || 'Admin',
          date: postForm.date || new Date().toISOString().split('T')[0],
          image: finalImage,
          category: postForm.category || 'News',
          seoTitle: postForm.seoTitle || '',
          seoDescription: postForm.seoDescription || ''
        };
        onAddPost(newPost);
        setIsAddingPost(false);
        showToast('Article created');
     } else if (editingPostId) {
        onUpdatePost({ ...postForm, id: editingPostId, slug, image: finalImage } as BlogPost);
        setEditingPostId(null);
        showToast('Article updated');
     }
     setPostForm({});
  };

  // --- Review Handlers ---
  const handleReviewStatus = (productId: string, reviewId: string, status: 'approved' | 'rejected') => {
      const product = products.find(p => p.id === productId);
      if (!product || !product.reviews) return;
      const updatedReviews = product.reviews.map(r => r.id === reviewId ? { ...r, status } : r);
      onUpdate({ ...product, reviews: updatedReviews });
      showToast(`Review ${status}`);
  };

  const handleReviewDeleteRequest = (productId: string, reviewId: string) => {
      setReviewToDelete({ productId, reviewId });
      setDeleteConfirmId(reviewId); // Just a flag
      setDeleteType('review');
  };

  const confirmDeleteReview = () => {
      if (!reviewToDelete) return;
      const product = products.find(p => p.id === reviewToDelete.productId);
      if (product && product.reviews) {
          const updatedReviews = product.reviews.filter(r => r.id !== reviewToDelete.reviewId);
          onUpdate({ ...product, reviews: updatedReviews });
          showToast('Review deleted');
      }
      setReviewToDelete(null);
      setDeleteConfirmId(null);
  };

  // --- Delete Handler (Shared) ---
  const handleDeleteRequest = (id: string, type: 'product' | 'page' | 'post') => {
    setDeleteConfirmId(id);
    setDeleteType(type);
  };

  const handleConfirmDelete = () => {
    if (deleteType === 'review') {
        confirmDeleteReview();
        return;
    }
    if (deleteConfirmId) {
      if (deleteType === 'product') {
        onDelete(deleteConfirmId);
        if (editingId === deleteConfirmId) { setEditingId(null); setIsAdding(false); }
      } else if (deleteType === 'page') {
        onDeletePage(deleteConfirmId);
        if (editingPageId === deleteConfirmId) { setEditingPageId(null); setIsAddingPage(false); }
      } else if (deleteType === 'post') {
        onDeletePost(deleteConfirmId);
        if (editingPostId === deleteConfirmId) { setEditingPostId(null); setIsAddingPost(false); }
      }
      showToast(`${deleteType.charAt(0).toUpperCase() + deleteType.slice(1)} deleted`);
      setDeleteConfirmId(null);
    }
  };

  // --- Settings Handlers ---
  const handleSaveSettings = () => {
    onUpdateSettings(tempSettings);
    showToast('Store settings saved successfully');
  };

  const handleDownloadSitemap = () => {
    const baseUrl = storeSettings.siteUrl.endsWith('/') ? storeSettings.siteUrl.slice(0, -1) : storeSettings.siteUrl;
    const date = new Date().toISOString().split('T')[0];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/shop</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

    products.forEach(p => {
        const slug = p.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        xml += `
  <url>
    <loc>${baseUrl}/product/${p.id}/${slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    pages.forEach(p => {
        xml += `
  <url>
    <loc>${baseUrl}/page/${p.slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

    blogPosts.forEach(p => {
        xml += `
  <url>
    <loc>${baseUrl}/blog/${p.slug}</loc>
    <lastmod>${p.date || date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Sitemap downloaded');
  };

  // --- Login Screen ---
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-sm w-full rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 text-center border-b border-slate-200 bg-white">
             <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
               <Lock size={24} />
             </div>
             <h2 className="text-xl font-bold text-slate-900">Admin Portal</h2>
             <p className="text-slate-500 text-sm mt-1">Enter password to access dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter password (default: admin)"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    loginError 
                    ? 'border-red-300 focus:ring-red-200 bg-red-50 text-red-900 placeholder-red-400' 
                    : 'border-slate-200 focus:ring-indigo-500 focus:bg-white bg-white'
                }`}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginError(false); }}
                autoFocus
              />
              {loginError && <p className="text-red-500 text-xs mt-2 pl-1">Incorrect password.</p>}
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <LogIn size={18} /> Login
            </button>
            <button type="button" onClick={onClose} className="w-full text-slate-400 hover:text-slate-600 text-sm font-medium py-2">
              Back to Store
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Main Dashboard Layout ---
  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans relative text-slate-900">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[60] px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in transition-all ${
          toast.type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-fade-in">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Item?</h3>
              <p className="text-slate-500 text-sm mb-6">Are you sure you want to delete this? This action cannot be undone.</p>
              <div className="flex gap-3">
                 <button onClick={() => {setDeleteConfirmId(null); setReviewToDelete(null);}} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                 <button onClick={handleConfirmDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">Delete</button>
              </div>
           </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 hidden md:flex">
        <div className="p-6 border-b border-slate-200 flex items-center gap-2">
           <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
             <LayoutGrid size={20} />
           </div>
           <span className="font-bold text-lg tracking-tight text-slate-900">AdminPanel</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem icon={<TrendingUp size={18} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={<Package size={18} />} label="Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
          <SidebarItem icon={<ShoppingCart size={18} />} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
          <SidebarItem icon={<MessageSquare size={18} />} label="Reviews" active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} />
          <SidebarItem icon={<FileText size={18} />} label="Pages" active={activeTab === 'pages'} onClick={() => setActiveTab('pages')} />
          <SidebarItem icon={<BookOpen size={18} />} label="Blog" active={activeTab === 'blog'} onClick={() => setActiveTab('blog')} />
          <SidebarItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-4 border-t border-slate-200">
           <button onClick={onClose} className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-red-600 text-sm py-2 hover:bg-red-50 rounded-lg transition-colors">
              <ExternalLink size={14} /> Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
           <div className="flex items-center gap-4">
             <button className="md:hidden text-slate-500" onClick={onClose}><ArrowLeft size={20}/></button>
             <h1 className="text-xl font-bold text-slate-900 capitalize">{activeTab}</h1>
           </div>
        </header>

        <div className="flex-1 overflow-auto p-6 bg-white text-slate-900">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`$${orders.filter(o => o.status === 'completed').reduce((acc, o) => acc + o.total, 0).toLocaleString()}`} icon={<DollarSign className="text-green-500" />} change="+12%" />
                <StatCard title="Total Products" value={products.length.toString()} icon={<Package className="text-blue-500" />} change="+4" />
                <StatCard title="Total Orders" value={orders.length.toString()} icon={<ShoppingCart className="text-amber-500" />} change={`+${orders.length}`} />
                <StatCard title="Pending Reviews" value={allReviews.filter(r => r.status === 'pending').length.toString()} icon={<MessageSquare className="text-purple-500" />} change="Needs Action" />
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="flex flex-col lg:flex-row gap-6 h-full">
               <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full min-h-[500px]">
                  <div className="p-4 border-b border-slate-200 flex gap-4 bg-white">
                     <div className="relative flex-1">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                     </div>
                     <button onClick={handleAddClick} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap"><Plus size={18} /> Add New</button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-white sticky top-0 z-10 border-b border-slate-200">
                        <tr>
                          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredProducts.map(product => (
                          <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-white overflow-hidden shrink-0 border border-slate-200">
                                   {product.image ? <img src={product.image} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-full h-full p-2 text-slate-300" />}
                                </div>
                                <span className="font-medium text-slate-900 line-clamp-1">{product.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-slate-600 hidden sm:table-cell"><span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs">{product.category}</span></td>
                            <td className="p-4 text-sm font-bold text-slate-900">${product.price}</td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleEditClick(product)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"><Edit size={16} /></button>
                                <button onClick={() => handleDeleteRequest(product.id, 'product')} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>

               {(editingId || isAdding) && (
                 <div className="w-full lg:w-96 bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-fit sticky top-0 z-20 overflow-y-auto max-h-[90vh]">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white rounded-t-xl sticky top-0 z-10">
                      <h3 className="font-bold text-slate-900">{isAdding ? 'Add Product' : 'Edit Product'}</h3>
                      <button onClick={() => {setEditingId(null); setIsAdding(false);}} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Name</label><input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} /></div>
                      <div className="grid grid-cols-2 gap-4">
                         <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Price</label><input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" value={editForm.price || 0} onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})} /></div>
                         <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category</label><select className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>{categories.map(c => <option key={c} value={c}>{c}</option>)}<option value="New Category">Other...</option></select></div>
                      </div>
                      <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Image URL</label><div className="flex gap-2"><input type="text" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg bg-white" placeholder="Leave empty to auto-generate" value={editForm.image || ''} onChange={e => setEditForm({...editForm, image: e.target.value})} /><button type="button" onClick={() => {const img = generatePlaceholder(editForm.name || 'Product', editForm.category || 'Plugins & Tools'); setEditForm({...editForm, image: img});}} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 text-sm font-medium transition-colors" title="Generate Placeholder Image"><Sparkles size={18} /></button></div></div>
                      
                      <div className="pt-4 border-t border-slate-200 mt-4">
                        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1"><Globe size={14} className="text-green-600"/> SEO Settings</h4>
                        <div className="space-y-3">
                          <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">SEO Title</label><input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" placeholder={editForm.name || ''} value={editForm.seoTitle || ''} onChange={e => setEditForm({...editForm, seoTitle: e.target.value})} /></div>
                          <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Meta Description</label><textarea rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm" placeholder="Summarize for search engines..." value={editForm.seoDescription || ''} onChange={e => setEditForm({...editForm, seoDescription: e.target.value})} /></div>
                        </div>
                      </div>

                      <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label><textarea rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} /></div>
                      <button onClick={handleSaveProduct} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"><Save size={18} /> Save Product</button>
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 border-b border-slate-200 bg-white">
                 <h2 className="font-bold text-slate-900">Recent Orders</h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-white border-b border-slate-200">
                     <tr>
                       <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Order ID</th>
                       <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                       <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                       <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Total</th>
                       <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {orders.map(order => (
                       <tr key={order.id} className="hover:bg-slate-50">
                         <td className="p-4 font-bold text-indigo-600">{order.id}</td>
                         <td className="p-4">
                           <div className="font-medium text-slate-900">{order.customer}</div>
                           <div className="text-xs text-slate-500">{order.email}</div>
                         </td>
                         <td className="p-4">
                           <select 
                              value={order.status} 
                              onChange={(e) => onUpdateOrder({ ...order, status: e.target.value as any })}
                              className={`text-xs font-bold uppercase px-2 py-1 rounded border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${getStatusBadge(order.status)}`}
                           >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="completed">Completed</option>
                              <option value="on-hold">On Hold</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="refunded">Refunded</option>
                           </select>
                         </td>
                         <td className="p-4 font-bold text-slate-900">${order.total}</td>
                         <td className="p-4 text-sm text-slate-600">{order.date}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {/* PAGES TAB */}
          {activeTab === 'pages' && (
            <div className="flex flex-col lg:flex-row gap-6 h-full">
               <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                  <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
                     <h2 className="font-bold text-slate-900">Static Pages</h2>
                     <button onClick={handleAddPageClick} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"><Plus size={18} /> New Page</button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white border-b border-slate-200 sticky top-0">
                        <tr>
                          <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Title</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Slug</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pages.map(page => (
                          <tr key={page.id} className="hover:bg-slate-50">
                            <td className="p-4 font-bold text-slate-900">{page.title}</td>
                            <td className="p-4 text-sm text-slate-600">/{page.slug}</td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => handleEditPageClick(page)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"><Edit size={16} /></button>
                                <button onClick={() => handleDeleteRequest(page.id, 'page')} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>

               {(editingPageId || isAddingPage) && (
                 <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-fit sticky top-0 z-20">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white rounded-t-xl">
                      <h3 className="font-bold text-slate-900">{isAddingPage ? 'New Page' : 'Edit Page'}</h3>
                      <button onClick={() => {setEditingPageId(null); setIsAddingPage(false);}} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Page Title</label><input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" value={pageForm.title || ''} onChange={e => setPageForm({...pageForm, title: e.target.value})} /></div>
                      <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Slug (URL)</label><input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" placeholder="auto-generated-if-empty" value={pageForm.slug || ''} onChange={e => setPageForm({...pageForm, slug: e.target.value})} /></div>
                      <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Content (HTML allowed)</label><textarea rows={12} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-mono text-sm" value={pageForm.content || ''} onChange={e => setPageForm({...pageForm, content: e.target.value})} /></div>
                      <button onClick={handleSavePage} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"><Save size={18} /> Save Page</button>
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* BLOG TAB */}
          {activeTab === 'blog' && (
            <div className="flex flex-col lg:flex-row gap-6 h-full">
               <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                  <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
                     <h2 className="font-bold text-slate-900">Blog Posts</h2>
                     <button onClick={handleAddPostClick} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"><Plus size={18} /> Write Article</button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white border-b border-slate-200 sticky top-0">
                        <tr>
                          <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Title</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Category</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {blogPosts.map(post => (
                          <tr key={post.id} className="hover:bg-slate-50">
                            <td className="p-4 font-bold text-slate-900">{post.title}</td>
                            <td className="p-4 text-sm text-slate-600"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs uppercase font-bold">{post.category}</span></td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => handleEditPostClick(post)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"><Edit size={16} /></button>
                                <button onClick={() => handleDeleteRequest(post.id, 'post')} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>

               {(editingPostId || isAddingPost) && (
                 <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-fit sticky top-0 z-20 overflow-y-auto max-h-[90vh]">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white rounded-t-xl sticky top-0 z-10">
                      <h3 className="font-bold text-slate-900">{isAddingPost ? 'New Article' : 'Edit Article'}</h3>
                      <button onClick={() => {setEditingPostId(null); setIsAddingPost(false);}} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Article Title</label><input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" value={postForm.title || ''} onChange={e => setPostForm({...postForm, title: e.target.value})} /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category</label><input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" value={postForm.category || ''} onChange={e => setPostForm({...postForm, category: e.target.value})} /></div>
                        <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Image URL</label><input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" value={postForm.image || ''} onChange={e => setPostForm({...postForm, image: e.target.value})} /></div>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-200 mt-4">
                        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1"><Globe size={14} className="text-green-600"/> SEO Settings</h4>
                        <div className="space-y-3">
                          <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">SEO Title</label><input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" placeholder={postForm.title || ''} value={postForm.seoTitle || ''} onChange={e => setPostForm({...postForm, seoTitle: e.target.value})} /></div>
                          <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Meta Description</label><textarea rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm" placeholder="Short summary..." value={postForm.seoDescription || ''} onChange={e => setPostForm({...postForm, seoDescription: e.target.value})} /></div>
                        </div>
                      </div>

                      <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Excerpt (Short Summary)</label><textarea rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" value={postForm.excerpt || ''} onChange={e => setPostForm({...postForm, excerpt: e.target.value})} /></div>
                      <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Content</label><textarea rows={10} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" value={postForm.content || ''} onChange={e => setPostForm({...postForm, content: e.target.value})} /></div>
                      
                      <button onClick={handleSavePost} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"><Save size={18} /> Publish Article</button>
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
                   <div className="flex items-center gap-4">
                      <h2 className="font-bold text-slate-900">Reviews</h2>
                      <div className="flex bg-slate-100 rounded-lg p-1">
                          {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                             <button 
                                key={f}
                                onClick={() => setReviewFilter(f)}
                                className={`px-3 py-1 text-xs font-bold uppercase rounded-md transition-all ${reviewFilter === f ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                             >
                                {f}
                             </button>
                          ))}
                      </div>
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {filteredReviews.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">No reviews found matching this filter.</div>
                    ) : (
                        <div className="space-y-4">
                            {filteredReviews.map((review) => (
                                <div key={review.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4">
                                    <div className="w-16 h-16 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                                        {review.productImage ? <img src={review.productImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={16}/></div>}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-900">{review.productName}</h4>
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${review.status === 'pending' ? 'bg-amber-100 text-amber-700' : review.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {review.status || 'approved'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex text-amber-400">
                                                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />)}
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium">by {review.customerName}</span>
                                            <span className="text-xs text-slate-400">• {new Date(review.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100 italic">"{review.comment}"</p>
                                    </div>
                                    <div className="flex md:flex-col justify-end gap-2">
                                        {review.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleReviewStatus(review.productId, review.id, 'approved')} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-bold flex items-center gap-1"><Check size={14}/> Approve</button>
                                                <button onClick={() => handleReviewStatus(review.productId, review.id, 'rejected')} className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1"><X size={14}/> Reject</button>
                                            </>
                                        )}
                                        {review.status === 'rejected' && (
                                            <button onClick={() => handleReviewStatus(review.productId, review.id, 'approved')} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-bold flex items-center gap-1"><Check size={14}/> Approve</button>
                                        )}
                                        <button onClick={() => handleReviewDeleteRequest(review.productId, review.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold flex items-center gap-1"><Trash2 size={14}/> Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
             </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
             <div className="flex h-full gap-6">
                {/* Settings Sidebar */}
                <div className="w-48 shrink-0 flex flex-col gap-1 border-r border-slate-200 pr-4">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Configuration</h3>
                   <button onClick={() => setSettingsSubTab('general')} className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${settingsSubTab === 'general' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>General</button>
                   <button onClick={() => setSettingsSubTab('design')} className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${settingsSubTab === 'design' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>Design & Branding</button>
                   <button onClick={() => setSettingsSubTab('payment')} className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${settingsSubTab === 'payment' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>Payment Gateways</button>
                   <button onClick={() => setSettingsSubTab('checkout')} className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${settingsSubTab === 'checkout' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>Checkout Settings</button>
                   <button onClick={() => setSettingsSubTab('footer')} className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${settingsSubTab === 'footer' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>Footer Content</button>
                   <button onClick={() => setSettingsSubTab('seo')} className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${settingsSubTab === 'seo' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>SEO & Analytics</button>
                   <button onClick={() => setSettingsSubTab('social')} className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${settingsSubTab === 'social' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>Social Media</button>
                   <button onClick={() => setSettingsSubTab('security')} className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${settingsSubTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>Security</button>
                </div>

                {/* Settings Content */}
                <div className="flex-1 overflow-y-auto pr-2">
                   {settingsSubTab === 'general' && (
                      <div className="space-y-6 max-w-2xl">
                         <div><label className="block text-sm font-bold text-slate-700 mb-1">Store Name</label><input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" value={tempSettings.storeName} onChange={e => setTempSettings({...tempSettings, storeName: e.target.value})} /></div>
                         <div><label className="block text-sm font-bold text-slate-700 mb-1">Store Logo URL</label><input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" value={tempSettings.logoUrl || ''} onChange={e => setTempSettings({...tempSettings, logoUrl: e.target.value})} /></div>
                         <div><label className="block text-sm font-bold text-slate-700 mb-1">Support Email</label><input type="email" className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" value={tempSettings.supportEmail} onChange={e => setTempSettings({...tempSettings, supportEmail: e.target.value})} /></div>
                         <div><label className="block text-sm font-bold text-slate-700 mb-1">Contact Phone</label><input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" value={tempSettings.contactPhone} onChange={e => setTempSettings({...tempSettings, contactPhone: e.target.value})} /></div>
                         <div><label className="block text-sm font-bold text-slate-700 mb-1">Address</label><input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" value={tempSettings.contactAddress} onChange={e => setTempSettings({...tempSettings, contactAddress: e.target.value})} /></div>
                      </div>
                   )}

                   {settingsSubTab === 'design' && (
                      <div className="space-y-6 max-w-2xl">
                         <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                             <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Palette size={18}/> Theme Colors & Fonts</h4>
                             <div className="grid grid-cols-2 gap-4">
                                 <div><label className="block text-sm font-bold text-slate-700 mb-1">Primary Color</label><div className="flex gap-2"><input type="color" className="h-10 w-10 rounded cursor-pointer border-0" value={tempSettings.design.primaryColor} onChange={e => setTempSettings({...tempSettings, design: {...tempSettings.design, primaryColor: e.target.value}})} /><input type="text" className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-white" value={tempSettings.design.primaryColor} onChange={e => setTempSettings({...tempSettings, design: {...tempSettings.design, primaryColor: e.target.value}})} /></div></div>
                                 <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Font Family</label>
                                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" value={tempSettings.design.fontFamily} onChange={e => setTempSettings({...tempSettings, design: {...tempSettings.design, fontFamily: e.target.value}})}>
                                        <option value="Inter">Inter (Clean)</option>
                                        <option value="Roboto">Roboto (Standard)</option>
                                        <option value="Open Sans">Open Sans (Readable)</option>
                                        <option value="Lato">Lato (Modern)</option>
                                        <option value="Poppins">Poppins (Geometric)</option>
                                        <option value="Montserrat">Montserrat (Bold)</option>
                                    </select>
                                 </div>
                                 <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Border Radius</label>
                                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" value={tempSettings.design.borderRadius} onChange={e => setTempSettings({...tempSettings, design: {...tempSettings.design, borderRadius: e.target.value}})}>
                                        <option value="none">Square (0px)</option>
                                        <option value="sm">Small (4px)</option>
                                        <option value="md">Medium (8px)</option>
                                        <option value="lg">Large (12px)</option>
                                        <option value="xl">Extra Large (16px)</option>
                                        <option value="2xl">2x Large (24px)</option>
                                        <option value="3xl">3x Large (32px)</option>
                                    </select>
                                 </div>
                             </div>
                         </div>
                         
                         <div><label className="block text-sm font-bold text-slate-700 mb-1">Hero Headline</label><input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" value={tempSettings.design.heroHeadline} onChange={e => setTempSettings({...tempSettings, design: {...tempSettings.design, heroHeadline: e.target.value}})} /></div>
                         <div><label className="block text-sm font-bold text-slate-700 mb-1">Hero Subheadline</label><textarea rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" value={tempSettings.design.heroSubheadline} onChange={e => setTempSettings({...tempSettings, design: {...tempSettings.design, heroSubheadline: e.target.value}})} /></div>
                      </div>
                   )}

                   {settingsSubTab === 'payment' && (
                      <div className="space-y-6 max-w-2xl">
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Store Currency</label>
                            <div className="flex gap-4">
                                <select className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-white" value={tempSettings.payment.currencyCode} onChange={e => {const curr = CURRENCIES.find(c => c.code === e.target.value); if(curr) setTempSettings({...tempSettings, payment: {...tempSettings.payment, currencyCode: curr.code, currencySymbol: curr.symbol}});}}>
                                  {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol}) - {c.name}</option>)}
                               </select>
                            </div>
                         </div>
                         
                         <div className="p-4 bg-white border border-slate-200 rounded-xl">
                            <div className="flex items-center justify-between mb-4">
                               <h4 className="font-bold text-slate-900 flex items-center gap-2"><CreditCard size={18} className="text-indigo-600"/> Stripe Integration</h4>
                               <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" checked={tempSettings.payment.stripeEnabled} onChange={e => setTempSettings({...tempSettings, payment: {...tempSettings.payment, stripeEnabled: e.target.checked}})} />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                               </label>
                            </div>
                            {tempSettings.payment.stripeEnabled && (
                               <div className="space-y-3">
                                  <div><label className="text-xs font-bold text-slate-500 uppercase">Publishable Key</label><input type="text" className="w-full px-3 py-2 border border-slate-200 rounded bg-slate-50 text-sm font-mono" value={tempSettings.payment.stripePublishableKey} onChange={e => setTempSettings({...tempSettings, payment: {...tempSettings.payment, stripePublishableKey: e.target.value}})} placeholder="pk_test_..." /></div>
                                  <div><label className="text-xs font-bold text-slate-500 uppercase">Secret Key</label><input type="password" className="w-full px-3 py-2 border border-slate-200 rounded bg-slate-50 text-sm font-mono" value={tempSettings.payment.stripeSecretKey} onChange={e => setTempSettings({...tempSettings, payment: {...tempSettings.payment, stripeSecretKey: e.target.value}})} placeholder="sk_test_..." /></div>
                               </div>
                            )}
                         </div>

                         <div className="p-4 bg-white border border-slate-200 rounded-xl">
                            <div className="flex items-center justify-between mb-4">
                               <h4 className="font-bold text-slate-900 flex items-center gap-2"><CreditCard size={18} className="text-blue-600"/> PayPal Integration</h4>
                               <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" checked={tempSettings.payment.paypalEnabled} onChange={e => setTempSettings({...tempSettings, payment: {...tempSettings.payment, paypalEnabled: e.target.checked}})} />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                               </label>
                            </div>
                            {tempSettings.payment.paypalEnabled && (
                               <div className="space-y-3">
                                  <div><label className="text-xs font-bold text-slate-500 uppercase">Client ID</label><input type="text" className="w-full px-3 py-2 border border-slate-200 rounded bg-slate-50 text-sm font-mono" value={tempSettings.payment.paypalClientId} onChange={e => setTempSettings({...tempSettings, payment: {...tempSettings.payment, paypalClientId: e.target.value}})} /></div>
                                  <div><label className="text-xs font-bold text-slate-500 uppercase">Secret</label><input type="password" className="w-full px-3 py-2 border border-slate-200 rounded bg-slate-50 text-sm font-mono" value={tempSettings.payment.paypalSecret} onChange={e => setTempSettings({...tempSettings, payment: {...tempSettings.payment, paypalSecret: e.target.value}})} /></div>
                               </div>
                            )}
                         </div>
                      </div>
                   )}

                   {settingsSubTab === 'checkout' && (
                      <div className="space-y-4 max-w-2xl bg-white p-6 rounded-xl border border-slate-200">
                         <h4 className="font-bold text-slate-900 mb-4">Checkout Rules</h4>
                         <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                            <span className="font-medium text-slate-700">Enable Guest Checkout</span>
                            <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" checked={tempSettings.checkout.guestCheckout} onChange={e => setTempSettings({...tempSettings, checkout: {...tempSettings.checkout, guestCheckout: e.target.checked}})} />
                         </label>
                         <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                            <span className="font-medium text-slate-700">Require Phone Number</span>
                            <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" checked={tempSettings.checkout.requirePhone} onChange={e => setTempSettings({...tempSettings, checkout: {...tempSettings.checkout, requirePhone: e.target.checked}})} />
                         </label>
                         <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                            <span className="font-medium text-slate-700">Enable Coupons</span>
                            <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" checked={tempSettings.checkout.enableCoupons} onChange={e => setTempSettings({...tempSettings, checkout: {...tempSettings.checkout, enableCoupons: e.target.checked}})} />
                         </label>
                      </div>
                   )}

                   {settingsSubTab === 'footer' && (
                      <div className="space-y-6 max-w-2xl">
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Footer Description</label>
                            <textarea rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" value={tempSettings.footerDescription} onChange={e => setTempSettings({...tempSettings, footerDescription: e.target.value})} />
                            <p className="text-xs text-slate-500 mt-1">Appears below the logo in the footer.</p>
                         </div>
                         
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Popular Categories Links</label>
                            <textarea 
                              rows={6} 
                              className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white font-mono text-sm" 
                              value={tempSettings.popularCategories?.join('\n')} 
                              onChange={e => setTempSettings({...tempSettings, popularCategories: e.target.value.split('\n').filter(line => line.trim() !== '')})} 
                              placeholder="One category per line"
                            />
                            <p className="text-xs text-slate-500 mt-1">Enter one category per line. These will appear in the "Popular Categories" column.</p>
                         </div>
                      </div>
                   )}

                   {settingsSubTab === 'seo' && (
                      <div className="space-y-6 max-w-2xl">
                         <div><label className="block text-sm font-bold text-slate-700 mb-1">Homepage SEO Title</label><input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" value={tempSettings.seo.title} onChange={e => setTempSettings({...tempSettings, seo: {...tempSettings.seo, title: e.target.value}})} /></div>
                         <div><label className="block text-sm font-bold text-slate-700 mb-1">Homepage Meta Description</label><textarea rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" value={tempSettings.seo.description} onChange={e => setTempSettings({...tempSettings, seo: {...tempSettings.seo, description: e.target.value}})} /></div>
                         
                         <div className="pt-6 border-t border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-4">Webmaster Verification</h4>
                            <div className="space-y-4">
                               <div><label className="block text-sm font-bold text-slate-700 mb-1">Google Search Console ID</label><input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg font-mono text-sm bg-slate-50" placeholder="content value from google-site-verification tag" value={tempSettings.seo.googleSearchConsoleCode} onChange={e => setTempSettings({...tempSettings, seo: {...tempSettings.seo, googleSearchConsoleCode: e.target.value}})} /></div>
                               <div><label className="block text-sm font-bold text-slate-700 mb-1">Bing Webmaster ID</label><input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg font-mono text-sm bg-slate-50" placeholder="content value from msvalidate.01 tag" value={tempSettings.seo.bingWebmasterCode} onChange={e => setTempSettings({...tempSettings, seo: {...tempSettings.seo, bingWebmasterCode: e.target.value}})} /></div>
                            </div>
                         </div>
                         
                         <div className="pt-6 border-t border-slate-100">
                             <h4 className="font-bold text-slate-900 mb-4">Analytics</h4>
                             <div><label className="block text-sm font-bold text-slate-700 mb-1">Google Analytics ID (G-XXXXXXX)</label><input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg font-mono text-sm bg-slate-50" value={tempSettings.seo.googleAnalyticsId} onChange={e => setTempSettings({...tempSettings, seo: {...tempSettings.seo, googleAnalyticsId: e.target.value}})} /></div>
                         </div>
                         <button onClick={handleDownloadSitemap} className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"><Download size={18} /> Generate & Download Sitemap.xml</button>
                      </div>
                   )}

                   {settingsSubTab === 'social' && (
                      <div className="space-y-4 max-w-2xl">
                         <div><label className="block text-sm font-bold text-slate-700 mb-1">Facebook URL</label><input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" value={tempSettings.socials.facebook} onChange={e => setTempSettings({...tempSettings, socials: {...tempSettings.socials, facebook: e.target.value}})} /></div>
                         <div><label className="block text-sm font-bold text-slate-700 mb-1">Twitter (X) URL</label><input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" value={tempSettings.socials.twitter} onChange={e => setTempSettings({...tempSettings, socials: {...tempSettings.socials, twitter: e.target.value}})} /></div>
                         <div><label className="block text-sm font-bold text-slate-700 mb-1">Instagram URL</label><input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" value={tempSettings.socials.instagram} onChange={e => setTempSettings({...tempSettings, socials: {...tempSettings.socials, instagram: e.target.value}})} /></div>
                         <div><label className="block text-sm font-bold text-slate-700 mb-1">LinkedIn URL</label><input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" value={tempSettings.socials.linkedin} onChange={e => setTempSettings({...tempSettings, socials: {...tempSettings.socials, linkedin: e.target.value}})} /></div>
                      </div>
                   )}

                   {settingsSubTab === 'security' && (
                      <div className="space-y-4 max-w-2xl bg-red-50 p-6 rounded-xl border border-red-100">
                         <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2"><Lock size={18}/> Admin Security</h4>
                         <div><label className="block text-sm font-bold text-red-800 mb-1">Admin Password</label><input type="text" className="w-full px-4 py-2 border border-red-200 rounded-lg bg-white" value={tempSettings.adminPassword} onChange={e => setTempSettings({...tempSettings, adminPassword: e.target.value})} /></div>
                         <p className="text-xs text-red-600 mt-2">Make sure to use a strong password. Default is 'admin'.</p>
                      </div>
                   )}

                   <div className="sticky bottom-0 bg-white p-4 border-t border-slate-200 mt-6 -mx-6 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                      <button onClick={handleSaveSettings} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 ml-auto"><Save size={18} /> Save Settings</button>
                   </div>
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};
