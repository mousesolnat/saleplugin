
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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 px-6 py-2 pb-safe safe-area-bottom">
      <div className="flex justify-between items-end">
        <button
          onClick={() => onChangeView('home')}
          className={`flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-xl transition-all ${
            currentView === 'home' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Home size={24} strokeWidth={currentView === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button
          onClick={() => onChangeView('shop')}
          className={`flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-xl transition-all ${
            currentView === 'shop' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Store size={24} strokeWidth={currentView === 'shop' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Shop</span>
        </button>

        <button
          onClick={onOpenWishlist}
          className={`flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-xl transition-all relative ${
            currentView === 'wishlist' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="relative">
            <Heart size={24} strokeWidth={currentView === 'wishlist' ? 2.5 : 2} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white animate-fade-in">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">Wishlist</span>
        </button>

        <button
          onClick={onOpenCart}
          className={`flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-xl transition-all relative ${
            false ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="relative">
            <ShoppingCart size={24} strokeWidth={2} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white animate-fade-in">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">Cart</span>
        </button>
      </div>
    </div>
  );
};
