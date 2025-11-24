import React, { useState } from 'react';
import { 
  X, Plus, Trash2, Edit, Save, Search, Image as ImageIcon, 
  Settings, ShoppingBag, FileText, MessageSquare, Users, 
  BarChart2, Shield, Lock, AlertTriangle, CheckCircle,
  Layout, CreditCard, Globe, Share2, HelpCircle, LogOut, Package
} from 'lucide-react';
import { Product, StoreSettings, Page, BlogPost, Order, SupportTicket } from '../types';

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

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products, onAdd, onUpdate, onDelete, onClose,
  storeSettings, onUpdateSettings,
  pages, onAddPage, onUpdatePage, onDeletePage,
  blogPosts, onAddPost, onUpdatePost, onDeletePost,
  orders, onUpdateOrder,
  tickets, onUpdateTicket
}) => {
  const [activeTab, setActiveTab] = useState('products');
  const [settingsSubTab, setSettingsSubTab] = useState('general');
  const [tempSettings, setTempSettings] = useState<StoreSettings>(storeSettings);

  // Simple state for forms
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({});

  const handleSaveSettings = () => {
    onUpdateSettings(tempSettings);
    // In a real app, show a toast or notification
    alert('Settings saved successfully!');
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900">
       {/* Sidebar */}
       <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 transition-all">
          <div className="p-6 flex items-center justify-between border-b border-slate-800">
             <div className="font-bold text-xl flex items-center gap-2">
               <Shield size={24} className="text-indigo-500" /> Admin
             </div>
             <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
          </div>
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
             <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'products' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Package size={20} /> Products
             </button>
             <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <ShoppingBag size={20} /> Orders
             </button>
             <button onClick={() => setActiveTab('tickets')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'tickets' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <MessageSquare size={20} /> Support
             </button>
             <button onClick={() => setActiveTab('pages')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'pages' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <FileText size={20} /> Pages
             </button>
             <button onClick={() => setActiveTab('blog')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'blog' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Edit size={20} /> Blog
             </button>
             <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Settings size={20} /> Settings
             </button>
          </nav>
          <div className="p-4 border-t border-slate-800">
             <button onClick={onClose} className="w-full flex items-center gap-2 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-all font-medium">
                <LogOut size={18} /> Exit Dashboard
             </button>
          </div>
       </aside>

       <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto">
             {/* Dynamic Content based on activeTab */}
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
                                      <div className="font-bold text-slate-900">{p.name}</div>
                                      <div className="text-xs text-slate-400">{p.id}</div>
                                   </td>
                                   <td className="p-5 text-slate-600 font-medium">${p.price}</td>
                                   <td className="p-5">
                                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{p.category}</span>
                                   </td>
                                   <td className="p-5 text-right flex justify-end gap-2">
                                      <button onClick={() => onDelete(p.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                                         <Trash2 size={16} />
                                      </button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
             )}

             {activeTab === 'settings' && (
                <div className="space-y-8 animate-fade-in">
                   <div className="flex items-center justify-between">
                      <div>
                         <h2 className="text-2xl font-bold text-slate-900">Store Settings</h2>
                         <p className="text-slate-500">Configure your store preferences</p>
                      </div>
                   </div>
                   
                   <div className="flex space-x-1 bg-slate-100 p-1.5 rounded-xl w-fit border border-slate-200">
                      {['general', 'design', 'payment', 'security'].map(tab => (
                         <button
                            key={tab}
                            onClick={() => setSettingsSubTab(tab)}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${settingsSubTab === tab ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                         >
                            {tab}
                         </button>
                      ))}
                   </div>
                   
                   {/* Security Tab */}
                   {settingsSubTab === 'security' && (
                      <div className="space-y-6 max-w-2xl animate-fade-in">
                         <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-2xl border border-indigo-100">
                                     A
                                  </div>
                                  <div>
                                     <h4 className="font-bold text-slate-900 text-lg">Super Administrator</h4>
                                     <p className="text-slate-500 text-sm mt-0.5">Role: <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">ROOT_ACCESS</span></p>
                                  </div>
                               </div>
                               <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 border border-emerald-200">
                                  <CheckCircle size={14} strokeWidth={2.5} /> Active
                               </span>
                            </div>

                            <div className="space-y-6">
                               <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-2">Admin Access Password</label>
                                  <div className="relative group">
                                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                     <input 
                                        type="text" 
                                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all shadow-sm" 
                                        value={tempSettings.adminPassword || 'admin'} 
                                        onChange={e => setTempSettings({...tempSettings, adminPassword: e.target.value})} 
                                     />
                                  </div>
                                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                                     <AlertTriangle size={14} className="text-amber-500" /> This password provides full access to the dashboard. Please use a strong password.
                                  </p>
                               </div>
                            </div>
                         </div>
                         
                         <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 text-blue-700 text-sm">
                            <Shield className="shrink-0" size={20} />
                            <p>Currently, the system supports a single Super Admin role. Future updates will include multi-user role management (Editors, Support Agents, etc.).</p>
                         </div>
                      </div>
                   )}
                   
                   {/* General Tab */}
                   {settingsSubTab === 'general' && (
                      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl animate-fade-in space-y-6">
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Store Name</label>
                            <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={tempSettings.storeName} onChange={e => setTempSettings({...tempSettings, storeName: e.target.value})} />
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Support Email</label>
                            <input type="email" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={tempSettings.supportEmail} onChange={e => setTempSettings({...tempSettings, supportEmail: e.target.value})} />
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Footer Description</label>
                            <textarea rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" value={tempSettings.footerDescription} onChange={e => setTempSettings({...tempSettings, footerDescription: e.target.value})} />
                         </div>
                      </div>
                   )}

                   <div className="sticky bottom-4 flex justify-end">
                      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xl inline-flex">
                         <button onClick={handleSaveSettings} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all flex items-center gap-2"><Save size={18} /> Save Changes</button>
                      </div>
                   </div>
                </div>
             )}

             {/* Placeholder for other tabs */}
             {(activeTab !== 'products' && activeTab !== 'settings') && (
                 <div className="flex flex-col items-center justify-center h-96 text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed animate-fade-in">
                     <div className="p-4 bg-slate-50 rounded-full mb-4">
                        <Layout size={32} className="text-slate-300" />
                     </div>
                     <h3 className="text-lg font-bold text-slate-900">Coming Soon</h3>
                     <p>Management for {activeTab} is under development.</p>
                 </div>
             )}
          </div>
       </main>

       {/* Modal for Adding Product */}
       {isAddingProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
             <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-2xl font-bold text-slate-900">Add New Product</h3>
                   <button onClick={() => setIsAddingProduct(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Product Name</label>
                      <input type="text" className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={productForm.name || ''} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Price</label>
                         <input type="number" className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={productForm.price || ''} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                         <input type="text" className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={productForm.category || ''} onChange={e => setProductForm({...productForm, category: e.target.value})} />
                      </div>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Image URL</label>
                      <input type="text" className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={productForm.image || ''} onChange={e => setProductForm({...productForm, image: e.target.value})} />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                      <textarea rows={3} className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" value={productForm.description || ''} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                   </div>
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                   <button onClick={() => setIsAddingProduct(false)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                   <button onClick={() => {
                      if (productForm.name && productForm.price) {
                         onAdd({ ...productForm, id: `prod_${Date.now()}`, reviews: [] } as Product);
                         setIsAddingProduct(false);
                      }
                   }} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-colors">Add Product</button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};
