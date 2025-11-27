
import React, { useState } from 'react';
import { 
  X, Plus, Trash2, Edit, Save, Search, Image as ImageIcon, 
  Settings, ShoppingBag, FileText, MessageSquare, Users, 
  BarChart2, Shield, Lock, AlertTriangle, CheckCircle,
  Layout, CreditCard, Globe, Share2, HelpCircle, LogOut, Package,
  Star, Filter, Check, Ban, ExternalLink, ChevronDown, Key,
  LayoutList, FolderTree, Eye, Printer, Palette, DollarSign, Terminal, Link, Upload, Sparkles, Download, TrendingUp, Clock, Bell, Tag, Percent, Mail, Database, ChevronRight, ToggleLeft, ToggleRight, Monitor, FileCheck, Cookie
} from 'lucide-react';
import { Product, StoreSettings, Page, BlogPost, Order, SupportTicket, Review, Customer, Coupon, LicenseType } from '../types';
import { CURRENCIES, LICENSE_DEFINITIONS } from '../constants';

interface AdminDashboardProps {
  products: Product[];
  onAdd: (product: Product) => void;
  onUpdate: (product: Product) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  storeSettings: StoreSettings;
  onUpdateSettings: (settings: StoreSettings) => void;
  pages: Page[];
  onAddPage: (page: Page) => void;
  onUpdatePage: (page: Page) => void;
  onDeletePage: (id: string) => void;
  blogPosts: BlogPost[];
  onAddPost: (post: BlogPost) => void;
  onUpdatePost: (post: BlogPost) => void;
  onDeletePost: (id: string) => void;
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
  tickets: SupportTicket[];
  onUpdateTicket: (ticket: SupportTicket) => void;
  users?: Customer[];
  onDeleteUser?: (id: string) => void;
  onReplyTicket?: (id: string, message: string, sender: 'admin' | 'customer') => void;
  coupons?: Coupon[];
  onAddCoupon?: (coupon: Coupon) => void;
  onDeleteCoupon?: (id: string) => void;
}

// Sidebar Item Component
const SidebarItem = ({ 
  active, 
  onClick, 
  icon: Icon, 
  label, 
  badgeCount 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: any; 
  label: string; 
  badgeCount?: number;
}) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={20} className={active ? 'text-white' : 'text-slate-500'} />
      <span>{label}</span>
    </div>
    {badgeCount !== undefined && badgeCount > 0 && (
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
        {badgeCount}
      </span>
    )}
  </button>
);

