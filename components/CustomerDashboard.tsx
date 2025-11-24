
import React, { useState } from 'react';
import { Customer, Order } from '../types';
import { User, Package, LogOut, ShoppingBag, MapPin, CreditCard, Settings, Download, Save, Lock, Mail } from 'lucide-react';

interface CustomerDashboardProps {
  customer: Customer;
  onLogout: () => void;
  currencySymbol?: string;
  onUpdateProfile?: (data: Partial<Customer>) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ customer, onLogout, currencySymbol = '$', onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'details'>('orders');

  // Form State
  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Mock orders for demo if none passed (in real app, these would come from props/state)
  const mockOrders: Order[] = [
    { id: '#ORD-9921', customer: customer.name, email: customer.email, total: 45, status: 'completed', date: '2024-03-15', items: 2 },
    { id: '#ORD-9925', customer: customer.name, email: customer.email, total: 20, status: 'processing', date: '2024-03-10', items: 1 }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'completed': return 'bg-green-100 text-green-700';
        case 'processing': return 'bg-blue-100 text-blue-700';
        case 'pending': return 'bg-amber-100 text-amber-700';
        case 'on-hold': return 'bg-orange-100 text-orange-700';
        case 'cancelled': return 'bg-slate-100 text-slate-700';
        case 'refunded': return 'bg-red-100 text-red-700';
        default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
      e.preventDefault();
      setMessage(null);
      setIsSaving(true);

      // Basic validation
      if (!formData.name || !formData.email) {
          setMessage({ type: 'error', text: 'Name and Email are required.' });
          setIsSaving(false);
          return;
      }

      if (formData.newPassword) {
          if (formData.newPassword !== formData.confirmPassword) {
              setMessage({ type: 'error', text: 'New passwords do not match.' });
              setIsSaving(false);
              return;
          }
          if (formData.newPassword.length < 6) {
              setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
              setIsSaving(false);
              return;
          }
      }

      setTimeout(() => {
          if (onUpdateProfile) {
             const updates: Partial<Customer> = {
                 name: formData.name,
                 email: formData.email
             };
             if (formData.newPassword) {
                 updates.password = formData.newPassword;
             }
             onUpdateProfile(updates);
             setMessage({ type: 'success', text: 'Profile updated successfully.' });
             setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
          }
          setIsSaving(false);
      }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up px-4 sm:px-6">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Account</h1>
          <p className="text-slate-500 mt-1">Manage your orders and account details</p>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors font-medium"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold border-4 border-white shadow-sm">
                {customer.name.charAt(0)}
              </div>
              <h2 className="font-bold text-slate-900 text-lg">{customer.name}</h2>
              <p className="text-slate-500 text-sm mb-4">{customer.email}</p>
              <div className="text-xs bg-slate-100 rounded-full py-1 px-3 inline-block font-medium text-slate-600">
                Member since {new Date(customer.joinDate).toLocaleDateString()}
              </div>
           </div>

           <nav className="space-y-2">
             <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}
             >
               <Package size={20} /> Orders & Downloads
             </button>
             <button 
                onClick={() => setActiveTab('details')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'details' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}
             >
               <Settings size={20} /> Account Details
             </button>
           </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
           
           {/* ORDERS VIEW */}
           {activeTab === 'orders' && (
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <ShoppingBag size={20} className="text-indigo-600"/> Recent Orders
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Order</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Total</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockOrders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50">
                          <td className="p-4 font-bold text-indigo-600">{order.id}</td>
                          <td className="p-4 text-sm text-slate-600">{order.date}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-slate-900">{currencySymbol}{order.total}.00</td>
                          <td className="p-4 text-right">
                            <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center justify-end gap-1 ml-auto">
                              <Download size={16} /> Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
           )}

           {/* ACCOUNT DETAILS VIEW */}
           {activeTab === 'details' && (
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm animate-fade-in">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <User size={20} className="text-indigo-600"/> Account Details
                  </h3>
                </div>
                
                <div className="p-8">
                   {message && (
                       <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                           {message.text}
                       </div>
                   )}

                   <form onSubmit={handleSaveProfile} className="space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                               <label className="text-sm font-bold text-slate-700">Full Name</label>
                               <div className="relative">
                                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                   <input 
                                      type="text" 
                                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" 
                                      value={formData.name} 
                                      onChange={e => setFormData({...formData, name: e.target.value})}
                                   />
                               </div>
                           </div>
                           <div className="space-y-2">
                               <label className="text-sm font-bold text-slate-700">Email Address</label>
                               <div className="relative">
                                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                   <input 
                                      type="email" 
                                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" 
                                      value={formData.email} 
                                      onChange={e => setFormData({...formData, email: e.target.value})}
                                   />
                               </div>
                           </div>
                       </div>

                       <div className="pt-6 border-t border-slate-100">
                           <h4 className="font-bold text-slate-900 mb-6">Password Change</h4>
                           <div className="space-y-4 max-w-md">
                               <div className="space-y-2">
                                   <label className="text-sm font-bold text-slate-700">Current Password (leave blank to keep unchanged)</label>
                                   <div className="relative">
                                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                       <input 
                                          type="password" 
                                          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" 
                                          value={formData.currentPassword}
                                          onChange={e => setFormData({...formData, currentPassword: e.target.value})}
                                       />
                                   </div>
                               </div>
                               <div className="space-y-2">
                                   <label className="text-sm font-bold text-slate-700">New Password</label>
                                   <div className="relative">
                                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                       <input 
                                          type="password" 
                                          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" 
                                          value={formData.newPassword}
                                          onChange={e => setFormData({...formData, newPassword: e.target.value})}
                                       />
                                   </div>
                               </div>
                               <div className="space-y-2">
                                   <label className="text-sm font-bold text-slate-700">Confirm New Password</label>
                                   <div className="relative">
                                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                       <input 
                                          type="password" 
                                          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" 
                                          value={formData.confirmPassword}
                                          onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                       />
                                   </div>
                               </div>
                           </div>
                       </div>

                       <div className="pt-4">
                           <button 
                              type="submit" 
                              disabled={isSaving}
                              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                           >
                              {isSaving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                           </button>
                       </div>
                   </form>
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};
