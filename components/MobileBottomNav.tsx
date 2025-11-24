
import React from 'react';
import { Home, Store, Heart, ShoppingCart } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: string;
  onChangeView: (view: string) => void;
  cartItemCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onChangeView,
  cartItemCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 px-2 pb-safe safe-area-bottom">
      <div className="flex justify-around items-end h-16 pb-1">
        <button
          onClick={() => onChangeView('home')}
          className={`flex flex-col items-center gap-1 flex-1 p-1 transition-all duration-300 group ${
            currentView === 'home' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all duration-300 ${
            currentView === 'home' ? 'bg-indigo-50 -translate-y-1' : 'bg-transparent'
          }`}>
            <Home size={24} strokeWidth={currentView === 'home' ? 2.5 : 2} className="transition-transform duration-300" />
          </div>
          <span className={`text-[10px] transition-all duration-300 ${
            currentView === 'home' ? 'font-extrabold scale-105' : 'font-medium'
          }`}>
            Home
          </span>
        </button>

        <button
          onClick={() => onChangeView('shop')}
          className={`flex flex-col items-center gap-1 flex-1 p-1 transition-all duration-300 group ${
            currentView === 'shop' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all duration-300 ${
            currentView === 'shop' ? 'bg-indigo-50 -translate-y-1' : 'bg-transparent'
          }`}>
            <Store size={24} strokeWidth={currentView === 'shop' ? 2.5 : 2} className="transition-transform duration-300" />
          </div>
          <span className={`text-[10px] transition-all duration-300 ${
            currentView === 'shop' ? 'font-extrabold scale-105' : 'font-medium'
          }`}>
            Shop
          </span>
        </button>

        <button
          onClick={onOpenWishlist}
          className={`flex flex-col items-center gap-1 flex-1 p-1 transition-all duration-300 group ${
            currentView === 'wishlist' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${
            currentView === 'wishlist' ? 'bg-indigo-50 -translate-y-1' : 'bg-transparent'
          }`}>
            <Heart size={24} strokeWidth={currentView === 'wishlist' ? 2.5 : 2} className="transition-transform duration-300" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white animate-bounce shadow-sm">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] transition-all duration-300 ${
            currentView === 'wishlist' ? 'font-extrabold scale-105' : 'font-medium'
          }`}>
            Wishlist
          </span>
        </button>

        <button
          onClick={onOpenCart}
          className={`flex flex-col items-center gap-1 flex-1 p-1 transition-all duration-300 group ${
             // Cart doesn't technically have a 'view' in the main area usually (it's a sidebar), 
             // but we style it active if needed, or just keep it neutral. 
             // Assuming cart might be overlay, keeping neutral unless specified.
             false ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative p-1.5 rounded-xl transition-all duration-300 group-active:scale-95">
            <ShoppingCart size={24} strokeWidth={2} className="transition-transform duration-300" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white animate-bounce shadow-sm">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium transition-all duration-300">
            Cart
          </span>
        </button>
      </div>
    </div>
  );
};