// Simple CSS Bar Chart
const RevenueChart = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const heights = [45, 60, 35, 70, 55, 80, 65]; 
  
  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2 h-40 mt-4 px-2">
        {heights.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end group cursor-pointer">
             <div className="relative w-full bg-indigo-50 rounded-t-lg hover:bg-indigo-100 transition-colors" style={{height: '100%'}}>
                <div 
                  style={{ height: `${h}%` }} 
                  className="absolute bottom-0 w-full bg-indigo-600 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-500"
                ></div>
                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold py-1 px-2 rounded shadow-lg transition-opacity whitespace-nowrap z-10 pointer-events-none">
                   ${h * 15}
                </div>
             </div>
             <span className="text-xs text-slate-500 text-center mt-2 font-medium">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products = [], onAdd, onUpdate, onDelete, onClose,
  storeSettings, onUpdateSettings,
  pages = [], onAddPage, onUpdatePage, onDeletePage,
  blogPosts = [], onAddPost, onUpdatePost, onDeletePost,
  orders = [], onUpdateOrder,
  tickets = [], onUpdateTicket,
  users = [], onDeleteUser, onReplyTicket,
  coupons = [], onAddCoupon, onDeleteCoupon
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('overview');
  const [settingsSubTab, setSettingsSubTab] = useState('general');
  const [tempSettings, setTempSettings] = useState<StoreSettings>(storeSettings);
  const [ticketFilter, setTicketFilter] = useState<'all' | 'open' | 'closed'>('all');

  // Forms State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  // Initialize default license pricing for new products
  const defaultLicensePricing = LICENSE_DEFINITIONS.reduce((acc, def) => {
    acc[def.type] = { enabled: true, price: 0 };
    return acc;
  }, {} as any);
  
  const [productForm, setProductForm] = useState<Partial<Product>>({ licensePricing: defaultLicensePricing });
  
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [pageForm, setPageForm] = useState<Partial<Page>>({});

  const [isAddingPost, setIsAddingPost] = useState(false);
  const [postForm, setPostForm] = useState<Partial<BlogPost>>({});

  // Category Management
  const [isManagingCategory, setIsManagingCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ oldName: '', newName: '', icon: '' });

  // Coupon Management
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [couponForm, setCouponForm] = useState<Partial<Coupon>>({ discountType: 'percentage', status: 'active' });

  // Ticket Reply
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Order Detail
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Notification Dropdown
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const pendingOrdersCount = orders ? orders.filter(o => o.status === 'pending').length : 0;
  const allReviews = products ? products.flatMap(p => (p.reviews || []).map(r => ({ ...r, productName: p.name, productId: p.id }))) : [];
  const pendingReviewsCount = allReviews.filter(r => r.status === 'pending').length;

  const uniqueCategories = products ? Array.from(new Set([
    ...products.map(p => p.category),
    ...(storeSettings.popularCategories || [])
  ])).filter(Boolean).sort() : [];

  const totalRevenue = orders
    ? orders.filter(o => o.status !== 'cancelled' && o.status !== 'refunded').reduce((sum, o) => sum + o.total, 0)
    : 0;
  
  const activeTickets = tickets ? tickets.filter(t => t.status === 'open').length : 0;

  // Mock Activity Feed
  const activities = [
     { id: 1, type: 'order', text: `New order received from ${orders[0]?.customer || 'Guest'}`, time: '2 mins ago', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
     { id: 2, type: 'user', text: 'New customer registered', time: '1 hour ago', icon: Users, color: 'bg-green-100 text-green-600' },
     { id: 3, type: 'ticket', text: 'Support ticket #TIC-9281 opened', time: '3 hours ago', icon: MessageSquare, color: 'bg-amber-100 text-amber-600' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === (storeSettings.adminPassword || 'admin')) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };

  const handleSaveSettings = () => {
    onUpdateSettings(tempSettings);
    alert('Settings saved successfully!');
  };

  const generatePlaceholder = (name: string, category: string) => {
     const text = encodeURIComponent(name);
     const colors = ['2563eb', '059669', '7c3aed', 'db2777', 'd97706', 'dc2626', '0891b2', '475569'];
     const color = colors[Math.floor(Math.random() * colors.length)];
     return `https://placehold.co/600x400/${color}/ffffff?text=${text}`;
  };

  const handleSaveProduct = () => {
    if (productForm.name && productForm.licensePricing) {
      
      // Determine base display price (lowest enabled price)
      let displayPrice = 0;
      const enabledPrices = Object.values(productForm.licensePricing)
        .filter((lp: any) => lp.enabled)
        .map((lp: any) => lp.price);
      
      if (enabledPrices.length > 0) {
        displayPrice = Math.min(...enabledPrices);
      }

      const newProduct: Product = {
        id: productForm.id || `prod_${Date.now()}`,
        name: productForm.name,
        price: displayPrice,
        category: productForm.category || 'Uncategorized',
        description: productForm.description || '',
        image: productForm.image || generatePlaceholder(productForm.name, productForm.category || 'Plugins'),
        seoTitle: productForm.seoTitle,
        seoDescription: productForm.seoDescription,
        demoUrl: productForm.demoUrl,
        licensePricing: productForm.licensePricing as any
      };
      
      if (productForm.id) {
        onUpdate(newProduct);
      } else {
        onAdd(newProduct);
      }
      setIsAddingProduct(false);
      setProductForm({ licensePricing: defaultLicensePricing });
    }
  };

  const handleLicensePriceChange = (type: LicenseType, field: 'enabled' | 'price', value: any) => {
    setProductForm(prev => ({
      ...prev,
      licensePricing: {
        ...prev.licensePricing,
        [type]: {
          ...(prev.licensePricing?.[type] || { enabled: false, price: 0 }),
          [field]: value
        }
      }
    }));
  };

  // ... (Rest of handlers: handleSavePage, handleSavePost, etc. - mostly same as previous version)
  const handleSavePage = () => {
      if (pageForm.title && pageForm.content) {
          const newPage: Page = {
              id: pageForm.id || `page_${Date.now()}`,
              title: pageForm.title,
              slug: pageForm.slug || pageForm.title.toLowerCase().replace(/ /g, '-'),
              content: pageForm.content
          };
          if (pageForm.id) onUpdatePage(newPage);
          else onAddPage(newPage);
          setIsAddingPage(false);
          setPageForm({});
      }
  };

  const handleSavePost = () => {
      if (postForm.title && postForm.content) {
          const newPost: BlogPost = {
              id: postForm.id || `post_${Date.now()}`,
              title: postForm.title,
              slug: postForm.slug || postForm.title.toLowerCase().replace(/ /g, '-'),
              content: postForm.content,
              excerpt: postForm.excerpt || '',
              author: postForm.author || 'Admin',
              date: postForm.date || new Date().toISOString(),
              category: postForm.category || 'Uncategorized',
              image: postForm.image
          };
          if (postForm.id) onUpdatePost(newPost);
          else onAddPost(newPost);
          setIsAddingPost(false);
          setPostForm({});
      }
  };

  const handleSaveCoupon = () => {
     if (couponForm.code && couponForm.discountValue && onAddCoupon) {
        const newCoupon: Coupon = {
           id: `coup_${Date.now()}`,
           code: couponForm.code.toUpperCase(),
           discountType: couponForm.discountType || 'percentage',
           discountValue: Number(couponForm.discountValue),
           usageLimit: couponForm.usageLimit ? Number(couponForm.usageLimit) : undefined,
           expiryDate: couponForm.expiryDate,
           usedCount: 0,
           status: 'active'
        };
        onAddCoupon(newCoupon);
        setIsAddingCoupon(false);
        setCouponForm({ discountType: 'percentage', status: 'active' });
     }
  };

  const handleUpdateReviewStatus = (productId: string, reviewId: string, status: 'approved' | 'rejected') => {
    const product = products.find(p => p.id === productId);
    if (product && product.reviews) {
      const updatedReviews = product.reviews.map(r => r.id === reviewId ? { ...r, status } : r);
      onUpdate({ ...product, reviews: updatedReviews });
    }
  };

  const handleDeleteReview = (productId: string, reviewId: string) => {
    const product = products.find(p => p.id === productId);
    if (product && product.reviews) {
      const updatedReviews = product.reviews.filter(r => r.id !== reviewId);
      onUpdate({ ...product, reviews: updatedReviews });
    }
  };

  const handleRenameCategory = () => {
    if (!categoryForm.newName.trim()) return;
    const updatedIcons = { ...(storeSettings.categoryIcons || {}) };

    if (categoryForm.oldName) {
        products.forEach(p => {
            if (p.category === categoryForm.oldName) {
                onUpdate({ ...p, category: categoryForm.newName });
            }
        });
        const updatedPopular = (storeSettings.popularCategories || []).map(c => 
            c === categoryForm.oldName ? categoryForm.newName : c
        );
        if (categoryForm.icon) updatedIcons[categoryForm.newName] = categoryForm.icon;
        else if (updatedIcons[categoryForm.oldName]) updatedIcons[categoryForm.newName] = updatedIcons[categoryForm.oldName];
        
        if (categoryForm.oldName !== categoryForm.newName) delete updatedIcons[categoryForm.oldName];

        onUpdateSettings({ ...storeSettings, popularCategories: updatedPopular, categoryIcons: updatedIcons });
    } else {
        const updatedPopular = [...(storeSettings.popularCategories || []), categoryForm.newName];
        if (categoryForm.icon) updatedIcons[categoryForm.newName] = categoryForm.icon;
        onUpdateSettings({ ...storeSettings, popularCategories: Array.from(new Set(updatedPopular)), categoryIcons: updatedIcons });
    }
    setIsManagingCategory(false);
    setCategoryForm({ oldName: '', newName: '', icon: '' });
  };

  const handleDeleteCategory = (categoryName: string) => {
     if(confirm(`Delete "${categoryName}"? Products will be kept but category removed from lists.`)) {
         const updatedPopular = (storeSettings.popularCategories || []).filter(c => c !== categoryName);
         const updatedIcons = { ...(storeSettings.categoryIcons || {}) };
         delete updatedIcons[categoryName];
         onUpdateSettings({ ...storeSettings, popularCategories: updatedPopular, categoryIcons: updatedIcons });
     }
  };

  const handleSendReply = () => {
    if (!selectedTicket || !replyMessage.trim()) return;
    if (onReplyTicket) {
      onReplyTicket(selectedTicket.id, replyMessage, 'admin');
      setSelectedTicket(null);
      setReplyMessage('');
    }
  };

  const handleExportOrders = () => {
    const headers = ['Order ID', 'Customer', 'Email', 'Date', 'Status', 'Total', 'Items'];
    const csvContent = [
      headers.join(','),
      ...orders.map(order => [
        order.id,
        `"${order.customer}"`,
        order.email,
        order.date,
        order.status,
        order.total.toFixed(2),
        order.items
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCategoryForm(prev => ({ ...prev, icon: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const filteredTickets = tickets ? tickets.filter(t => ticketFilter === 'all' ? true : t.status === ticketFilter) : [];

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-indigo-600 p-8 text-center">
             <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Shield size={32} className="text-white" />
             </div>
             <h2 className="text-2xl font-bold text-white">Admin Access</h2>
             <p className="text-indigo-100 mt-2">Please verify your identity.</p>
          </div>
          <div className="p-8">
             <form onSubmit={handleLogin} className="space-y-4">
                <div>
                   <label className="block text-sm font-bold text-slate-900 mb-2">Password</label>
                   <input 
                        type="password" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        autoFocus
                   />
                </div>
                {loginError && <div className="text-red-600 bg-red-50 p-3 rounded-xl text-sm font-bold">{loginError}</div>}
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl">Access Dashboard</button>
             </form>
             <button onClick={onClose} className="w-full mt-4 text-slate-500 font-medium hover:text-indigo-600">Return to Store</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
       {/* SIDEBAR - Light Theme (White Background, Dark Text) */}
       <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 print:hidden">
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
             <div className="font-bold text-xl flex items-center gap-2 text-slate-900">
                <Shield size={20} className="text-indigo-600" /> 
                <span>Admin</span>
             </div>
             <button onClick={onClose}><LogOut size={20} className="text-slate-400 hover:text-indigo-600 transition-colors" /></button>
          </div>
          
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
             <SidebarItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={BarChart2} label="Dashboard" />
             <SidebarItem active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={Package} label="Products" />
             <SidebarItem active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} icon={LayoutList} label="Categories" />
             <SidebarItem active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={ShoppingBag} label="Orders" badgeCount={pendingOrdersCount} />
             <SidebarItem active={activeTab === 'marketing'} onClick={() => setActiveTab('marketing')} icon={Tag} label="Marketing" />
             <SidebarItem active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={Star} label="Reviews" badgeCount={pendingReviewsCount} />
             <SidebarItem active={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} icon={MessageSquare} label="Support" badgeCount={tickets.filter(t => t.status === 'open').length} />
             <SidebarItem active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} icon={Users} label="Customers" />
             <SidebarItem active={activeTab === 'pages'} onClick={() => setActiveTab('pages')} icon={FileText} label="Pages" />
             <SidebarItem active={activeTab === 'blog'} onClick={() => setActiveTab('blog')} icon={Edit} label="Blog" />
             <SidebarItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="Settings" />
          </nav>
          
          <div className="p-4 border-t border-slate-100">
             <button onClick={() => setIsAuthenticated(false)} className="w-full flex gap-2 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors font-medium">
                <Lock size={18} /> Lock Dashboard
             </button>
          </div>
       </aside>

       <main className="flex-1 overflow-y-auto bg-slate-50 print:bg-white print:overflow-visible relative">
          
          {/* Top Bar */}
          <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-slate-200 px-8 py-4 flex justify-between items-center print:hidden">
             <h2 className="text-xl font-bold text-slate-900 capitalize">{activeTab}</h2>
             <div className="flex items-center gap-4">
                <div className="relative">
                   <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
                      <Bell size={20} />
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                   </button>
                   {isNotificationsOpen && (
                      <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-20 animate-fade-in">
                         <h4 className="font-bold text-sm mb-3 text-slate-700">Notifications</h4>
                         <div className="space-y-3">
                            {activities.slice(0,3).map(a => (
                               <div key={a.id} className="flex gap-3 items-start">
                                  <div className={`p-1.5 rounded-full shrink-0 ${a.color.split(' ')[0]}`}>
                                     <a.icon size={12} className={a.color.split(' ')[1]} />
                                  </div>
                                  <div>
                                     <p className="text-xs font-medium text-slate-800">{a.text}</p>
                                     <p className="text-[10px] text-slate-400">{a.time}</p>
                                  </div>
                                </div>
                            ))}
                         </div>
                      </div>
                      </>
                   )}
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">AD</div>
                   <span className="text-sm font-bold text-slate-700">Admin</span>
                </div>
             </div>
          </div>

          <div className="p-8 max-w-7xl mx-auto print:p-0">
             
             {/* OVERVIEW TAB */}
             {activeTab === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* ... (Overview stats remain similar) ... */}
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                         <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><DollarSign size={24}/></div>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1"><TrendingUp size={12}/> +12%</span>
                         </div>
                         <h3 className="text-slate-500 text-sm font-medium mb-1">Total Revenue</h3>
                         <p className="text-2xl font-bold text-slate-900">${totalRevenue.toFixed(2)}</p>
                      </div>
                      {/* ... other stats ... */}
                   </div>
                   {/* ... charts and activity ... */}
                </div>
             )}

             {/* PRODUCTS TAB */}
             {activeTab === 'products' && (
                 <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                       <h2 className="text-2xl font-bold text-slate-900">Products</h2>
                       <button onClick={() => { 
                          setProductForm({ 
                             licensePricing: LICENSE_DEFINITIONS.reduce((acc, def) => {
                                acc[def.type] = { enabled: true, price: 0 };
                                return acc;
                             }, {} as any)
                          }); 
                          setIsAddingProduct(true); 
                        }} className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold flex gap-2"><Plus size={18} /> Add Product</button>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                             <tr>
                                <th className="p-4 font-semibold text-slate-600 text-sm">Product</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">Base Price</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">Category</th>
                                <th className="p-4 text-right">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {products.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50">
                                   <td className="p-4 flex gap-3 items-center">
                                      <img src={p.image} className="w-10 h-10 rounded bg-slate-100 object-cover" alt="" />
                                      <div><div className="font-bold text-slate-900">{p.name}</div><div className="text-xs text-slate-400">{p.id}</div></div>
                                   </td>
                                   <td className="p-4 font-medium text-slate-900">
                                      ${p.price} <span className="text-xs text-slate-400">(starts from)</span>
                                   </td>
                                   <td className="p-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">{p.category}</span></td>
                                   <td className="p-4 text-right flex justify-end gap-2">
                                      <button onClick={() => { setProductForm(p); setIsAddingProduct(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"><Edit size={16} /></button>
                                      <button onClick={() => onDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
             )}

             {/* ... Other Tabs (Categories, Orders, etc.) remain mostly the same ... */}
             
             {/* ORDERS TAB (Updated for License Labels) */}
             {activeTab === 'orders' && (
                <div className="space-y-6 animate-fade-in">
                   <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-slate-900">Orders</h2>
                      <button onClick={handleExportOrders} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold text-sm flex items-center gap-2 hover:bg-slate-50"><Download size={16}/> Export CSV</button>
                   </div>
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <table className="w-full text-left">
                         <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                               <th className="p-4 font-semibold text-slate-600 text-sm">Order ID</th>
                               <th className="p-4 font-semibold text-slate-600 text-sm">Customer</th>
                               <th className="p-4 font-semibold text-slate-600 text-sm">Date</th>
                               <th className="p-4 font-semibold text-slate-600 text-sm">Status</th>
                               <th className="p-4 font-semibold text-slate-600 text-sm">Total</th>
                               <th className="p-4 text-right">Actions</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                            {orders.map(order => (
                               <tr key={order.id} className="hover:bg-slate-50">
                                  <td className="p-4 font-bold text-indigo-600">{order.id}</td>
                                  <td className="p-4 text-sm">
                                     <div className="font-bold text-slate-900">{order.customer}</div>
                                     <div className="text-slate-500">{order.email}</div>
                                  </td>
                                  <td className="p-4 text-sm text-slate-600">{order.date}</td>
                                  <td className="p-4">
                                     <select 
                                        value={order.status} 
                                        onChange={(e) => onUpdateOrder({...order, status: e.target.value as any})}
                                        className={`text-xs font-bold uppercase border-none rounded bg-transparent cursor-pointer outline-none ${
                                           order.status === 'completed' ? 'text-green-600' : 
                                           order.status === 'pending' ? 'text-amber-600' : 'text-slate-600'
                                        }`}
                                     >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                     </select>
                                  </td>
                                  <td className="p-4 font-bold text-slate-900">${order.total}</td>
                                  <td className="p-4 text-right">
                                     <button onClick={() => setSelectedOrder(order)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"><Eye size={16}/></button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             )}

             {/* SETTINGS TAB */}
             {activeTab === 'settings' && (
                <div className="space-y-6 animate-fade-in h-full flex flex-col">
                   {/* ... Settings implementation (same as before) ... */}
                   <div className="flex justify-between items-center shrink-0">
                       <h2 className="text-2xl font-bold text-slate-900">Settings & Configuration</h2>
                       <button onClick={handleSaveSettings} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"><Save size={18} /> Save All Changes</button>
                   </div>
                   
                   <div className="flex-1 flex bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      {/* Settings Sidebar */}
                      <div className="w-64 bg-slate-50 border-r border-slate-100 flex flex-col">
                         {['general', 'design', 'payment', 'checkout', 'email', 'seo', 'footer', 'security'].map(t => (
                            <button 
                               key={t} 
                               onClick={() => setSettingsSubTab(t)} 
                               className={`px-6 py-4 text-left font-bold text-sm capitalize transition-colors flex items-center justify-between ${settingsSubTab === t ? 'bg-white text-indigo-600 border-l-4 border-indigo-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
                            >
                               {t === 'email' ? 'Email Notifications' : t}
                               {settingsSubTab === t && <ChevronRight size={16} />}
                            </button>
                         ))}
                      </div>

                      {/* Settings Content */}
                      <div className="flex-1 p-8 overflow-y-auto">
                         {/* General Settings */}
                         {settingsSubTab === 'general' && (
                            <div className="space-y-6 max-w-2xl">
                               <div><h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Store Identity</h3></div>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div><label className="block text-sm font-bold text-slate-700 mb-1">Store Name</label><input type="text" className="w-full p-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" value={tempSettings.storeName} onChange={e => setTempSettings({...tempSettings, storeName: e.target.value})} /></div>
                                  <div><label className="block text-sm font-bold text-slate-700 mb-1">Support Email</label><input type="email" className="w-full p-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" value={tempSettings.supportEmail} onChange={e => setTempSettings({...tempSettings, supportEmail: e.target.value})} /></div>
                                  <div><label className="block text-sm font-bold text-slate-700 mb-1">Contact Phone</label><input type="text" className="w-full p-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" value={tempSettings.contactPhone} onChange={e => setTempSettings({...tempSettings, contactPhone: e.target.value})} /></div>
                                  <div><label className="block text-sm font-bold text-slate-700 mb-1">Logo URL</label><input type="text" className="w-full p-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" value={tempSettings.logoUrl || ''} onChange={e => setTempSettings({...tempSettings, logoUrl: e.target.value})} /></div>
                               </div>
                               <div><label className="block text-sm font-bold text-slate-700 mb-1">Physical Address</label><textarea className="w-full p-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" rows={3} value={tempSettings.contactAddress} onChange={e => setTempSettings({...tempSettings, contactAddress: e.target.value})} /></div>
                            </div>
                         )}
                         {/* ... Other settings tabs same as before ... */}
                      </div>
                   </div>
                </div>
             )}

          </div>
       </main>

       {/* MODALS */}
       
       {/* Product Modal - ENHANCED for License Management */}
       {isAddingProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in print:hidden">
             <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                <h3 className="text-2xl font-bold mb-6 text-slate-900">{productForm.id ? 'Edit Product' : 'Add New Product'}</h3>
                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Product Name</label>
                         <input className="w-full border p-3 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Name" value={productForm.name || ''} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                         <input className="w-full border p-3 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Category" list="cats" value={productForm.category || ''} onChange={e => setProductForm({...productForm, category: e.target.value})} />
                         <datalist id="cats">{uniqueCategories.map(c => <option key={c} value={c}/>)}</datalist>
                      </div>
                   </div>

                   {/* LICENSE CONFIGURATION SECTION */}
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Key size={16}/> License Pricing Configuration</h4>
                      <div className="space-y-3">
                         {LICENSE_DEFINITIONS.map(def => {
                            const licenseConfig = productForm.licensePricing?.[def.type] || { enabled: false, price: 0 };
                            return (
                               <div key={def.type} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200">
                                  <div className="w-8 flex justify-center">
                                     <input 
                                        type="checkbox" 
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                        checked={licenseConfig.enabled}
                                        onChange={(e) => handleLicensePriceChange(def.type, 'enabled', e.target.checked)}
                                     />
                                  </div>
                                  <div className="flex-1 font-medium text-slate-700 text-sm">{def.label}</div>
                                  <div className="w-32 relative">
                                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                     <input 
                                        type="number" 
                                        disabled={!licenseConfig.enabled}
                                        className="w-full pl-6 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="0.00"
                                        value={licenseConfig.price}
                                        onChange={(e) => handleLicensePriceChange(def.type, 'price', Number(e.target.value))}
                                     />
                                  </div>
                               </div>
                            );
                         })}
                      </div>
                   </div>

                   <textarea className="w-full border p-3 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Description" rows={3} value={productForm.description || ''} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                   
                   {/* Product Image Upload */}
                   <div>
                       <label className="block text-sm font-bold text-slate-900 mb-1">Product Image</label>
                       <div className="flex flex-col gap-3">
                          <div className="flex gap-2">
                             <input className="w-full border p-3 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Image URL" value={productForm.image || ''} onChange={e => setProductForm({...productForm, image: e.target.value})} />
                             <button onClick={() => setProductForm({...productForm, image: generatePlaceholder(productForm.name || 'Product', productForm.category || 'Plugin')})} className="bg-indigo-50 text-indigo-600 px-3 rounded-xl hover:bg-indigo-100 transition-colors" title="Generate Random"><Sparkles size={20}/></button>
                          </div>
                       </div>
                   </div>

                   <input className="w-full border p-3 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Demo URL (Optional)" value={productForm.demoUrl || ''} onChange={e => setProductForm({...productForm, demoUrl: e.target.value})} />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                   <button onClick={() => setIsAddingProduct(false)} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                   <button onClick={handleSaveProduct} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">Save</button>
                </div>
             </div>
          </div>
       )}

       {/* Order Modal - Updated for License Labels */}
       {selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:static print:bg-white">
             <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto print:shadow-none print:w-full print:max-w-none print:h-auto print:overflow-visible">
                 <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                    <div>
                       <h2 className="text-3xl font-bold text-slate-900 mb-1">Receipt</h2>
                       <p className="text-slate-500 text-sm">#{selectedOrder.id} • {selectedOrder.date}</p>
                    </div>
                    <div className="text-right">
                       <div className="text-xl font-bold text-indigo-600">{storeSettings.storeName}</div>
                    </div>
                 </div>
                 {/* ... (Customer info same as before) ... */}
                 <table className="w-full text-left text-sm mb-8">
                    <thead><tr><th className="p-2 border-b text-slate-600">Item</th><th className="p-2 border-b text-right text-slate-600">Total</th></tr></thead>
                    <tbody>
                       {selectedOrder.products?.map((p, i) => (
                          <tr key={i}>
                             <td className="p-2 border-b text-slate-900">
                                <div>{p.name}</div>
                                <div className="text-xs text-slate-500">{p.licenseLabel} <span className="mx-1">•</span> x{p.quantity}</div>
                             </td>
                             <td className="p-2 border-b text-right text-slate-900">${(p.price * p.quantity).toFixed(2)}</td>
                          </tr>
                       ))}
                    </tbody>
                    <tfoot>
                       <tr><td className="p-2 font-bold text-right text-slate-900">Total</td><td className="p-2 font-bold text-right text-indigo-600">${selectedOrder.total.toFixed(2)}</td></tr>
                    </tfoot>
                 </table>
                 <div className="flex justify-end gap-3 print:hidden">
                    <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors">Close</button>
                    <button onClick={() => window.print()} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg flex gap-2 items-center hover:bg-indigo-700 transition-colors"><Printer size={16}/> Print</button>
                 </div>
             </div>
          </div>
       )}

       {/* ... Other modals (Category, Coupon, etc) ... */}
    </div>
  );
};