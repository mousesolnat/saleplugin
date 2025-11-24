import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { CartSidebar } from './components/CartSidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { PRODUCTS as INITIAL_PRODUCTS, STORE_NAME, CURRENCIES } from './constants';
import { Product, CartItem, StoreSettings, Page, Currency, Customer } from './types';
import { 
  Filter, SlidersHorizontal, ArrowRight, Mail, Phone, MapPin, Send, Star, Zap, Trophy,
  ShieldCheck, Ban, RefreshCw, Headphones, ChevronDown, ChevronUp, HelpCircle,
  LayoutGrid, ChevronLeft, ChevronRight, Key, CreditCard, Download, Users, Code, Lock, Heart, LifeBuoy, Search, CheckCircle, Smartphone, FileInput,
  LayoutTemplate, BarChart3, ShoppingBag, Calendar, GraduationCap, Wrench, Layers
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

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('digimarket_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // User Auth State
  const [users, setUsers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('digimarket_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<Customer | null>(() => {
    const saved = localStorage.getItem('digimarket_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Global Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('digimarket_settings');
    const defaultSettings: StoreSettings = {
      storeName: STORE_NAME,
      siteUrl: 'https://digimarket.pro',
      supportEmail: 'support@digimarket.pro',
      currencySymbol: '$',
      currencyCode: 'USD',
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
      },
      primaryColor: '#4f46e5',
      heroHeadline: 'Premium WordPress Tools Without The Premium Price',
      heroSubheadline: 'Get instant access to 100% original, verified license keys for the world\'s best plugins and themes. Secure, affordable, and developer-friendly.'
    };
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  // Selected Currency for User View
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0]);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
     const saved = localStorage.getItem('digimarket_history');
     return saved ? JSON.parse(saved) : [];
  });
  
  // View State (Simple Routing)
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'contact' | 'product' | 'page' | 'wishlist' | 'profile' | 'checkout'>('home');
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

  // Save wishlist
  useEffect(() => {
    localStorage.setItem('digimarket_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Save history
  useEffect(() => {
    localStorage.setItem('digimarket_history', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Save Users
  useEffect(() => {
    localStorage.setItem('digimarket_users', JSON.stringify(users));
  }, [users]);

  // Save Current User Session
  useEffect(() => {
    if (currentUser) {
        localStorage.setItem('digimarket_current_user', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('digimarket_current_user');
    }
  }, [currentUser]);

  // Save settings when they change & Update Document Title / Meta
  useEffect(() => {
    localStorage.setItem('digimarket_settings', JSON.stringify(storeSettings));
    
    // Determine Title and Meta Description based on View
    let title = storeSettings.seoTitle || storeSettings.storeName;
    let description = storeSettings.seoDescription;

    if (currentView === 'shop' && storeSettings.shopSeoTitle) {
      title = storeSettings.shopSeoTitle;
      description = storeSettings.shopSeoDescription || description;
    } else if (currentView === 'contact' && storeSettings.contactSeoTitle) {
      title = storeSettings.contactSeoTitle;
      description = storeSettings.contactSeoDescription || description;
    } else if (currentView === 'product' && selectedProduct) {
       title = selectedProduct.seoTitle || `${selectedProduct.name} | ${storeSettings.storeName}`;
       description = selectedProduct.seoDescription || selectedProduct.description?.substring(0, 160) || storeSettings.seoDescription;
    } else if (currentView === 'page' && selectedPage) {
       title = `${selectedPage.title} | ${storeSettings.storeName}`;
    }

    document.title = title;
    
    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Favicon
    let linkIcon = document.querySelector('link[rel="icon"]');
    if (!linkIcon) {
        linkIcon = document.createElement('link');
        linkIcon.setAttribute('rel', 'icon');
        document.head.appendChild(linkIcon);
    }
    linkIcon.setAttribute('href', storeSettings.faviconUrl || '/favicon.ico');

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

    // Google Analytics Injection
    if (storeSettings.googleAnalyticsId) {
       let script = document.querySelector(`script[src^="https://www.googletagmanager.com/gtag/js?id="]`);
       if (!script) {
         script = document.createElement('script');
         script.setAttribute('async', 'true');
         script.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${storeSettings.googleAnalyticsId}`);
         document.head.appendChild(script);

         const inlineScript = document.createElement('script');
         inlineScript.innerHTML = `
           window.dataLayer = window.dataLayer || [];
           function gtag(){dataLayer.push(arguments);}
           gtag('js', new Date());
           gtag('config', '${storeSettings.googleAnalyticsId}');
         `;
         document.head.appendChild(inlineScript);
       }
    }
  }, [storeSettings, currentView, selectedProduct, selectedPage]);

  // Auth Handlers
  const handleLogin = async (email: string, pass: string): Promise<boolean> => {
     // Simple mock auth against local state
     const user = users.find(u => u.email === email && u.password === pass);
     if (user) {
        setCurrentUser(user);
        return true;
     }
     return false;
  };

  const handleRegister = async (name: string, email: string, pass: string): Promise<boolean> => {
     // Check if exists
     if (users.some(u => u.email === email)) return false;
     
     const newUser: Customer = {
        id: `cust_${Date.now()}`,
        name,
        email,
        password: pass, // In production, never store raw passwords
        joinDate: new Date().toISOString()
     };
     
     const updatedUsers = [...users, newUser];
     setUsers(updatedUsers);
     setCurrentUser(newUser);
     return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  // Cart & Wishlist Handlers
  const addToCart = (product: Product) => {
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

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.find(p => p.id === product.id)) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleViewProduct = (product: Product) => {
    // Add to History
    setRecentlyViewed(prev => {
       const filtered = prev.filter(p => p.id !== product.id);
       return [product, ...filtered].slice(0, 4);
    });

    setSelectedProductId(product.id);
    setCurrentView('product');
    window.scrollTo(0, 0);
  };

  const handleViewPage = (id: string) => {
    setSelectedPageId(id);
    setCurrentView('page');
    window.scrollTo(0, 0);
  };

  // Products filtering
  const filteredProducts = products.filter(p => 
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     p.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const searchResults = searchQuery.length > 0 ? filteredProducts.slice(0, 5) : [];

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'All': return <LayoutGrid size={16} />;
      case 'Builders & Addons': return <LayoutTemplate size={16} />;
      case 'SEO & Marketing': return <BarChart3 size={16} />;
      case 'eCommerce': return <ShoppingBag size={16} />;
      case 'Forms & Leads': return <FileInput size={16} />;
      case 'Performance': return <Zap size={16} />;
      case 'Booking & Events': return <Calendar size={16} />;
      case 'LMS & Education': return <GraduationCap size={16} />;
      case 'Plugins & Tools': return <Wrench size={16} />;
      default: return <Layers size={16} />;
    }
  };

  // Pagination Logic
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Theme Generator ---
  const generateThemeStyles = () => {
     // Generate CSS variable for primary color
     const primary = storeSettings.primaryColor || '#4f46e5';
     return (
       <style>{`
         :root {
           --color-primary: ${primary};
         }
       `}</style>
     );
  };

  // --- Views ---

  const HomeView = () => (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <div 
        className="relative overflow-hidden py-20 lg:py-32"
        style={{ backgroundColor: `var(--color-primary)` }}
      >
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-float-delayed"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8 animate-fade-in-up">
            <Zap size={16} className="fill-current" />
            <span>Instant Digital Delivery</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 animate-fade-in-up delay-100 leading-tight">
             {storeSettings.heroHeadline || 'Premium WordPress Tools Without The Premium Price'}
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-white/90 mb-10 animate-fade-in-up delay-200 leading-relaxed">
            {storeSettings.heroSubheadline || "Get instant access to 100% original, verified license keys for the world's best plugins and themes. Secure, affordable, and developer-friendly."}
          </p>

          {/* New Hero Search Bar */}
          <div className="max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200 relative z-20">
            <div className="relative group">
               <input
                 type="text"
                 placeholder="Search 5,000+ plugins & themes..."
                 className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/70 rounded-2xl py-4 pl-14 pr-4 text-lg focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white transition-all shadow-xl"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && setCurrentView('shop')}
               />
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70" size={24} />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <button 
              onClick={() => setCurrentView('shop')}
              className="px-8 py-4 bg-white hover:bg-slate-50 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
              style={{ color: 'var(--color-primary)' }}
            >
              Browse Shop <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('how-it-works');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-black/20 hover:bg-black/30 text-white border border-white/20 rounded-xl font-bold text-lg transition-all backdrop-blur-sm"
            >
              How It Works
            </button>
          </div>
          
          {/* Trust strip */}
          <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up delay-500">
             <div className="flex flex-col items-center gap-2">
                <ShieldCheck className="text-emerald-300 w-8 h-8 mb-1" />
                <span className="text-white font-bold">100% Original</span>
                <span className="text-white/70 text-xs">Verified Licenses</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <Ban className="text-red-300 w-8 h-8 mb-1" />
                <span className="text-white font-bold">No GPL/Nulled</span>
                <span className="text-white/70 text-xs">Safe & Secure</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <RefreshCw className="text-blue-300 w-8 h-8 mb-1" />
                <span className="text-white font-bold">Regular Updates</span>
                <span className="text-white/70 text-xs">Via Dashboard</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <LifeBuoy className="text-amber-300 w-8 h-8 mb-1" />
                <span className="text-white font-bold">Quick Support</span>
                <span className="text-white/70 text-xs">Expert Help</span>
             </div>
          </div>
        </div>
      </div>

      {/* Featured Products (First 4) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
           <h2 className="text-3xl font-extrabold text-slate-900">Featured Products</h2>
           <p className="text-slate-500 mt-2">Explore our hand-picked selections for professional developers.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {products.slice(0, 4).map((product, idx) => (
             <div key={product.id} className={`animate-fade-in-up`} style={{ animationDelay: `${idx * 100}ms` }}>
               <ProductCard 
                 product={product} 
                 onAddToCart={addToCart} 
                 onViewDetails={() => handleViewProduct(product)}
                 isWishlisted={wishlist.some(p => p.id === product.id)}
                 onToggleWishlist={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                 priceMultiplier={selectedCurrency.rate}
                 currencySymbol={selectedCurrency.symbol}
               />
             </div>
           ))}
        </div>
        <div className="text-center mt-12">
           <button 
             onClick={() => setCurrentView('shop')} 
             className="font-bold hover:underline flex items-center justify-center gap-1 mx-auto group"
             style={{ color: 'var(--color-primary)' }}
           >
             View All Products <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
           <div>
             <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
               <Trophy className="text-amber-500 fill-current" /> Best Sellers
             </h2>
             <p className="text-slate-500 mt-2">Top rated tools loved by our customers.</p>
           </div>
           <button 
             onClick={() => { setSelectedCategory('Builders & Addons'); setCurrentView('shop'); }} 
             className="text-sm font-bold hover:underline flex items-center gap-1"
             style={{ color: 'var(--color-primary)' }}
           >
             View All <ArrowRight size={14} />
           </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {products.slice(4, 8).map((product, idx) => (
               <div key={product.id} className={`animate-fade-in-up`} style={{ animationDelay: `${idx * 100}ms` }}>
                 <ProductCard 
                   product={product} 
                   onAddToCart={addToCart} 
                   onViewDetails={() => handleViewProduct(product)}
                   isWishlisted={wishlist.some(p => p.id === product.id)}
                   onToggleWishlist={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                   priceMultiplier={selectedCurrency.rate}
                   currencySymbol={selectedCurrency.symbol}
                 />
               </div>
           ))}
        </div>
      </div>

      {/* Forms & Leads Category Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
           <div>
             <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
               <FileInput className="text-pink-500" /> Forms & Leads
             </h2>
             <p className="text-slate-500 text-sm mt-1">Capture more leads and grow your list.</p>
           </div>
           <button 
             onClick={() => { setSelectedCategory('Forms & Leads'); setCurrentView('shop'); }} 
             className="text-sm font-bold hover:underline flex items-center gap-1"
             style={{ color: 'var(--color-primary)' }}
           >
             View Category <ArrowRight size={14} />
           </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up delay-100">
           {products
             .filter(p => p.category === 'Forms & Leads')
             .slice(0, 4)
             .map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
                onViewDetails={() => handleViewProduct(product)}
                isWishlisted={wishlist.some(p => p.id === product.id)}
                onToggleWishlist={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                priceMultiplier={selectedCurrency.rate}
                currencySymbol={selectedCurrency.symbol}
              />
           ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 text-white relative overflow-hidden" style={{ backgroundColor: '#1e293b' }}>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
               <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-extrabold text-indigo-300">15k+</div>
                  <div className="text-indigo-100 font-medium">Licenses Sold</div>
               </div>
               <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-extrabold text-indigo-300">99%</div>
                  <div className="text-indigo-100 font-medium">Satisfaction Rate</div>
               </div>
               <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-extrabold text-indigo-300">24/7</div>
                  <div className="text-indigo-100 font-medium">Expert Support</div>
               </div>
               <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-extrabold text-indigo-300">100%</div>
                  <div className="text-indigo-100 font-medium">Secure Payments</div>
               </div>
            </div>
         </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-2">Get your premium tools in 4 simple steps.</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Search size={32} />, title: "1. Browse", desc: "Find the plugin or theme you need from our catalog." },
              { icon: <CreditCard size={32} />, title: "2. Checkout", desc: "Pay securely via Stripe or PayPal." },
              { icon: <Mail size={32} />, title: "3. Receive", desc: "Get your license key delivered to your email instantly." },
              { icon: <CheckCircle size={32} />, title: "4. Activate", desc: "Enter the key in your WordPress dashboard and enjoy." }
            ].map((step, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:-translate-y-2 transition-transform duration-300">
                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ color: 'var(--color-primary)' }}>
                   {step.icon}
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                 <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
         </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900">Trusted by Developers</h2>
          <p className="text-slate-500 mt-2">Join thousands of happy customers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {TESTIMONIALS.map((t) => (
             <div key={t.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover mb-4 ring-4 ring-slate-50" />
                <p className="text-slate-600 italic mb-6">"{t.text}"</p>
                <div>
                   <h4 className="font-bold text-slate-900">{t.name}</h4>
                   <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>{t.role}</span>
                </div>
             </div>
           ))}
        </div>
      </div>

      <FAQSection />

      {/* Newsletter */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4">Join Our Developer Community</h2>
              <p className="text-slate-300 mb-8 max-w-lg mx-auto">Subscribe for exclusive discounts, new product alerts, and WordPress tips delivered to your inbox.</p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                 <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:bg-white/20 transition-all" />
                 <button 
                   className="px-8 py-4 text-white font-bold rounded-xl transition-colors"
                   style={{ backgroundColor: 'var(--color-primary)' }}
                 >
                   Subscribe
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const ShopView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8 animate-fade-in">
       {/* Page Header */}
       <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{selectedCategory}</h1>
          <p className="text-slate-500 mt-1">Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} results</p>
       </div>

       <div className="flex flex-col lg:flex-row gap-8">
         {/* Sidebar Filters */}
         <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-8">
               {/* Categories */}
               <div>
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Filter size={18}/> Categories</h3>
                  
                  {/* Desktop Vertical List */}
                  <div className="hidden lg:flex flex-col space-y-1">
                     {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                             selectedCategory === cat 
                             ? 'bg-slate-100 text-slate-900' 
                             : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                          style={selectedCategory === cat ? { color: 'var(--color-primary)', backgroundColor: '#f1f5f9' } : {}}
                        >
                           <span className="flex items-center gap-2">
                             {getCategoryIcon(cat)} {cat}
                           </span>
                           <span className="text-xs bg-slate-100 text-slate-500 py-0.5 px-2 rounded-full">
                              {products.filter(p => cat === 'All' || p.category === cat).length}
                           </span>
                        </button>
                     ))}
                  </div>

                  {/* Mobile Horizontal Scroll */}
                  <div className="lg:hidden -mx-4 px-4 overflow-x-auto pb-4 no-scrollbar flex gap-2 sticky top-16 z-30 bg-white/95 backdrop-blur-sm py-2">
                     {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${
                             selectedCategory === cat 
                             ? 'text-white border-transparent' 
                             : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                          style={selectedCategory === cat ? { backgroundColor: 'var(--color-primary)' } : {}}
                        >
                           {getCategoryIcon(cat)} {cat}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         </aside>

         {/* Product Grid */}
         <div className="flex-1">
            {currentProducts.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProducts.map(product => (
                     <ProductCard 
                       key={product.id} 
                       product={product} 
                       onAddToCart={addToCart} 
                       onViewDetails={() => handleViewProduct(product)}
                       isWishlisted={wishlist.some(p => p.id === product.id)}
                       onToggleWishlist={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                       priceMultiplier={selectedCurrency.rate}
                       currencySymbol={selectedCurrency.symbol}
                     />
                  ))}
               </div>
            ) : (
               <div className="text-center py-24 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                  <div className="inline-block p-4 bg-white rounded-full shadow-sm mb-4">
                     <Search size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No products found</h3>
                  <p className="text-slate-500">Try adjusting your search or filter.</p>
                  <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-4 font-bold hover:underline" style={{ color: 'var(--color-primary)' }}>
                     Clear all filters
                  </button>
               </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
               <div className="mt-12 flex justify-center items-center gap-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                        currentPage === page 
                        ? 'text-white' 
                        : 'text-slate-600 hover:bg-slate-50'
                      }`}
                      style={currentPage === page ? { backgroundColor: 'var(--color-primary)' } : {}}
                    >
                      {page}
                    </button>
                  ))}

                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
               </div>
            )}
         </div>
       </div>
    </div>
  );

  const ContactView = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
       <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-slate-500">Have questions about a license? Our team is here to help 24/7.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
             <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ color: 'var(--color-primary)' }}>
                <Mail size={24} />
             </div>
             <h3 className="font-bold text-slate-900 mb-2">Email Support</h3>
             <p className="text-slate-500 text-sm mb-4">We usually reply within 2 hours.</p>
             <a href={`mailto:${storeSettings.supportEmail}`} className="font-bold hover:underline" style={{ color: 'var(--color-primary)' }}>{storeSettings.supportEmail}</a>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
             <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone size={24} />
             </div>
             <h3 className="font-bold text-slate-900 mb-2">Phone</h3>
             <p className="text-slate-500 text-sm mb-4">Mon-Fri from 8am to 5pm.</p>
             <a href={`tel:${storeSettings.contactPhone}`} className="font-bold hover:underline" style={{ color: 'var(--color-primary)' }}>{storeSettings.contactPhone}</a>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
             <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin size={24} />
             </div>
             <h3 className="font-bold text-slate-900 mb-2">Office</h3>
             <p className="text-slate-500 text-sm mb-4">Come say hello.</p>
             <span className="text-slate-600 text-sm block px-4">{storeSettings.contactAddress}</span>
          </div>
       </div>

       <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Send us a message</h2>
          <form className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                   <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" placeholder="Your name" />
                </div>
                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                   <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" placeholder="your@email.com" />
                </div>
             </div>
             <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" placeholder="How can we help?" />
             </div>
             <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea rows={6} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" placeholder="Tell us more details..." />
             </div>
             <button 
               className="w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
               style={{ backgroundColor: 'var(--color-primary)' }}
             >
                <Send size={20} /> Send Message
             </button>
          </form>
       </div>
    </div>
  );

  const WishlistView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
       <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
             <Heart className="text-red-500 fill-current" /> My Wishlist
          </h1>
          <p className="text-slate-500 mt-1">{wishlist.length} items saved for later</p>
       </div>

       {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {wishlist.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                  onViewDetails={() => handleViewProduct(product)}
                  isWishlisted={true}
                  onToggleWishlist={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                  priceMultiplier={selectedCurrency.rate}
                  currencySymbol={selectedCurrency.symbol}
                />
             ))}
          </div>
       ) : (
          <div className="text-center py-24 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
             <div className="inline-block p-4 bg-white rounded-full shadow-sm mb-4">
                <Heart size={32} className="text-slate-300" />
             </div>
             <h3 className="text-lg font-bold text-slate-900">Your wishlist is empty</h3>
             <p className="text-slate-500 mb-6">Save items you want to check out later.</p>
             <button 
               onClick={() => setCurrentView('shop')} 
               className="px-6 py-3 text-white rounded-xl font-bold"
               style={{ backgroundColor: 'var(--color-primary)' }}
             >
                Browse Shop
             </button>
          </div>
       )}
    </div>
  );

  const PageView = () => {
    if (!selectedPage) return <div>Page not found</div>;
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
         <h1 className="text-4xl font-extrabold text-slate-900 mb-8">{selectedPage.title}</h1>
         <div className="prose prose-slate max-w-none bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
            {selectedPage.content.split('\n').map((para, i) => (
              <p key={i} className="mb-4 leading-relaxed text-slate-600">{para}</p>
            ))}
         </div>
      </div>
    );
  };

  const CheckoutView = () => {
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) * selectedCurrency.rate;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
           <Lock className="text-indigo-600" style={{ color: 'var(--color-primary)' }} /> Secure Checkout
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Billing Form */}
           <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                 <h2 className="text-xl font-bold text-slate-900 mb-6">Billing Details</h2>
                 <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">First Name *</label>
                          <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
                       </div>
                       <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name *</label>
                          <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Email address *</label>
                          <input type="email" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
                       </div>
                       <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Phone *</label>
                          <input type="tel" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
                       </div>
                    </div>

                    <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-2">Address (optional)</label>
                       <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Street address" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Country *</label>
                          <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">
                             <option>Select a country / region...</option>
                             <option value="US">United States</option>
                             <option value="UK">United Kingdom</option>
                             <option value="CA">Canada</option>
                             <option value="AU">Australia</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Town / City *</label>
                          <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">State / County (optional)</label>
                          <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                       </div>
                       <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Postcode / ZIP *</label>
                          <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
                       </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                       <input type="checkbox" id="create_account" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                       <label htmlFor="create_account" className="text-slate-700 font-medium cursor-pointer">Create an account?</label>
                    </div>

                    <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-2">Additional information</label>
                       <textarea rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Notes about your order, e.g. special notes for delivery." />
                    </div>
                 </form>
              </div>
           </div>

           {/* Order Summary */}
           <div className="lg:col-span-1">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 sticky top-24">
                 <h2 className="text-lg font-bold text-slate-900 mb-6">Your Order</h2>
                 <div className="space-y-4 mb-6">
                    {cartItems.map(item => (
                       <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-slate-600">{item.name} <span className="text-xs text-slate-400">x{item.quantity}</span></span>
                          <span className="font-medium text-slate-900">{selectedCurrency.symbol}{(item.price * item.quantity * selectedCurrency.rate).toFixed(2)}</span>
                       </div>
                    ))}
                    {cartItems.length === 0 && <p className="text-slate-400 italic text-sm text-center py-4">Cart is empty</p>}
                 </div>
                 
                 <div className="border-t border-slate-200 pt-4 flex justify-between items-center mb-6">
                    <span className="font-bold text-slate-700">Total</span>
                    <span className="text-2xl font-extrabold" style={{ color: 'var(--color-primary)' }}>{selectedCurrency.symbol}{total.toFixed(2)}</span>
                 </div>

                 <div className="space-y-3 mb-6">
                    <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                       <input type="radio" name="payment" defaultChecked className="mt-1" />
                       <div>
                          <span className="font-bold text-slate-900 block text-sm">Credit Card (Stripe)</span>
                          <span className="text-xs text-slate-500">Pay securely with credit card.</span>
                       </div>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                       <input type="radio" name="payment" className="mt-1" />
                       <div>
                          <span className="font-bold text-slate-900 block text-sm">PayPal</span>
                          <span className="text-xs text-slate-500">Pay via PayPal; you can pay with your credit card if you don’t have a PayPal account.</span>
                       </div>
                    </div>
                 </div>

                 <button 
                   className="w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                   style={{ backgroundColor: 'var(--color-primary)' }}
                 >
                    Place Order <ArrowRight size={20} />
                 </button>
                 
                 <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-xs">
                    <Lock size={12} /> Secure 256-bit SSL Encryption
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      {generateThemeStyles()}
      
      <Header 
        storeName={storeSettings.storeName}
        logoUrl={storeSettings.logoUrl}
        cartItems={cartItems} 
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAdmin={() => setIsAdminOpen(true)}
        currentView={currentView}
        onChangeView={(view: string) => setCurrentView(view as any)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setCurrentView('wishlist')}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        currentUser={currentUser}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenProfile={() => setCurrentView('profile')}
        onViewProduct={handleViewProduct}
        searchResults={searchResults}
      />
      
      <main className="flex-1 pt-6">
        {currentView === 'home' && <HomeView />}
        {currentView === 'shop' && <ShopView />}
        {currentView === 'contact' && <ContactView />}
        {currentView === 'wishlist' && <WishlistView />}
        {currentView === 'page' && <PageView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'profile' && currentUser && (
           <CustomerDashboard 
             customer={currentUser} 
             onLogout={handleLogout} 
             currencySymbol={selectedCurrency.symbol}
           />
        )}
        {currentView === 'product' && selectedProduct && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductDetail 
              product={selectedProduct} 
              onAddToCart={addToCart} 
              onBack={() => setCurrentView('shop')} 
              isWishlisted={wishlist.some(p => p.id === selectedProduct.id)}
              onToggleWishlist={() => handleToggleWishlist(selectedProduct)}
              priceMultiplier={selectedCurrency.rate}
              currencySymbol={selectedCurrency.symbol}
              recentlyViewed={recentlyViewed}
              onViewHistoryItem={handleViewProduct}
            />
          </div>
        )}
      </main>

      <Footer 
        settings={storeSettings} 
        pages={pages}
        onChangeView={(view: string, id?: string) => {
           if(id && typeof id === 'string') handleViewPage(id as string);
           else setCurrentView(view as any);
           window.scrollTo(0,0);
        }}
      />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        priceMultiplier={selectedCurrency.rate}
        currencySymbol={selectedCurrency.symbol}
        onCheckout={() => {
           setIsCartOpen(false);
           setCurrentView('checkout' as any);
           window.scrollTo(0,0);
        }}
      />

      <AuthModal 
         isOpen={isAuthModalOpen}
         onClose={() => setIsAuthModalOpen(false)}
         onLogin={handleLogin}
         onRegister={handleRegister}
      />
      
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 bg-white animate-fade-in">
          <AdminDashboard 
            products={products}
            onAdd={(p) => setProducts([...products, p])}
            onUpdate={(p) => setProducts(products.map(prod => prod.id === p.id ? p : prod))}
            onDelete={(id) => setProducts(products.filter(p => p.id !== id))}
            onClose={() => setIsAdminOpen(false)}
            storeSettings={storeSettings}
            onUpdateSettings={(s: StoreSettings) => setStoreSettings(s)}
            pages={pages}
            onAddPage={(p) => setPages([...pages, p])}
            onUpdatePage={(p) => setPages(pages.map(page => page.id === p.id ? p : page))}
            onDeletePage={(id) => setPages(pages.filter(p => p.id !== id))}
          />
        </div>
      )}
    </div>
  );
};

export default App;