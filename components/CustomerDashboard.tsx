import React from 'react';
import { Customer, Order } from '../types';
import { User, Package, LogOut, ShoppingBag, MapPin, CreditCard, Settings, Download } from 'lucide-react';

interface CustomerDashboardProps {
  customer: Customer;
  onLogout: () => void;
  currencySymbol?: string;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ customer, onLogout, currencySymbol = '$' }) => {
  // Mock orders for demo
  const mockOrders: Order[] = [
    { id: '#ORD-9921', customer: customer.name, email: customer.email, total: 45, status: 'completed', date: '2024-03-15', items: 2 },
    { id: '#ORD-9925', customer: customer.name, email: customer.email, total: 20, status: 'completed', date: '2024-03-10', items: 1 }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">
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
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                {customer.name.charAt(0)}
              </div>
              <h2 className="font-bold text-slate-900 text-lg">{customer.name}</h2>
              <p className="text-slate-500 text-sm mb-4">{customer.email}</p>
              <div className="text-xs bg-slate-100 rounded-full py-1 px-3 inline-block font-medium text-slate-600">
                Member since {new Date(customer.joinDate).toLocaleDateString()}
              </div>
           </div>

           <nav className="space-y-2">
             <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-md shadow-indigo-200">
               <Package size={20} /> Orders & Downloads
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-white hover:shadow-sm rounded-xl font-medium transition-all">
               <Settings size={20} /> Account Details
             </button>
           </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
           {/* Recent Orders */}
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold uppercase">
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

           {/* Account Details Preview */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <User size={20} className="text-indigo-600" /> Personal Info
                 </h3>
                 <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-slate-500 block">Full Name</span>
                      <span className="font-medium text-slate-900">{customer.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Email Address</span>
                      <span className="font-medium text-slate-900">{customer.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Phone</span>
                      <span className="font-medium text-slate-900 text-slate-400 italic">Not set</span>
                    </div>
                 </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <CreditCard size={20} className="text-indigo-600" /> Payment Methods
                 </h3>
                 <p className="text-slate-500 text-sm mb-4">No payment methods saved.</p>
                 <button className="text-indigo-600 font-bold text-sm hover:underline">
                   Add Payment Method
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};