
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
  ShieldCheck, Ban, RefreshCw, Headphones, ChevronDown, ChevronUp, HelpCircle,
  LayoutGrid, ChevronLeft, ChevronRight, Key, CreditCard, Download, Users, Code, Lock,
  LifeBuoy
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
    <div className="mb-24 animate-fade-in-up delay-200">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-3">
          <HelpCircle className="text-indigo-600" strokeWidth={2.5} /> Frequently Asked Questions
        </h2>
        <p className="text-slate-500 mt-4 text-lg">Everything you need to know before you buy.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden max-w-5xl mx-auto">
        {/* Tabs */}
        <div className="flex flex-col sm:flex-row border-b border-slate-100">
          {(Object.keys(FAQ_DATA) as Array<keyof typeof FAQ_DATA>).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setOpenIndex(null); }}
              className={`flex-1 py-5 px-6 text-sm font-bold tracking-wide transition-all ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-inner'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div className="p-6 md:p-12 bg-white min-h-[400px]">
          <div className="space-y-4">
            {FAQ_DATA[activeTab].map((item, index) => (
              <div 
                key={index} 
                className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                  openIndex === index 
                    ? 'border-indigo-200 shadow-md ring-1 ring-indigo-50 bg-indigo-50/10' 
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors"
                >
                  <span className={`font-bold text-lg ${openIndex === index ? 'text-indigo-700' : 'text-slate-800'}`}>
                    {item.q}
                  </span>
                  <div className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                    {openIndex === index ? (
                        <ChevronUp className="text-indigo-600" size={24} />
                    ) : (
                        <ChevronDown className="text-slate-400" size={24} />
                    )}
                  </div>
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-5 pt-0 text-slate-600 leading-relaxed border-t border-indigo-50/50">
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

const ITEMS_PER_PAGE = 30;

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

  // Recently Viewed State
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    const saved = localStorage.getItem('digimarket_recent');
    return saved ? JSON.parse(saved) : [];
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
      shopSeoTitle: 'Shop Premium Plugins - DigiMarket Pro',
      shopSeoDescription: 'Browse our extensive catalog of premium WordPress plugins and themes.',
      contactSeoTitle: 'Contact Support - DigiMarket Pro',
      contactSeoDescription: 'Get in touch with our support team for any questions or assistance.',
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
      },
      aiSystemInstruction: `You are a knowledgeable and helpful digital sales assistant for '${STORE_NAME}'.
Your goal is to help customers find the right WordPress plugins and tools from our specific inventory.
Rules:
1. ONLY recommend products that are in the inventory list provided in the context.
2. If a user asks for a product we don't have, suggest a similar alternative from our inventory if one exists, otherwise politely say we don't carry it.
3. Keep responses concise, friendly, and focused on sales.
4. Mention the price when recommending a product.`
    };
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  
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

  // Save Recently Viewed
  useEffect(() => {
    localStorage.setItem('digimarket_recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Save settings & Update SEO / Favicon
  useEffect(() => {
    localStorage.setItem('digimarket_settings', JSON.stringify(storeSettings));
    
    // 1. Dynamic Page Title & Description Logic
    let pageTitle = storeSettings.seoTitle || storeSettings.storeName;
    let pageDesc = storeSettings.seoDescription;

    if (currentView === 'product' && selectedProduct) {
       pageTitle = `${selectedProduct.name} | ${storeSettings.storeName}`;
       // If no product description, fallback to global
       pageDesc = selectedProduct.description ? selectedProduct.description.substring(0, 160) : pageDesc;
    } else if (currentView === 'page' && selectedPage) {
       pageTitle = `${selectedPage.title} | ${storeSettings.storeName}`;
       // Pages generally don't have unique meta desc fields in this simple app, revert to global
    } else if (currentView === 'shop') {
       pageTitle = storeSettings.shopSeoTitle || `Shop | ${storeSettings.storeName}`;
       pageDesc = storeSettings.shopSeoDescription || pageDesc;
    } else if (currentView === 'contact') {
       pageTitle = storeSettings.contactSeoTitle || `Contact | ${storeSettings.storeName}`;
       pageDesc = storeSettings.contactSeoDescription || pageDesc;
    }

    // Apply Title
    document.title = pageTitle;
    
    // Apply Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', pageDesc);

    // 2. Favicon Injection
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    if (storeSettings.faviconUrl) {
      link.href = storeSettings.faviconUrl;
    }

    // 3. Verification Meta Tags
    if (storeSettings.googleSearchConsoleCode) {
      let gscMeta = document.querySelector('meta[name="google-site-verification"]');
      if (!gscMeta) {
        gscMeta = document.createElement('meta');
        gscMeta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(gscMeta);
      }
      gscMeta.setAttribute('content', storeSettings.googleSearchConsoleCode);
    }

    if (storeSettings.bingWebmasterCode) {
      let bingMeta = document.querySelector('meta[name="msvalidate.01"]');
      if (!bingMeta) {
        bingMeta = document.createElement('meta');
        bingMeta.setAttribute('name', 'msvalidate.01');
        document.head.appendChild(bingMeta);
      }
      bingMeta.setAttribute('content', storeSettings.bingWebmasterCode);
    }

    // 4. Google Analytics Script Injection
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

  }, [storeSettings, currentView, selectedProduct, selectedPage]);

  // Reset pagination when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats).sort()];
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
    setRecentlyViewed(prev => {
       const filtered = prev.filter(p => p.id !== product.id);
       return [product, ...filtered].slice(0, 4);
    });
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
      <div className="space-y-24 pb-12">
        {/* Hero Section */}
        <div className="relative bg-indigo-900 rounded-[2.5rem] p-8 md:p-20 overflow-hidden shadow-2xl animate-fade-in-up">
          {/* Background & Hero Content (Unchanged) */}
          <div className="absolute top-0 left-0 w-full h-full">
             <div className="absolute top-10 right-10 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-40 animate-pulse-slow"></div>
             <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-500 rounded-full blur-[100px] opacity-30 animate-pulse-slow delay-300"></div>
             <div className="absolute top-20 right-[15%] text-indigo-300/20 animate-float hidden md:block">
                <Code size={120} strokeWidth={1} />
             </div>
             <div className="absolute bottom-20 left-[10%] text-indigo-300/20 animate-float-delayed hidden md:block">
                <Zap size={100} strokeWidth={1} />
             </div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="inline-block bg-indigo-800/80 backdrop-blur-md border border-indigo-700 text-indigo-200 px-6 py-2 rounded-full text-sm font-bold mb-8 animate-fade-in-up delay-100 shadow-lg">
              ✨ New Arrivals: 2024 Collections Available
            </span>
            <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-8 tracking-tight leading-[1.1] max-w-5xl animate-fade-in-up delay-200">
              Premium WordPress Tools<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-indigo-200">
                Without the Premium Price
              </span>
            </h1>
            <p className="text-indigo-200 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-300">
              Genuine licenses for the world's best plugins, themes, and builders. 
              Instant delivery. Verified updates. 100% Secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto animate-fade-in-up delay-500">
               <button
                 onClick={() => setCurrentView('shop')}
                 className="px-10 py-5 bg-white text-indigo-900 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-900/20 flex items-center justify-center gap-3"
               >
                 Start Shopping <ArrowRight size={22} />
               </button>
               <button
                  onClick={() => { setSelectedCategory('Builders & Addons'); setCurrentView('shop'); }}
                  className="px-10 py-5 border-2 border-indigo-400/30 bg-indigo-800/30 backdrop-blur-sm text-indigo-100 rounded-full font-bold text-lg hover:bg-indigo-800 hover:border-indigo-400 transition-all flex items-center justify-center"
               >
                 View Builders
               </button>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="max-w-6xl mx-auto -mt-12 relative z-20 animate-fade-in-up delay-500">
           <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-slate-100">
              <div className="flex flex-col items-center text-center">
                 <span className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">15K+</span>
                 <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Licenses Sold</span>
              </div>
              <div className="flex flex-col items-center text-center">
                 <span className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">500+</span>
                 <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Premium Products</span>
              </div>
              <div className="flex flex-col items-center text-center">
                 <span className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">99%</span>
                 <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Satisfaction Rate</span>
              </div>
              <div className="flex flex-col items-center text-center">
                 <span className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">24/7</span>
                 <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Expert Support</span>
              </div>
           </div>
        </div>

        {/* Trust Badges Section */}
        <div className="animate-fade-in-up delay-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {/* Item 1 */}
             <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white duration-300">
                   <ShieldCheck size={32} />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">Original Items</h3>
                <p className="text-slate-500 text-sm leading-relaxed">100% Original WordPress Themes & Plugins. Authentic files straight from developers.</p>
             </div>
             
             {/* Item 2 */}
             <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white duration-300">
                   <Ban size={32} />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">No Nulled / GPL</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Strict Policy: No GPL • No Nulled • No Cracked software. Safety first.</p>
             </div>
             
             {/* Item 3 */}
             <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white duration-300">
                   <RefreshCw size={32} />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">Regular Updates</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Get the latest features, bug fixes, and security patches instantly via dashboard.</p>
             </div>
             
             {/* Item 4 - Changed Icon to LifeBuoy */}
             <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white duration-300">
                   <LifeBuoy size={32} />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">Quick Support</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Dedicated expert support team available to help you set up and activate.</p>
             </div>
          </div>
        </div>

        {/* Rest of Home Sections (Featured, How It Works, Best Sellers, Testimonials, FAQ, Newsletter) */}
        {/* Featured Section */}
        <div className="animate-fade-in-up delay-300">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 flex items-center gap-3">
                <Zap className="text-amber-500 fill-amber-500" size={32} /> Featured Products
              </h2>
              <p className="text-slate-500 mt-3 text-lg">Explore our hand-picked selections for professional developers.</p>
            </div>
            <button 
              onClick={() => setCurrentView('shop')} 
              className="group flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 bg-indigo-50 px-5 py-2 rounded-full transition-colors"
            >
               View All Products <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onViewDetails={() => handleViewProduct(product)} />
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-12 animate-fade-in-up delay-200">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">How It Works</h2>
               <p className="text-slate-500 text-lg">Get your site running in 3 simple steps</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
               <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-200 z-0"></div>
               {/* Steps... (Unchanged) */}
               <div className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-24 h-24 bg-white border-4 border-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:border-indigo-500 transition-colors duration-300">
                     <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white"><CreditCard size={32} /></div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">1. Choose & Buy</h3>
                  <p className="text-slate-500 max-w-xs">Select your desired plugin or theme and complete the secure payment.</p>
               </div>
               <div className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-24 h-24 bg-white border-4 border-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:border-indigo-500 transition-colors duration-300">
                     <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white"><Download size={32} /></div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">2. Receive Info</h3>
                  <p className="text-slate-500 max-w-xs">Get your original license key and download links instantly via email.</p>
               </div>
               <div className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-24 h-24 bg-white border-4 border-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:border-indigo-500 transition-colors duration-300">
                     <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white"><Lock size={32} /></div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">3. Activate</h3>
                  <p className="text-slate-500 max-w-xs">Enter the key in your WordPress dashboard or let our team activate it for you.</p>
               </div>
            </div>
        </div>

        {/* Best Sellers */}
        <div className="animate-fade-in-up delay-200">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 flex items-center gap-3">
                <Trophy className="text-indigo-600" size={32} /> Best Sellers
              </h2>
              <p className="text-slate-500 mt-3 text-lg">Our most popular items this month</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.filter(p => p.price >= 25).slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onViewDetails={() => handleViewProduct(product)} />
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-slate-100 rounded-[2.5rem] p-10 md:p-20 animate-fade-in-up delay-300">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Trusted by Agencies & Freelancers</h2>
              <p className="text-slate-500 mt-4 text-lg">See what our customers are saying about us</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {TESTIMONIALS.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-10 rounded-3xl shadow-sm h-full flex flex-col hover:-translate-y-2 transition-transform duration-300 border border-slate-100">
                   <div className="flex text-amber-400 mb-6">
                      {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="currentColor" />)}
                   </div>
                   <p className="text-slate-600 mb-8 leading-relaxed flex-1 text-lg italic">"{testimonial.text}"</p>
                   <div className="flex items-center gap-4 mt-auto border-t border-slate-50 pt-6">
                      <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover ring-4 ring-slate-50" loading="lazy"/>
                      <div>
                         <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                         <p className="text-sm text-slate-500">{testimonial.role}</p>
                      </div>
                   </div>
                </div>
             ))}
           </div>
        </div>

        <FAQSection />

        {/* Newsletter */}
        <div className="bg-indigo-600 rounded-[2.5rem] p-10 md:p-24 text-center text-white relative overflow-hidden mb-12 shadow-2xl animate-fade-in-up delay-300">
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] opacity-60 -mr-20 -mt-20 animate-pulse-slow"></div>
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-[100px] opacity-60 -ml-20 -mb-20 animate-pulse-slow delay-500"></div>
           <div className="relative z-10 max-w-3xl mx-auto">
              <span className="inline-block bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-indigo-100 font-bold text-sm mb-6 border border-white/20">🚀 Join 25,000+ Developers</span>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Get Exclusive Deals & Updates</h2>
              <p className="text-indigo-100 mb-10 text-lg md:text-xl leading-relaxed">Subscribe to our newsletter and get <span className="font-bold text-white bg-indigo-500/50 px-2 py-0.5 rounded">10% off</span> your first purchase.</p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                 <input type="email" placeholder="Enter your email address" className="flex-1 px-8 py-4 rounded-full text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-400 text-lg shadow-lg placeholder:text-slate-400"/>
                 <button className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:scale-105">Subscribe</button>
              </div>
              <p className="text-indigo-200 text-sm mt-6 flex items-center justify-center gap-2"><ShieldCheck size={16} /> No spam, unsubscribe at any time.</p>
           </div>
        </div>
      </div>
    );
  };

  const ShopView = () => {
    // ... Existing ShopView logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (newPage: number) => {
       setCurrentPage(newPage);
       window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
    <div className="flex flex-col lg:flex-row gap-8 pb-12 items-start animate-fade-in-up">
      {/* Sidebar - Categories */}
      <aside className="w-full lg:w-64 flex-shrink-0 space-y-4 lg:space-y-8 lg:sticky lg:top-24">
         <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 hidden lg:flex items-center gap-2">
              <Filter size={18} className="text-indigo-600"/> Categories
            </h3>
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0" style={{scrollbarWidth: 'none'}}>
              {categories.map(cat => {
                const count = cat === 'All' ? products.length : products.filter(p => p.category === cat).length;
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`
                      shrink-0 transition-all text-sm font-medium
                      px-4 py-2 rounded-full border flex items-center
                      lg:border-0 lg:rounded-xl lg:px-4 lg:py-3 lg:w-full lg:flex lg:justify-between lg:items-center
                      ${isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 lg:bg-slate-50 lg:hover:bg-slate-100 lg:hover:border-transparent'}
                    `}
                  >
                    <span className="whitespace-nowrap">{cat}</span>
                    <span className={`hidden lg:inline-block text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-white group-hover:text-indigo-600'}`}>{count}</span>
                  </button>
                )
              })}
            </div>
         </div>
         <div className="hidden lg:block bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <h4 className="font-bold text-indigo-900 mb-2">Need Help?</h4>
            <p className="text-sm text-indigo-700 mb-4">Our AI assistant can help you find the perfect plugin.</p>
            <button onClick={() => document.querySelector('button[aria-label="Ask AI"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))} className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">Ask AI</button>
         </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-1 w-full">
         <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{selectedCategory}</h1>
              <p className="text-slate-500 text-sm">Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} results</p>
            </div>
         </div>
         {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onViewDetails={() => handleViewProduct(product)} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={20} /></button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => handlePageChange(page)} className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{page}</button>
                  ))}
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRight size={20} /></button>
                </div>
              )}
            </>
         ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
              <div className="bg-slate-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4"><LayoutGrid size={32} className="text-slate-400" /></div>
              <h3 className="text-xl font-bold text-slate-900">No products found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your search or category.</p>
              <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">Clear Filters</button>
            </div>
         )}
      </div>
    </div>
    );
  }

  const ContactView = () => (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h1>
        <p className="text-slate-500 text-lg">Have questions about a product or need support? We're here to help.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-8 md:p-12 bg-indigo-900 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4"><MapPin className="text-indigo-400 mt-1" /><span>{storeSettings.contactAddress}</span></li>
                <li className="flex items-center gap-4"><Mail className="text-indigo-400" /><span>{storeSettings.supportEmail}</span></li>
                <li className="flex items-center gap-4"><Phone className="text-indigo-400" /><span>{storeSettings.contactPhone}</span></li>
              </ul>
            </div>
            <div className="mt-12">
               <div className="flex gap-4">
                 <a href={storeSettings.socials.facebook || '#'} target="_blank" className="w-10 h-10 bg-indigo-800 rounded-full flex items-center justify-center hover:bg-indigo-600 cursor-pointer transition-colors text-white font-bold">f</a>
                 <a href={storeSettings.socials.linkedin || '#'} target="_blank" className="w-10 h-10 bg-indigo-800 rounded-full flex items-center justify-center hover:bg-indigo-600 cursor-pointer transition-colors text-white font-bold">in</a>
                 <a href={storeSettings.socials.twitter || '#'} target="_blank" className="w-10 h-10 bg-indigo-800 rounded-full flex items-center justify-center hover:bg-indigo-600 cursor-pointer transition-colors text-white font-bold">x</a>
               </div>
            </div>
         </div>
         <div className="p-8 md:p-12">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label><input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="John Doe" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label><input type="email" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="john@example.com" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Message</label><textarea rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="How can we help you?" /></div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"><Send size={18} /> Send Message</button>
            </form>
         </div>
      </div>
    </div>
  );

  const PageView = () => {
    if (!selectedPage) return null;
    return (
      <div className="max-w-4xl mx-auto py-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">{selectedPage.title}</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
           <div className="prose prose-slate max-w-none whitespace-pre-wrap">{selectedPage.content}</div>
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
            recentlyViewed={recentlyViewed.filter(p => p.id !== selectedProduct.id)}
            onViewRecent={(p) => handleViewProduct(p)}
          />
        )}
      </main>

      <Footer 
        settings={storeSettings} 
        pages={pages}
        onChangeView={(view, id) => { 
          if(view === 'page' && id) { handleViewPage(id); } else { setCurrentView(view); window.scrollTo(0,0); }
        }}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      <AIAssistant products={products} settings={storeSettings} />
    </div>
  );
};

export default App;
