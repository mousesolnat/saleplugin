
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ShoppingCart, Check, ShieldCheck, Clock, 
  AlertTriangle, Star, Share2, Facebook, Twitter, Linkedin, CreditCard, Heart
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  priceMultiplier?: number;
  currencySymbol?: string;
  recentlyViewed?: Product[];
  onViewHistoryItem?: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onAddToCart, 
  onBack,
  isWishlisted = false,
  onToggleWishlist,
  priceMultiplier = 1,
  currencySymbol = '$',
  recentlyViewed = [],
  onViewHistoryItem
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [isAdded, setIsAdded] = useState(false);

  const finalPrice = (product.price * priceMultiplier).toFixed(2);

  // SEO: Update Title and Meta Description when product changes
  useEffect(() => {
    // Update Document Title
    // Use the explicit SEO title if available, otherwise fallback to Product Name
    const title = product.seoTitle || product.name;
    document.title = title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    
    // Use explicit SEO description, or truncate product description, or empty string
    const description = product.seoDescription || product.description?.substring(0, 160) || '';
    metaDesc.setAttribute('content', description);
  }, [product]);

  const handleAdd = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    // Simulate checkout process
    alert(`Proceeding to secure checkout for ${product.name}...`);
  };

  const features = [
    { icon: <Clock size={18} className="text-indigo-600" />, text: "Same Day Delivery - Within 12 hours" },
    { icon: <ShieldCheck size={18} className="text-indigo-600" />, text: "Original License - Valid Subscriptions" },
    { icon: <Check size={18} className="text-indigo-600" />, text: "No GPL or Unsafe Products" },
    { icon: <Check size={18} className="text-indigo-600" />, text: "Automatic Updates via Dashboard" },
    { icon: <Check size={18} className="text-indigo-600" />, text: "100% Money Back Guarantee" },
  ];

  // Generate a SKU based on ID
  const sku = `SKU-${product.id.split('_')[1].padStart(5, '0')}`;
  
  return (
    <div className="animate-fade-in pb-12 relative">
      {/* Breadcrumb / Back */}
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
        >
          <ArrowLeft size={18} /> Back to Shop
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* Left Column: Image */}
          <div className="p-8 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col items-center justify-center gap-6">
            <div className="relative w-full max-w-lg aspect-square lg:aspect-auto lg:h-[400px] flex items-center justify-center">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain rounded-xl shadow-lg hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="p-8 lg:p-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-indigo-600">{currencySymbol}{finalPrice}</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <span className="text-slate-400 text-sm ml-1">(No reviews yet)</span>
              </div>
            </div>

            {/* Short Description */}
            <div className="prose prose-slate text-slate-600 mb-8 leading-relaxed">
              <p>
                <strong>{product.name} License</strong> – We have a valid subscription for this plugin. 
                The product license is 100% original and will be valid for LIFETIME. 
                Your WordPress website will be able to update this product directly via your dashboard. 
                <strong> WP ORIGIN never sells any kind of warez, crack, or GPL products!</strong>
              </p>
            </div>

            {/* Warning / Instruction Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-4 animate-pulse">
              <AlertTriangle className="text-amber-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-amber-800 mb-1">Activation Requirement</h4>
                <p className="text-sm text-amber-700">
                  You have to provide temporary admin login details for your website. 
                  We’ll activate your licenses with our original license key manually.
                </p>
              </div>
            </div>

            {/* Add to Cart & Buy Now */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 border-b border-slate-100 pb-8">
              <button
                onClick={handleAdd}
                disabled={isAdded}
                className={`flex-1 py-4 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all duration-200 transform ${
                  isAdded
                    ? 'bg-green-600 text-white shadow-lg shadow-green-200 scale-[1.02]'
                    : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-indigo-200 hover:-translate-y-1'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={24} className="animate-bounce" /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={24} /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200 hover:-translate-y-1 transition-all duration-200"
              >
                <CreditCard size={24} /> Buy Now
              </button>

              {/* Wishlist Button */}
              {onToggleWishlist && (
                <button
                  onClick={onToggleWishlist}
                  className={`w-16 flex items-center justify-center rounded-xl border-2 transition-all ${
                    isWishlisted 
                    ? 'border-red-500 bg-red-50 text-red-500' 
                    : 'border-slate-200 text-slate-400 hover:border-red-400 hover:text-red-500'
                  }`}
                  title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart size={24} className={isWishlisted ? 'fill-current' : ''} />
                </button>
              )}
            </div>

            {/* Feature List */}
            <div className="space-y-3 mb-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  {feature.icon}
                  {feature.text}
                </div>
              ))}
            </div>

            {/* Meta */}
            <div className="space-y-2 text-sm text-slate-500 pt-4 border-t border-slate-100">
              <div className="flex gap-2">
                <span className="font-bold text-slate-900 w-24">SKU:</span> 
                {sku}
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-slate-900 w-24">Category:</span> 
                <span className="text-indigo-600 cursor-pointer hover:underline">{product.category}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-slate-900 w-24">Share:</span> 
                <div className="flex gap-2">
                  <Facebook size={16} className="hover:text-indigo-600 cursor-pointer" />
                  <Twitter size={16} className="hover:text-indigo-600 cursor-pointer" />
                  <Linkedin size={16} className="hover:text-indigo-600 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tabs Section */}
        <div className="border-t border-slate-200">
           <div className="flex border-b border-slate-200">
             <button 
               onClick={() => setActiveTab('description')}
               className={`px-8 py-4 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${
                 activeTab === 'description' 
                 ? 'border-indigo-600 text-indigo-600 bg-slate-50' 
                 : 'border-transparent text-slate-500 hover:text-slate-800'
               }`}
             >
               Description
             </button>
             <button 
               onClick={() => setActiveTab('reviews')}
               className={`px-8 py-4 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${
                 activeTab === 'reviews' 
                 ? 'border-indigo-600 text-indigo-600 bg-slate-50' 
                 : 'border-transparent text-slate-500 hover:text-slate-800'
               }`}
             >
               Reviews (0)
             </button>
           </div>
           
           <div className="p-8 lg:p-12 bg-slate-50/50">
             {activeTab === 'description' && (
               <div className="prose prose-slate max-w-none text-slate-600">
                 <h3 className="text-lg font-bold text-slate-900 mb-4">Product Description</h3>
                 <p className="mb-4">
                   This is a genuine license for <strong>{product.name}</strong>. 
                   We’re aware of the importance of using licensed and original products for the security of your WordPress website. 
                   Check Our Licenses. If you get any product from our store, please share your experience with others.
                 </p>
                 <p className="mb-4">
                   <strong>Important Notes:</strong>
                 </p>
                 <ul className="list-disc pl-5 space-y-2 mb-6">
                   <li>Original License - We only sell our valid subscriptions.</li>
                   <li>We never sell any GPL or Unsafe products.</li>
                   <li>All our products get automatic updates via your WordPress backend.</li>
                   <li>If you are not happy, we offer a 100% money-back guarantee.</li>
                 </ul>
                 <p>
                   Share Your Review on Our Google Profile to help other developers find safe, affordable tools.
                 </p>
                 {product.description && product.description.length > 100 && (
                     <div className="mt-6 pt-6 border-t border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-2">Additional Information</h4>
                        <p>{product.description}</p>
                     </div>
                 )}
               </div>
             )}
             
             {activeTab === 'reviews' && (
               <div className="text-center py-12">
                 <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
                   <Star className="text-slate-300" size={32} />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900">No Reviews Yet</h3>
                 <p className="text-slate-500">Be the first to review "{product.name}".</p>
               </div>
             )}
           </div>
        </div>
      </div>
      
      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <div className="mt-16 animate-fade-in-up">
           <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
             <Clock size={24} className="text-slate-400"/> Recently Viewed
           </h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recentlyViewed.map(item => (
                <div 
                   key={item.id}
                   onClick={() => onViewHistoryItem && onViewHistoryItem(item)}
                   className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                   <div className="aspect-square bg-slate-100 rounded-lg mb-3 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                      )}
                   </div>
                   <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.name}</h4>
                   <p className="text-indigo-600 font-bold text-sm mt-1">{currencySymbol}{(item.price * priceMultiplier).toFixed(2)}</p>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};
