
import React, { useState } from 'react';
import { Plus, Check, Tag, ImageOff, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails?: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (e: React.MouseEvent) => void;
  priceMultiplier?: number;
  currencySymbol?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onViewDetails,
  isWishlisted = false,
  onToggleWishlist,
  priceMultiplier = 1,
  currencySymbol = '$'
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering details view when adding to cart
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  // Generate a distinct gradient based on category for visual variety (fallback)
  const getGradient = (cat: string) => {
    switch(cat) {
      case 'Builders & Addons': return 'from-blue-500 to-cyan-500';
      case 'SEO & Marketing': return 'from-emerald-500 to-teal-500';
      case 'eCommerce': return 'from-violet-500 to-purple-500';
      case 'Performance': return 'from-orange-500 to-amber-500';
      default: return 'from-slate-500 to-gray-500';
    }
  };

  const displayPrice = (product.price * priceMultiplier).toFixed(2);

  return (
    <div 
      onClick={onViewDetails}
      className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer"
    >
      {/* Image / Header Area */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {!imageError && product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getGradient(product.category)} flex items-center justify-center`}>
            <ImageOff className="text-white/50" size={48} />
          </div>
        )}
        
        {/* Category Badge Overlay */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-slate-800 text-xs font-bold shadow-sm flex items-center gap-1">
            <Tag size={12} className="text-indigo-600" />
            {product.category}
         </div>
         
         {/* Wishlist Button Overlay */}
         {onToggleWishlist && (
           <button 
             onClick={onToggleWishlist}
             className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white hover:shadow-md transition-all z-10 group/heart"
             title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
           >
             <Heart 
               size={18} 
               className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover/heart:text-red-500'}`} 
             />
           </button>
         )}

         {/* Price Badge Overlay */}
         <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
           {currencySymbol}{displayPrice}
         </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100">
          <button
            onClick={handleAdd}
            className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 ${
              isAdded
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-200'
            }`}
          >
            {isAdded ? (
              <>
                <Check size={18} />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus size={18} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
