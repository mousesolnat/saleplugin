
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { CartSidebar } from './components/CartSidebar';
import { AIAssistant } from './components/AIAssistant';
import { AdminDashboard } from './components/AdminDashboard';
import { PRODUCTS as INITIAL_PRODUCTS, STORE_NAME } from './constants';
import { Product, CartItem, StoreSettings, Page } from './types';
import { 
  Filter, SlidersHorizontal, ArrowRight, Mail, Phone, MapPin, Send, Star, Zap, Trophy,
  ShieldCheck, Ban, RefreshCw, Headphones, ChevronDown, ChevronUp, HelpCircle
} from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Web Developer",
    text: "Incredible value. I've saved hundreds on plugin licenses for my client sites. The instant delivery is a game changer.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces"
  },
  {
    id: 2,
    name: "Mike Ross",
    role: "Agency Owner",
    text: "The support team is amazing. Had a small activation issue and they sorted it out within minutes. Highly recommended!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces"
  },
  {
    id: 3,
    name: "Emily Chen",
    role: "Freelancer",
    text: "Finally a place where I can get genuine keys at a reasonable price for my startup. Will definitely be buying more.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces"
  }
];

const FAQ_DATA = {
  'PRE-SELL QUESTIONS': [
    { q: "Why are your prices so affordable?", a: "We purchase Agency and Developer licenses in bulk directly from the authors. This allows us to share the significant cost savings with our customers." },
    { q: "Are these products original?", a: "Yes, absolutely. All files are 100% original, unmodified, and free from malware. We do not deal with nulled or cracked software." },
    { q: "Do I need an account to purchase?", a: "No, you can purchase as a guest, but creating an account allows you to manage your downloads and licenses more easily." }
  ],
  'LICENSE RELATED QUESTIONS': [
    { q: "Do I get a valid license key?", a: "Yes! Unlike GPL clubs, we provide genuine license keys that allow for automatic updates directly from your WordPress dashboard." },
    { q: "How long is the license valid for?", a: "Most licenses are valid for 1 year from the date of purchase. Lifetime licenses will be clearly marked as such." },
    { q: "Can I use the license on client sites?", a: "Yes, you are free to use the purchased plugins and themes on your own sites or your client's websites." }
  ],
  'PAYMENT RELATED QUESTIONS': [
    { q: "What payment gateways do you use?", a: "We securely process payments via Stripe and PayPal. We accept all major credit and debit cards." },
    { q: "Is my payment information safe?", a: "Yes. Your connection is secured with SSL, and we do not store any credit card information on our servers." },
    { q: "Do you offer refunds?", a: "We offer a 7-day money-back guarantee if a plugin fails to work and our support team is unable to resolve the issue for you." }
  ]
};

const FAQSection = () => {
  const [activeTab, setActiveTab] = useState<keyof typeof FAQ_DATA>('PRE-SELL QUESTIONS');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mb-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
          <HelpCircle className="text-indigo-600" /> Frequently Asked Questions
        </h2>
        <p className="text-slate-500 mt-2">Everything you need to know before you buy.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex flex-wrap border-b border-slate-100">
          {(Object.keys(FAQ_DATA) as Array<keyof typeof FAQ_DATA>).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setOpenIndex(null); }}
              className={`flex-1 py-4 px-6 text-sm font-bold tracking-wide transition-colors ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div className="p-6 md:p-10 bg-white min-h-[300px]">
          <div className="space-y-4">
            {FAQ_DATA[activeTab].map((item, index) => (
              <div 
                key={index} 
                className={`border border-slate-100 rounded-xl overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'shadow-md ring-1 ring-indigo-100' : ''
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50 transition-colors"
                >
                  <span className={`font-bold ${openIndex === index ? 'text-indigo-700' : 'text-slate-800'}`}>
                    {item.q}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="text-indigo-600" size={20} />
                  ) : (
                    <ChevronDown className="text-slate-400" size={20} />
                  )}
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-50 bg-slate-50/50">
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DEFAULT_PAGES: Page[] = [
  { id: 'page_privacy', title: 'Privacy Policy', slug: 'privacy-policy', content: 'This is the Privacy Policy content. You can edit this in the Admin Dashboard.' },
  { id: 'page_terms', title: 'Terms of Service', slug: 'terms-of-service', content: 'This is the Terms of Service content. You can edit this in the Admin Dashboard.' },
  { id: 'page_dmca', title: 'DMCA', slug: 'dmca', content: 'This is the DMCA content. You can edit this in the Admin Dashboard.' },
  { id: 'page_cookie', title: 'Cookie Policy', slug: 'cookie-policy', content: 'This is the Cookie Policy content. You can edit this in the Admin Dashboard.' },
];

