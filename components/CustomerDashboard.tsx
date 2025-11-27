
import React, { useState } from 'react';
import { Customer, Order, SupportTicket } from '../types';
import { User, Package, LogOut, ShoppingBag, MapPin, CreditCard, Settings, Download, Save, Lock, Mail, MessageCircle, Plus, Send, Image as ImageIcon } from 'lucide-react';

interface CustomerDashboardProps {
  customer: Customer;
  onLogout: () => void;
  currencySymbol?: string;
  onUpdateProfile?: (data: Partial<Customer>) => void;
  tickets?: SupportTicket[];
  onOpenTicket?: (ticket: Omit<SupportTicket, 'id' | 'date' | 'status'>) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ customer, onLogout, currencySymbol = '$', onUpdateProfile, tickets = [], onOpenTicket }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'details' | 'tickets'>('orders');

  // Form State
  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Ticket Form State
  const [ticketForm, setTicketForm] = useState({ subject: '', message: '', priority: 'medium' as 'low' | 'medium' | 'high', image: '' });
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [resendStatus, setResendStatus] = useState('');

  // Filter tickets for current customer
  const myTickets = tickets.filter(t => t.customerId === customer.id);

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

  const handleResendVerification = () => {
     setResendStatus('Sending...');
     setTimeout(() => {
        setResendStatus('Email sent!');
        setTimeout(() => setResendStatus(''), 3000);
     }, 1500);
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

  const handleSubmitTicket = (e: React.FormEvent) => {
      e.preventDefault();
      if (!ticketForm.subject || !ticketForm.message) return;
      
      setIsSubmittingTicket(true);
      setTimeout(() => {
          if (onOpenTicket) {
              onOpenTicket({
                  customerId: customer.id,
                  customerName: customer.name,
                  email: customer.email,
                  subject: ticketForm.subject,
                  message: ticketForm.message,
                  priority: ticketForm.priority,
                  image: ticketForm.image
              });
              setTicketForm({ subject: '', message: '', priority: 'medium', image: '' });
              setMessage({ type: 'success', text: 'Ticket opened successfully!' });
          }
          setIsSubmittingTicket(false);
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

      {/* Verification Banner */}
      {customer.isVerified === false && (
         <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-amber-100 text-amber-700 rounded-lg"><Mail size={20}/></div>
               <div>
                  <h4 className="font-bold text-slate-900 text-sm">Verify your email address</h4>
                  <p className="text-slate-500 text-xs">Please check your inbox at <span className="font-semibold">{customer.email}</span> to verify your account.</p>
               </div>
            </div>
            <button 
               onClick={handleResendVerification}
               className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white px-3 py-2 rounded-lg border border-indigo-100 shadow-sm transition-all"
            >
               {resendStatus || 'Resend Email'}
            </button>
         </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold border-4 border-white shadow-sm">
                {customer.name.charAt(0)}
              </div>
              <h2 className="font-bold text-slate-900 text-lg">{customer.name}</h2>
              <p className="text-slate-500 text-sm mb-4">{customer.email}</p>
              {customer.isVerified && (
                 <div className="text-xs bg-green-100 text-green-700 rounded-full py-1 px-3 inline-block font-bold mb-2">Verified Account</div>
              )}
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
                onClick={() => setActiveTab('tickets')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'tickets' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}
             >
               <MessageCircle size={20} /> Support Tickets
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

           {/* TICKETS VIEW */}
           {activeTab === 'tickets' && (
              <div className="space-y-8 animate-fade-in">
                 {/* Create Ticket */}
                 <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-lg">
                       <Plus className="bg-indigo-100 text-indigo-600 p-1 rounded-full" size={24} /> Open New Ticket
                    </div>
                    {message && message.type === 'success' && (
                        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm font-bold rounded-lg border border-green-100">
                            {message.text}
                        </div>
                    )}
                    <form onSubmit={handleSubmitTicket} className="space-y-4">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                             <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
                             <input 
                                type="text" 
                                required 
                                className="w-full mt-1 px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 placeholder:text-slate-400" 
                                placeholder="Brief summary of issue" 
                                value={ticketForm.subject} 
                                onChange={e => setTicketForm({...ticketForm, subject: e.target.value})} 
                             />
                          </div>
                          <div>
                             <label className="text-xs font-bold text-slate-500 uppercase">Priority</label>
                             <select 
                                className="w-full mt-1 px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" 
                                value={ticketForm.priority} 
                                onChange={e => setTicketForm({...ticketForm, priority: e.target.value as any})}
                             >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                             </select>
                          </div>
                       </div>
                       
                       <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Attachment (Optional)</label>
                          <div className="relative">
                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                className="w-full mt-1 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 placeholder:text-slate-400" 
                                placeholder="Image URL (e.g., screenshot link)" 
                                value={ticketForm.image} 
                                onChange={e => setTicketForm({...ticketForm, image: e.target.value})} 
                             />
                          </div>
                       </div>

                       <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Message</label>
                          <textarea 
                             required 
                             rows={4} 
                             className="w-full mt-1 px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 placeholder:text-slate-400" 
                             placeholder="Describe your issue in detail..." 
                             value={ticketForm.message} 
                             onChange={e => setTicketForm({...ticketForm, message: e.target.value})} 
                          />
                       </div>
                       <button type="submit" disabled={isSubmittingTicket} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70">
                          {isSubmittingTicket ? 'Sending...' : <><Send size={16}/> Submit Ticket</>}
                       </button>
                    </form>
                 </div>

                 {/* History */}
                 <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50">
                       <h3 className="font-bold text-slate-900 flex items-center gap-2"><MessageCircle size={20} className="text-indigo-600"/> Ticket History</h3>
                    </div>
                    {myTickets.length === 0 ? (
                       <div className="p-8 text-center text-slate-500">You haven't opened any support tickets yet.</div>
                    ) : (
                       <div className="divide-y divide-slate-100">
                          {myTickets.map(ticket => (
                             <div key={ticket.id} className="p-6 hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                   <div>
                                      <div className="flex items-center gap-3 mb-1">
                                         <span className="font-bold text-slate-900">{ticket.id}</span>
                                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ticket.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{ticket.status}</span>
                                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ticket.priority === 'high' ? 'bg-red-100 text-red-700' : ticket.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{ticket.priority}</span>
                                      </div>
                                      <h4 className="font-bold text-lg text-slate-800">{ticket.subject}</h4>
                                   </div>
                                   <span className="text-xs text-slate-500">{new Date(ticket.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-600 text-sm whitespace-pre-line">{ticket.message}</p>
                                {ticket.image && (
                                   <div className="mt-3">
                                     <a href={ticket.image} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-xs font-bold bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100">
                                       <ImageIcon size={14} /> View Attachment
                                     </a>
                                   </div>
                                )}
                             </div>
                          ))}
                       </div>
                    )}
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
                                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-slate-900" 
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
                                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-slate-900" 
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
                                          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-slate-900" 
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
                                          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-slate-900" 
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
                                          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-slate-900" 
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
