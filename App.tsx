
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
import { Product, CartItem, StoreSettings, Page, Currency, Customer, Review, BlogPost } from './types';
import { 
  Filter, SlidersHorizontal, ArrowRight, ArrowLeft, Mail, Phone, MapPin, Send, Star, Zap, Trophy,
  ShieldCheck, Ban, RefreshCw, Headphones, ChevronDown, ChevronUp, HelpCircle,
  LayoutGrid, ChevronLeft, ChevronRight, Key, CreditCard, Download, Users, Code, Lock, Heart, LifeBuoy, Search, CheckCircle, Smartphone, FileInput,
  LayoutTemplate, BarChart3, ShoppingBag, Calendar, GraduationCap, Wrench, Layers, Package, AlertCircle, BookOpen, Clock, User
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

const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post_1',
    title: 'Top 10 WordPress Plugins for 2024',
    slug: 'top-10-wordpress-plugins-2024',
    excerpt: 'Discover the essential plugins every WordPress site owner needs to boost performance and SEO.',
    content: 'This is a dummy blog post content. You can edit it in the admin dashboard. Listing the top plugins...',
    date: '2024-03-15',
    author: 'Admin',
    category: 'Guides',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'post_2',
    title: 'How to Optimize Core Web Vitals',
    slug: 'optimize-core-web-vitals',
    excerpt: 'Learn how to improve your LCP, FID, and CLS scores using premium caching plugins.',
    content: 'Detailed guide on optimizing Core Web Vitals...',
    date: '2024-03-10',
    author: 'Admin',
    category: 'Performance',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'post_3',
    title: 'Elementor vs Bricks Builder: Which is Better?',
    slug: 'elementor-vs-bricks',
    excerpt: 'A comprehensive comparison of the two most popular WordPress page builders.',
    content: 'Comparing features, performance, and pricing...',
    date: '2024-03-05',
    author: 'Admin',
    category: 'Reviews',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
  }
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

  // Blog State
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('digimarket_posts');
    return saved ? JSON.parse(saved) : DEFAULT_BLOG_POSTS;
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
  
  // View State
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'contact' | 'about' | 'blog' | 'blog-post' | 'product' | 'page' | 'wishlist' | 'profile' | 'checkout'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Derived selected product
  const selectedProduct = useMemo(() => 
    products.find(p => p.id === selectedProductId) || null
  , [products, selectedProductId]);

  // Derived selected page
  const selectedPage = useMemo(() => 
    pages.find(p => p.id === selectedPageId) || null
  , [pages, selectedPageId]);

  // Derived selected post
  const selectedPost = useMemo(() =>
    blogPosts.find(p => p.id === selectedPostId) || null
  , [blogPosts, selectedPostId]);

  // Persistence Effects
  useEffect(() => { localStorage.setItem('digimarket_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('digimarket_pages', JSON.stringify(pages)); }, [pages]);
  useEffect(() => { localStorage.setItem('digimarket_posts', JSON.stringify(blogPosts)); }, [blogPosts]);
  useEffect(() => { localStorage.setItem('digimarket_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('digimarket_history', JSON.stringify(recentlyViewed)); }, [recentlyViewed]);
  useEffect(() => { localStorage.setItem('digimarket_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { 
    if (currentUser) localStorage.setItem('digimarket_current_user', JSON.stringify(currentUser));
    else localStorage.removeItem('digimarket_current_user');
  }, [currentUser]);

  // Save settings & SEO
  useEffect(() => {
    localStorage.setItem('digimarket_settings', JSON.stringify(storeSettings));
    
    let title = storeSettings.seoTitle || storeSettings.storeName;
    let description = storeSettings.seoDescription;

    if (currentView === 'shop') {
      title = storeSettings.shopSeoTitle || `Shop | ${storeSettings.storeName}`;
    } else if (currentView === 'contact') {
      title = storeSettings.contactSeoTitle || `Contact | ${storeSettings.storeName}`;
    } else if (currentView === 'about') {
      title = `About Us | ${storeSettings.storeName}`;
    } else if (currentView === 'blog') {
      title = `Blog | ${storeSettings.storeName}`;
    } else if (currentView === 'blog-post' && selectedPost) {
      title = selectedPost.seoTitle || `${selectedPost.title} | ${storeSettings.storeName}`;
      description = selectedPost.seoDescription || selectedPost.excerpt || description;
    } else if (currentView === 'product' && selectedProduct) {
       title = selectedProduct.seoTitle || `${selectedProduct.name} | ${storeSettings.storeName}`;
       description = selectedProduct.seoDescription || selectedProduct.description?.substring(0, 160) || storeSettings.seoDescription;
    } else if (currentView === 'page' && selectedPage) {
       title = `${selectedPage.title} | ${storeSettings.storeName}`;
    }

    document.title = title;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
  }, [storeSettings, currentView, selectedProduct, selectedPage, selectedPost]);

  // Auth Handlers
  const handleLogin = async (email: string, pass: string): Promise<boolean> => {
     const user = users.find(u => u.email === email && u.password === pass);
     if (user) {
        setCurrentUser(user);
        return true;
     }
     return false;
  };

  const handleRegister = async (name: string, email: string, pass: string): Promise<boolean> => {
     if (users.some(u => u.email === email)) return false;
     const newUser: Customer = {
        id: `cust_${Date.now()}`, name, email, password: pass, joinDate: new Date().toISOString()
     };
     setUsers([...users, newUser]);
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
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => setCartItems(prev => prev.filter(item => item.id !== id));

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => prev.find(p => p.id === product.id) ? prev.filter(p => p.id !== product.id) : [...prev, product]);
  };

  const handleAddReview = (productId: string, review: Omit<Review, 'id' | 'productId' | 'date'>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, reviews: [{ id: `rev_${Date.now()}`, productId, date: new Date().toISOString(), ...review }, ...(p.reviews || [])] };
      }
      return p;
    }));
  };

  const handleViewProduct = (product: Product) => {
    setRecentlyViewed(prev => [product, ...prev.filter(p => p.id !== product.id)].slice(0, 4));
    setSelectedProductId(product.id);
    setCurrentView('product');
    window.scrollTo(0, 0);
  };

  const handleViewPage = (id: string) => {
    setSelectedPageId(id);
    setCurrentView('page');
    window.scrollTo(0, 0);
  };

  const handleViewPost = (post: BlogPost) => {
    setSelectedPostId(post.id);
    setCurrentView('blog-post');
    window.scrollTo(0, 0);
  };

  // Theme Generator
  const generateThemeStyles = () => {
     const primary = storeSettings.primaryColor || '#4f46e5';
     return <style>{`:root { --color-primary: ${primary}; }`}</style>;
  };

  // --- Views ---
  const HomeView = () => (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20 lg:py-32" style={{ backgroundColor: `var(--color-primary)` }}>
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-float-delayed"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8 animate-fade-in-up">
            <Zap size={16} className="fill-current" /><span>Instant Digital Delivery</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 animate-fade-in-up delay-100 leading-tight">{storeSettings.heroHeadline || 'Premium WordPress Tools Without The Premium Price'}</h1>
          <p className="max-w-2xl mx-auto text-lg text-white/90 mb-10 animate-fade-in-up delay-200 leading-relaxed">{storeSettings.heroSubheadline || "Get instant access to 100% original, verified license keys for the world's best plugins and themes. Secure, affordable, and developer-friendly."}</p>
          <div className="max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200 relative z-20">
            <div className="relative group">
               <input type="text" placeholder="Search 5,000+ plugins & themes..." className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/70 rounded-2xl py-4 pl-14 pr-4 text-lg focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white transition-all shadow-xl" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setCurrentView('shop')} />
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70" size={24} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <button onClick={() => setCurrentView('shop')} className="px-8 py-4 bg-white hover:bg-slate-50 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2" style={{ color: 'var(--color-primary)' }}>Browse Shop <ArrowRight size={20} /></button>
            <button onClick={() => { const element = document.getElementById('how-it-works'); element?.scrollIntoView({ behavior: 'smooth' }); }} className="px-8 py-4 bg-black/20 hover:bg-black/30 text-white border border-white/20 rounded-xl font-bold text-lg transition-all backdrop-blur-sm">How It Works</button>
          </div>
          <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up delay-500">
             <div className="flex flex-col items-center gap-2"><ShieldCheck className="text-emerald-300 w-8 h-8 mb-1" /><span className="text-white font-bold">100% Original</span><span className="text-white/70 text-xs">Verified Licenses</span></div>
             <div className="flex flex-col items-center gap-2"><Ban className="text-red-300 w-8 h-8 mb-1" /><span className="text-white font-bold">No GPL/Nulled</span><span className="text-white/70 text-xs">Safe & Secure</span></div>
             <div className="flex flex-col items-center gap-2"><RefreshCw className="text-blue-300 w-8 h-8 mb-1" /><span className="text-white font-bold">Regular Updates</span><span className="text-white/70 text-xs">Via Dashboard</span></div>
             <div className="flex flex-col items-center gap-2"><LifeBuoy className="text-amber-300 w-8 h-8 mb-1" /><span className="text-white font-bold">Quick Support</span><span className="text-white/70 text-xs">Expert Help</span></div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
           <h2 className="text-3xl font-extrabold text-slate-900">Featured Products</h2>
           <p className="text-slate-500 mt-2">Explore our hand-picked selections for professional developers.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {products.slice(0, 4).map((product, idx) => (
             <div key={product.id} className={`animate-fade-in-up`} style={{ animationDelay: `${idx * 100}ms` }}>
               <ProductCard product={product} onAddToCart={addToCart} onViewDetails={() => handleViewProduct(product)} isWishlisted={wishlist.some(p => p.id === product.id)} onToggleWishlist={(e) => { e.stopPropagation(); handleToggleWishlist(product); }} priceMultiplier={selectedCurrency.rate} currencySymbol={selectedCurrency.symbol} />
             </div>
           ))}
        </div>
        <div className="text-center mt-12"><button onClick={() => setCurrentView('shop')} className="font-bold hover:underline flex items-center justify-center gap-1 mx-auto group" style={{ color: 'var(--color-primary)' }}>View All Products <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></button></div>
      </div>

      {/* Best Sellers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
           <div><h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3"><Trophy className="text-amber-500 fill-current" /> Best Sellers</h2><p className="text-slate-500 mt-2">Top rated tools loved by our customers.</p></div>
           <button onClick={() => { setSelectedCategory('Builders & Addons'); setCurrentView('shop'); }} className="text-sm font-bold hover:underline flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>View All <ArrowRight size={14} /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {products.slice(4, 8).map((product, idx) => (
               <div key={product.id} className={`animate-fade-in-up`} style={{ animationDelay: `${idx * 100}ms` }}>
                 <ProductCard product={product} onAddToCart={addToCart} onViewDetails={() => handleViewProduct(product)} isWishlisted={wishlist.some(p => p.id === product.id)} onToggleWishlist={(e) => { e.stopPropagation(); handleToggleWishlist(product); }} priceMultiplier={selectedCurrency.rate} currencySymbol={selectedCurrency.symbol} />
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

      {/* Process / How It Works */}
      <div id="how-it-works" className="py-24 bg-white relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-50/50 rounded-full blur-3xl translate-y-1/2"></div>
         </div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
               <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm">Seamless Structure</span>
               <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">How It Works</h2>
               <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">Get your premium WordPress tools up and running in minutes with our streamlined process.</p>
            </div>
            <div className="relative">
               <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
                  {[{ icon: Search, title: "1. Browse & Select", desc: "Explore our vast catalog of premium plugins and themes.", delay: 0 }, { icon: CreditCard, title: "2. Secure Checkout", desc: "Pay safely via Stripe or PayPal with instant processing.", delay: 200 }, { icon: Mail, title: "3. Instant Delivery", desc: "Receive your license key and download link via email.", delay: 400 }, { icon: CheckCircle, title: "4. Activate & Enjoy", desc: "Enter the key in your dashboard for lifetime updates.", delay: 600 }].map((step, i) => (
                    <div key={i} className="relative group">
                       <div className="flex flex-col items-center text-center">
                          <div className={`w-24 h-24 bg-white rounded-full border-4 border-slate-50 shadow-xl flex items-center justify-center z-10 mb-6 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-indigo-100 group-hover:shadow-indigo-100 group-hover:bg-indigo-600 group-hover:text-white ${i === 0 ? 'animate-fade-in' : ''}`} style={{animationDelay: `${step.delay}ms`, color: 'var(--color-primary)'}}><step.icon size={32} /></div>
                          <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{step.title}</h3>
                          <p className="text-slate-500 leading-relaxed text-sm px-2">{step.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* eCommerce Category Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
         <div className="flex items-center justify-between mb-8 animate-fade-in-up">
            <div><h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><ShoppingBag className="text-violet-600" /> eCommerce & Growth</h2><p className="text-slate-500 text-sm mt-1">Boost your revenue with these essential tools.</p></div>
            <button onClick={() => { setSelectedCategory('eCommerce'); setCurrentView('shop'); }} className="text-sm font-bold hover:underline flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>View Category <ArrowRight size={14} /></button>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up delay-100">
            {products.filter(p => p.category === 'eCommerce').slice(0, 4).map((product) => (<ProductCard key={product.id} product={product} onAddToCart={addToCart} onViewDetails={() => handleViewProduct(product)} isWishlisted={wishlist.some(p => p.id === product.id)} onToggleWishlist={(e) => { e.stopPropagation(); handleToggleWishlist(product); }} priceMultiplier={selectedCurrency.rate} currencySymbol={selectedCurrency.symbol} />))}
         </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16"><h2 className="text-3xl font-extrabold text-slate-900">Trusted by Developers</h2><p className="text-slate-500 mt-2">Join thousands of happy customers.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{TESTIMONIALS.map((t) => (<div key={t.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center"><img src={t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover mb-4 ring-4 ring-slate-50" /><p className="text-slate-600 italic mb-6">"{t.text}"</p><div><h4 className="font-bold text-slate-900">{t.name}</h4><span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>{t.role}</span></div></div>))}</div>
      </div>

      <FAQSection />
    </div>
  );

  const AboutView = () => (
    <div className="animate-fade-in">
       <div className="bg-slate-900 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">About {storeSettings.storeName}</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto px-4">Empowering developers and agencies with premium tools at accessible prices.</p>
       </div>
       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          <div className="prose prose-lg prose-slate mx-auto text-slate-600">
             <p>Founded in 2023, {storeSettings.storeName} began with a simple mission: to make high-quality WordPress development tools accessible to everyone, from freelancers to large agencies.</p>
             <p>We understand the struggle of managing multiple licenses and skyrocketing costs. That's why we partner directly with developers and purchase agency licenses in bulk, passing the savings on to you.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
             <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="text-4xl font-bold text-indigo-600 mb-2">5k+</div>
                <div className="text-slate-600 font-medium">Products Available</div>
             </div>
             <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="text-4xl font-bold text-indigo-600 mb-2">15k+</div>
                <div className="text-slate-600 font-medium">Happy Customers</div>
             </div>
             <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="text-4xl font-bold text-indigo-600 mb-2">99%</div>
                <div className="text-slate-600 font-medium">Satisfaction Rate</div>
             </div>
          </div>

          <div className="bg-indigo-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
             <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Commitment to Quality</h3>
                <ul className="space-y-3">
                   <li className="flex items-center gap-3"><CheckCircle className="text-indigo-600" /> <span>100% Original Files</span></li>
                   <li className="flex items-center gap-3"><CheckCircle className="text-indigo-600" /> <span>Malware Free Guarantee</span></li>
                   <li className="flex items-center gap-3"><CheckCircle className="text-indigo-600" /> <span>Automatic Updates</span></li>
                   <li className="flex items-center gap-3"><CheckCircle className="text-indigo-600" /> <span>Dedicated Support</span></li>
                </ul>
             </div>
             <div className="flex-1">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Team" className="rounded-2xl shadow-lg" />
             </div>
          </div>
       </div>
    </div>
  );

  const BlogView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
       <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Our Blog</h1>
          <p className="text-lg text-slate-500">Latest news, tutorials, and updates from the WordPress world.</p>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
             <div key={post.id} onClick={() => handleViewPost(post)} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all group">
                <div className="h-48 overflow-hidden">
                   <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                   <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 uppercase font-bold tracking-wide">
                      <span className="text-indigo-600">{post.category}</span>
                      <span>•</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">{post.title}</h3>
                   <p className="text-slate-600 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                   <button className="text-indigo-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Read More <ArrowRight size={16} /></button>
                </div>
             </div>
          ))}
       </div>
       {blogPosts.length === 0 && (
         <div className="text-center py-12 text-slate-500">No articles found. Check back soon!</div>
       )}
    </div>
  );

  const BlogPostView = () => {
    if (!selectedPost) return <div>Post not found</div>;
    return (
       <div className="animate-fade-in">
          <div className="bg-slate-900 text-white py-20">
             <div className="max-w-3xl mx-auto px-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-indigo-300 mb-4 uppercase tracking-wider">
                   <span>{selectedPost.category}</span>
                   <span>•</span>
                   <span>{new Date(selectedPost.date).toLocaleDateString()}</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">{selectedPost.title}</h1>
                <div className="flex items-center justify-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">A</div>
                   <div className="text-left">
                      <div className="font-bold text-sm">{selectedPost.author}</div>
                      <div className="text-slate-400 text-xs">Author</div>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="max-w-3xl mx-auto px-4 py-12 -mt-10">
             <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-auto rounded-2xl shadow-2xl mb-12 border-4 border-white" />
             
             <div className="prose prose-lg prose-slate max-w-none">
                <p className="lead text-xl text-slate-600 font-medium mb-8">{selectedPost.excerpt}</p>
                {selectedPost.content.split('\n').map((para, i) => (
                   <p key={i}>{para}</p>
                ))}
             </div>

             <div className="mt-12 pt-8 border-t border-slate-200">
                <button onClick={() => setCurrentView('blog')} className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                   <ArrowLeft size={20} /> Back to Blog
                </button>
             </div>
          </div>
       </div>
    );
  };

  // Re-implementing basic views to ensure full file correctness
  const ShopView = () => {
    // Logic for filtering products
    const filtered = products.filter(p => (selectedCategory === 'All' || p.category === selectedCategory) && (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase())));
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const categoriesList = ['All', ...(Array.from(new Set(products.map(p => p.category))) as string[])];

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8 animate-fade-in">
         <div className="mb-8"><h1 className="text-3xl font-bold text-slate-900">{selectedCategory}</h1><p className="text-slate-500 mt-1">Showing {paginated.length} results</p></div>
         <div className="flex flex-col lg:flex-row gap-8">
           <aside className="lg:w-64 shrink-0">
              <div className="sticky top-24 space-y-8">
                 <div><h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Filter size={18}/> Categories</h3><div className="flex flex-col space-y-1">{categoriesList.map(cat => (<button key={cat} onClick={() => setSelectedCategory(cat)} className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`} style={selectedCategory === cat ? { color: 'var(--color-primary)' } : {}}>{cat}</button>))}</div></div>
              </div>
           </aside>
           <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map(product => (<ProductCard key={product.id} product={product} onAddToCart={addToCart} onViewDetails={() => handleViewProduct(product)} isWishlisted={wishlist.some(p => p.id === product.id)} onToggleWishlist={(e) => { e.stopPropagation(); handleToggleWishlist(product); }} priceMultiplier={selectedCurrency.rate} currencySymbol={selectedCurrency.symbol} />))}
              </div>
              {totalPages > 1 && <div className="mt-12 flex justify-center gap-2">{Array.from({length: totalPages}, (_, i) => i + 1).map(page => <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg font-bold ${currentPage === page ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>{page}</button>)}</div>}
           </div>
         </div>
      </div>
    );
  };

  const ContactView = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
       <div className="text-center mb-16"><h1 className="text-4xl font-extrabold text-slate-900 mb-4">Get in Touch</h1><p className="text-lg text-slate-500">Have questions about a license? Our team is here to help 24/7.</p></div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center"><Mail size={24} className="mx-auto mb-4 text-indigo-600"/><h3 className="font-bold mb-2">Email Support</h3><p className="text-sm text-slate-500">{storeSettings.supportEmail}</p></div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center"><Phone size={24} className="mx-auto mb-4 text-purple-600"/><h3 className="font-bold mb-2">Phone</h3><p className="text-sm text-slate-500">{storeSettings.contactPhone}</p></div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center"><MapPin size={24} className="mx-auto mb-4 text-emerald-600"/><h3 className="font-bold mb-2">Office</h3><p className="text-sm text-slate-500">{storeSettings.contactAddress}</p></div>
       </div>
    </div>
  );

  const PageView = () => selectedPage ? (<div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in"><h1 className="text-4xl font-extrabold mb-8">{selectedPage.title}</h1><div className="prose prose-slate max-w-none">{selectedPage.content}</div></div>) : <div>Page not found</div>;
  
  const WishlistView = () => (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in"><h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><Heart className="text-red-500 fill-current"/> My Wishlist</h1>{wishlist.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{wishlist.map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} onViewDetails={() => handleViewProduct(p)} isWishlisted={true} onToggleWishlist={(e) => {e.stopPropagation(); handleToggleWishlist(p)}} priceMultiplier={selectedCurrency.rate} currencySymbol={selectedCurrency.symbol}/>)}</div> : <div className="text-center py-24"><p>Wishlist empty</p></div>}</div>
  );

  const CheckoutView = () => {
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) * selectedCurrency.rate;
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', country: '', city: '', zip: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePlaceOrder = () => {
       const newErrors: Record<string, string> = {};
       if (!form.firstName) newErrors.firstName = "Required";
       if (!form.lastName) newErrors.lastName = "Required";
       if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Valid email required";
       if (!form.phone) newErrors.phone = "Required";
       if (!form.country) newErrors.country = "Required";
       if (!form.city) newErrors.city = "Required";
       if (!form.zip) newErrors.zip = "Required";
       setErrors(newErrors);

       if (Object.keys(newErrors).length === 0) {
          setIsSubmitting(true);
          setTimeout(() => { setIsSubmitting(false); setCartItems([]); setCurrentView('home'); alert('Order placed!'); }, 2000);
       } else {
          window.scrollTo({top: 0, behavior: 'smooth'});
       }
    };

    const getInputClass = (name: string) => `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all ${errors[name] ? 'border-red-500 bg-red-50' : 'border-slate-200'}`;

    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8">Secure Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Billing Details</h2>
              {Object.keys(errors).length > 0 && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex gap-2"><AlertCircle/> Please fix errors below.</div>}
              <form className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                   <div><label className="block text-sm font-bold mb-2">First Name</label><input type="text" className={getInputClass('firstName')} value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} /></div>
                   <div><label className="block text-sm font-bold mb-2">Last Name</label><input type="text" className={getInputClass('lastName')} value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} /></div>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                   <div><label className="block text-sm font-bold mb-2">Email</label><input type="email" className={getInputClass('email')} value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                   <div><label className="block text-sm font-bold mb-2">Phone</label><input type="tel" className={getInputClass('phone')} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                 </div>
                 <div><label className="block text-sm font-bold mb-2">Address</label><input type="text" className={getInputClass('address')} value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
                 <div className="grid grid-cols-2 gap-6">
                   <div><label className="block text-sm font-bold mb-2">Country</label><select className={getInputClass('country')} value={form.country} onChange={e => setForm({...form, country: e.target.value})}><option value="">Select...</option><option value="US">United States</option><option value="MA">Morocco</option><option value="UK">United Kingdom</option></select></div>
                   <div><label className="block text-sm font-bold mb-2">City</label><input type="text" className={getInputClass('city')} value={form.city} onChange={e => setForm({...form, city: e.target.value})} /></div>
                 </div>
                 <div><label className="block text-sm font-bold mb-2">ZIP / Postcode</label><input type="text" className={getInputClass('zip')} value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} /></div>
              </form>
           </div>
           <div className="lg:col-span-1">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 sticky top-24">
                 <h2 className="text-lg font-bold mb-6">Order Summary</h2>
                 <div className="space-y-4 mb-6">{cartItems.map(item => (<div key={item.id} className="flex justify-between text-sm"><span>{item.name} x{item.quantity}</span><span className="font-bold">{selectedCurrency.symbol}{(item.price * item.quantity * selectedCurrency.rate).toFixed(2)}</span></div>))}</div>
                 <div className="border-t border-slate-200 pt-4 flex justify-between font-bold text-xl mb-6"><span>Total</span><span>{selectedCurrency.symbol}{total.toFixed(2)}</span></div>
                 <button onClick={handlePlaceOrder} disabled={isSubmitting || cartItems.length === 0} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-70">{isSubmitting ? 'Processing...' : 'Place Order'}</button>
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
        searchResults={searchQuery.length > 0 ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5) : []}
      />
      
      <main className="flex-1 pt-6">
        {currentView === 'home' && <HomeView />}
        {currentView === 'shop' && <ShopView />}
        {currentView === 'contact' && <ContactView />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'blog' && <BlogView />}
        {currentView === 'blog-post' && <BlogPostView />}
        {currentView === 'wishlist' && <WishlistView />}
        {currentView === 'page' && <PageView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'profile' && currentUser && <CustomerDashboard customer={currentUser} onLogout={handleLogout} currencySymbol={selectedCurrency.symbol} />}
        {currentView === 'product' && selectedProduct && <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><ProductDetail product={selectedProduct} onAddToCart={addToCart} onBack={() => setCurrentView('shop')} isWishlisted={wishlist.some(p => p.id === selectedProduct.id)} onToggleWishlist={() => handleToggleWishlist(selectedProduct)} priceMultiplier={selectedCurrency.rate} currencySymbol={selectedCurrency.symbol} recentlyViewed={recentlyViewed} onViewHistoryItem={handleViewProduct} currentUser={currentUser} onAddReview={handleAddReview} /></div>}
      </main>

      <Footer settings={storeSettings} pages={pages} onChangeView={(view: string, id?: string) => { if(id) handleViewPage(id); else setCurrentView(view as any); window.scrollTo(0,0); }} />
      
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onRemoveItem={removeFromCart} onUpdateQuantity={updateQuantity} priceMultiplier={selectedCurrency.rate} currencySymbol={selectedCurrency.symbol} onCheckout={() => { setIsCartOpen(false); setCurrentView('checkout'); window.scrollTo(0,0); }} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} onRegister={handleRegister} />
      
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 bg-white animate-fade-in">
          <AdminDashboard 
            products={products}
            onAdd={(p) => setProducts([...products, p])}
            onUpdate={(p) => setProducts(products.map(prod => prod.id === p.id ? p : prod))}
            onDelete={(id) => setProducts(products.filter(p => p.id !== id))}
            onClose={() => setIsAdminOpen(false)}
            storeSettings={storeSettings}
            onUpdateSettings={(s) => setStoreSettings(s)}
            pages={pages}
            onAddPage={(p) => setPages([...pages, p])}
            onUpdatePage={(p) => setPages(pages.map(page => page.id === p.id ? p : page))}
            onDeletePage={(id) => setPages(pages.filter(p => p.id !== id))}
            blogPosts={blogPosts}
            onAddPost={(p) => setBlogPosts([...blogPosts, p])}
            onUpdatePost={(p) => setBlogPosts(blogPosts.map(post => post.id === p.id ? p : post))}
            onDeletePost={(id) => setBlogPosts(blogPosts.filter(p => p.id !== id))}
          />
        </div>
      )}
    </div>
  );
};

export default App;
