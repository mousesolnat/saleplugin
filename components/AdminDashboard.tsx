
import React, { useState, useRef } from 'react';
import { 
  X, Plus, Trash2, Edit, Save, Search, Image as ImageIcon, 
  Settings, ShoppingBag, FileText, MessageSquare, Users, 
  BarChart2, Shield, Lock, AlertTriangle, CheckCircle,
  Layout, CreditCard, Globe, Share2, HelpCircle, LogOut, Package,
  Star, Filter, Check, Ban, ExternalLink, ChevronDown, Key,
  LayoutList, FolderTree, Eye, Upload
} from 'lucide-react';
import { Product, StoreSettings, Page, BlogPost, Order, SupportTicket, Review, CategoryData } from '../types';
import { CURRENCIES } from '../constants';

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
  users?: any[];
  onDeleteUser?: (id: string) => void;
  onReplyTicket?: (id: string, message: string, sender: 'admin' | 'customer') => void;
  categories: CategoryData[];
  onAddCategory: (cat: CategoryData) => void;
  onUpdateCategory: (cat: CategoryData) => void;
  onDeleteCategory: (id: string) => void;
}

// Sidebar Item Component for cleaner code
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
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
        : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={20} />
      <span>{label}</span>
    </div>
    {badgeCount !== undefined && badgeCount > 0 && (
      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
        {badgeCount}
      </span>
    )}
  </button>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products, onAdd, onUpdate, onDelete, onClose,
  storeSettings, onUpdateSettings,
  pages, onAddPage, onUpdatePage, onDeletePage,
  blogPosts, onAddPost, onUpdatePost, onDeletePost,
  orders, onUpdateOrder,
  tickets, onUpdateTicket,
  users = [], onDeleteUser, onReplyTicket,
  categories, onAddCategory, onUpdateCategory, onDeleteCategory
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('products');
  const [settingsSubTab, setSettingsSubTab] = useState('general');
  const [tempSettings, setTempSettings] = useState<StoreSettings>(storeSettings);
  const [ticketFilter, setTicketFilter] = useState<'all' | 'open' | 'closed'>('all');

  // Simple state for forms
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({});
  
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [pageForm, setPageForm] = useState<Partial<Page>>({});

  const [isAddingPost, setIsAddingPost] = useState(false);
  const [postForm, setPostForm] = useState<Partial<BlogPost>>({});

  // Category Management State
  const [isManagingCategory, setIsManagingCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState<Partial<CategoryData>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ticket Reply State
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Order Details State
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  
  // Calculate pending reviews across all products
  const allReviews = products.flatMap(p => (p.reviews || []).map(r => ({ ...r, productName: p.name, productId: p.id })));
  const pendingReviewsCount = allReviews.filter(r => r.status === 'pending').length;

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryForm(prev => ({ ...prev, icon: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name) return;
    
    // Slugify name
    const slug = categoryForm.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    if (categoryForm.id) {
        // Update
        onUpdateCategory({ ...categoryForm, slug } as CategoryData);
    } else {
        // Create
        onAddCategory({ ...categoryForm, id: `cat_${Date.now()}`, slug } as CategoryData);
    }
    
    setIsManagingCategory(false);
    setCategoryForm({});
  };

  const handleSendReply = () => {
    if (!selectedTicket || !replyMessage.trim()) return;
    if (onReplyTicket) {
      onReplyTicket(selectedTicket.id, replyMessage, 'admin');
      // Update local state to show reply immediately in modal if we wanted, but closing is easier
      setSelectedTicket(null);
      setReplyMessage('');
    }
  };

  const filteredTickets = tickets.filter(t => {
     if (ticketFilter === 'all') return true;
     return t.status === ticketFilter;
  });

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-indigo-600 p-8 text-center">
             <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Shield size={32} className="text-white" />
             </div>
             <h2 className="text-2xl font-bold text-white">Admin Access</h2>
             <p className="text-indigo-100 mt-2">Please verify your identity to continue.</p>
          </div>
          <div className="p-8">
             <form onSubmit={handleLogin} className="space-y-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                   <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="password" 
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        placeholder="Enter admin password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        autoFocus
                      />
                   </div>
                </div>
                {loginError && (
                   <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-sm font-medium">
                      <AlertTriangle size={16} /> {loginError}
                   </div>
                )}
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                   <Key size={18} /> Access Dashboard
                </button>
             </form>
             <button onClick={onClose} className="w-full mt-4 text-slate-500 hover:text-slate-700 text-sm font-medium">
                Return to Store
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white font-sans text-slate-900">
       {/* Sidebar */}
       <aside className="w-64 bg-indigo-900 text-white flex flex-col shrink-0 transition-all">
          <div className="p-6 flex items-center justify-between border-b border-indigo-800">
             <div className="font-bold text-xl flex items-center gap-2">
               <div className="bg-white p-1.5 rounded-lg">
                 <Shield size={20} className="text-indigo-900" />
               </div>
               Admin
             </div>
             {/* Return to website */}
             <button onClick={onClose} className="text-indigo-300 hover:text-white transition-colors" title="Return to Store"><LogOut size={20} /></button>
          </div>
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
             <SidebarItem active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={Package} label="Products" />
             <SidebarItem active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} icon={LayoutList} label="Categories" />
             <SidebarItem active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={ShoppingBag} label="Orders" badgeCount={pendingOrdersCount} />
             <SidebarItem active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={Star} label="Reviews" badgeCount={pendingReviewsCount} />
             <SidebarItem active={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} icon={MessageSquare} label="Support" badgeCount={tickets.filter(t => t.status === 'open').length} />
             <SidebarItem active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} icon={Users} label="Customers" />
             <SidebarItem active={activeTab === 'pages'} onClick={() => setActiveTab('pages')} icon={FileText} label="Pages" />
             <SidebarItem active={activeTab === 'blog'} onClick={() => setActiveTab('blog')} icon={Edit} label="Blog" />
             <SidebarItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="Settings" />
          </nav>
          <div className="p-4 border-t border-indigo-800">
             <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-2 px-4 py-3 text-indigo-300 hover:text-white hover:bg-indigo-800 rounded-xl transition-all font-medium mb-2">
                <Lock size={18} /> Lock Dashboard
             </button>
             <div className="text-center text-xs text-indigo-400">
                v2.5.0 • Logged in
             </div>
          </div>
       </aside>

       <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-8 max-w-7xl mx-auto">
             
             {/* PRODUCTS TAB */}
             {activeTab === 'products' && (
                 <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                       <div>
                          <h2 className="text-2xl font-bold text-slate-900">Products</h2>
                          <p className="text-slate-500">Manage your product inventory</p>
                       </div>
                       <button onClick={() => { setProductForm({}); setIsAddingProduct(true); }} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
                          <Plus size={18} /> Add Product
                       </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                             <tr>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Product Name</th>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Price</th>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Category</th>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {products.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                   <td className="p-5">
                                      <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                            {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : null}
                                         </div>
                                         <div>
                                            <div className="font-bold text-slate-900">{p.name}</div>
                                            <div className="text-xs text-slate-400">{p.id}</div>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="p-5 text-slate-600 font-medium">${p.price}</td>
                                   <td className="p-5">
                                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{p.category}</span>
                                   </td>
                                   <td className="p-5 text-right flex justify-end gap-2">
                                      <button onClick={() => { setProductForm(p); setIsAddingProduct(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit size={16} /></button>
                                      <button onClick={() => onDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
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
                       <div>
                          <h2 className="text-2xl font-bold text-slate-900">Category Manager</h2>
                          <p className="text-slate-500">Create, rename, and manage product categories</p>
                       </div>
                       <button onClick={() => { setCategoryForm({}); setIsManagingCategory(true); }} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
                          <Plus size={18} /> New Category
                       </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                             <tr>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Icon</th>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Category Name</th>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Products Count</th>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {categories.map(cat => {
                                const count = products.filter(p => p.category === cat.name).length;
                                return (
                                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                                     <td className="p-5">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 overflow-hidden border border-indigo-100">
                                            {cat.icon ? <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover" /> : <LayoutList size={20} />}
                                        </div>
                                     </td>
                                     <td className="p-5 font-bold text-slate-900">{cat.name}</td>
                                     <td className="p-5">
                                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">{count} Products</span>
                                     </td>
                                     <td className="p-5 text-right flex justify-end gap-2">
                                        <button onClick={() => { setCategoryForm(cat); setIsManagingCategory(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit"><Edit size={16} /></button>
                                        <button onClick={() => onDeleteCategory(cat.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                                     </td>
                                  </tr>
                                );
                             })}
                          </tbody>
                       </table>
                    </div>
                 </div>
             )}

             {/* ORDERS TAB */}
             {activeTab === 'orders' && (
               <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Orders</h2>
                    <p className="text-slate-500">Manage customer orders and status</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                     <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                           <tr>
                              <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Order ID</th>
                              <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Customer</th>
                              <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Date</th>
                              <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Total</th>
                              <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Status</th>
                              <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {orders.map(order => (
                              <tr key={order.id} className="hover:bg-slate-50">
                                 <td className="p-5 font-bold text-indigo-600">{order.id}</td>
                                 <td className="p-5">
                                    <div className="font-bold text-slate-900">{order.customer}</div>
                                    <div className="text-xs text-slate-400">{order.email}</div>
                                 </td>
                                 <td className="p-5 text-slate-600 text-sm">{order.date}</td>
                                 <td className="p-5 font-bold text-slate-900">${order.total.toFixed(2)}</td>
                                 <td className="p-5">
                                    <select 
                                      value={order.status} 
                                      onChange={(e) => onUpdateOrder({ ...order, status: e.target.value as any })}
                                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                                        order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                        order.status === 'cancelled' ? 'bg-slate-100 text-slate-600' :
                                        order.status === 'refunded' ? 'bg-red-100 text-red-700' :
                                        'bg-amber-100 text-amber-700'
                                      }`}
                                    >
                                       <option value="pending">Pending</option>
                                       <option value="processing">Processing</option>
                                       <option value="completed">Completed</option>
                                       <option value="on-hold">On Hold</option>
                                       <option value="cancelled">Cancelled</option>
                                       <option value="refunded">Refunded</option>
                                    </select>
                                 </td>
                                 <td className="p-5 text-right">
                                    <button 
                                      onClick={() => setViewingOrder(order)} 
                                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                      title="View Details"
                                    >
                                       <Eye size={18} />
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
             )}

             {/* REVIEWS TAB */}
             {activeTab === 'reviews' && (
               <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Reviews Moderation</h2>
                    <p className="text-slate-500">Approve or reject customer reviews</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                     {allReviews.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">No reviews found.</div>
                     ) : (
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                             <tr>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Product</th>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Reviewer</th>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Rating</th>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Comment</th>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Status</th>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {allReviews.map(review => (
                                <tr key={review.id} className="hover:bg-slate-50">
                                   <td className="p-5 text-sm font-bold text-indigo-600 max-w-xs truncate">{review.productName}</td>
                                   <td className="p-5 text-sm font-medium text-slate-900">{review.customerName}</td>
                                   <td className="p-5 text-sm font-bold text-amber-500 flex items-center gap-1">
                                      <Star size={14} fill="currentColor" /> {review.rating}
                                   </td>
                                   <td className="p-5 text-sm text-slate-600 max-w-sm truncate">{review.comment}</td>
                                   <td className="p-5">
                                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                          review.status === 'approved' ? 'bg-green-100 text-green-700' :
                                          review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                          'bg-amber-100 text-amber-700'
                                      }`}>
                                        {review.status || 'approved'}
                                      </span>
                                   </td>
                                   <td className="p-5 text-right flex justify-end gap-2">
                                      {review.status !== 'approved' && (
                                        <button onClick={() => handleUpdateReviewStatus(review.productId, review.id, 'approved')} title="Approve" className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Check size={16} /></button>
                                      )}
                                      {review.status !== 'rejected' && (
                                        <button onClick={() => handleUpdateReviewStatus(review.productId, review.id, 'rejected')} title="Reject" className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"><Ban size={16} /></button>
                                      )}
                                      <button onClick={() => handleDeleteReview(review.productId, review.id)} title="Delete" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                     )}
                  </div>
               </div>
             )}

             {/* ... rest of the tabs ... */}
          </div>
       </main>

       {/* CATEGORY MODAL */}
       {isManagingCategory && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
             <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-2xl font-bold text-slate-900">{categoryForm.id ? 'Edit Category' : 'New Category'}</h3>
                   <button onClick={() => setIsManagingCategory(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                   <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1">Category Name</label>
                       <input 
                          type="text" 
                          className="w-full border border-slate-200 p-3 rounded-xl outline-none bg-white focus:ring-2 focus:ring-indigo-500" 
                          value={categoryForm.name || ''} 
                          onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} 
                          placeholder="e.g. Analytics Tools"
                          autoFocus
                       />
                   </div>
                   
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Category Icon</label>
                      <div className="flex items-center gap-4">
                         <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                             {categoryForm.icon ? (
                                <img src={categoryForm.icon} alt="Preview" className="w-full h-full object-cover" />
                             ) : (
                                <ImageIcon className="text-slate-400" />
                             )}
                         </div>
                         <div className="flex-1">
                            <input 
                               type="file" 
                               ref={fileInputRef}
                               className="hidden" 
                               accept="image/*"
                               onChange={handleImageUpload}
                            />
                            <div className="flex gap-2">
                                <button 
                                   onClick={() => fileInputRef.current?.click()}
                                   className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2"
                                >
                                   <Upload size={16} /> Upload
                                </button>
                                {categoryForm.icon && (
                                   <button 
                                      onClick={() => setCategoryForm(prev => ({ ...prev, icon: undefined }))}
                                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
                                   >
                                      Remove
                                   </button>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Recommended: 200x200px PNG or JPG.</p>
                         </div>
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Icon URL (Alternative)</label>
                      <input 
                          type="text" 
                          className="w-full border border-slate-200 p-3 rounded-xl outline-none bg-white focus:ring-2 focus:ring-indigo-500 text-sm" 
                          value={categoryForm.icon || ''} 
                          onChange={e => setCategoryForm({...categoryForm, icon: e.target.value})} 
                          placeholder="https://..."
                       />
                   </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                   <button onClick={() => setIsManagingCategory(false)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl">Cancel</button>
                   <button onClick={handleSaveCategory} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl">Save</button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};