const App: React.FC = () => {
  // Persistence for products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('digimarket_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Pages State
  const [pages, setPages] = useState<Page[]>(() => {
    const saved = localStorage.getItem('digimarket_pages');
    return saved ? JSON.parse(saved) : DEFAULT_PAGES;
  });

  // Global Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('digimarket_settings');
    const defaultSettings: StoreSettings = {
      storeName: STORE_NAME,
      siteUrl: 'https://digimarket.pro',
      supportEmail: 'support@digimarket.pro',
      currencySymbol: '$',
      seoTitle: 'DigiMarket Pro - Premium WordPress Tools',
      seoDescription: 'The best marketplace for WordPress plugins, themes, and builder integrations. Instant delivery and verified licenses.',
      googleAnalyticsId: '',
      googleSearchConsoleCode: '',
      bingWebmasterCode: '',
      contactAddress: '123 Digital Avenue, Tech City, Cloud State, 90210',
      contactPhone: '+1 (555) 123-4567',
      footerDescription: 'The #1 marketplace for premium digital products, plugins, and themes. Instant delivery and verified quality.',
      popularCategories: ['WordPress Plugins', 'Page Builders', 'SEO Tools', 'eCommerce'],
      socials: {
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com'
      }
    };
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // View State (Simple Routing)
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'contact' | 'product' | 'page'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  // Derived selected product
  const selectedProduct = useMemo(() => 
    products.find(p => p.id === selectedProductId) || null
  , [products, selectedProductId]);

  // Derived selected page
  const selectedPage = useMemo(() => 
    pages.find(p => p.id === selectedPageId) || null
  , [pages, selectedPageId]);

  // Save products when they change
  useEffect(() => {
    localStorage.setItem('digimarket_products', JSON.stringify(products));
  }, [products]);

  // Save pages
  useEffect(() => {
    localStorage.setItem('digimarket_pages', JSON.stringify(pages));
  }, [pages]);

  // Save settings when they change & Update Document Title / Meta
  useEffect(() => {
    localStorage.setItem('digimarket_settings', JSON.stringify(storeSettings));
    document.title = storeSettings.seoTitle || storeSettings.storeName;
    
    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', storeSettings.seoDescription);

    // Update Google Search Console
    if (storeSettings.googleSearchConsoleCode) {
      let gscMeta = document.querySelector('meta[name="google-site-verification"]');
      if (!gscMeta) {
        gscMeta = document.createElement('meta');
        gscMeta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(gscMeta);
      }
      gscMeta.setAttribute('content', storeSettings.googleSearchConsoleCode);
    }

    // Update Bing Webmaster
    if (storeSettings.bingWebmasterCode) {
      let bingMeta = document.querySelector('meta[name="msvalidate.01"]');
      if (!bingMeta) {
        bingMeta = document.createElement('meta');
        bingMeta.setAttribute('name', 'msvalidate.01');
        document.head.appendChild(bingMeta);
      }
      bingMeta.setAttribute('content', storeSettings.bingWebmasterCode);
    }

    // Update Google Analytics
    // Remove existing scripts to prevent duplicates if ID changes
    const existingScript = document.getElementById('ga-script');
    if (existingScript) existingScript.remove();
    const existingInline = document.getElementById('ga-inline');
    if (existingInline) existingInline.remove();

    if (storeSettings.googleAnalyticsId) {
      const script = document.createElement('script');
      script.id = 'ga-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${storeSettings.googleAnalyticsId}`;
      document.head.appendChild(script);

      const inlineScript = document.createElement('script');
      inlineScript.id = 'ga-inline';
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${storeSettings.googleAnalyticsId}');
      `;
      document.head.appendChild(inlineScript);
    }

  }, [storeSettings]);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, products]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  // View Details
  const handleViewProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setCurrentView('product');
    window.scrollTo(0,0);
  };

  // View Page
  const handleViewPage = (id: string) => {
    setSelectedPageId(id);
    setCurrentView('page');
    window.scrollTo(0,0);
  };

  // --- Admin Handlers ---
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Page CRUD
  const handleAddPage = (newPage: Page) => setPages(prev => [...prev, newPage]);
  const handleUpdatePage = (updatedPage: Page) => setPages(prev => prev.map(p => p.id === updatedPage.id ? updatedPage : p));
  const handleDeletePage = (id: string) => setPages(prev => prev.filter(p => p.id !== id));

  if (isAdminOpen) {
    return (
      <AdminDashboard 
        products={products}
        onAdd={handleAddProduct}
        onUpdate={handleUpdateProduct}
        onDelete={handleDeleteProduct}
        onClose={() => setIsAdminOpen(false)}
        storeSettings={storeSettings}
        onUpdateSettings={setStoreSettings}
        pages={pages}
        onAddPage={handleAddPage}
        onUpdatePage={handleUpdatePage}
        onDeletePage={handleDeletePage}
      />
    );
  }

  // --- Views ---

  const HomeView = () => {
    return (
      <>
        {/* Banner */}
        <div className="bg-indigo-900 rounded-3xl p-8 md:p-16 mb-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 flex flex-col items-center">
            <span className="bg-indigo-800 text-indigo-200 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 animate-fade-in">
              New Arrivals: 2024 Collections
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight max-w-4xl">
              Premium WordPress Tools<br />
              <span className="text-indigo-400">Without the Premium Price Tag</span>
            </h1>
            <p className="text-indigo-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Genuine licenses for the world's best plugins, themes, and builders. Instant delivery. Verified updates. 100% Secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
               <button
                 onClick={() => setCurrentView('shop')}
                 className="px-8 py-4 bg-white text-indigo-900 rounded-full font-bold hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
               >
                 Start Shopping <ArrowRight size={20} />
               </button>
               <button
                  onClick={() => { setSelectedCategory('Builders & Addons'); setCurrentView('shop'); }}
                  className="px-8 py-4 border-2 border-indigo-400 text-indigo-100 rounded-full font-bold hover:bg-indigo-800/50 hover:border-indigo-300 transition-colors flex items-center justify-center"
               >
                 View Builders
               </button>
            </div>
          </div>
        </div>

        {/* Trust Badges Section */}
        <div className="bg-white rounded-3xl shadow-lg shadow-indigo-100 border border-indigo-50 p-8 md:p-12 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 z-0"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-50 rounded-full -ml-12 -mb-12 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
             {/* Item 1 */}
             <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300">
                   <ShieldCheck size={32} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Original Items</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Original WordPress Themes & Plugins. Authentic files only.</p>
             </div>
             
             {/* Item 2 */}
             <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300">
                   <Ban size={32} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">No Nulled / GPL</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Strict Policy: No GPL • No Nulled • No Cracked software.</p>
             </div>
             
             {/* Item 3 */}
             <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300">
                   <RefreshCw size={32} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Regular Updates</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Get the latest features and security patches instantly.</p>
             </div>
             
             {/* Item 4 */}
             <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300">
                   <Headphones size={32} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Quick Support</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Dedicated support team available to help you set up.</p>
             </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="mb-20">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                <Zap className="text-amber-500 fill-amber-500" /> Featured Products
              </h2>
              <p className="text-slate-500 mt-2">Explore our hand-picked selections for professional developers.</p>
            </div>
            <button onClick={() => setCurrentView('shop')} className="text-indigo-600 font-semibold hover:text-indigo-800 hidden sm:block">View All Products &rarr;</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onViewDetails={() => handleViewProduct(product)} />
            ))}
          </div>
        </div>

        {/* Best Sellers Section */}
        <div className="mb-20">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="text-indigo-600" /> Best Sellers
              </h2>
              <p className="text-slate-500 mt-2">Our most popular items this month</p>
            </div>
            <button onClick={() => setCurrentView('shop')} className="text-indigo-600 font-semibold hover:text-indigo-800 hidden sm:block">View All Products &rarr;</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Logic: show expensive items or random set for variety */}
            {products.filter(p => p.price >= 25).slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onViewDetails={() => handleViewProduct(product)} />
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="mb-20 bg-slate-100 rounded-3xl p-10 md:p-16">
           <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900">Trusted by Agencies & Freelancers</h2>
              <p className="text-slate-500 mt-2">See what our customers are saying about us</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {TESTIMONIALS.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-sm h-full flex flex-col hover:-translate-y-1 transition-transform duration-300">
                   <div className="flex text-amber-400 mb-4">
                      {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                   </div>
                   <p className="text-slate-600 mb-6 leading-relaxed flex-1 italic">"{testimonial.text}"</p>
                   <div className="flex items-center gap-3 mt-auto">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-100" 
                        loading="lazy"
                      />
                      <div>
                         <h4 className="font-bold text-sm text-slate-900">{testimonial.name}</h4>
                         <p className="text-xs text-slate-500">{testimonial.role}</p>
                      </div>
                   </div>
                </div>
             ))}
           </div>
        </div>

        {/* FAQ Section */}
        <FAQSection />

        {/* Newsletter / CTA */}
        <div className="bg-indigo-600 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden mb-8">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-800 rounded-full blur-3xl opacity-50 -ml-16 -mb-16"></div>
           
           <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Get Exclusive Deals & Updates</h2>
              <p className="text-indigo-100 mb-8">Subscribe to our newsletter and get 10% off your first purchase of any plugin or theme.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                 <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="flex-1 px-6 py-3 rounded-full text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-400"
                 />
                 <button className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-colors shadow-lg">
                    Subscribe
                 </button>
              </div>
              <p className="text-indigo-200 text-xs mt-4">No spam, unsubscribe at any time.</p>
           </div>
        </div>
      </>
    );
  };

  const ShopView = () => (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Shop All Products</h1>
        <p className="text-slate-500 max-w-2xl">Browse our extensive collection of WordPress tools. Use the filters below to narrow down your search.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sticky top-20 z-30 bg-slate-50/95 backdrop-blur-sm py-4 border-b border-slate-200">
         <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto no-scrollbar">
            <div className="flex items-center gap-2 text-slate-500 mr-2 shrink-0">
              <Filter size={18} />
              <span className="text-sm font-medium">Category:</span>
            </div>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
         </div>
         <div className="text-slate-500 text-sm whitespace-nowrap">
           Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> results
         </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onViewDetails={() => handleViewProduct(product)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="bg-slate-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <SlidersHorizontal size={32} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No products found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search or filter criteria.</p>
          <button
             onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
             className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </>
  );

  const ContactView = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h1>
        <p className="text-slate-500 text-lg">Have questions about a product or need support? We're here to help.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-8 md:p-12 bg-indigo-900 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <MapPin className="text-indigo-400 mt-1" />
                  <span>{storeSettings.contactAddress}</span>
                </li>
                <li className="flex items-center gap-4">
                  <Mail className="text-indigo-400" />
                  <span>{storeSettings.supportEmail}</span>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="text-indigo-400" />
                  <span>{storeSettings.contactPhone}</span>
                </li>
              </ul>
            </div>
            <div className="mt-12">
               <div className="flex gap-4">
                 {/* Social Icons for Contact Page */}
                 <a href={storeSettings.socials.facebook || '#'} target="_blank" className="w-10 h-10 bg-indigo-800 rounded-full flex items-center justify-center hover:bg-indigo-600 cursor-pointer transition-colors text-white font-bold">f</a>
                 <a href={storeSettings.socials.linkedin || '#'} target="_blank" className="w-10 h-10 bg-indigo-800 rounded-full flex items-center justify-center hover:bg-indigo-600 cursor-pointer transition-colors text-white font-bold">in</a>
                 <a href={storeSettings.socials.twitter || '#'} target="_blank" className="w-10 h-10 bg-indigo-800 rounded-full flex items-center justify-center hover:bg-indigo-600 cursor-pointer transition-colors text-white font-bold">x</a>
               </div>
            </div>
         </div>

         <div className="p-8 md:p-12">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input type="email" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="How can we help you?" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                <Send size={18} /> Send Message
              </button>
            </form>
         </div>
      </div>
    </div>
  );

  const PageView = () => {
    if (!selectedPage) return null;
    return (
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">{selectedPage.title}</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
           <div className="prose prose-slate max-w-none whitespace-pre-wrap">
             {selectedPage.content}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        storeName={storeSettings.storeName}
        logoUrl={storeSettings.logoUrl}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAdmin={() => setIsAdminOpen(true)}
        currentView={currentView === 'product' ? 'shop' : (currentView === 'page' ? 'home' : currentView)}
        onChangeView={(view) => setCurrentView(view)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {currentView === 'home' && <HomeView />}
        {currentView === 'shop' && <ShopView />}
        {currentView === 'contact' && <ContactView />}
        {currentView === 'page' && <PageView />}
        {currentView === 'product' && selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            onAddToCart={handleAddToCart}
            onBack={() => setCurrentView('shop')}
          />
        )}
      </main>

      <Footer 
        settings={storeSettings} 
        pages={pages}
        onChangeView={(view, id) => { 
          if(view === 'page' && id) {
             handleViewPage(id);
          } else {
             setCurrentView(view); 
             window.scrollTo(0,0); 
          }
        }}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      <AIAssistant />
    </div>
  );
};

export default App;
