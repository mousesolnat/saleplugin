
import React, { useState } from 'react';
import { ShoppingCart, Search, Package, LayoutDashboard, Menu, X, Heart, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { CartItem, Currency, Customer } from '../types';
import { CURRENCIES } from '../constants';

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
  wishlistCount?: number;
  onOpenWishlist?: () => void;
  selectedCurrency?: Currency;
  onCurrencyChange?: (currency: Currency) => void;
  currentUser?: Customer | null;
  onOpenLogin?: () => void;
  onLogout?: () => void;
  onOpenProfile?: () => void;
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
  onChangeView,
  wishlistCount = 0,
  onOpenWishlist,
  selectedCurrency,
  onCurrencyChange,
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenProfile
}) => {
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onChangeView('home')}>
             {logoUrl ? (
               <img src={logoUrl} alt={storeName} className="h-10 w-auto object-contain" />
             ) : (
               <div className="flex items-center gap-2">
                 <div className="bg-indigo-600 p-2 rounded-xl text-white">
                   <Package size={24} strokeWidth={2.5} />
                 </div>
                 <span className="text-xl font-extrabold text-slate-900 tracking-tight">{storeName}</span>
               </div>
             )}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink view="home" label="Home" />
            <NavLink view="shop" label="Shop" />
            <NavLink view="contact" label="Contact" />
          </nav>

          {/* Search */}
          <div className="hidden lg:block flex-1 max-w-md mx-4 relative group">
            <input 
              type="text"
              placeholder="Search plugins, themes..."
              className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Currency Selector */}
            {selectedCurrency && onCurrencyChange && (
              <div className="relative">
                <button 
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors"
                >
                  <span className="text-lg">{selectedCurrency.flag}</span>
                  <span className="hidden sm:inline">{selectedCurrency.code}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
                
                {isCurrencyOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsCurrencyOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20">
                      {CURRENCIES.map(c => (
                        <button
                          key={c.code}
                          onClick={() => {
                            onCurrencyChange(c);
                            setIsCurrencyOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 ${selectedCurrency.code === c.code ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700'}`}
                        >
                           <span>{c.flag}</span> {c.code}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <button 
              onClick={onOpenWishlist}
              className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all relative"
              aria-label="Wishlist"
            >
              <Heart size={22} className={wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            <button 
              onClick={onOpenCart}
              className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative"
              aria-label="Cart"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Auth / Profile Button */}
            {currentUser ? (
              <div className="relative">
                <button 
                   onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                   className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                     {currentUser.name.charAt(0)}
                  </div>
                  <ChevronDown size={14} className="text-slate-400 mr-1" />
                </button>

                {isUserMenuOpen && (
                   <>
                     <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                     <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-50 bg-slate-50">
                           <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                           <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                        </div>
                        <button onClick={() => { onOpenProfile && onOpenProfile(); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                           <User size={16} /> My Account
                        </button>
                        <button onClick={() => { onOpenAdmin(); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                           <LayoutDashboard size={16} /> Admin Dashboard
                        </button>
                        <div className="border-t border-slate-50 my-1"></div>
                        <button onClick={() => { onLogout && onLogout(); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2">
                           <LogOut size={16} /> Sign Out
                        </button>
                     </div>
                   </>
                )}
              </div>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-colors shadow-lg hover:shadow-indigo-200"
              >
                <User size={18} />
                <span>Log In</span>
              </button>
            )}

            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-4 lg:hidden">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search..."
                className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full left-0 z-30 shadow-lg animate-fade-in-up">
          <div className="px-4 py-6 space-y-4">
            <button onClick={() => { onChangeView('home'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 font-medium">Home</button>
            <button onClick={() => { onChangeView('shop'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 font-medium">Shop</button>
            <button onClick={() => { onChangeView('contact'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 font-medium">Contact</button>
            
            {!currentUser && (
               <button onClick={() => { onOpenLogin && onOpenLogin(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 font-medium text-indigo-600">
                 Log In / Sign Up
               </button>
            )}

            {currentUser && (
               <>
                 <button onClick={() => { onOpenProfile && onOpenProfile(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 font-medium">My Account</button>
                 <button onClick={() => { onLogout && onLogout(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-medium">Sign Out</button>
               </>
            )}

            <button onClick={() => { onOpenAdmin(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 font-medium flex items-center gap-2">
               <LayoutDashboard size={18} /> Admin Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
