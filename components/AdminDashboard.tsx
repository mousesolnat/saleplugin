
import React, { useState } from 'react';
import { 
  X, Plus, Trash2, Edit, Save, Search, Image as ImageIcon, 
  Settings, ShoppingBag, FileText, MessageSquare, Users, 
  BarChart2, Shield, Lock, AlertTriangle, CheckCircle,
  Layout, CreditCard, Globe, Share2, HelpCircle, LogOut, Package,
  Star, Filter, Check, Ban, ExternalLink, ChevronDown, Bot, Key
} from 'lucide-react';
import { Product, StoreSettings, Page, BlogPost, Order, SupportTicket, Review } from '../types';
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
  tickets, onUpdateTicket
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
             <SidebarItem active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={ShoppingBag} label="Orders" badgeCount={pendingOrdersCount} />
             <SidebarItem active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={Star} label="Reviews" badgeCount={pendingReviewsCount} />
             <SidebarItem active={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} icon={MessageSquare} label="Support" badgeCount={tickets.filter(t => t.status === 'open').length} />
             <SidebarItem active={activeTab === 'pages'} onClick={() => setActiveTab('pages')} icon={FileText} label="Pages" />
             <SidebarItem active={activeTab === 'blog'} onClick={() => setActiveTab('blog')} icon={Edit} label="Blog" />
             <SidebarItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="Settings" />
          </nav>
          <div className="p-4 border-t border-indigo-800">
             <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-2 px-4 py-3 text-indigo-300 hover:text-white hover:bg-indigo-800 rounded-xl transition-all font-medium mb-2">
                <Lock size={18} /> Lock Dashboard
             </button>
             <div className="text-center text-xs text-indigo-400">
                v2.4.0 • Logged in
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
                                 <td className="p-5 font-bold text-slate-900">${order.total}</td>
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

             {/* SUPPORT TICKETS TAB */}
             {activeTab === 'tickets' && (
               <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Support Tickets</h2>
                      <p className="text-slate-500">Manage customer inquiries</p>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                       <button onClick={() => setTicketFilter('all')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${ticketFilter === 'all' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>All</button>
                       <button onClick={() => setTicketFilter('open')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${ticketFilter === 'open' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Open</button>
                       <button onClick={() => setTicketFilter('closed')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${ticketFilter === 'closed' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Closed</button>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                     {filteredTickets.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">No tickets found.</div>
                     ) : (
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                             <tr>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">ID</th>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Subject</th>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Customer</th>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Priority</th>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Status</th>
                                <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {filteredTickets.map(ticket => (
                                <tr key={ticket.id} className="hover:bg-slate-50">
                                   <td className="p-5 font-bold text-indigo-600">{ticket.id}</td>
                                   <td className="p-5 text-sm font-medium text-slate-900">
                                      {ticket.subject}
                                      {ticket.image && <ImageIcon size={14} className="inline ml-2 text-slate-400" />}
                                   </td>
                                   <td className="p-5">
                                      <div className="text-sm font-bold text-slate-900">{ticket.customerName}</div>
                                      <div className="text-xs text-slate-400">{ticket.email}</div>
                                   </td>
                                   <td className="p-5">
                                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                         ticket.priority === 'high' ? 'bg-red-100 text-red-700' : 
                                         ticket.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 
                                         'bg-blue-100 text-blue-700'
                                      }`}>
                                         {ticket.priority}
                                      </span>
                                   </td>
                                   <td className="p-5">
                                      <button 
                                        onClick={() => onUpdateTicket({ ...ticket, status: ticket.status === 'open' ? 'closed' : 'open' })}
                                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                                           ticket.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                                        }`}
                                      >
                                        {ticket.status}
                                      </button>
                                   </td>
                                   <td className="p-5 text-right">
                                      {ticket.image && (
                                         <a href={ticket.image} target="_blank" rel="noopener noreferrer" className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg inline-block mr-2" title="View Attachment">
                                            <ImageIcon size={16} />
                                         </a>
                                      )}
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                     )}
                  </div>
               </div>
             )}

             {/* PAGES TAB */}
             {activeTab === 'pages' && (
                <div className="space-y-6 animate-fade-in">
                   <div className="flex justify-between items-center">
                      <div>
                         <h2 className="text-2xl font-bold text-slate-900">Pages</h2>
                         <p className="text-slate-500">Manage static pages</p>
                      </div>
                      <button onClick={() => { setPageForm({}); setIsAddingPage(true); }} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
                         <Plus size={18} /> Add Page
                      </button>
                   </div>
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <table className="w-full text-left">
                         <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                               <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Title</th>
                               <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Slug</th>
                               <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">Actions</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                            {pages.map(page => (
                               <tr key={page.id} className="hover:bg-slate-50">
                                  <td className="p-5 font-bold text-slate-900">{page.title}</td>
                                  <td className="p-5 text-slate-500 text-sm">/{page.slug}</td>
                                  <td className="p-5 text-right flex justify-end gap-2">
                                     <button onClick={() => { setPageForm(page); setIsAddingPage(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit size={16} /></button>
                                     <button onClick={() => onDeletePage(page.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
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
                      <div>
                         <h2 className="text-2xl font-bold text-slate-900">Blog Posts</h2>
                         <p className="text-slate-500">Manage blog articles</p>
                      </div>
                      <button onClick={() => { setPostForm({ author: 'Admin', date: new Date().toISOString().split('T')[0] }); setIsAddingPost(true); }} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
                         <Plus size={18} /> New Article
                      </button>
                   </div>
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <table className="w-full text-left">
                         <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                               <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Title</th>
                               <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Category</th>
                               <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">Date</th>
                               <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">Actions</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                            {blogPosts.map(post => (
                               <tr key={post.id} className="hover:bg-slate-50">
                                  <td className="p-5 font-bold text-slate-900">{post.title}</td>
                                  <td className="p-5 text-sm text-indigo-600 font-medium">{post.category}</td>
                                  <td className="p-5 text-slate-500 text-sm">{post.date}</td>
                                  <td className="p-5 text-right flex justify-end gap-2">
                                     <button onClick={() => { setPostForm(post); setIsAddingPost(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit size={16} /></button>
                                     <button onClick={() => onDeletePost(post.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
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
                <div className="space-y-8 animate-fade-in">
                   <div className="flex items-center justify-between">
                      <div>
                         <h2 className="text-2xl font-bold text-slate-900">Store Settings</h2>
                         <p className="text-slate-500">Configure your store preferences</p>
                      </div>
                   </div>
                   
                   <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-xl w-fit border border-slate-200">
                      {['general', 'design', 'payment', 'checkout', 'seo', 'footer', 'ai', 'security'].map(tab => (
                         <button
                            key={tab}
                            onClick={() => setSettingsSubTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${settingsSubTab === tab ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                         >
                            {tab}
                         </button>
                      ))}
                   </div>
                   
                   {/* Settings Sub-tabs */}
                   <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-4xl animate-fade-in space-y-6">
                       {settingsSubTab === 'general' && (
                          <>
                             <h3 className="text-lg font-bold text-slate-900">General Information</h3>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Store Name</label><input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white" value={tempSettings.storeName} onChange={e => setTempSettings({...tempSettings, storeName: e.target.value})} /></div>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Default Currency</label><select className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white" value={tempSettings.payment.currencyCode} onChange={e => setTempSettings({...tempSettings, payment: {...tempSettings.payment, currencyCode: e.target.value, currencySymbol: CURRENCIES.find(c => c.code === e.target.value)?.symbol || '$'}})}>{CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.symbol})</option>)}</select></div>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Support Email</label><input type="email" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white" value={tempSettings.supportEmail} onChange={e => setTempSettings({...tempSettings, supportEmail: e.target.value})} /></div>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Contact Address</label><input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white" value={tempSettings.contactAddress} onChange={e => setTempSettings({...tempSettings, contactAddress: e.target.value})} /></div>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Contact Phone</label><input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white" value={tempSettings.contactPhone} onChange={e => setTempSettings({...tempSettings, contactPhone: e.target.value})} /></div>
                          </>
                       )}

                       {settingsSubTab === 'design' && (
                          <>
                             <h3 className="text-lg font-bold text-slate-900">Design & Branding</h3>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Primary Color</label><div className="flex gap-2"><input type="color" className="h-10 w-20 rounded cursor-pointer" value={tempSettings.design.primaryColor} onChange={e => setTempSettings({...tempSettings, design: {...tempSettings.design, primaryColor: e.target.value}})} /><input type="text" className="w-full px-4 border border-slate-200 rounded-xl outline-none bg-white" value={tempSettings.design.primaryColor} onChange={e => setTempSettings({...tempSettings, design: {...tempSettings.design, primaryColor: e.target.value}})} /></div></div>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Hero Headline</label><input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white" value={tempSettings.design.heroHeadline} onChange={e => setTempSettings({...tempSettings, design: {...tempSettings.design, heroHeadline: e.target.value}})} /></div>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Hero Subheadline</label><textarea rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white resize-none" value={tempSettings.design.heroSubheadline} onChange={e => setTempSettings({...tempSettings, design: {...tempSettings.design, heroSubheadline: e.target.value}})} /></div>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Font Family</label><select className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white" value={tempSettings.design.fontFamily} onChange={e => setTempSettings({...tempSettings, design: {...tempSettings.design, fontFamily: e.target.value}})}><option value="Inter">Inter (Clean)</option><option value="Roboto">Roboto (Modern)</option><option value="Open Sans">Open Sans (Friendly)</option><option value="Lato">Lato (Balanced)</option><option value="Montserrat">Montserrat (Bold)</option></select></div>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Border Radius</label><select className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white" value={tempSettings.design.borderRadius} onChange={e => setTempSettings({...tempSettings, design: {...tempSettings.design, borderRadius: e.target.value}})}><option value="none">Square (0px)</option><option value="sm">Small (4px)</option><option value="md">Medium (8px)</option><option value="lg">Large (12px)</option><option value="xl">Extra Large (16px)</option><option value="2xl">2XL (24px)</option><option value="3xl">3XL (32px)</option></select></div>
                          </>
                       )}

                       {settingsSubTab === 'payment' && (
                          <>
                             <h3 className="text-lg font-bold text-slate-900">Payment Gateways</h3>
                             <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 mb-4"><div className="flex items-center justify-between mb-2"><span className="font-bold">Stripe</span><input type="checkbox" className="toggle" checked={tempSettings.payment.stripeEnabled} onChange={e => setTempSettings({...tempSettings, payment: {...tempSettings.payment, stripeEnabled: e.target.checked}})} /></div><input type="text" placeholder="Publishable Key" className="w-full mb-2 px-3 py-2 rounded border border-slate-300 bg-white" value={tempSettings.payment.stripePublishableKey} onChange={e => setTempSettings({...tempSettings, payment: {...tempSettings.payment, stripePublishableKey: e.target.value}})} /><input type="text" placeholder="Secret Key" className="w-full px-3 py-2 rounded border border-slate-300 bg-white" value={tempSettings.payment.stripeSecretKey} onChange={e => setTempSettings({...tempSettings, payment: {...tempSettings.payment, stripeSecretKey: e.target.value}})} /></div>
                             <div className="p-4 border border-slate-200 rounded-xl bg-slate-50"><div className="flex items-center justify-between mb-2"><span className="font-bold">PayPal</span><input type="checkbox" checked={tempSettings.payment.paypalEnabled} onChange={e => setTempSettings({...tempSettings, payment: {...tempSettings.payment, paypalEnabled: e.target.checked}})} /></div><input type="text" placeholder="Client ID" className="w-full mb-2 px-3 py-2 rounded border border-slate-300 bg-white" value={tempSettings.payment.paypalClientId} onChange={e => setTempSettings({...tempSettings, payment: {...tempSettings.payment, paypalClientId: e.target.value}})} /><input type="text" placeholder="Secret" className="w-full px-3 py-2 rounded border border-slate-300 bg-white" value={tempSettings.payment.paypalSecret} onChange={e => setTempSettings({...tempSettings, payment: {...tempSettings.payment, paypalSecret: e.target.value}})} /></div>
                          </>
                       )}
                       
                       {settingsSubTab === 'checkout' && (
                         <>
                             <h3 className="text-lg font-bold text-slate-900">Checkout &amp; Thank You Pages</h3>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Checkout Page Title</label><input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white" value={tempSettings.checkout.checkoutTitle} onChange={e => setTempSettings({...tempSettings, checkout: {...tempSettings.checkout, checkoutTitle: e.target.value}})} /></div>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Checkout Page Subtitle</label><textarea rows={2} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none resize-none bg-white" value={tempSettings.checkout.checkoutSubtitle} onChange={e => setTempSettings({...tempSettings, checkout: {...tempSettings.checkout, checkoutSubtitle: e.target.value}})} /></div>
                             <div className="pt-4 border-t border-slate-100"></div>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Thank You Page Title</label><input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white" value={tempSettings.checkout.thankYouTitle} onChange={e => setTempSettings({...tempSettings, checkout: {...tempSettings.checkout, thankYouTitle: e.target.value}})} /></div>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Thank You Page Message</label><textarea rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none resize-none bg-white" value={tempSettings.checkout.thankYouMessage} onChange={e => setTempSettings({...tempSettings, checkout: {...tempSettings.checkout, thankYouMessage: e.target.value}})} /></div>
                         </>
                       )}

                       {settingsSubTab === 'footer' && (
                          <>
                             <h3 className="text-lg font-bold text-slate-900">Footer Content</h3>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Footer Description</label><textarea rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none resize-none bg-white" value={tempSettings.footerDescription} onChange={e => setTempSettings({...tempSettings, footerDescription: e.target.value})} /></div>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Popular Categories (One per line)</label><textarea rows={5} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none resize-none bg-white" value={tempSettings.popularCategories?.join('\n')} onChange={e => setTempSettings({...tempSettings, popularCategories: e.target.value.split('\n')})} /></div>
                          </>
                       )}

                       {settingsSubTab === 'security' && (
                          <div className="space-y-6">
                             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                                   <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl border border-indigo-100">A</div>
                                      <div><h4 className="font-bold text-slate-900">Super Administrator</h4><span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">ROOT_ACCESS</span></div>
                                   </div>
                                   <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1"><CheckCircle size={14} /> Active</span>
                                </div>
                                <div><label className="block text-sm font-bold text-slate-700 mb-2">Admin Password</label><input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white font-mono outline-none focus:ring-2 focus:ring-indigo-500" value={tempSettings.adminPassword} onChange={e => setTempSettings({...tempSettings, adminPassword: e.target.value})} /></div>
                             </div>
                          </div>
                       )}

                       {settingsSubTab === 'ai' && (
                         <>
                             <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Bot size={20} /> AI Assistant Configuration</h3>
                             <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50 text-indigo-800 rounded-r-lg">
                               <p className="font-bold">Connect your AI Assistant</p>
                               <p className="text-sm">Enter your Gemini API key to enable the AI-powered product assistant. You can get a key from Google AI Studio.</p>
                             </div>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Gemini API Key</label><input type="password" placeholder="Enter your API key" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-mono" value={tempSettings.aiApiKey} onChange={e => setTempSettings({...tempSettings, aiApiKey: e.target.value})} /></div>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">AI System Instruction (Personality)</label><textarea rows={8} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none resize-none bg-white font-mono text-sm" placeholder="e.g., You are a helpful sales assistant for a digital store..." value={tempSettings.aiSystemInstruction} onChange={e => setTempSettings({...tempSettings, aiSystemInstruction: e.target.value})} /></div>
                         </>
                       )}

                       {settingsSubTab === 'seo' && (
                          <>
                             <h3 className="text-lg font-bold text-slate-900">SEO Configuration</h3>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Global Meta Title</label><input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white" value={tempSettings.seo.title} onChange={e => setTempSettings({...tempSettings, seo: {...tempSettings.seo, title: e.target.value}})} /></div>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Global Meta Description</label><textarea rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white" value={tempSettings.seo.description} onChange={e => setTempSettings({...tempSettings, seo: {...tempSettings.seo, description: e.target.value}})} /></div>
                             <div><label className="block text-sm font-bold text-slate-700 mb-2">Favicon URL</label><input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white" placeholder="https://..." value={tempSettings.faviconUrl || ''} onChange={e => setTempSettings({...tempSettings, faviconUrl: e.target.value})} /></div>
                             <div className="grid grid-cols-2 gap-4">
                               <div><label className="block text-sm font-bold text-slate-700 mb-2">Google Analytics ID</label><input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white" placeholder="G-XXXXXXXXXX" value={tempSettings.seo.googleAnalyticsId} onChange={e => setTempSettings({...tempSettings, seo: {...tempSettings.seo, googleAnalyticsId: e.target.value}})} /></div>
                               <div><label className="block text-sm font-bold text-slate-700 mb-2">Google Search Console</label><input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white" placeholder="content value" value={tempSettings.seo.googleSearchConsoleCode} onChange={e => setTempSettings({...tempSettings, seo: {...tempSettings.seo, googleSearchConsoleCode: e.target.value}})} /></div>
                               <div><label className="block text-sm font-bold text-slate-700 mb-2">Bing Webmaster</label><input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white" placeholder="content value" value={tempSettings.seo.bingWebmasterCode} onChange={e => setTempSettings({...tempSettings, seo: {...tempSettings.seo, bingWebmasterCode: e.target.value}})} /></div>
                             </div>
                          </>
                       )}
                   </div>

                   <div className="sticky bottom-4 flex justify-end">
                      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xl inline-flex">
                         <button onClick={handleSaveSettings} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all flex items-center gap-2"><Save size={18} /> Save Changes</button>
                      </div>
                   </div>
                </div>
             )}
          </div>
       </main>

       {/* Modal for Adding Product */}
       {isAddingProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
             <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-2xl font-bold text-slate-900">Add/Edit Product</h3>
                   <button onClick={() => setIsAddingProduct(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                   <div><label className="block text-sm font-bold text-slate-700 mb-1">Name</label><input type="text" className="w-full border border-slate-200 p-3 rounded-xl outline-none bg-white" value={productForm.name || ''} onChange={e => setProductForm({...productForm, name: e.target.value})} /></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-bold text-slate-700 mb-1">Price</label><input type="number" className="w-full border border-slate-200 p-3 rounded-xl outline-none bg-white" value={productForm.price || ''} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-1">Category</label><input type="text" className="w-full border border-slate-200 p-3 rounded-xl outline-none bg-white" value={productForm.category || ''} onChange={e => setProductForm({...productForm, category: e.target.value})} /></div>
                   </div>
                   <div><label className="block text-sm font-bold text-slate-700 mb-1">Image URL</label><input type="text" className="w-full border border-slate-200 p-3 rounded-xl outline-none bg-white" value={productForm.image || ''} onChange={e => setProductForm({...productForm, image: e.target.value})} /></div>
                   <div><label className="block text-sm font-bold text-slate-700 mb-1">Description</label><textarea rows={3} className="w-full border border-slate-200 p-3 rounded-xl outline-none resize-none bg-white" value={productForm.description || ''} onChange={e => setProductForm({...productForm, description: e.target.value})} /></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-bold text-slate-700 mb-1">SEO Title (Optional)</label><input type="text" className="w-full border border-slate-200 p-3 rounded-xl outline-none bg-white" value={productForm.seoTitle || ''} onChange={e => setProductForm({...productForm, seoTitle: e.target.value})} /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-1">Meta Description</label><input type="text" className="w-full border border-slate-200 p-3 rounded-xl outline-none bg-white" value={productForm.seoDescription || ''} onChange={e => setProductForm({...productForm, seoDescription: e.target.value})} /></div>
                   </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                   <button onClick={() => setIsAddingProduct(false)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl">Cancel</button>
                   <button onClick={() => { if (productForm.name && productForm.price) { if(productForm.id) onUpdate(productForm as Product); else onAdd({ ...productForm, id: `prod_${Date.now()}`, reviews: [] } as Product); setIsAddingProduct(false); }}} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl">Save Product</button>
                </div>
             </div>
          </div>
       )}
       
       {/* Modal for Adding Page */}
       {isAddingPage && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
             <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-2xl font-bold text-slate-900">Add/Edit Page</h3>
                   <button onClick={() => setIsAddingPage(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                   <div><label className="block text-sm font-bold text-slate-700 mb-1">Page Title</label><input type="text" className="w-full border border-slate-200 p-3 rounded-xl outline-none bg-white" value={pageForm.title || ''} onChange={e => setPageForm({...pageForm, title: e.target.value})} /></div>
                   <div><label className="block text-sm font-bold text-slate-700 mb-1">Slug (URL)</label><input type="text" className="w-full border border-slate-200 p-3 rounded-xl outline-none bg-white" value={pageForm.slug || ''} onChange={e => setPageForm({...pageForm, slug: e.target.value})} /></div>
                   <div className="flex-1"><label className="block text-sm font-bold text-slate-700 mb-1">Content (HTML Supported)</label><textarea className="w-full h-64 border border-slate-200 p-3 rounded-xl outline-none resize-none bg-white font-mono text-sm" value={pageForm.content || ''} onChange={e => setPageForm({...pageForm, content: e.target.value})} /></div>
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                   <button onClick={() => setIsAddingPage(false)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl">Cancel</button>
                   <button onClick={() => { if (pageForm.title) { if(pageForm.id) onUpdatePage(pageForm as Page); else onAddPage({ ...pageForm, id: `page_${Date.now()}` } as Page); setIsAddingPage(false); }}} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl">Save Page</button>
                </div>
             </div>
          </div>
       )}

       {/* Modal for Adding Post */}
       {isAddingPost && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
             <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-2xl font-bold text-slate-900">Add/Edit Article</h3>
                   <button onClick={() => setIsAddingPost(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                   <div><label className="block text-sm font-bold text-slate-700 mb-1">Title</label><input type="text" className="w-full border border-slate-200 p-3 rounded-xl outline-none bg-white" value={postForm.title || ''} onChange={e => setPostForm({...postForm, title: e.target.value})} /></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-bold text-slate-700 mb-1">Category</label><input type="text" className="w-full border border-slate-200 p-3 rounded-xl outline-none bg-white" value={postForm.category || ''} onChange={e => setPostForm({...postForm, category: e.target.value})} /></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-1">Date</label><input type="date" className="w-full border border-slate-200 p-3 rounded-xl outline-none bg-white" value={postForm.date || ''} onChange={e => setPostForm({...postForm, date: e.target.value})} /></div>
                   </div>
                   <div><label className="block text-sm font-bold text-slate-700 mb-1">Image URL</label><input type="text" className="w-full border border-slate-200 p-3 rounded-xl outline-none bg-white" value={postForm.image || ''} onChange={e => setPostForm({...postForm, image: e.target.value})} /></div>
                   <div><label className="block text-sm font-bold text-slate-700 mb-1">Excerpt</label><textarea rows={2} className="w-full border border-slate-200 p-3 rounded-xl outline-none resize-none bg-white" value={postForm.excerpt || ''} onChange={e => setPostForm({...postForm, excerpt: e.target.value})} /></div>
                   <div className="flex-1"><label className="block text-sm font-bold text-slate-700 mb-1">Content</label><textarea className="w-full h-48 border border-slate-200 p-3 rounded-xl outline-none resize-none bg-white" value={postForm.content || ''} onChange={e => setPostForm({...postForm, content: e.target.value})} /></div>
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                   <button onClick={() => setIsAddingPost(false)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl">Cancel</button>
                   <button onClick={() => { if (postForm.title) { if(postForm.id) onUpdatePost(postForm as BlogPost); else onAddPost({ ...postForm, id: `post_${Date.now()}` } as BlogPost); setIsAddingPost(false); }}} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl">Save Article</button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};
