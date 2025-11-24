
import React, { useState } from 'react';
import { Product, StoreSettings, Order, Page } from '../types';
import { CURRENCIES } from '../constants';
import { 
  Plus, Edit, Trash2, X, Save, Search, Image as ImageIcon, 
  ArrowLeft, Lock, LogIn, LayoutGrid, Package, ShoppingCart, 
  Settings, TrendingUp, DollarSign, Users, ExternalLink, Globe, Share2,
  CheckCircle, AlertCircle, AlertTriangle, Sparkles, MapPin, FileText,
  BarChart, Download, Palette, LayoutTemplate
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
}

type Tab = 'overview' | 'products' | 'orders' | 'pages' | 'settings';

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

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, onAdd, onUpdate, onDelete, onClose, storeSettings, onUpdateSettings,
  pages, onAddPage, onUpdatePage, onDeletePage
}) => {
  // Login State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Dashboard State
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // Feedback State
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'product' | 'page'>('product');

  // Product State
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);

  // Page State
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [pageForm, setPageForm] = useState<Partial<Page>>({});
  const [isAddingPage, setIsAddingPage] = useState(false);

  // Settings State
  const [tempSettings, setTempSettings] = useState<StoreSettings>(storeSettings);
  // Flatten categories array to string for textarea
  const [categoriesText, setCategoriesText] = useState(storeSettings.popularCategories?.join('\n') || '');

  // Mock Orders Data
  const [orders] = useState<Order[]>([
    { id: '#ORD-7829', customer: 'Alex Johnson', email: 'alex@example.com', total: 65, status: 'completed', date: '2024-03-10', items: 3 },
    { id: '#ORD-7830', customer: 'Sarah Smith', email: 'sarah@design.co', total: 20, status: 'completed', date: '2024-03-11', items: 1 },
    { id: '#ORD-7831', customer: 'Mike Brown', email: 'mike@agency.net', total: 125, status: 'pending', date: '2024-03-12', items: 5 },
    { id: '#ORD-7832', customer: 'Emma Davis', email: 'emma@wp.org', total: 45, status: 'refunded', date: '2024-03-09', items: 2 },
    { id: '#ORD-7833', customer: 'Chris Wilson', email: 'chris@dev.io', total: 20, status: 'completed', date: '2024-03-12', items: 1 },
  ]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(products.map(p => p.category)));

  // --- Helpers ---
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownloadSitemap = () => {
    const baseUrl = tempSettings.siteUrl.replace(/\/$/, '');
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
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;

    // Pages
    pages.forEach(page => {
      xml += `
  <url>
    <loc>${baseUrl}/page/${page.slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

    // Products (Assuming URL structure /product/id for now, though App uses internal state)
    // For SEO purposes in a real app, you'd want clean URLs.
    products.forEach(product => {
      const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      xml += `
  <url>
    <loc>${baseUrl}/product/${slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Sitemap generated and downloaded');
  };

  // --- Auth Handler ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
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
      // Auto-generate image if empty
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

  // --- Delete Handler (Shared) ---
  const handleDeleteRequest = (id: string, type: 'product' | 'page') => {
    setDeleteConfirmId(id);
    setDeleteType(type);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      if (deleteType === 'product') {
        onDelete(deleteConfirmId);
        if (editingId === deleteConfirmId) {
            setEditingId(null);
            setIsAdding(false);
        }
      } else {
        onDeletePage(deleteConfirmId);
        if (editingPageId === deleteConfirmId) {
           setEditingPageId(null);
           setIsAddingPage(false);
        }
      }
      showToast(`${deleteType === 'product' ? 'Product' : 'Page'} deleted`);
      setDeleteConfirmId(null);
    }
  };

  // --- Settings Handlers ---
  const handleSaveSettings = () => {
    // Process categories text to array
    const catsArray = categoriesText.split('\n').filter(line => line.trim() !== '');
    
    const finalSettings = {
      ...tempSettings,
      popularCategories: catsArray
    };

    onUpdateSettings(finalSettings);
    showToast('Store settings saved successfully');
  };

  // --- Login Screen ---
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-slate-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-sm w-full rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 text-center border-b border-slate-100 bg-slate-50">
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
                placeholder="Enter password (admin)"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    loginError 
                    ? 'border-red-300 focus:ring-red-200 bg-red-50 text-red-900 placeholder-red-400' 
                    : 'border-slate-200 focus:ring-indigo-500 focus:bg-white bg-slate-50'
                }`}
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError(false);
                }}
                autoFocus
              />
              {loginError && <p className="text-red-500 text-xs mt-2 pl-1">Incorrect password. Try 'admin'.</p>}
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
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans relative">
      
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
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete {deleteType === 'product' ? 'Product' : 'Page'}?</h3>
              <p className="text-slate-500 text-sm mb-6">Are you sure you want to delete this? This action cannot be undone.</p>
              <div className="flex gap-3">
                 <button 
                   onClick={() => setDeleteConfirmId(null)}
                   className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleConfirmDelete}
                   className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                 >
                   Delete
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Sidebar - BLUE THEME */}
      <aside className="w-64 bg-indigo-900 border-r border-indigo-800 flex flex-col shrink-0 transition-all duration-300 hidden md:flex text-white">
        <div className="p-6 border-b border-indigo-800 flex items-center gap-2">
           <div className="bg-white p-1.5 rounded-lg text-indigo-900">
             <LayoutGrid size={20} />
           </div>
           <span className="font-bold text-lg tracking-tight text-white">AdminPanel</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem icon={<TrendingUp size={18} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={<Package size={18} />} label="Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
          <SidebarItem icon={<ShoppingCart size={18} />} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
          <SidebarItem icon={<FileText size={18} />} label="Pages" active={activeTab === 'pages'} onClick={() => setActiveTab('pages')} />
          <SidebarItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-4 border-t border-indigo-800">
           <div className="flex items-center gap-3 px-3 py-2">
             <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center font-bold text-xs text-white border border-indigo-600">A</div>
             <div className="overflow-hidden">
               <p className="text-sm font-medium truncate text-white">Administrator</p>
               <p className="text-xs text-indigo-300 truncate">admin@digimarket.pro</p>
             </div>
           </div>
           <button onClick={onClose} className="mt-4 w-full flex items-center justify-center gap-2 text-indigo-300 hover:text-white text-sm py-2 hover:bg-indigo-800 rounded-lg transition-colors">
              <ExternalLink size={14} /> Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header / Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
           <div className="flex items-center gap-4">
             <button className="md:hidden text-slate-500" onClick={onClose}><ArrowLeft size={20}/></button>
             <h1 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h1>
           </div>
           <div className="md:hidden flex items-center gap-2">
              <button onClick={() => setActiveTab('overview')} className={`p-2 rounded ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-600' : ''}`}><TrendingUp size={20}/></button>
              <button onClick={() => setActiveTab('products')} className={`p-2 rounded ${activeTab === 'products' ? 'bg-indigo-50 text-indigo-600' : ''}`}><Package size={20}/></button>
              <button onClick={() => setActiveTab('pages')} className={`p-2 rounded ${activeTab === 'pages' ? 'bg-indigo-50 text-indigo-600' : ''}`}><FileText size={20}/></button>
              <button onClick={() => setActiveTab('settings')} className={`p-2 rounded ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600' : ''}`}><Settings size={20}/></button>
           </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value="$12,450" icon={<DollarSign className="text-green-500" />} change="+12%" />
                <StatCard title="Total Products" value={products.length.toString()} icon={<Package className="text-blue-500" />} change="+4" />
                <StatCard title="Total Pages" value={pages.length.toString()} icon={<FileText className="text-amber-500" />} change="+1" />
                <StatCard title="Total Customers" value="1,203" icon={<Users className="text-purple-500" />} change="+18%" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-4">Recent Sales</h3>
                  <div className="space-y-4">
                     {orders.slice(0,3).map(order => (
                       <div key={order.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                               {order.customer.charAt(0)}
                             </div>
                             <div>
                               <p className="text-sm font-semibold text-slate-900">{order.customer}</p>
                               <p className="text-xs text-slate-500">{order.date}</p>
                             </div>
                          </div>
                          <span className="font-bold text-slate-900">${order.total}</span>
                       </div>
                     ))}
                  </div>
                </div>
                
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-4">Inventory Summary</h3>
                  <div className="space-y-3">
                    {categories.slice(0,5).map(cat => {
                      const count = products.filter(p => p.category === cat).length;
                      const percentage = Math.round((count / products.length) * 100);
                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">{cat}</span>
                            <span className="font-medium text-slate-900">{count} items</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="flex flex-col lg:flex-row gap-6 h-full">
               <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full min-h-[500px]">
                  <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50">
                     <div className="relative flex-1">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input 
                         type="text" 
                         placeholder="Search products..." 
                         className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                       />
                     </div>
                     <button 
                        onClick={handleAddClick}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap"
                      >
                        <Plus size={18} /> Add New
                      </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 sticky top-0 z-10">
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
                                <div className="w-10 h-10 rounded bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                   {product.image ? (
                                     <img src={product.image} alt="" className="w-full h-full object-cover" />
                                   ) : (
                                     <ImageIcon className="w-full h-full p-2 text-slate-300" />
                                   )}
                                </div>
                                <span className="font-medium text-slate-900 line-clamp-1">{product.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">
                              <span className="px-2 py-1 bg-slate-100 rounded text-xs">{product.category}</span>
                            </td>
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

               {/* Edit Sidebar */}
               {(editingId || isAdding) && (
                 <div className="w-full lg:w-96 bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-fit sticky top-0 z-20 overflow-y-auto max-h-[90vh]">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl sticky top-0 z-10">
                      <h3 className="font-bold text-slate-900">{isAdding ? 'Add Product' : 'Edit Product'}</h3>
                      <button onClick={() => {setEditingId(null); setIsAdding(false);}} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      {/* Form Fields */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Name</label>
                        <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Price</label>
                          <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg" value={editForm.price || 0} onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})} />
                        </div>
                         <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category</label>
                          <select className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            <option value="New Category">Other...</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Image URL</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg" 
                            placeholder="Leave empty to auto-generate"
                            value={editForm.image || ''} 
                            onChange={e => setEditForm({...editForm, image: e.target.value})} 
                          />
                          <button 
                            type="button"
                            onClick={() => {
                                const img = generatePlaceholder(editForm.name || 'Product', editForm.category || 'Plugins & Tools');
                                setEditForm({...editForm, image: img});
                            }}
                            className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 text-sm font-medium transition-colors"
                            title="Generate Placeholder Image"
                          >
                            <Sparkles size={18} />
                          </button>
                        </div>
                      </div>
                      
                      {/* SEO Fields */}
                      <div className="pt-4 border-t border-slate-100 mt-4">
                        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1"><Globe size={14} className="text-green-600"/> SEO Settings</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">SEO Title (Optional)</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                placeholder="Custom Title Tag"
                                value={editForm.seoTitle || ''}
                                onChange={e => setEditForm({...editForm, seoTitle: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Meta Description (Optional)</label>
                            <textarea
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                rows={2}
                                placeholder="Custom Meta Description"
                                value={editForm.seoDescription || ''}
                                onChange={e => setEditForm({...editForm, seoDescription: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
                        <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg" rows={6} value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} />
                      </div>
                      <button onClick={handleSaveProduct} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"><Save size={18} /> Save</button>
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* PAGES TAB */}
          {activeTab === 'pages' && (
            <div className="flex flex-col lg:flex-row gap-6 h-full">
              <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full min-h-[500px]">
                 <div className="p-4 border-b border-slate-100 flex justify-between bg-slate-50">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2"><FileText size={18} /> All Pages</h2>
                    <button 
                       onClick={handleAddPageClick}
                       className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                     >
                       <Plus size={18} /> Create Page
                     </button>
                 </div>
                 <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                           <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Title</th>
                           <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Slug</th>
                           <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {pages.map(page => (
                           <tr key={page.id} className="hover:bg-slate-50">
                              <td className="p-4 font-medium text-slate-900">{page.title}</td>
                              <td className="p-4 text-sm text-slate-500">/{page.slug}</td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => handleEditPageClick(page)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"><Edit size={16} /></button>
                                  <button onClick={() => handleDeleteRequest(page.id, 'page')} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                                </div>
                              </td>
                           </tr>
                         ))}
                         {pages.length === 0 && (
                           <tr><td colSpan={3} className="p-8 text-center text-slate-400">No pages found. Create one to get started.</td></tr>
                         )}
                      </tbody>
                    </table>
                 </div>
              </div>

              {/* Page Editor */}
              {(editingPageId || isAddingPage) && (
                 <div className="w-full lg:w-[32rem] bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-fit sticky top-0 z-20">
                     <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                       <h3 className="font-bold text-slate-900">{isAddingPage ? 'Create Page' : 'Edit Page'}</h3>
                       <button onClick={() => {setEditingPageId(null); setIsAddingPage(false);}} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                     </div>
                     <div className="p-6 space-y-4">
                       <div>
                         <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Page Title</label>
                         <input 
                           type="text" 
                           className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                           value={pageForm.title || ''} 
                           onChange={e => setPageForm({...pageForm, title: e.target.value})} 
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Slug (URL)</label>
                         <input 
                           type="text" 
                           placeholder="auto-generated"
                           className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                           value={pageForm.slug || ''} 
                           onChange={e => setPageForm({...pageForm, slug: e.target.value})} 
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Content</label>
                         <textarea 
                           className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm" 
                           rows={15} 
                           value={pageForm.content || ''} 
                           onChange={e => setPageForm({...pageForm, content: e.target.value})} 
                         />
                         <p className="text-xs text-slate-400 mt-1">Basic text format. Use double line breaks for paragraphs.</p>
                       </div>
                       <button onClick={handleSavePage} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"><Save size={18} /> Save Page</button>
                     </div>
                 </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-slate-50">
                 <h2 className="font-bold text-slate-800">Recent Orders</h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Order ID</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {orders.map(order => (
                         <tr key={order.id} className="hover:bg-slate-50">
                           <td className="p-4 font-mono text-xs text-indigo-600 font-bold">{order.id}</td>
                           <td className="p-4">
                             <div className="font-medium text-slate-900">{order.customer}</div>
                             <div className="text-xs text-slate-500">{order.email}</div>
                           </td>
                           <td className="p-4 text-sm text-slate-600">{order.date}</td>
                           <td className="p-4">
                             <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                               order.status === 'completed' ? 'bg-green-100 text-green-700' :
                               order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                               'bg-red-100 text-red-700'
                             }`}>
                               {order.status}
                             </span>
                           </td>
                           <td className="p-4 text-right font-bold text-slate-900">${order.total}.00</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* General Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Settings size={20} className="text-indigo-600"/> General Settings</h2>
                 
                 <div className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Store Name</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          value={tempSettings.storeName}
                          onChange={e => setTempSettings({...tempSettings, storeName: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Support Email</label>
                        <input 
                          type="email" 
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          value={tempSettings.supportEmail}
                          onChange={e => setTempSettings({...tempSettings, supportEmail: e.target.value})}
                        />
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Default Currency</label>
                          <select 
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                            value={tempSettings.currencyCode}
                            onChange={(e) => {
                               const selected = CURRENCIES.find(c => c.code === e.target.value);
                               if(selected) {
                                  setTempSettings({...tempSettings, currencyCode: selected.code, currencySymbol: selected.symbol});
                               }
                            }}
                          >
                            {CURRENCIES.map(c => (
                               <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.symbol})</option>
                            ))}
                          </select>
                       </div>
                   </div>

                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Logo URL</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="https://example.com/logo.png"
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          value={tempSettings.logoUrl || ''}
                          onChange={e => setTempSettings({...tempSettings, logoUrl: e.target.value})}
                        />
                        {tempSettings.logoUrl && (
                          <div className="w-10 h-10 border border-slate-200 rounded p-1 flex items-center justify-center bg-slate-50">
                            <img src={tempSettings.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                          </div>
                        )}
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Website URL (For Sitemap)</label>
                      <input 
                        type="text" 
                        placeholder="https://digimarket.pro"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={tempSettings.siteUrl || ''}
                        onChange={e => setTempSettings({...tempSettings, siteUrl: e.target.value})}
                      />
                   </div>
                   
                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Favicon URL</label>
                      <input 
                        type="text" 
                        placeholder="https://example.com/favicon.ico"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={tempSettings.faviconUrl || ''}
                        onChange={e => setTempSettings({...tempSettings, faviconUrl: e.target.value})}
                      />
                   </div>
                 </div>
              </div>
              
              {/* Design & Home Page Settings (New) */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Palette size={20} className="text-pink-600"/> Design & Home Page</h2>
                 
                 <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Primary Brand Color</label>
                          <div className="flex items-center gap-3">
                             <input 
                               type="color" 
                               className="h-10 w-20 rounded cursor-pointer"
                               value={tempSettings.primaryColor || '#4f46e5'}
                               onChange={e => setTempSettings({...tempSettings, primaryColor: e.target.value})}
                             />
                             <span className="text-sm font-mono text-slate-500">{tempSettings.primaryColor || '#4f46e5'}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">Sets the main color for the Hero section, buttons, and accents.</p>
                       </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Hero Section Headline</label>
                        <input 
                          type="text" 
                          placeholder="Premium WordPress Tools Without The Premium Price"
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          value={tempSettings.heroHeadline || ''}
                          onChange={e => setTempSettings({...tempSettings, heroHeadline: e.target.value})}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Hero Section Subheadline</label>
                        <textarea
                          rows={2}
                          placeholder="Get instant access to 100% original, verified license keys..."
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          value={tempSettings.heroSubheadline || ''}
                          onChange={e => setTempSettings({...tempSettings, heroSubheadline: e.target.value})}
                        />
                    </div>
                 </div>
              </div>

               {/* SEO & Analytics Settings */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Globe size={20} className="text-green-600"/> SEO & Analytics Configuration</h2>
                 
                 <div className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">SEO Meta Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. DigiMarket - Premium WordPress Plugins"
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          value={tempSettings.seoTitle || ''}
                          onChange={e => setTempSettings({...tempSettings, seoTitle: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Google Analytics ID</label>
                        <input 
                          type="text" 
                          placeholder="G-XXXXXXXXXX"
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm"
                          value={tempSettings.googleAnalyticsId || ''}
                          onChange={e => setTempSettings({...tempSettings, googleAnalyticsId: e.target.value})}
                        />
                     </div>
                   </div>
                   
                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">SEO Meta Description</label>
                      <textarea
                        rows={3}
                        placeholder="e.g. The best marketplace for digital products..."
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={tempSettings.seoDescription || ''}
                        onChange={e => setTempSettings({...tempSettings, seoDescription: e.target.value})}
                      />
                   </div>
                   
                   {/* Specific Page SEO */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Shop Page Title</label>
                        <input 
                          type="text" 
                          placeholder="Shop Premium Plugins"
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          value={tempSettings.shopSeoTitle || ''}
                          onChange={e => setTempSettings({...tempSettings, shopSeoTitle: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Page Title</label>
                        <input 
                          type="text" 
                          placeholder="Contact Support"
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          value={tempSettings.contactSeoTitle || ''}
                          onChange={e => setTempSettings({...tempSettings, contactSeoTitle: e.target.value})}
                        />
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Google Search Console (Meta Content)</label>
                        <input 
                          type="text" 
                          placeholder="verification-code-string"
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm"
                          value={tempSettings.googleSearchConsoleCode || ''}
                          onChange={e => setTempSettings({...tempSettings, googleSearchConsoleCode: e.target.value})}
                        />
                        <p className="text-xs text-slate-400 mt-1">Enter just the 'content' part of the meta tag.</p>
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Bing Webmaster (Meta Content)</label>
                        <input 
                          type="text" 
                          placeholder="verification-code-string"
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm"
                          value={tempSettings.bingWebmasterCode || ''}
                          onChange={e => setTempSettings({...tempSettings, bingWebmasterCode: e.target.value})}
                        />
                        <p className="text-xs text-slate-400 mt-1">Enter just the 'content' part of the meta tag.</p>
                     </div>
                   </div>

                   <div className="pt-4 border-t border-slate-100">
                      <button 
                        onClick={handleDownloadSitemap}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                         <Download size={18} /> Generate & Download Sitemap.xml
                      </button>
                      <p className="text-xs text-slate-400 mt-1">Generates a sitemap based on your current products and pages for you to upload to your host.</p>
                   </div>
                 </div>
              </div>

               {/* Contact & Footer Settings */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><MapPin size={20} className="text-amber-600"/> Contact & Footer Information</h2>
                 
                 <div className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Physical Address</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          value={tempSettings.contactAddress || ''}
                          onChange={e => setTempSettings({...tempSettings, contactAddress: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          value={tempSettings.contactPhone || ''}
                          onChange={e => setTempSettings({...tempSettings, contactPhone: e.target.value})}
                        />
                      </div>
                   </div>
                   
                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Footer About Text</label>
                      <textarea
                        rows={2}
                        placeholder="Description appearing in the footer..."
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={tempSettings.footerDescription || ''}
                        onChange={e => setTempSettings({...tempSettings, footerDescription: e.target.value})}
                      />
                   </div>

                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Popular Categories List (One per line)</label>
                      <textarea
                        rows={4}
                        placeholder="WordPress Plugins..."
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={categoriesText}
                        onChange={e => setCategoriesText(e.target.value)}
                      />
                   </div>
                 </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Share2 size={20} className="text-blue-600"/> Social Media Links</h2>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Facebook URL</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={tempSettings.socials?.facebook || ''}
                        onChange={e => setTempSettings({...tempSettings, socials: {...tempSettings.socials, facebook: e.target.value}})}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Twitter URL</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={tempSettings.socials?.twitter || ''}
                        onChange={e => setTempSettings({...tempSettings, socials: {...tempSettings.socials, twitter: e.target.value}})}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Instagram URL</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={tempSettings.socials?.instagram || ''}
                        onChange={e => setTempSettings({...tempSettings, socials: {...tempSettings.socials, instagram: e.target.value}})}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">LinkedIn URL</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={tempSettings.socials?.linkedin || ''}
                        onChange={e => setTempSettings({...tempSettings, socials: {...tempSettings.socials, linkedin: e.target.value}})}
                      />
                   </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                   <button 
                     onClick={handleSaveSettings}
                     className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                   >
                     <Save size={18} /> Save Settings
                   </button>
                 </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- Subcomponents ---

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
      active ? 'bg-indigo-800 text-white shadow-lg' : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
    }`}
  >
    {icon}
    {label}
  </button>
);

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; change: string }> = ({ title, value, icon, change }) => {
  const isPositive = change.startsWith('+');
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
        <span className={`text-xs font-bold px-2 py-1 rounded ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {change}
        </span>
      </div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
};
