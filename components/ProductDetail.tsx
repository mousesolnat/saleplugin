

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ShoppingCart, Check, ShieldCheck, Clock, 
  AlertTriangle, Star, Share2, Facebook, Twitter, Linkedin, CreditCard, Heart, User, MessageSquare, ExternalLink, Key
} from 'lucide-react';
import { Product, Customer, Review, CartItem, LicenseType } from '../types';
import { LICENSE_DEFINITIONS } from '../constants';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: CartItem) => void;
  onBack: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  priceMultiplier?: number;
  currencySymbol?: string;
  recentlyViewed?: Product[];
  onViewHistoryItem?: (product: Product) => void;
  currentUser?: Customer | null;
  onAddReview?: (productId: string, review: Omit<Review, 'id' | 'productId' | 'date' | 'status'>) => void;
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
  onViewHistoryItem,
  currentUser,
  onAddReview
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [isAdded, setIsAdded] = useState(false);
  
  // Find the first enabled license to select by default
  const availableLicenses = LICENSE_DEFINITIONS.filter(def => 
    product.licensePricing && 
    product.licensePricing[def.type]?.enabled
  );

  const [selectedLicense, setSelectedLicense] = useState<LicenseType>(
    availableLicenses.length > 0 ? availableLicenses[0].type : 'single'
  );

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Get specific price for selected license from product config
  const selectedLicenseConfig = product.licensePricing?.[selectedLicense];
  const basePrice = selectedLicenseConfig ? selectedLicenseConfig.price : 0;
  const finalPrice = (basePrice * priceMultiplier).toFixed(2);
  
  const reviews = (product.reviews || []).filter(r => !r.status || r.status === 'approved');
  
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0;

  useEffect(() => {
    const title = product.seoTitle || product.name;
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const description = product.seoDescription || product.description?.substring(0, 160) || '';
    metaDesc.setAttribute('content', description);

  }, [product]);

  const handleAdd = () => {
    if (!selectedLicenseConfig) return;

    const licenseDef = LICENSE_DEFINITIONS.find(l => l.type === selectedLicense);

    const cartItem: CartItem = {
      ...product,
      quantity: 1,
      licenseType: selectedLicense,
      licenseLabel: licenseDef?.label || 'Unknown License',
      basePrice: selectedLicenseConfig.price,
      // Store the specific configured price as the item price
      price: selectedLicenseConfig.price,
      finalPrice: selectedLicenseConfig.price * priceMultiplier
    };

    onAddToCart(cartItem);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    alert(`Proceeding to secure checkout for ${product.name}...`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (!currentUser && !guestName.trim()) return;

    setIsSubmittingReview(true);
    
    setTimeout(() => {
        if (onAddReview) {
            onAddReview(product.id, {
                customerName: currentUser ? currentUser.name : guestName,
                rating,
                comment
            });
        }
        setComment('');
        setGuestName('');
        setRating(5);
        setIsSubmittingReview(false);
        setReviewSubmitted(true);
    }, 800);
  };

  const features = [
    { icon: <Clock size={18} className="text-indigo-600" />, text: "Same Day Delivery - Within 12 hours" },
    { icon: <ShieldCheck size={18} className="text-indigo-600" />, text: "Original License - Valid Subscriptions" },
    { icon: <Check size={18} className="text-indigo-600" />, text: "No GPL or Unsafe Products" },
    { icon: <Check size={18} className="text-indigo-600" />, text: "Automatic Updates via Dashboard" },
    { icon: <Check size={18} className="text-indigo-600" />, text: "100% Money Back Guarantee" },
  ];

  const sku = `SKU-${product.id.split('_')[1].padStart(5, '0')}`;
  
  return (
    <div className="animate-fade-in pb-12 relative">
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
            <div className="relative w-full max-w-md aspect-[3/4] flex items-center justify-center shadow-lg rounded-2xl overflow-hidden bg-white">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="p-8 lg:p-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex flex-col">
                 <span className="text-sm text-slate-500 font-medium uppercase tracking-wide">Price</span>
                 <span className="text-4xl font-extrabold text-indigo-600 tracking-tight">{currencySymbol}{finalPrice}</span>
              </div>
              <div className="h-10 w-px bg-slate-200 mx-2"></div>
              <div className="flex flex-col justify-center">
                 <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={16} 
                          fill={star <= Math.round(averageRating) ? "currentColor" : "none"}
                          className={star <= Math.round(averageRating) ? "" : "text-slate-300"} 
                        />
                    ))}
                 </div>
                 <span className="text-slate-400 text-xs font-bold mt-1">{reviews.length} Verified Reviews</span>
              </div>
            </div>

            {/* License Selection Options */}
            <div className="mb-8">
               <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Key size={18} className="text-indigo-600"/> Select License Type
               </h3>
               {availableLicenses.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableLicenses.map((def) => {
                       const price = product.licensePricing[def.type]?.price || 0;
                       return (
                         <button
                            key={def.type}
                            onClick={() => setSelectedLicense(def.type)}
                            className={`relative p-3 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
                               selectedLicense === def.type
                                  ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                            }`}
                         >
                            <div>
                               <span className={`block font-bold text-sm ${selectedLicense === def.type ? 'text-indigo-900' : 'text-slate-700'}`}>
                                  {def.label}
                               </span>
                               <span className={`text-xs font-medium ${selectedLicense === def.type ? 'text-indigo-600' : 'text-slate-500'}`}>
                                  {currencySymbol}{(price * priceMultiplier).toFixed(2)}
                               </span>
                            </div>
                            {selectedLicense === def.type && (
                               <div className="bg-indigo-600 rounded-full p-1 text-white">
                                  <Check size={12} strokeWidth={3} />
                               </div>
                            )}
                            {def.badge && (
                               <div className="absolute -top-2.5 right-2 bg-amber-400 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                                  {def.badge}
                               </div>
                            )}
                         </button>
                       );
                    })}
                 </div>
               ) : (
                 <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">
                    No license options available for this product.
                 </div>
               )}
            </div>

            {/* Add to Cart & Buy Now */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 border-b border-slate-100 pb-8">
              <button
                onClick={handleAdd}
                disabled={isAdded || availableLicenses.length === 0}
                className={`flex-1 py-4 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all duration-200 transform ${
                  isAdded
                    ? 'bg-green-600 text-white shadow-lg shadow-green-200 scale-[1.02]'
                    : availableLicenses.length === 0
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-indigo-200 hover:-translate-y-1'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={24} className="text-white" /> <span className="text-white">Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={24} /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={availableLicenses.length === 0}
                className={`flex-1 py-4 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all duration-200 ${
                   availableLicenses.length === 0 
                   ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                   : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200 hover:-translate-y-1'
                }`}
              >
                <CreditCard size={24} /> Buy Now
              </button>
              
              {product.demoUrl && (
                <a
                  href={product.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg bg-white text-slate-700 border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 transition-all hover:-translate-y-1"
                  title="View Live Demo"
                >
                  <ExternalLink size={24} /> <span className="hidden sm:inline">Preview</span>
                </a>
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
            </div>
          </div>
        </div>

        {/* Bottom Tabs Section */}
        <div className="border-t border-slate-200">
           <div className="flex border-b border-slate-200 overflow-x-auto">
             <button 
               onClick={() => setActiveTab('description')}
               className={`px-8 py-4 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                 activeTab === 'description' 
                 ? 'border-indigo-600 text-indigo-600 bg-slate-50' 
                 : 'border-transparent text-slate-500 hover:text-slate-800'
               }`}
             >
               Description
             </button>
             <button 
               onClick={() => setActiveTab('reviews')}
               className={`px-8 py-4 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                 activeTab === 'reviews' 
                 ? 'border-indigo-600 text-indigo-600 bg-slate-50' 
                 : 'border-transparent text-slate-500 hover:text-slate-800'
               }`}
             >
               Reviews ({reviews.length})
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
               <div className="max-w-4xl mx-auto">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Review Form */}
                    <div className="lg:col-span-1">
                       <h3 className="text-lg font-bold text-slate-900 mb-4">Write a Review</h3>
                       {reviewSubmitted ? (
                          <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl text-center">
                            <Check size={32} className="mx-auto mb-2" />
                            <h4 className="font-bold mb-1">Review Submitted!</h4>
                            <p className="text-sm">Your review is pending approval.</p>
                            <button onClick={() => setReviewSubmitted(false)} className="mt-4 text-sm font-bold underline">Write another</button>
                          </div>
                       ) : (
                       <form onSubmit={handleSubmitReview} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Your Rating</label>
                            <div className="flex gap-2">
                               {[1, 2, 3, 4, 5].map((star) => (
                                 <button 
                                   key={star} 
                                   type="button"
                                   onClick={() => setRating(star)}
                                   className="focus:outline-none transition-transform hover:scale-110"
                                 >
                                    <Star 
                                      size={24} 
                                      className={`${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                                    />
                                 </button>
                               ))}
                            </div>
                          </div>
                          
                          {!currentUser && (
                            <div>
                               <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                               <input 
                                 type="text" 
                                 className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                 placeholder="John Doe"
                                 value={guestName}
                                 onChange={(e) => setGuestName(e.target.value)}
                                 required
                               />
                            </div>
                          )}

                          <div>
                             <label className="block text-sm font-medium text-slate-700 mb-2">Review</label>
                             <textarea 
                               rows={4}
                               className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                               placeholder="Tell us what you liked..."
                               value={comment}
                               onChange={(e) => setComment(e.target.value)}
                               required
                             />
                          </div>
                          
                          <button 
                             type="submit" 
                             disabled={isSubmittingReview}
                             className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70"
                          >
                             {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                          </button>
                       </form>
                       )}
                    </div>

                    {/* Review List */}
                    <div className="lg:col-span-2 space-y-6">
                       <h3 className="text-lg font-bold text-slate-900 mb-4">Customer Reviews ({reviews.length})</h3>
                       
                       {reviews.length > 0 ? (
                          reviews.map((review) => (
                            <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in">
                               <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                        {review.customerName.charAt(0)}
                                     </div>
                                     <div>
                                        <h4 className="font-bold text-slate-900">{review.customerName}</h4>
                                        <div className="flex items-center gap-1">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                             <Star 
                                               key={star} 
                                               size={12} 
                                               className={`${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                                             />
                                          ))}
                                        </div>
                                     </div>
                                  </div>
                                  <span className="text-xs text-slate-400">
                                     {new Date(review.date).toLocaleDateString()}
                                  </span>
                               </div>
                               <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                            </div>
                          ))
                       ) : (
                          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
                            <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
                              <MessageSquare className="text-slate-300" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No Reviews Yet</h3>
                            <p className="text-slate-500">Be the first to share your thoughts on this product.</p>
                          </div>
                       )}
                    </div>
                 </div>
               </div>
             )}
           </div>
        </div>
      </div>
      
      {/* Recently Viewed */}
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
