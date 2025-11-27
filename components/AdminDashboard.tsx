
import React, { useState } from 'react';
import { 
  X, Plus, Trash2, Edit, Save, Search, Image as ImageIcon, 
  Settings, ShoppingBag, FileText, MessageSquare, Users, 
  BarChart2, Shield, Lock, AlertTriangle, CheckCircle,
  Layout, CreditCard, Globe, Share2, HelpCircle, LogOut, Package,
  Star, Filter, Check, Ban, ExternalLink, ChevronDown, Key,
  LayoutList, FolderTree, Eye, Printer, Palette, DollarSign, Terminal, Link, Upload, Sparkles, Download, TrendingUp, Clock, Bell, Tag, Percent, Mail, Database, ChevronRight, ToggleLeft, ToggleRight, Monitor, FileCheck, Cookie, Send
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
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-black hover:bg-slate-100'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={20} className={active ? 'text-white' : 'text-black'} />
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
             <span className="text-xs text-black text-center mt-2 font-bold">{days[i]}</span>
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

  const defaultLicensePricing = LICENSE_DEFINITIONS.reduce((acc, def) => {
    acc[def.type] = { enabled: true, price: 0 };
    return acc;
  }, {} as any);

  // Forms State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
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

  const generatePlaceholder = (name: string) => {
     const text = encodeURIComponent(name);
     return `https://placehold.co/600x400/475569/ffffff?text=${text}`;
  };

  const handleSaveProduct = () => {
    if (productForm.name && productForm.licensePricing) {
      // Find the lowest price among enabled licenses to set as the 'display price'
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
        image: productForm.image || generatePlaceholder(productForm.name),
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
     if(window.confirm(`Delete "${categoryName}"? Products will be kept but category removed from lists.`)) {
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

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProductForm(prev => ({ ...prev, image: reader.result as string }));
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
                   <label className="block text-sm font-bold text-black mb-2">Password</label>
                   <input 
                        type="password" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
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
    <div className="flex h-screen bg-slate-50 font-sans text-black">
       {/* SIDEBAR - Light Theme (White Background, Black Text) */}
       <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 print:hidden">
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
             <div className="font-bold text-xl flex items-center gap-2 text-black">
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
             <button onClick={() => setIsAuthenticated(false)} className="w-full flex gap-2 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-black rounded-xl transition-colors font-bold">
                <Lock size={18} /> Lock Dashboard
             </button>
          </div>
       </aside>

       <main className="flex-1 overflow-y-auto bg-slate-50 print:bg-white print:overflow-visible relative">
          
          <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-slate-200 px-8 py-4 flex justify-between items-center print:hidden">
             <h2 className="text-xl font-extrabold text-black capitalize">{activeTab}</h2>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">AD</div>
                   <span className="text-sm font-bold text-black">Admin</span>
                </div>
             </div>
          </div>

          <div className="p-8 max-w-7xl mx-auto print:p-0">
             
             {/* OVERVIEW TAB */}
             {activeTab === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                         <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><DollarSign size={24}/></div>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1"><TrendingUp size={12}/> +12%</span>
                         </div>
                         <h3 className="text-slate-500 text-sm font-bold mb-1">Total Revenue</h3>
                         <p className="text-2xl font-extrabold text-black">${totalRevenue.toFixed(2)}</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                         <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ShoppingBag size={24}/></div>
                         </div>
                         <h3 className="text-slate-500 text-sm font-bold mb-1">Total Orders</h3>
                         <p className="text-2xl font-extrabold text-black">{orders.length}</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                         <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Users size={24}/></div>
                         </div>
                         <h3 className="text-slate-500 text-sm font-bold mb-1">Customers</h3>
                         <p className="text-2xl font-extrabold text-black">{users.length}</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                         <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><MessageSquare size={24}/></div>
                            {activeTickets > 0 && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">{activeTickets} Active</span>}
                         </div>
                         <h3 className="text-slate-500 text-sm font-bold mb-1">Pending Tickets</h3>
                         <p className="text-2xl font-extrabold text-black">{activeTickets}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-black text-lg">Revenue Analytics</h3>
                         </div>
                         <RevenueChart />
                      </div>

                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                         <h3 className="font-bold text-black text-lg mb-6">Recent Activity</h3>
                         <div className="space-y-6">
                            {activities.map(act => (
                               <div key={act.id} className="flex gap-4 relative">
                                  <div className={`p-2 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center z-10 ${act.color}`}>
                                     <act.icon size={18}/>
                                  </div>
                                  <div className="absolute left-5 top-10 bottom-[-24px] w-0.5 bg-slate-100 last:hidden"></div>
                                  <div>
                                     <p className="text-sm font-bold text-black">{act.text}</p>
                                     <span className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium"><Clock size={10}/> {act.time}</span>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {/* PRODUCTS TAB */}
             {activeTab === 'products' && (
                 <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                       <h2 className="text-2xl font-bold text-black">Products</h2>
                       <button onClick={() => { setProductForm({ licensePricing: defaultLicensePricing }); setIsAddingProduct(true); }} className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold flex gap-2"><Plus size={18} /> Add Product</button>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                             <tr>
                                <th className="p-4 font-bold text-black text-sm">Product</th>
                                <th className="p-4 font-bold text-black text-sm">Base Price</th>
                                <th className="p-4 font-bold text-black text-sm">Category</th>
                                <th className="p-4 text-right font-bold text-black">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {products.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50">
                                   <td className="p-4 flex gap-3 items-center">
                                      <img src={p.image} className="w-10 h-10 rounded bg-slate-100 object-cover" alt="" />
                                      <div><div className="font-bold text-black">{p.name}</div><div className="text-xs text-slate-500 font-medium">{p.id}</div></div>
                                   </td>
                                   <td className="p-4 font-bold text-black">${p.price}</td>
                                   <td className="p-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-700">{p.category}</span></td>
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

             {/* CATEGORIES TAB */}
             {activeTab === 'categories' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                       <h2 className="text-2xl font-bold text-black">Categories</h2>
                       <button onClick={() => { setCategoryForm({ oldName: '', newName: '', icon: '' }); setIsManagingCategory(true); }} className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold flex gap-2"><Plus size={18} /> Add Category</button>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                             <tr><th className="p-4 font-bold text-black text-sm">Icon</th><th className="p-4 font-bold text-black text-sm">Name</th><th className="p-4 font-bold text-black text-sm">Products</th><th className="p-4 text-right font-bold text-black">Actions</th></tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {uniqueCategories.map(cat => (
                                <tr key={cat} className="hover:bg-slate-50">
                                   <td className="p-4">
                                      {storeSettings.categoryIcons && storeSettings.categoryIcons[cat] ? (
                                         <img src={storeSettings.categoryIcons[cat]} className="w-8 h-8 object-contain" alt={cat} />
                                      ) : <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center"><LayoutList size={16} className="text-slate-400"/></div>}
                                   </td>
                                   <td className="p-4 font-bold text-black">{cat}</td>
                                   <td className="p-4 text-slate-700 font-medium">{products.filter(p => p.category === cat).length} items</td>
                                   <td className="p-4 text-right flex justify-end gap-2">
                                      <button onClick={() => { setCategoryForm({ oldName: cat, newName: cat, icon: storeSettings.categoryIcons?.[cat] || '' }); setIsManagingCategory(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"><Edit size={16}/></button>
                                      <button onClick={() => handleDeleteCategory(cat)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                </div>
             )}

             {/* ORDERS TAB */}
             {activeTab === 'orders' && (
                <div className="space-y-6 animate-fade-in">
                   <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-black">Orders</h2>
                      <button onClick={handleExportOrders} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-black font-bold text-sm flex items-center gap-2 hover:bg-slate-50"><Download size={16}/> Export CSV</button>
                   </div>
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <table className="w-full text-left">
                         <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                               <th className="p-4 font-bold text-black text-sm">Order ID</th>
                               <th className="p-4 font-bold text-black text-sm">Customer</th>
                               <th className="p-4 font-bold text-black text-sm">Date</th>
                               <th className="p-4 font-bold text-black text-sm">Status</th>
                               <th className="p-4 font-bold text-black text-sm">Total</th>
                               <th className="p-4 text-right font-bold text-black">Actions</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                            {orders.map(order => (
                               <tr key={order.id} className="hover:bg-slate-50">
                                  <td className="p-4 font-bold text-indigo-600">{order.id}</td>
                                  <td className="p-4 text-sm">
                                     <div className="font-bold text-black">{order.customer}</div>
                                     <div className="text-slate-500">{order.email}</div>
                                  </td>
                                  <td className="p-4 text-sm text-black font-medium">{order.date}</td>
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
                                  <td className="p-4 font-bold text-black">${order.total}</td>
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

             {/* MARKETING / COUPONS TAB */}
             {activeTab === 'marketing' && (
                <div className="space-y-6 animate-fade-in">
                   <div className="flex justify-between items-center">
                       <h2 className="text-2xl font-bold text-black">Coupons & Discounts</h2>
                       <button onClick={() => setIsAddingCoupon(true)} className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold flex gap-2 hover:bg-indigo-700 transition-colors"><Plus size={18} /> Add Coupon</button>
                   </div>
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                             <tr>
                                <th className="p-4 font-bold text-black text-sm">Code</th>
                                <th className="p-4 font-bold text-black text-sm">Discount</th>
                                <th className="p-4 font-bold text-black text-sm">Usage</th>
                                <th className="p-4 font-bold text-black text-sm">Status</th>
                                <th className="p-4 text-right font-bold text-black">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {coupons?.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                                   <td className="p-4 font-bold text-black font-mono tracking-wide">{c.code}</td>
                                   <td className="p-4 text-sm text-black font-medium">
                                      {c.discountType === 'percentage' ? `${c.discountValue}% Off` : `$${c.discountValue} Off`}
                                   </td>
                                   <td className="p-4 text-sm text-black font-medium">{c.usedCount} / {c.usageLimit || '∞'}</td>
                                   <td className="p-4"><span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span></td>
                                   <td className="p-4 text-right">
                                      {onDeleteCoupon && <button onClick={() => onDeleteCoupon(c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={16}/></button>}
                                   </td>
                                </tr>
                             ))}
                             {(!coupons || coupons.length === 0) && (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No coupons created yet.</td></tr>
                             )}
                          </tbody>
                       </table>
                   </div>
                </div>
             )}

             {/* REVIEWS TAB */}
             {activeTab === 'reviews' && (
                <div className="space-y-6 animate-fade-in">
                   <h2 className="text-2xl font-bold text-black">Reviews</h2>
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                             <tr>
                                <th className="p-4 font-bold text-black text-sm">Product</th>
                                <th className="p-4 font-bold text-black text-sm">User</th>
                                <th className="p-4 font-bold text-black text-sm">Rating</th>
                                <th className="p-4 font-bold text-black text-sm">Comment</th>
                                <th className="p-4 text-right font-bold text-black">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {allReviews.map(r => (
                                <tr key={r.id} className="hover:bg-slate-50">
                                   <td className="p-4 font-bold text-black">{r.productName}</td>
                                   <td className="p-4 text-black font-medium">{r.customerName}</td>
                                   <td className="p-4 text-amber-500 font-bold">{r.rating}/5</td>
                                   <td className="p-4 truncate max-w-xs text-slate-700">{r.comment}</td>
                                   <td className="p-4 text-right flex justify-end gap-2">
                                      {r.status !== 'approved' && <button onClick={() => handleUpdateReviewStatus(r.productId, r.id, 'approved')} className="p-2 text-green-600 hover:bg-green-50 rounded"><Check size={16}/></button>}
                                      <button onClick={() => handleDeleteReview(r.productId, r.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                   </div>
                </div>
             )}

             {/* SUPPORT TICKETS TAB */}
             {activeTab === 'tickets' && (
                <div className="space-y-6 animate-fade-in">
                   <h2 className="text-2xl font-bold text-black">Support Tickets</h2>
                   <div className="flex gap-2">
                      {['all', 'open', 'closed'].map(f => (
                         <button key={f} onClick={() => setTicketFilter(f as any)} className={`px-4 py-2 rounded-lg text-sm font-bold uppercase ${ticketFilter === f ? 'bg-indigo-600 text-white' : 'bg-white text-black border border-slate-200'}`}>{f}</button>
                      ))}
                   </div>
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                             <tr>
                                <th className="p-4 font-bold text-black text-sm">ID</th>
                                <th className="p-4 font-bold text-black text-sm">Subject</th>
                                <th className="p-4 font-bold text-black text-sm">Customer</th>
                                <th className="p-4 font-bold text-black text-sm">Status</th>
                                <th className="p-4 text-right font-bold text-black">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {filteredTickets.map(t => (
                                <tr key={t.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedTicket(t)}>
                                   <td className="p-4 font-bold text-indigo-600">{t.id}</td>
                                   <td className="p-4 font-bold text-black">{t.subject}</td>
                                   <td className="p-4 text-sm text-black"><span className="font-bold">{t.customerName}</span><br/><span className="text-slate-500 text-xs">{t.email}</span></td>
                                   <td className="p-4"><span className={`text-xs font-bold uppercase px-2 py-1 rounded ${t.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{t.status}</span></td>
                                   <td className="p-4 text-right"><button className="p-2 text-indigo-600"><MessageSquare size={16}/></button></td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                   </div>
                </div>
             )}
             
             {/* CUSTOMERS TAB */}
             {activeTab === 'customers' && (
                <div className="space-y-6 animate-fade-in">
                   <h2 className="text-2xl font-bold text-black">Customers</h2>
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                             <tr><th className="p-4 font-bold text-black text-sm">Name</th><th className="p-4 font-bold text-black text-sm">Email</th><th className="p-4 font-bold text-black text-sm">Joined</th><th className="p-4 text-right font-bold text-black">Actions</th></tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {users.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50">
                                   <td className="p-4 font-bold text-black">{u.name}</td>
                                   <td className="p-4 text-sm text-black font-medium">{u.email}</td>
                                   <td className="p-4 text-sm text-slate-600">{new Date(u.joinDate).toLocaleDateString()}</td>
                                   <td className="p-4 text-right">
                                      {onDeleteUser && <button onClick={() => onDeleteUser(u.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button>}
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                   </div>
                </div>
             )}

             {/* PAGES TAB */}
             {activeTab === 'pages' && (
                <div className="space-y-6 animate-fade-in">
                   <div className="flex justify-between items-center">
                       <h2 className="text-2xl font-bold text-black">Pages</h2>
                       <button onClick={() => { setPageForm({}); setIsAddingPage(true); }} className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold flex gap-2"><Plus size={18} /> Add Page</button>
                   </div>
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                             <tr><th className="p-4 font-bold text-black text-sm">Title</th><th className="p-4 font-bold text-black text-sm">Slug</th><th className="p-4 text-right font-bold text-black">Actions</th></tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {pages.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50">
                                   <td className="p-4 font-bold text-black">{p.title}</td>
                                   <td className="p-4 text-sm text-slate-500">/{p.slug}</td>
                                   <td className="p-4 text-right flex justify-end gap-2">
                                      <button onClick={() => { setPageForm(p); setIsAddingPage(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"><Edit size={16}/></button>
                                      <button onClick={() => onDeletePage(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                   </div>
                </div>
             )}

             {/* BLOG TAB */}
             {activeTab === 'blog' && (
                <div className="space-y-6 animate-fade-in">
                   <div className="flex justify-between items-center">
                       <h2 className="text-2xl font-bold text-black">Blog Posts</h2>
                       <button onClick={() => { setPostForm({}); setIsAddingPost(true); }} className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold flex gap-2"><Plus size={18} /> Add Post</button>
                   </div>
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                             <tr><th className="p-4 font-bold text-black text-sm">Title</th><th className="p-4 font-bold text-black text-sm">Category</th><th className="p-4 font-bold text-black text-sm">Date</th><th className="p-4 text-right font-bold text-black">Actions</th></tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {blogPosts.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50">
                                   <td className="p-4 font-bold text-black">{p.title}</td>
                                   <td className="p-4 text-sm text-black font-medium">{p.category}</td>
                                   <td className="p-4 text-sm text-slate-600">{new Date(p.date).toLocaleDateString()}</td>
                                   <td className="p-4 text-right flex justify-end gap-2">
                                      <button onClick={() => { setPostForm(p); setIsAddingPost(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"><Edit size={16}/></button>
                                      <button onClick={() => onDeletePost(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
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
                <div className="space-y-6 flex h-full">
                   <div className="w-64 bg-slate-50 border-r p-2 space-y-1">
                      {['general', 'design', 'payment', 'checkout', 'email', 'seo', 'footer', 'security'].map(t => (
                         <button key={t} onClick={() => setSettingsSubTab(t)} className={`w-full text-left px-4 py-3 rounded-lg font-bold capitalize ${settingsSubTab === t ? 'bg-white shadow text-indigo-600' : 'text-black hover:bg-slate-200'}`}>
                            {t}
                         </button>
                      ))}
                   </div>
                   <div className="flex-1 p-6 overflow-y-auto">
                      {/* GENERAL */}
                      {settingsSubTab === 'general' && (
                         <div className="space-y-4 max-w-xl">
                            <div><label className="block text-sm font-bold text-black mb-1">Store Name</label><input type="text" className="w-full p-3 border border-slate-200 rounded-xl text-black" value={tempSettings.storeName} onChange={e => setTempSettings({...tempSettings, storeName: e.target.value})} /></div>
                            <div><label className="block text-sm font-bold text-black mb-1">Support Email</label><input type="email" className="w-full p-3 border border-slate-200 rounded-xl text-black" value={tempSettings.supportEmail} onChange={e => setTempSettings({...tempSettings, supportEmail: e.target.value})} /></div>
                            <div><label className="block text-sm font-bold text-black mb-1">Address</label><textarea className="w-full p-3 border border-slate-200 rounded-xl text-black" value={tempSettings.contactAddress} onChange={e => setTempSettings({...tempSettings, contactAddress: e.target.value})} /></div>
                         </div>
                      )}
                      
                      {/* DESIGN */}
                      {settingsSubTab === 'design' && (
                         <div className="space-y-4 max-w-xl">
                            <div>
                               <label className="block text-sm font-bold text-black mb-1">Primary Color</label>
                               <div className="flex gap-4 items-center">
                                  <input type="color" className="w-12 h-12 rounded cursor-pointer" value={tempSettings.design.primaryColor} onChange={e => setTempSettings({...tempSettings, design: {...tempSettings.design, primaryColor: e.target.value}})} />
                                  <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-black">{tempSettings.design.primaryColor}</span>
                               </div>
                            </div>
                            <div><label className="block text-sm font-bold text-black mb-1">Hero Headline</label><input type="text" className="w-full p-3 border border-slate-200 rounded-xl text-black" value={tempSettings.design.heroHeadline} onChange={e => setTempSettings({...tempSettings, design: {...tempSettings.design, heroHeadline: e.target.value}})} /></div>
                         </div>
                      )}

                      {/* PAYMENT */}
                      {settingsSubTab === 'payment' && (
                         <div className="space-y-4 max-w-xl">
                            <div><label className="block text-sm font-bold text-black mb-1">Currency Symbol</label><input type="text" className="w-full p-3 border border-slate-200 rounded-xl text-black" value={tempSettings.payment.currencySymbol} onChange={e => setTempSettings({...tempSettings, payment: {...tempSettings.payment, currencySymbol: e.target.value}})} /></div>
                            <div>
                                <label className="block text-sm font-bold text-black mb-1">Default Currency</label>
                                <select 
                                   className="w-full p-3 border border-slate-200 rounded-xl bg-white text-black"
                                   value={tempSettings.payment.currencyCode} 
                                   onChange={e => {
                                      const curr = CURRENCIES.find(c => c.code === e.target.value);
                                      if(curr) setTempSettings({...tempSettings, payment: {...tempSettings.payment, currencyCode: curr.code, currencySymbol: curr.symbol}});
                                   }}
                                >
                                   {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.symbol})</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                               <button 
                                  onClick={() => setTempSettings({...tempSettings, payment: {...tempSettings.payment, paypalEnabled: !tempSettings.payment.paypalEnabled}})}
                                  className={`relative w-12 h-6 rounded-full transition-colors ${tempSettings.payment.paypalEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                               >
                                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${tempSettings.payment.paypalEnabled ? 'translate-x-6' : ''}`}></div>
                               </button>
                               <span className="font-bold text-black">Enable PayPal</span>
                            </div>
                            {tempSettings.payment.paypalEnabled && (
                               <div className="pl-4 border-l-2 border-indigo-200 space-y-3">
                                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">PayPal Client ID</label><input type="text" className="w-full p-3 border border-slate-200 rounded-xl text-black text-sm font-mono" value={tempSettings.payment.paypalClientId} onChange={e => setTempSettings({...tempSettings, payment: {...tempSettings.payment, paypalClientId: e.target.value}})} placeholder="Client ID" /></div>
                                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">PayPal Secret</label><input type="password" className="w-full p-3 border border-slate-200 rounded-xl text-black text-sm font-mono" value={tempSettings.payment.paypalSecret} onChange={e => setTempSettings({...tempSettings, payment: {...tempSettings.payment, paypalSecret: e.target.value}})} placeholder="Secret Key" /></div>
                               </div>
                            )}
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                               <button 
                                  onClick={() => setTempSettings({...tempSettings, payment: {...tempSettings.payment, stripeEnabled: !tempSettings.payment.stripeEnabled}})}
                                  className={`relative w-12 h-6 rounded-full transition-colors ${tempSettings.payment.stripeEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                               >
                                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${tempSettings.payment.stripeEnabled ? 'translate-x-6' : ''}`}></div>
                               </button>
                               <span className="font-bold text-black">Enable Stripe</span>
                            </div>
                         </div>
                      )}

                      {/* EMAIL */}
                      {settingsSubTab === 'email' && (
                         <div className="space-y-4 max-w-xl">
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 mb-4">
                               <strong>Note:</strong> This is a simulation. In a real production app, you would connect this to an SMTP service like AWS SES, SendGrid, or Mailgun.
                            </div>
                            <div><label className="block text-sm font-bold text-black mb-1">Sender Name</label><input type="text" className="w-full p-3 border border-slate-200 rounded-xl text-black" value={tempSettings.emailSettings.senderName} onChange={e => setTempSettings({...tempSettings, emailSettings: {...tempSettings.emailSettings, senderName: e.target.value}})} /></div>
                            <div><label className="block text-sm font-bold text-black mb-1">Sender Email</label><input type="email" className="w-full p-3 border border-slate-200 rounded-xl text-black" value={tempSettings.emailSettings.senderEmail} onChange={e => setTempSettings({...tempSettings, emailSettings: {...tempSettings.emailSettings, senderEmail: e.target.value}})} /></div>
                         </div>
                      )}

                      {/* FOOTER */}
                      {settingsSubTab === 'footer' && (
                         <div className="space-y-4 max-w-xl">
                            <div><label className="block text-sm font-bold text-black mb-1">Footer Description</label><textarea className="w-full p-3 border border-slate-200 rounded-xl text-black" value={tempSettings.footerDescription} onChange={e => setTempSettings({...tempSettings, footerDescription: e.target.value})} /></div>
                            <div><label className="block text-sm font-bold text-black mb-1">Facebook URL</label><input type="text" className="w-full p-3 border border-slate-200 rounded-xl text-black" value={tempSettings.socials.facebook} onChange={e => setTempSettings({...tempSettings, socials: {...tempSettings.socials, facebook: e.target.value}})} /></div>
                            <div><label className="block text-sm font-bold text-black mb-1">Twitter URL</label><input type="text" className="w-full p-3 border border-slate-200 rounded-xl text-black" value={tempSettings.socials.twitter} onChange={e => setTempSettings({...tempSettings, socials: {...tempSettings.socials, twitter: e.target.value}})} /></div>
                         </div>
                      )}

                      <button onClick={handleSaveSettings} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all mt-4">Save Changes</button>
                   </div>
                </div>
             )}
          </div>
       </main>

       {/* MODALS */}
       
       {isAddingProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
             <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                <h3 className="text-2xl font-bold text-black mb-6">{productForm.id ? 'Edit Product' : 'Add New Product'}</h3>
                <div className="space-y-4">
                   <input className="w-full border border-slate-200 p-3 rounded-xl text-black font-medium" placeholder="Product Name" value={productForm.name || ''} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                   
                   {/* License Pricing Configuration */}
                   <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <h4 className="font-bold text-black mb-4 flex items-center gap-2"><Tag size={18} className="text-indigo-600"/> License Pricing</h4>
                      <p className="text-xs text-slate-500 mb-4">Enable licenses and set unique prices for this product.</p>
                      <div className="space-y-3">
                         {LICENSE_DEFINITIONS.map(def => (
                            <div key={def.type} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100">
                               <input 
                                  type="checkbox" 
                                  className="w-5 h-5 text-indigo-600 rounded"
                                  checked={productForm.licensePricing?.[def.type]?.enabled || false} 
                                  onChange={e => handleLicensePriceChange(def.type, 'enabled', e.target.checked)} 
                               />
                               <span className="flex-1 font-bold text-sm text-black">{def.label}</span>
                               <div className="flex items-center gap-2">
                                  <span className="text-slate-400 text-sm">$</span>
                                  <input 
                                     type="number" 
                                     className="border border-slate-200 p-2 rounded-lg w-24 text-right font-mono font-bold text-black" 
                                     value={productForm.licensePricing?.[def.type]?.price || 0} 
                                     onChange={e => handleLicensePriceChange(def.type, 'price', Number(e.target.value))}
                                     disabled={!productForm.licensePricing?.[def.type]?.enabled}
                                  />
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>

                   <input className="w-full border border-slate-200 p-3 rounded-xl text-black" placeholder="Category" list="cats" value={productForm.category || ''} onChange={e => setProductForm({...productForm, category: e.target.value})} />
                   <datalist id="cats">{uniqueCategories.map(c => <option key={c} value={c}/>)}</datalist>
                   
                   <div>
                       <label className="block text-sm font-bold text-black mb-1">Image</label>
                       <div className="flex gap-2">
                           <input type="file" onChange={handleProductImageUpload} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                       </div>
                       {productForm.image && <img src={productForm.image} className="mt-2 h-20 w-20 object-cover rounded-lg border border-slate-200" alt="Preview"/>}
                   </div>

                   <textarea className="w-full border border-slate-200 p-3 rounded-xl text-black" placeholder="Description" rows={3} value={productForm.description || ''} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                   <button onClick={() => setIsAddingProduct(false)} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                   <button onClick={handleSaveProduct} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Save Product</button>
                </div>
             </div>
          </div>
       )}

       {isManagingCategory && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
             <div className="bg-white p-8 rounded-3xl w-full max-w-md">
                <h3 className="text-xl font-bold text-black mb-4">{categoryForm.oldName ? 'Edit Category' : 'Add Category'}</h3>
                <div className="space-y-4">
                   <input className="w-full border border-slate-200 p-3 rounded-xl text-black" placeholder="Category Name" value={categoryForm.newName} onChange={e => setCategoryForm({...categoryForm, newName: e.target.value})} />
                   <div>
                      <label className="block text-sm font-bold text-black mb-1">Icon</label>
                      <input type="file" onChange={handleIconUpload} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                      {categoryForm.icon && <img src={categoryForm.icon} className="mt-2 h-10 object-contain" alt="Icon Preview"/>}
                   </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                   <button onClick={() => setIsManagingCategory(false)} className="px-6 py-2 font-bold text-slate-600 hover:bg-slate-50 rounded-xl">Cancel</button>
                   <button onClick={handleRenameCategory} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">Save</button>
                </div>
             </div>
          </div>
       )}

       {isAddingCoupon && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
             <div className="bg-white p-8 rounded-3xl w-full max-w-md">
                <h3 className="text-xl font-bold text-black mb-4">Add Coupon</h3>
                <div className="space-y-4">
                   <input className="w-full border border-slate-200 p-3 rounded-xl text-black uppercase font-mono" placeholder="CODE (e.g. SAVE20)" value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value})} />
                   <div className="flex gap-2">
                      <select className="border border-slate-200 p-3 rounded-xl text-black" value={couponForm.discountType} onChange={e => setCouponForm({...couponForm, discountType: e.target.value as any})}><option value="percentage">Percentage (%)</option><option value="fixed">Fixed Amount ($)</option></select>
                      <input type="number" className="w-full border border-slate-200 p-3 rounded-xl text-black" placeholder="Value" value={couponForm.discountValue} onChange={e => setCouponForm({...couponForm, discountValue: Number(e.target.value)})} />
                   </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                   <button onClick={() => setIsAddingCoupon(false)} className="px-6 py-2 font-bold text-slate-600 hover:bg-slate-50 rounded-xl">Cancel</button>
                   <button onClick={handleSaveCoupon} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">Create Coupon</button>
                </div>
             </div>
          </div>
       )}

       {selectedTicket && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
             <div className="bg-white p-8 rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <h3 className="text-xl font-bold text-black">{selectedTicket.subject}</h3>
                      <p className="text-sm text-slate-500">From: {selectedTicket.customerName}</p>
                   </div>
                   <button onClick={() => setSelectedTicket(null)}><X size={20} className="text-black"/></button>
                </div>
                <div className="flex-1 overflow-y-auto bg-slate-50 p-4 rounded-xl mb-4 space-y-4">
                   <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-sm font-bold text-slate-900 mb-1">{selectedTicket.customerName}</p>
                      <p className="text-black font-medium">{selectedTicket.message}</p>
                   </div>
                   {selectedTicket.replies?.map(r => (
                      <div key={r.id} className={`flex flex-col ${r.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                         <div className={`max-w-[80%] p-3 rounded-xl ${r.sender === 'admin' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-black'}`}>
                            <p className="text-sm font-medium">{r.message}</p>
                         </div>
                         <span className="text-xs text-slate-400 mt-1 font-medium">{new Date(r.date).toLocaleTimeString()}</span>
                      </div>
                   ))}
                </div>
                <div className="flex gap-2">
                   <input className="flex-1 border border-slate-200 p-3 rounded-xl text-black font-medium" placeholder="Type reply..." value={replyMessage} onChange={e => setReplyMessage(e.target.value)} />
                   <button onClick={handleSendReply} className="bg-indigo-600 text-white px-6 rounded-xl font-bold hover:bg-indigo-700 transition-colors">Send</button>
                </div>
             </div>
          </div>
       )}

       {selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:static print:bg-white">
             <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto print:shadow-none print:w-full print:max-w-none print:h-auto print:overflow-visible">
                 <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                    <div>
                       <h2 className="text-3xl font-extrabold text-slate-900 mb-1">Receipt</h2>
                       <p className="text-slate-500 text-sm font-medium">#{selectedOrder.id} • {selectedOrder.date}</p>
                    </div>
                    <div className="text-right">
                       <div className="text-xl font-bold text-indigo-600">{storeSettings.storeName}</div>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                       <h4 className="font-bold text-slate-700 mb-2 uppercase text-xs tracking-wider">Billed To</h4>
                       <div className="text-black font-bold text-lg">{selectedOrder.customer}</div>
                       <div className="text-slate-600 font-medium">{selectedOrder.email}</div>
                       {selectedOrder.billingDetails && (
                          <div className="text-slate-600 text-sm mt-1">
                             {selectedOrder.billingDetails.address}<br/>
                             {selectedOrder.billingDetails.city}, {selectedOrder.billingDetails.country}
                          </div>
                       )}
                    </div>
                    <div className="text-right">
                       <h4 className="font-bold text-slate-700 mb-2 uppercase text-xs tracking-wider">Status</h4>
                       <span className="font-bold uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg inline-block">{selectedOrder.status}</span>
                    </div>
                 </div>
                 <table className="w-full text-left text-sm mb-8">
                    <thead><tr><th className="p-2 border-b font-bold text-black">Item</th><th className="p-2 border-b text-right font-bold text-black">Total</th></tr></thead>
                    <tbody>
                       {selectedOrder.products?.map((p, i) => (
                          <tr key={i}>
                             <td className="p-3 border-b border-slate-50">
                                <div className="font-bold text-black text-base">{p.name} <span className="text-slate-400 text-xs">x{p.quantity}</span></div>
                                <div className="text-xs font-bold text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded mt-1">
                                   {p.licenseLabel || 'Standard License'}
                                </div>
                             </td>
                             <td className="p-3 border-b border-slate-50 text-right font-bold text-black text-base">${(p.price * p.quantity).toFixed(2)}</td>
                          </tr>
                       ))}
                    </tbody>
                    <tfoot>
                       <tr><td className="p-3 font-bold text-right text-lg text-black">Total</td><td className="p-3 font-extrabold text-right text-lg text-indigo-600">${selectedOrder.total.toFixed(2)}</td></tr>
                    </tfoot>
                 </table>
                 <div className="flex justify-end gap-3 print:hidden">
                    <button onClick={() => setSelectedOrder(null)} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-xl">Close</button>
                    <button onClick={() => window.print()} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl flex gap-2 items-center hover:bg-indigo-700"><Printer size={18}/> Print</button>
                 </div>
             </div>
          </div>
       )}

       {isAddingPage && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
             <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl">
                <h3 className="text-xl font-bold text-black mb-4">Edit Page</h3>
                <div className="space-y-4">
                   <input className="w-full border border-slate-200 p-3 rounded-xl text-black" placeholder="Page Title" value={pageForm.title || ''} onChange={e => setPageForm({...pageForm, title: e.target.value})} />
                   <textarea className="w-full border border-slate-200 p-3 rounded-xl font-mono text-sm text-black" placeholder="Content (HTML/Text)" rows={10} value={pageForm.content || ''} onChange={e => setPageForm({...pageForm, content: e.target.value})} />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                   <button onClick={() => setIsAddingPage(false)} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-xl">Cancel</button>
                   <button onClick={handleSavePage} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">Save</button>
                </div>
             </div>
          </div>
       )}

       {isAddingPost && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
             <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl">
                <h3 className="text-xl font-bold text-black mb-4">Edit Post</h3>
                <div className="space-y-4">
                   <input className="w-full border border-slate-200 p-3 rounded-xl text-black" placeholder="Title" value={postForm.title || ''} onChange={e => setPostForm({...postForm, title: e.target.value})} />
                   <input className="w-full border border-slate-200 p-3 rounded-xl text-black" placeholder="Category" value={postForm.category || ''} onChange={e => setPostForm({...postForm, category: e.target.value})} />
                   <input className="w-full border border-slate-200 p-3 rounded-xl text-black" placeholder="Image URL" value={postForm.image || ''} onChange={e => setPostForm({...postForm, image: e.target.value})} />
                   <textarea className="w-full border border-slate-200 p-3 rounded-xl text-black" placeholder="Excerpt" rows={2} value={postForm.excerpt || ''} onChange={e => setPostForm({...postForm, excerpt: e.target.value})} />
                   <textarea className="w-full border border-slate-200 p-3 rounded-xl text-black" placeholder="Content" rows={6} value={postForm.content || ''} onChange={e => setPostForm({...postForm, content: e.target.value})} />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                   <button onClick={() => setIsAddingPost(false)} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-xl">Cancel</button>
                   <button onClick={handleSavePost} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">Save</button>
                </div>
             </div>
          </div>
       )}

    </div>
  );
};
