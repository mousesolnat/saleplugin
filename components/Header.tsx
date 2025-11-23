import React from 'react';
import { ShoppingCart, Search, Package, LayoutDashboard, Menu, X } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  storeName: string;
  logoUrl?: string;
  cartItems: CartItem[];
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAdmin: () => void;
  currentView: string;
  onChangeView: (view: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  storeName, 
  logoUrl,
  cartItems, 
  onOpenCart, 
  searchQuery, 
  setSearchQuery, 
  onOpenAdmin,
  currentView,
  onChangeView
}) => {
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavLink = ({ view, label }: { view: 'home' | 'shop' | 'contact', label: string }) => (
    <button
      onClick={() => {
        onChangeView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        currentView === view 
          ? 'bg-slate-100 text-indigo-600' 
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onChangeView('home')}>
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-10 w-auto object-contain" />
            ) : (
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Package size={24} strokeWidth={2.5} />
              </div>
            )}
            <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">{storeName}</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink view="home" label="Home" />
            <NavLink view="shop" label="Shop" />
            <NavLink view="contact" label="Contact" />
          </nav>

          {/* Search Bar - Only show on Shop view or on desktop */}
          <div className={`flex-1 max-w-xs mx-4 ${currentView !== 'shop' ? 'hidden md:block opacity-50 hover:opacity-100 transition-opacity' : ''}`}>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'shop') onChangeView('shop');
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
               onClick={onOpenAdmin}
               className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
               title="Open Admin Dashboard"
            >
               <LayoutDashboard size={16} />
               Dashboard
            </button>

            <button
              onClick={onOpenCart}
              className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full min-w-[1.25rem]">
                  {totalItems}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-2 absolute w-full shadow-lg">
          <button onClick={() => { onChangeView('home'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 font-medium text-slate-700">Home</button>
          <button onClick={() => { onChangeView('shop'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 font-medium text-slate-700">Shop</button>
          <button onClick={() => { onChangeView('contact'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 font-medium text-slate-700">Contact</button>
          <div className="border-t border-slate-100 my-2 pt-2">
             <button onClick={() => { onOpenAdmin(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 font-medium text-slate-700 flex items-center gap-2">
               <LayoutDashboard size={18} /> Admin Dashboard
             </button>
          </div>
        </div>
      )}
    </header>
  );
};