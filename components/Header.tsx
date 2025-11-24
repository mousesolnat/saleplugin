
import React, { useState } from 'react';
import { ShoppingCart, Search, Package, LayoutDashboard, Menu, X, Heart, ChevronDown, User, LogOut, Settings, BookOpen, Info } from 'lucide-react';
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
  onChangeView: (view: string) => void;
  wishlistCount?: number;
  onOpenWishlist?: () => void;
  selectedCurrency?: Currency;
  onCurrencyChange?: (currency: Currency) => void;
  currentUser?: Customer | null;
  onOpenLogin?: () => void;
  onLogout?: () => void;
  onOpenProfile?: () => void;
  onViewProduct?: (product: any) => void;
  searchResults?: any[];
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
  onOpenProfile,
  onViewProduct,
  searchResults = []
}) => {
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onChangeView('shop');
      setIsSearchFocused(false);
      (e.target as HTMLInputElement).blur();
    }
  };

  const NavLink = ({ view, label }: { view: string, label: string }) => (
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
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink view="home" label="Home" />
            <NavLink view="shop" label="Shop" />
            <NavLink view="about" label="About" />
            <NavLink view="blog" label="Blog" />
            <NavLink view="contact" label="Contact" />
          </nav>

          {/* Search */}
          <div className="hidden md:block flex-1 max-w-xs lg:max-w-sm mx-4 relative group">
            <input 
              type="text"
              placeholder="Search..."
              className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              onKeyDown={handleSearchKeyDown}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            
            {/* Search Dropdown */}
            {isSearchFocused && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-h-96 overflow-y-auto">
                 {searchResults.length > 0 ? (
                   searchResults.map(product => (
                     <div 
                        key={product.id}
                        onClick={() => onViewProduct && onViewProduct(product)}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none"
                     >
                        <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                           {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-bold text-slate-900 truncate">{product.name}</p>
                           <p className="text-xs text-slate-500 truncate">{product.category}</p>
                        </div>
                        <span className="text-sm font-bold text-indigo-600">
                          {selectedCurrency?.symbol}{(product.price * (selectedCurrency?.rate || 1)).toFixed(2)}
                        </span>
                     </div>
                   ))
                 ) : (
                   <div className="p-4 text-center text-slate-500 text-sm">No results found</div>
                 )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Currency Selector */}
            {selectedCurrency && onCurrencyChange && (
              <div className="relative hidden sm:block">
                <button 
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-100 text-sm font-bold text-slate-700 transition-all border border-transparent hover:border-slate-200"
                >
                  <span className="text-lg leading-none">{selectedCurrency.flag}</span>
                  <span className="hidden lg:inline">{selectedCurrency.code}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCurrencyOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsCurrencyOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 animate-fade-in">
                      <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Currency</div>
                      {CURRENCIES.map(c => (
                        <button
                          key={c.code}
                          onClick={() => {
                            onCurrencyChange(c);
                            setIsCurrencyOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                            selectedCurrency.code === c.code ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700'
                          }`}
                        >
                           <span className="text-lg">{c.flag}</span> 
                           <span className="flex-1">{c.name}</span>
                           {selectedCurrency.code === c.code && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <button 
              onClick={onOpenAdmin}
              className="hidden xl:block p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
              title="Admin Dashboard"
            >
              <LayoutDashboard size={22} />
            </button>

            <button 
              onClick={onOpenWishlist}
              className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all relative group"
              aria-label="Wishlist"
            >
              <Heart size={22} className={`transition-transform group-hover:scale-110 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            <button 
              onClick={onOpenCart}
              className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative group"
              aria-label="Cart"
            >
              <ShoppingCart size={22} className="transition-transform group-hover:scale-110" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border-2 border-white animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Auth / Profile Button */}
            {currentUser ? (
              <div className="relative hidden sm:block">
                <button 
                   onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                   className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all bg-white shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-inner">
                     {currentUser.name.charAt(0)}
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {isUserMenuOpen && (
                   <>
                     <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                     <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 overflow-hidden animate-fade-in">
                        <div className="px-4 py-4 border-b border-slate-50 bg-slate-50/50">
                           <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                           <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                        </div>
                        <div className="p-1">
                          <button onClick={() => { onOpenProfile && onOpenProfile(); setIsUserMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2 transition-colors">
                             <User size={16} className="text-slate-400" /> My Account
                          </button>
                          <button onClick={() => { onOpenAdmin(); setIsUserMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2 transition-colors">
                             <LayoutDashboard size={16} className="text-slate-400" /> Admin Dashboard
                          </button>
                        </div>
                        <div className="border-t border-slate-50 my-1"></div>
                        <div className="p-1">
                          <button onClick={() => { onLogout && onLogout(); setIsUserMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors">
                             <LogOut size={16} /> Sign Out
                          </button>
                        </div>
                     </div>
                   </>
                )}
              </div>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5"
              >
                <User size={18} />
                <span>Log In</span>
              </button>
            )}

            <button 
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-4 md:hidden relative z-30">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search..."
                className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>

            {/* Mobile Search Dropdown */}
            {isSearchFocused && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-h-80 overflow-y-auto z-40">
                 {searchResults.length > 0 ? (
                   searchResults.map(product => (
                     <div 
                        key={product.id}
                        onClick={() => onViewProduct && onViewProduct(product)}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none"
                     >
                        <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                           {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-bold text-slate-900 truncate">{product.name}</p>
                           <p className="text-xs text-slate-500 truncate">{product.category}</p>
                        </div>
                        <span className="text-sm font-bold text-indigo-600">
                          {selectedCurrency?.symbol}{(product.price * (selectedCurrency?.rate || 1)).toFixed(2)}
                        </span>
                     </div>
                   ))
                 ) : (
                   <div className="p-4 text-center text-slate-500 text-sm">No results found</div>
                 )}
              </div>
            )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 absolute w-full left-0 z-20 shadow-lg animate-fade-in-up">
          <div className="px-4 py-6 space-y-4">
            <button onClick={() => { onChangeView('home'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 font-medium text-slate-700">Home</button>
            <button onClick={() => { onChangeView('shop'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 font-medium text-slate-700">Shop</button>
            <button onClick={() => { onChangeView('about'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 font-medium text-slate-700">About Us</button>
            <button onClick={() => { onChangeView('blog'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 font-medium text-slate-700">Blog</button>
            <button onClick={() => { onChangeView('contact'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 font-medium text-slate-700">Contact</button>
            
            {!currentUser && (
               <button onClick={() => { onOpenLogin && onOpenLogin(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-50 font-medium text-indigo-600">
                 Log In / Sign Up
               </button>
            )}

            {currentUser && (
               <>
                 <button onClick={() => { onOpenProfile && onOpenProfile(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 font-medium text-slate-700">My Account</button>
                 <button onClick={() => { onLogout && onLogout(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-medium">Sign Out</button>
               </>
            )}

            <button onClick={() => { onOpenAdmin(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 font-medium text-slate-700 flex items-center gap-2">
               <LayoutDashboard size={18} /> Admin Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
