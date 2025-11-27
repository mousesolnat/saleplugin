

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { CartSidebar } from './components/CartSidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PRODUCTS as INITIAL_PRODUCTS, STORE_NAME, CURRENCIES, LICENSE_DEFINITIONS } from './constants';
import { Product, CartItem, StoreSettings, Page, Currency, Customer, Review, BlogPost, Order, SupportTicket, TicketReply, Coupon } from './types';
import { 
  Filter, ArrowRight, ArrowLeft, Mail, Phone, MapPin, Send, Zap, Trophy,
  ShieldCheck, Ban, RefreshCw, LifeBuoy, Search, CheckCircle, FileInput,
  ShoppingBag, Heart, User, Clock, CreditCard, AlertCircle, ChevronDown, 
  ChevronLeft, ChevronRight, HelpCircle, ChevronUp, Lock, Download, UserPlus, Key,
  Headphones, BarChart3, Layout, Layers, Wrench, GraduationCap, Calendar, Star, Check, LayoutTemplate, Globe
} from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Freelance Developer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    text: "This platform has saved me thousands of dollars. The plugins are genuine and the updates work perfectly."
  },
  {
    id: 2,
    name: "Mike Ross",
    role: "Agency Owner",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    text: "Incredible value for money. Support is responsive and the library is massive. Highly recommended!"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "WordPress Specialist",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    text: "I was skeptical at first, but after 6 months of using their service, I'm a loyal customer. Best deal online."
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

      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row border-b border-slate-200">
          {(Object.keys(FAQ_DATA) as Array<keyof typeof FAQ_DATA>).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setOpenIndex(null); }}
              className={`flex-1 py-5 px-6 text-sm font-bold tracking-wide transition-all ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-inner'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-r border-slate-100 last:border-0'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-12 bg-white min-h-[400px]">
          <div className="space-y-4">
            {FAQ_DATA[activeTab].map((item, index) => (
              <div 
                key={index} 
                className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                  openIndex === index 
                    ? 'border-indigo-200 shadow-md ring-1 ring-indigo-50 bg-white' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
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

const NewsletterSection = () => (
  <div className="bg-indigo-900 relative overflow-hidden py-16">
    <div className="absolute inset-0 opacity-10">
       <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
    </div>
    <div className="absolute top-[-50%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500 blur-3xl opacity-30 animate-pulse-slow"></div>
    <div className="absolute bottom-[-50%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500 blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

    <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
       <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm border border-white/10 shadow-lg">
          <Mail className="text-white" size={20} />
       </div>
       <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
          Join the Developer Club
       </h2>
       <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          Get instant access to secret flash sales, new product alerts, and premium WordPress tutorials delivered straight to your inbox.
       </p>
       
       <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <div className="flex-1 relative group">
             <div className="absolute inset-0 bg-indigo-400 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition-opacity"></div>
             <input 
               type="email" 
               placeholder="Enter your email address" 
               className="relative w-full px-6 py-3 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all shadow-sm"
             />
          </div>
          <button className="px-6 py-3 bg-white text-indigo-900 font-bold text-base rounded-xl hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group">
             <span className="relative z-10">Subscribe</span>
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
       </form>
       
       <div className="mt-4 flex items-center justify-center gap-6 text-indigo-300 text-sm font-medium">
          <span className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Weekly Updates</span>
          <span className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> No Spam</span>
          <span className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Unsubscribe Anytime</span>
       </div>
    </div>
  </div>
);

const DEFAULT_PAGES: Page[] = [
  {
    id: 'page_terms',
    title: 'Terms of Service',
    slug: 'terms-of-service',
    content: '<h2>1. Introduction</h2><p>Welcome to DigiMarket. By accessing our website, you agree to these terms.</p><h2>2. License</h2><p>All products are licensed under GPL.</p>'
  },
  {
    id: 'page_privacy',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: '<h2>Data Collection</h2><p>We collect basic information to process your orders.</p>'
  }
];

const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post_1',
    title: 'Top 10 WordPress Plugins for SEO in 2024',
    slug: 'top-10-seo-plugins',
    excerpt: 'Discover the essential tools to rank your website higher on search engines this year.',
    content: '<p>Search Engine Optimization is crucial...</p>',
    author: 'Alex Writer',
    date: '2024-03-10',
    category: 'SEO',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'post_2',
    title: 'Elementor vs Divi: Which Builder is Right for You?',
    slug: 'elementor-vs-divi',
    excerpt: 'A comprehensive comparison of the two most popular page builders.',
    content: '<p>Choosing a page builder is a big decision...</p>',
    author: 'Sarah Dev',
    date: '2024-03-05',
    category: 'Page Builders',
    image: 'https://images.unsplash.com/photo-1555421689-4922cd295046?auto=format&fit=crop&w=800&q=80'
  }
];

const MOCK_ORDERS: Order[] = [
  {
    id: '#ORD-1001',
    customer: 'Demo Customer',
    email: 'demo@example.com',
    total: 45.00,
    status: 'completed',
    date: '2024-03-15',
    items: 2,
    products: [
       { 
         id: 'prod_1', 
         name: 'Elementor Pro', 
         price: 25, 
         finalPrice: 25, 
         quantity: 1, 
         category: 'Page Builders', 
         licenseType: 'single', 
         licenseLabel: '1 Site Activation', 
         basePrice: 25,
         licensePricing: { single: { enabled: true, price: 25 } }
       },
       { 
         id: 'prod_2', 
         name: 'WP Rocket', 
         price: 20, 
         finalPrice: 20, 
         quantity: 1, 
         category: 'Performance', 
         licenseType: 'single', 
         licenseLabel: '1 Site Activation', 
         basePrice: 20,
         licensePricing: { single: { enabled: true, price: 20 } }
       }
    ]
  }
];

const ITEMS_PER_PAGE = 30;

const App: React.FC = () => {
  // Persistence for products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('digimarket_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration: Ensure all loaded products have the new licensePricing structure
      return parsed.map((p: any) => {
        if (!p.licensePricing) {
          const pricing: any = {};
          LICENSE_DEFINITIONS.forEach(def => {
            pricing[def.type] = {
              enabled: true,
              price: Math.round(p.price * def.defaultMultiplier)
            };
          });
          return { ...p, licensePricing: pricing };
        }
        return p;
      });
    }
    return INITIAL_PRODUCTS;
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

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
      const saved = localStorage.getItem('digimarket_orders');
      return saved ? JSON.parse(saved) : MOCK_ORDERS;
  });

  // Tickets State
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('digimarket_tickets');
    return saved ? JSON.parse(saved) : [];
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

  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('digimarket_coupons');
    return saved ? JSON.parse(saved) : [];
  });

  // Global Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('digimarket_settings');
    const defaultSettings: StoreSettings = {
      storeName: STORE_NAME,
      siteUrl: 'https://allpluginswp.com',
      supportEmail: 'support@allpluginswp.com',
      contactAddress: '123 Digital Avenue, Tech City, Cloud State, 90210',
      contactPhone: '+1 (555) 123-4567',
      footerDescription: 'The #1 marketplace for premium digital products, plugins, and themes. Instant delivery and verified quality.',
      maintenanceMode: false,
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      
      design: {
        primaryColor: '#4f46e5',
        heroHeadline: 'Premium WordPress Tools Without The Premium Price',
        heroSubheadline: "Get instant access to 100% original, verified license keys for the world's best plugins and themes. Secure, affordable, and developer-friendly.",
        fontFamily: 'Inter',
        borderRadius: '1rem',
        announcementBar: {
          enabled: false,
          text: 'Flash Sale: Get 20% off all plugins this weekend!',
          backgroundColor: '#4f46e5',
          textColor: '#ffffff'
        }
      },

      payment: {
        currencySymbol: '$',
        currencyCode: 'USD',
        currencyPosition: 'left',
        taxRate: 0,
        stripeEnabled: true,
        stripePublishableKey: '',
        stripeSecretKey: '',
        paypalEnabled: true,
        paypalClientId: '',
        paypalSecret: '',
        testMode: true
      },

      checkout: {
        guestCheckout: true,
        requirePhone: true,
        enableCoupons: true,
        termsUrl: '/page/terms-of-service',
        privacyUrl: '/page/privacy-policy',
        checkoutTitle: 'Secure Checkout',
        checkoutSubtitle: 'Your information is protected with 256-bit SSL encryption.',
        thankYouTitle: 'Thank You For Your Order!',
        thankYouMessage: 'Your order has been received. You will receive an email confirmation with your license keys shortly. You can also access your downloads from your account dashboard.',
        invoicePrefix: 'INV-'
      },

      emailSettings: {
        senderName: STORE_NAME,
        senderEmail: 'noreply@allpluginswp.com',
        welcomeSubject: 'Welcome to AllPluginsWP',
        orderSubject: 'Your Order Confirmation'
      },

      seo: {
        title: 'AllPluginsWP - Premium WordPress Tools',
        description: 'The best marketplace for WordPress plugins, themes, and builder integrations. Instant delivery and verified licenses.',
        googleAnalyticsId: '',
        googleSearchConsoleCode: '',
        bingWebmasterCode: '',
      },
      
      popularCategories: ['WordPress Plugins', 'Page Builders', 'SEO Tools', 'eCommerce'],
      categoryIcons: {}, 
      
      socials: {
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        youtube: ''
      },
      
      adminPassword: 'admin'
    };
    
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultSettings,
        ...parsed,
        design: { ...defaultSettings.design, ...parsed.design, announcementBar: { ...defaultSettings.design.announcementBar, ...parsed.design?.announcementBar } },
        payment: { ...defaultSettings.payment, ...parsed.payment },
        checkout: { ...defaultSettings.checkout, ...parsed.checkout },
        emailSettings: { ...defaultSettings.emailSettings, ...parsed.emailSettings },
        seo: { ...defaultSettings.seo, ...parsed.seo },
        socials: { ...defaultSettings.socials, ...parsed.socials },
        categoryIcons: parsed.categoryIcons || {}
      };
    }
    return defaultSettings;
  });

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'contact' | 'about' | 'blog' | 'blog-post' | 'product' | 'page' | 'wishlist' | 'profile' | 'checkout' | 'thank-you' | 'admin'>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('default');
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
     const saved = localStorage.getItem('digimarket_history');
     return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [newAccountDetails, setNewAccountDetails] = useState<{ email: string, password: string } | null>(null);

  const selectedProduct = useMemo(() => products.find(p => p.id === selectedProductId) || null, [products, selectedProductId]);
  const selectedPage = useMemo(() => pages.find(p => p.id === selectedPageId) || null, [pages, selectedPageId]);
  const selectedPost = useMemo(() => blogPosts.find(p => p.id === selectedPostId) || null, [blogPosts, selectedPostId]);

  useEffect(() => { localStorage.setItem('digimarket_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('digimarket_pages', JSON.stringify(pages)); }, [pages]);
  useEffect(() => { localStorage.setItem('digimarket_posts', JSON.stringify(blogPosts)); }, [blogPosts]);
  useEffect(() => { localStorage.setItem('digimarket_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('digimarket_tickets', JSON.stringify(tickets)); }, [tickets]);
  useEffect(() => { localStorage.setItem('digimarket_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('digimarket_history', JSON.stringify(recentlyViewed)); }, [recentlyViewed]);
  useEffect(() => { localStorage.setItem('digimarket_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('digimarket_settings', JSON.stringify(storeSettings)); }, [storeSettings]);
  useEffect(() => { localStorage.setItem('digimarket_coupons', JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { 
    if (currentUser) localStorage.setItem('digimarket_current_user', JSON.stringify(currentUser));
    else localStorage.removeItem('digimarket_current_user');
  }, [currentUser]);

  useEffect(() => {
    let title: string = storeSettings.seo.title;
    let description: string = storeSettings.seo.description;

    if (currentView === 'shop') {
        title = storeSettings.seo.shopTitle || `Shop - ${storeSettings.storeName}`;
        description = storeSettings.seo.shopDescription || 'Browse our catalog of premium WordPress plugins and themes.';
    } else if (currentView === 'contact') {
        title = storeSettings.seo.contactTitle || `Contact Us - ${storeSettings.storeName}`;
        description = storeSettings.seo.contactDescription || 'Get in touch with our support team.';
    } else if (currentView === 'admin') {
        title = `Admin Dashboard - ${storeSettings.storeName}`;
    }

    document.title = title;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = storeSettings.faviconUrl || 'https://lucide.dev/favicon.ico';

  }, [storeSettings, currentView]);

  useEffect(() => {
    if (currentView === 'checkout' && storeSettings.payment.paypalEnabled && storeSettings.payment.paypalClientId) {
       console.log('PayPal Script loaded with ID:', storeSettings.payment.paypalClientId);
    }
  }, [currentView, storeSettings.payment.paypalEnabled, storeSettings.payment.paypalClientId]);

  const generateThemeStyles = () => {
     const primary = storeSettings.design.primaryColor || '#4f46e5';
     const font = storeSettings.design.fontFamily || 'Inter';
     const radius = storeSettings.design.borderRadius || '1rem';

     return (
       <>
         <link href={`https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`} rel="stylesheet" />
         <style>{`
           :root { --color-primary: ${primary}; --font-main: '${font}', sans-serif; --radius-theme: ${radius}; }
           body { font-family: var(--font-main); }
           .rounded-lg, .rounded-xl, .rounded-2xl, .rounded-3xl { border-radius: var(--radius-theme) !important; }
           button, input, select, textarea { border-radius: var(--radius-theme) !important; }
           .text-indigo-600 { color: var(--color-primary) !important; }
           .bg-indigo-600 { background-color: var(--color-primary) !important; }
           .hover\\:bg-indigo-700:hover { filter: brightness(0.9); background-color: var(--color-primary) !important; }
           .border-indigo-600 { border-color: var(--color-primary) !important; }
           .bg-indigo-50 { background-color: color-mix(in srgb, var(--color-primary) 10%, white) !important; }
           .ring-indigo-600 { --tw-ring-color: var(--color-primary) !important; }
           .text-indigo-900 { color: color-mix(in srgb, var(--color-primary) 50%, black) !important; }
           .bg-indigo-900 { background-color: color-mix(in srgb, var(--color-primary) 50%, black) !important; }
         `}</style>
       </>
     );
  };

  const changeView = (view: string, id?: string) => {
    if (typeof id === 'string') {
       if (view === 'product') setSelectedProductId(id);
       if (view === 'page') setSelectedPageId(id);
       if (view === 'blog-post') setSelectedPostId(id);
    }
    setCurrentView(view as any);
    window.scrollTo(0, 0);
  };

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
        id: `cust_${Date.now()}`, 
        name, 
        email, 
        password: pass, 
        joinDate: new Date().toISOString(),
        isVerified: false
     };
     setUsers([...users, newUser]);
     setCurrentUser(newUser);
     return true;
  };

  const handleDemoLogin = () => {
    const demoUser: Customer = { id: 'cust_demo_123', name: 'Demo Customer', email: 'demo@example.com', joinDate: new Date().toISOString(), isVerified: true };
    setCurrentUser(demoUser);
    setIsAuthModalOpen(false);
    setCurrentView('profile');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  // Updated to handle CartItem which now includes license information
  const handleAddToCart = (itemToAdd: CartItem | Product) => {
    // If it's a raw Product (from grid view), assume single license default
    // We need to fetch the single license price from the config
    let productPrice = itemToAdd.price;
    let licenseType: any = 'single';
    let licenseLabel = '1 Site Activation';

    if (!('licenseType' in itemToAdd)) {
       // It's a raw product, find default single license price
       const p = itemToAdd as Product;
       if (p.licensePricing && p.licensePricing.single) {
          productPrice = p.licensePricing.single.price;
       }
    } else {
       // It's already a CartItem (from detail view)
       productPrice = (itemToAdd as CartItem).price;
       licenseType = (itemToAdd as CartItem).licenseType;
       licenseLabel = (itemToAdd as CartItem).licenseLabel;
    }

    const product: CartItem = 'licenseType' in itemToAdd 
      ? (itemToAdd as CartItem) 
      : { 
          ...itemToAdd, 
          quantity: 1, 
          licenseType: 'single', 
          licenseLabel: '1 Site Activation', 
          basePrice: productPrice,
          price: productPrice,
          finalPrice: productPrice // Default for grid add
        };

    setCartItems(prev => {
      // Find existing item with same ID AND same license type
      const existingItem = prev.find(item => item.id === product.id && item.licenseType === product.licenseType);
      
      if (existingItem) {
        return prev.map(item => 
          (item.id === product.id && item.licenseType === product.licenseType)
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (productId: string) => setCartItems(prev => prev.filter(item => item.id !== productId));
  const handleUpdateCartQuantity = (productId: string, delta: number) => setCartItems(prev => prev.map(item => item.id === productId ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0));
  const handleToggleWishlist = (product: Product) => setWishlist(prev => prev.some(p => p.id === product.id) ? prev.filter(p => p.id !== product.id) : [...prev, product]);
  
  const handleViewProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setCurrentView('product');
    window.scrollTo(0, 0);
    setRecentlyViewed(prev => [product, ...prev.filter(p => p.id !== product.id)].slice(0, 4));
  };

  const handleDeleteUser = (userId: string) => {
     setUsers(prev => prev.filter(u => u.id !== userId));
     if (currentUser?.id === userId) setCurrentUser(null);
  };

  const handleTicketReply = (ticketId: string, message: string, sender: 'admin' | 'customer') => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
         const newReply: TicketReply = {
            id: `reply_${Date.now()}`,
            sender: sender,
            message,
            date: new Date().toISOString()
         };
         return { ...t, replies: [...(t.replies || []), newReply] };
      }
      return t;
    }));
  };

  const handleUpdateTicket = (updatedTicket: SupportTicket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };

  const handleUpdateProfile = (data: Partial<Customer>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...data };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleOpenTicket = (ticketData: Omit<SupportTicket, 'id' | 'date' | 'status'>) => {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `#TIC-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString(),
      status: 'open',
      replies: []
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const handleAddReview = (productId: string, review: Omit<Review, 'id' | 'productId' | 'date' | 'status'>) => {
    setProducts(prev => prev.map(p => {
       if (p.id === productId) {
          const newReview: Review = {
             id: `rev_${Date.now()}`,
             productId,
             date: new Date().toISOString(),
             status: 'pending',
             ...review
          };
          return { ...p, reviews: [...(p.reviews || []), newReview] };
       }
       return p;
    }));
  };

  const handlePlaceOrder = (orderDetails: any) => {
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newOrder: Order = {
        id: `${storeSettings.checkout.invoicePrefix || '#ORD-'}${Math.floor(Math.random() * 100000)}`,
        customer: orderDetails.firstName + ' ' + orderDetails.lastName,
        email: orderDetails.email,
        total: total,
        status: 'processing',
        date: new Date().toISOString().split('T')[0],
        items: cartItems.length,
        products: [...cartItems],
        billingDetails: {
           address: orderDetails.address,
           city: orderDetails.city,
           country: orderDetails.country,
           zip: orderDetails.zip,
           state: orderDetails.state,
           phone: orderDetails.phone
        }
    };
    setOrders([newOrder, ...orders]);
    setLastOrder(newOrder);

    // Auto Account Creation if guest
    if (!currentUser && orderDetails.createAccount) {
       const autoPassword = Math.random().toString(36).slice(-8);
       const newUser: Customer = {
          id: `cust_${Date.now()}`,
          name: orderDetails.firstName + ' ' + orderDetails.lastName,
          email: orderDetails.email,
          password: autoPassword,
          joinDate: new Date().toISOString(),
          isVerified: false
       };
       setUsers([...users, newUser]);
       setCurrentUser(newUser);
       setNewAccountDetails({ email: newUser.email, password: autoPassword });
    } else {
       setNewAccountDetails(null);
    }
    
    setCartItems([]);
    setCurrentView('thank-you');
    window.scrollTo(0, 0);
  };

  const handleUpdateProduct = (updated: Product) => setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  const handleAddProduct = (newProduct: Product) => setProducts(prev => [newProduct, ...prev]);
  const handleDeleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  
  const handleAddPage = (p: Page) => setPages(prev => [...prev, p]);
  const handleUpdatePage = (p: Page) => setPages(prev => prev.map(page => page.id === p.id ? p : page));
  const handleDeletePage = (id: string) => setPages(prev => prev.filter(page => page.id !== id));

  const handleAddPost = (p: BlogPost) => setBlogPosts(prev => [p, ...prev]);
  const handleUpdatePost = (p: BlogPost) => setBlogPosts(prev => prev.map(post => post.id === p.id ? p : post));
  const handleDeletePost = (id: string) => setBlogPosts(prev => prev.filter(post => post.id !== id));

  const handleAddCoupon = (c: Coupon) => setCoupons(prev => [...prev, c]);
  const handleDeleteCoupon = (id: string) => setCoupons(prev => prev.filter(c => c.id !== id));

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [products, selectedCategory, searchQuery]);

  const sortedProducts = useMemo(() => {
     let result = [...filteredProducts];
     if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
     else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
     else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
     return result;
  }, [filteredProducts, sortBy]);

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
  }, [searchQuery, products]);

  if (currentView === 'admin') {
     return (
        <>
          {generateThemeStyles()}
          <AdminDashboard 
             products={products}
             onAdd={handleAddProduct}
             onUpdate={handleUpdateProduct}
             onDelete={handleDeleteProduct}
             onClose={() => setCurrentView('home')}
             storeSettings={storeSettings}
             onUpdateSettings={setStoreSettings}
             pages={pages}
             onAddPage={handleAddPage}
             onUpdatePage={handleUpdatePage}
             onDeletePage={handleDeletePage}
             blogPosts={blogPosts}
             onAddPost={handleAddPost}
             onUpdatePost={handleUpdatePost}
             onDeletePost={handleDeletePost}
             orders={orders}
             onUpdateOrder={(order: Order) => setOrders((prev) => prev.map((o) => o.id === order.id ? order : o))}
             tickets={tickets}
             onUpdateTicket={handleUpdateTicket}
             users={users}
             onDeleteUser={handleDeleteUser}
             onReplyTicket={handleTicketReply}
             coupons={coupons}
             onAddCoupon={handleAddCoupon}
             onDeleteCoupon={handleDeleteCoupon}
          />
        </>
     );
  }

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const categories: string[] = ['All', ...Array.from(new Set(products.map(p => p.category))).sort()];

  const getCategoryIcon = (name: string) => {
    if (storeSettings.categoryIcons && storeSettings.categoryIcons[name]) {
        return <img src={storeSettings.categoryIcons[name]} className="w-5 h-5 object-contain" alt={name} />;
    }
    if (name.includes('Builder')) return <LayoutTemplate size={18} />;
    if (name.includes('SEO')) return <BarChart3 size={18} />;
    if (name.includes('eCommerce')) return <ShoppingBag size={18} />;
    if (name.includes('Form')) return <FileInput size={18} />;
    if (name.includes('Performance')) return <Zap size={18} />;
    if (name.includes('Booking')) return <Calendar size={18} />;
    if (name.includes('LMS')) return <GraduationCap size={18} />;
    if (name.includes('Tool')) return <Wrench size={18} />;
    return <Layers size={18} />;
  };

  const CheckoutView = () => {
     const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) * selectedCurrency.rate;
     const [details, setDetails] = useState({ 
        firstName: currentUser?.name.split(' ')[0] || '', 
        lastName: currentUser?.name.split(' ')[1] || '', 
        email: currentUser?.email || '', 
        phone: '', 
        country: 'United States', 
        address: '', 
        city: '', 
        state: '', 
        zip: '', 
        createAccount: !currentUser,
        notes: ''
     });
     
     const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>(() => {
        if (storeSettings.payment.stripeEnabled) return 'card';
        if (storeSettings.payment.paypalEnabled) return 'paypal';
        return 'card';
     });

     const [isProcessing, setIsProcessing] = useState(false);

     const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
        if (e && 'preventDefault' in e) e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
           handlePlaceOrder(details);
        }, 2000);
     };

     if (cartItems.length === 0) {
        return (
           <div className="max-w-7xl mx-auto px-4 py-24 text-center">
              <div className="mb-6 inline-block p-6 bg-slate-50 rounded-full"><ShoppingBag size={48} className="text-slate-300" /></div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
              <button onClick={() => setCurrentView('shop')} className="mt-6 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">Browse Shop</button>
           </div>
        );
     }

     return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
           <h1 className="text-3xl font-extrabold text-black mb-8">{storeSettings.checkout.checkoutTitle}</h1>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                 <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                       <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                          <User className="text-indigo-600"/> Billing Details
                       </h2>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div><label className="block text-sm font-bold text-slate-900 mb-2">First Name *</label><input type="text" required className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" value={details.firstName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetails({...details, firstName: e.target.value})} /></div>
                          <div><label className="block text-sm font-bold text-slate-900 mb-2">Last Name *</label><input type="text" required className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" value={details.lastName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetails({...details, lastName: e.target.value})} /></div>
                          <div><label className="block text-sm font-bold text-slate-900 mb-2">Phone *</label><input type="tel" required className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" value={details.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetails({...details, phone: e.target.value})} /></div>
                          <div><label className="block text-sm font-bold text-slate-900 mb-2">Email Address *</label><input type="email" required className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" value={details.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetails({...details, email: e.target.value})} /></div>
                          <div className="md:col-span-2"><label className="block text-sm font-bold text-slate-900 mb-2">Country / Region *</label><select className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" value={details.country} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDetails({...details, country: e.target.value})}><option>United States</option><option>United Kingdom</option><option>Canada</option><option>Australia</option><option>Germany</option><option>France</option><option>Morocco</option></select></div>
                          <div className="md:col-span-2"><label className="block text-sm font-bold text-slate-900 mb-2">Street Address *</label><input type="text" required placeholder="House number and street name" className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 mb-3" value={details.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetails({...details, address: e.target.value})} /></div>
                          <div><label className="block text-sm font-bold text-slate-900 mb-2">Town / City *</label><input type="text" required className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" value={details.city} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetails({...details, city: e.target.value})} /></div>
                          <div><label className="block text-sm font-bold text-slate-900 mb-2">State (Optional)</label><input type="text" className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" value={details.state} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetails({...details, state: e.target.value})} /></div>
                          <div><label className="block text-sm font-bold text-slate-900 mb-2">Postcode / ZIP *</label><input type="text" required className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" value={details.zip} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetails({...details, zip: e.target.value})} /></div>
                       </div>
                       
                       {!currentUser && (
                          <div className="mt-6 flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                             <input type="checkbox" id="create-account" checked={details.createAccount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetails({...details, createAccount: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                             <label htmlFor="create-account" className="font-bold text-slate-900 text-sm cursor-pointer select-none">Create an account automatically?</label>
                          </div>
                       )}

                       <div className="mt-6">
                          <label className="block text-sm font-bold text-slate-900 mb-2">Additional information</label>
                          <textarea rows={3} placeholder="Notes about your order, e.g. special notes for delivery." className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 resize-none" value={details.notes} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDetails({...details, notes: e.target.value})} />
                       </div>
                    </div>
                 </form>
              </div>

              <div className="lg:col-span-1">
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
                    <h2 className="text-xl font-bold text-black mb-6">Your Order</h2>
                    <div className="space-y-4 mb-6">
                       <div className="flex justify-between font-bold text-sm text-slate-500 pb-2 border-b border-slate-100"><span>Product</span><span>Subtotal</span></div>
                       {cartItems.map((item, idx) => (
                          <div key={`${item.id}-${idx}`} className="flex justify-between text-sm">
                             <div className="flex flex-col">
                               <span className="text-slate-600">{item.name} <span className="font-bold">× {item.quantity}</span></span>
                               <span className="text-xs text-slate-400">{item.licenseLabel || 'Single License'}</span>
                             </div>
                             <span className="font-bold text-slate-900">{selectedCurrency.symbol}{(item.price * selectedCurrency.rate * item.quantity).toFixed(2)}</span>
                          </div>
                       ))}
                       <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-lg font-bold text-slate-900">
                          <span>Total</span>
                          <span className="text-indigo-600">{selectedCurrency.symbol}{total.toFixed(2)}</span>
                       </div>
                    </div>

                    <div className="space-y-3 mb-8">
                       {storeSettings.payment.stripeEnabled && (
                           <div 
                              onClick={() => setPaymentMethod('card')}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
                           >
                              <div className="flex items-center gap-3 font-bold text-slate-900">
                                 <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-indigo-600' : 'border-slate-300'}`}>
                                    {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                                 </div>
                                 Credit Card (Stripe)
                              </div>
                           </div>
                       )}
                       
                       {storeSettings.payment.paypalEnabled && (
                           <div 
                              onClick={() => setPaymentMethod('paypal')}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
                           >
                              <div className="flex items-center gap-3 font-bold text-slate-900">
                                 <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'paypal' ? 'border-indigo-600' : 'border-slate-300'}`}>
                                    {paymentMethod === 'paypal' && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                                 </div>
                                 PayPal
                              </div>
                           </div>
                       )}
                       
                       {!storeSettings.payment.stripeEnabled && !storeSettings.payment.paypalEnabled && (
                           <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-bold flex items-center gap-2">
                               <AlertCircle size={16} /> No payment methods available.
                           </div>
                       )}
                    </div>

                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                       Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <button onClick={() => changeView('page', 'page_privacy')} className="text-indigo-600 hover:underline">privacy policy</button>.
                    </p>

                    {paymentMethod === 'paypal' && storeSettings.payment.paypalEnabled ? (
                        storeSettings.payment.paypalClientId ? (
                            <div className="w-full space-y-3">
                                <div className="p-3 bg-blue-50 text-blue-700 text-xs font-mono border border-blue-200 rounded-lg flex items-center gap-2 justify-between">
                                    <div className="flex items-center gap-2">
                                       <Globe size={14}/>
                                       <span>PayPal Test Mode</span>
                                    </div>
                                    <span className="font-bold bg-blue-100 px-2 py-0.5 rounded">SDK Loaded</span>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={(e) => handleSubmit(e)}
                                    disabled={isProcessing}
                                    className="w-full py-4 bg-[#FFC439] text-black font-bold rounded-xl hover:brightness-95 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isProcessing ? 'Processing...' : (
                                        <span className="italic font-extrabold text-blue-900 text-lg flex items-center gap-1">
                                            Pay<span className="text-[#009cde]">Pal</span>
                                        </span>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold border border-amber-100">
                                PayPal enabled but Client ID is missing in settings.
                            </div>
                        )
                    ) : (
                        <button 
                           type="submit" 
                           form="checkout-form"
                           disabled={isProcessing || !storeSettings.payment.stripeEnabled}
                           className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {isProcessing ? (
                              <>Processing...</>
                           ) : (
                              <>Place Order <Lock size={18} /></>
                           )}
                        </button>
                    )}
                 </div>
              </div>
           </div>
        </div>
     );
  };

  const ThankYouView = () => (
     <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8 relative">
           <Check size={48} className="text-green-600 animate-pop" />
           <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-ping"></div>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{storeSettings.checkout.thankYouTitle}</h1>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">{storeSettings.checkout.thankYouMessage}</p>
        
        <div className="mb-12 p-4 bg-indigo-50 border border-indigo-100 rounded-xl inline-flex items-center gap-3 text-indigo-800">
           <Mail size={24} className="text-indigo-600" />
           <span className="font-medium">A confirmation email has been sent to your inbox. Please verify your account.</span>
        </div>

        {newAccountDetails && (
           <div className="max-w-md mx-auto bg-indigo-900 text-white p-8 rounded-3xl shadow-xl mb-12 relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
               <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               <h2 className="text-xl font-bold mb-6 flex items-center justify-center gap-2"><UserPlus size={24}/> Account Created Successfully</h2>
               <div className="bg-white/10 rounded-xl p-6 backdrop-blur-md border border-white/20">
                   <p className="text-indigo-200 text-sm mb-1 uppercase tracking-wider font-bold">Your Login Details</p>
                   <div className="mb-4">
                      <span className="block text-xs text-indigo-300">Email</span>
                      <span className="font-mono text-lg font-bold">{newAccountDetails.email}</span>
                   </div>
                   <div>
                      <span className="block text-xs text-indigo-300">Password</span>
                      <span className="font-mono text-lg font-bold tracking-widest bg-black/30 px-3 py-1 rounded select-all">{newAccountDetails.password}</span>
                   </div>
               </div>
               <p className="mt-4 text-sm text-indigo-200">Please save these details. You can change your password in your profile.</p>
           </div>
        )}

        {lastOrder && (
            <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-12 text-left">
               <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 mb-3">Order Summary</h3>
               <div className="flex justify-between mb-2"><span className="text-slate-500">Order Number:</span> <span className="font-mono font-bold text-indigo-600">{lastOrder.id}</span></div>
               <div className="flex justify-between mb-2"><span className="text-slate-500">Date:</span> <span className="font-medium">{lastOrder.date}</span></div>
               <div className="flex justify-between mb-2"><span className="text-slate-500">Email:</span> <span className="font-medium">{lastOrder.email}</span></div>
               <div className="flex justify-between pt-3 border-t border-slate-100 text-lg font-bold"><span className="text-slate-900">Total:</span> <span className="text-indigo-600">{selectedCurrency.symbol}{lastOrder.total.toFixed(2)}</span></div>
            </div>
        )}

        <div className="flex justify-center gap-4">
           <button onClick={() => setCurrentView('profile')} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Go to My Account</button>
           <button onClick={() => setCurrentView('home')} className="px-8 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">Back to Home</button>
        </div>
     </div>
  );

  return (
    <>
      {generateThemeStyles()}
      <div className="min-h-screen flex flex-col transition-colors duration-300">
        <Header 
          storeName={storeSettings.storeName}
          logoUrl={storeSettings.logoUrl}
          cartItems={cartItems} 
          onOpenCart={() => setIsCartOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAdmin={() => changeView('admin')}
          currentView={currentView}
          onChangeView={changeView}
          wishlistCount={wishlist.length}
          onOpenWishlist={() => changeView('wishlist')}
          selectedCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
          currentUser={currentUser}
          onOpenLogin={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onOpenProfile={() => changeView('profile')}
          onViewProduct={handleViewProduct}
          searchResults={searchResults}
        />

        <main className="flex-1 bg-slate-50">
          
          {/* HOME VIEW */}
          {currentView === 'home' && (
            <div className="animate-fade-in">
              {/* Hero Section */}
              <div className="relative bg-indigo-600 text-white overflow-hidden pb-16 pt-12 md:pt-20">
                 <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                 <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-float"></div>
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400 opacity-20 rounded-full blur-3xl animate-float-delayed"></div>
                 
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-indigo-100 text-sm font-bold mb-6 tracking-wide uppercase">
                       {storeSettings.storeName}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                       {storeSettings.design.heroHeadline.split(' ').map((word, i) => (
                          <span key={i} className={i % 2 !== 0 ? "text-indigo-200" : ""}>{word} </span>
                       ))}
                    </h1>
                    <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                       {storeSettings.design.heroSubheadline}
                    </p>
                    
                    {/* Hero Search */}
                    <div className="max-w-xl mx-auto mb-10 relative group">
                        <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md transform group-focus-within:scale-105 transition-transform duration-300"></div>
                        <input 
                          type="text" 
                          placeholder="Search for plugins, themes..." 
                          className="relative w-full py-4 pl-12 pr-4 rounded-2xl bg-white/95 backdrop-blur-xl border-none text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-white/30 outline-none shadow-2xl text-lg"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && changeView('shop')}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={20} />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                       <button 
                         onClick={() => changeView('shop')} 
                         className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-50 hover:-translate-y-1 transition-all shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-2"
                       >
                          <ShoppingBag size={20} /> Browse Shop
                       </button>
                       <button onClick={() => changeView('about')} className="px-8 py-4 bg-indigo-700/50 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 backdrop-blur-sm border border-indigo-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                          Learn More <ArrowRight size={20} />
                       </button>
                    </div>
                 </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white border-b border-slate-200">
                 <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><ShieldCheck size={24} /></div>
                          <div><h4 className="font-bold text-slate-900 text-sm">100% Original</h4><p className="text-xs text-slate-500">Verified Files</p></div>
                       </div>
                       <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="p-2 bg-red-100 text-red-600 rounded-lg"><Ban size={24} /></div>
                          <div><h4 className="font-bold text-slate-900 text-sm">No Malware</h4><p className="text-xs text-slate-500">Safe & Secure</p></div>
                       </div>
                       <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><RefreshCw size={24} /></div>
                          <div><h4 className="font-bold text-slate-900 text-sm">Regular Updates</h4><p className="text-xs text-slate-500">Auto-Updates</p></div>
                       </div>
                       <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><LifeBuoy size={24} /></div>
                          <div><h4 className="font-bold text-slate-900 text-sm">Quick Support</h4><p className="text-xs text-slate-500">24/7 Help</p></div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="max-w-7xl mx-auto px-4 py-16 space-y-24">
                 
                 {/* Best Sellers */}
                 <section className="animate-fade-in-up delay-100">
                    <div className="flex justify-between items-end mb-8">
                       <div>
                          <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2"><Trophy className="text-amber-500 fill-amber-500" /> Best Sellers</h2>
                          <p className="text-slate-500 mt-2">Our most popular tools loved by developers</p>
                       </div>
                       <button onClick={() => changeView('shop')} className="hidden sm:flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">View All <ArrowRight size={18} /></button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                       {products.slice(4, 8).map(product => (
                          <ProductCard 
                             key={product.id} 
                             product={product} 
                             onAddToCart={handleAddToCart}
                             onViewDetails={() => handleViewProduct(product)}
                             isWishlisted={wishlist.some(p => p.id === product.id)}
                             onToggleWishlist={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                             priceMultiplier={selectedCurrency.rate}
                             currencySymbol={selectedCurrency.symbol}
                          />
                       ))}
                    </div>
                 </section>

                 {/* Featured Products */}
                 <section className="animate-fade-in-up delay-200">
                    <div className="flex justify-between items-end mb-8">
                       <div>
                          <h2 className="text-3xl font-extrabold text-slate-900">Featured Products</h2>
                          <p className="text-slate-500 mt-2">Explore our hand-picked selections for professional developers.</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                       {products.slice(0, 4).map(product => (
                          <ProductCard 
                             key={product.id} 
                             product={product} 
                             onAddToCart={handleAddToCart}
                             onViewDetails={() => handleViewProduct(product)}
                             isWishlisted={wishlist.some(p => p.id === product.id)}
                             onToggleWishlist={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                             priceMultiplier={selectedCurrency.rate}
                             currencySymbol={selectedCurrency.symbol}
                          />
                       ))}
                    </div>
                 </section>

                 {/* Forms & Leads Category */}
                 <section className="animate-fade-in-up delay-300">
                    <div className="flex justify-between items-end mb-8">
                       <div>
                          <h2 className="text-3xl font-extrabold text-slate-900">Forms & Leads</h2>
                          <p className="text-slate-500 mt-2">Essential tools for capturing leads and data.</p>
                       </div>
                       <button onClick={() => { setSelectedCategory('Forms & Leads'); changeView('shop'); }} className="hidden sm:flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">View All <ArrowRight size={18} /></button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                       {products.filter(p => p.category === 'Forms & Leads').slice(0, 4).map(product => (
                          <ProductCard 
                             key={product.id} 
                             product={product} 
                             onAddToCart={handleAddToCart}
                             onViewDetails={() => handleViewProduct(product)}
                             isWishlisted={wishlist.some(p => p.id === product.id)}
                             onToggleWishlist={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                             priceMultiplier={selectedCurrency.rate}
                             currencySymbol={selectedCurrency.symbol}
                          />
                       ))}
                    </div>
                 </section>

                 {/* How It Works */}
                 <section className="py-8 animate-fade-in-up delay-300">
                    <div className="text-center mb-12">
                       <h2 className="text-3xl font-extrabold text-slate-900">How It Works</h2>
                       <p className="text-slate-500 mt-2">Simple, fast, and secure process.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                       {[
                         { step: '01', title: 'Browse', desc: 'Find the perfect plugin or theme.', icon: Search },
                         { step: '02', title: 'Pay', desc: 'Secure checkout with Stripe or PayPal.', icon: CreditCard },
                         { step: '03', title: 'Receive', desc: 'Instant access to download files.', icon: Download },
                         { step: '04', title: 'Activate', desc: 'Genuine license activation included.', icon: Key }
                       ].map((item, idx) => (
                          <div key={idx} className="relative p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group text-center">
                             <div className="w-14 h-14 mx-auto bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <item.icon size={28} />
                             </div>
                             <div className="absolute top-4 right-4 text-4xl font-black text-slate-100 -z-10 select-none">{item.step}</div>
                             <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                             <p className="text-slate-500 text-sm">{item.desc}</p>
                          </div>
                       ))}
                    </div>
                 </section>

                 <FAQSection />

                 {/* Testimonials (Static 3 Grid) */}
                 <section className="mb-24 animate-fade-in-up">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Customer Testimonials</h2>
                      <p className="text-slate-500 mt-4 text-lg">Don't just take our word for it.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {TESTIMONIALS.map((t) => (
                        <div key={t.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all">
                          <div className="flex items-center gap-4 mb-6">
                            <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100" />
                            <div>
                              <h4 className="font-bold text-slate-900">{t.name}</h4>
                              <p className="text-indigo-600 text-sm font-medium">{t.role}</p>
                            </div>
                          </div>
                          <div className="flex text-amber-400 mb-4">
                            {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                          </div>
                          <p className="text-slate-600 leading-relaxed italic">"{t.text}"</p>
                        </div>
                      ))}
                    </div>
                 </section>

              </div>
              <NewsletterSection />
            </div>
          )}
          
          {/* ABOUT VIEW */}
          {currentView === 'about' && (
             <div className="animate-fade-in">
                {/* About Hero */}
                <div className="bg-slate-900 text-white py-20 px-4 text-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                   <h1 className="text-4xl md:text-5xl font-extrabold mb-6 relative z-10">Empowering Developers Worldwide</h1>
                   <p className="text-xl text-indigo-200 max-w-2xl mx-auto relative z-10">
                      We provide premium tools at accessible prices, helping creators build the web of tomorrow.
                   </p>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-16">
                   {/* Mission */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                      <div>
                         <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm">Our Mission</span>
                         <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-6">Democratizing Premium WordPress Tools</h2>
                         <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p>
                               At {storeSettings.storeName}, we believe that price shouldn't be a barrier to quality. 
                               Every developer, from freelancers to agency owners, deserves access to the best tools available.
                            </p>
                            <p>
                               By negotiating bulk licenses and agency deals directly with developers, we bridge the gap between 
                               premium pricing and affordable access, ensuring you get 100% original, safe, and updatable software.
                            </p>
                         </div>
                      </div>
                      <div className="relative">
                         <div className="absolute inset-0 bg-indigo-600 rounded-3xl rotate-3 opacity-10"></div>
                         <img 
                           src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                           alt="Team working" 
                           className="relative rounded-3xl shadow-xl w-full"
                         />
                      </div>
                   </div>

                   {/* Stats */}
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
                      {[
                        { label: 'Happy Customers', value: '15,000+' },
                        { label: 'Products Available', value: '350+' },
                        { label: 'Years in Business', value: '5+' },
                        { label: 'Support Team', value: '24/7' }
                      ].map((stat, idx) => (
                         <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center hover:-translate-y-1 transition-transform">
                            <div className="text-3xl font-extrabold text-indigo-600 mb-2">{stat.value}</div>
                            <div className="text-sm font-bold text-slate-500 uppercase">{stat.label}</div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          )}

          {/* BLOG VIEW */}
          {currentView === 'blog' && (
             <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
                <div className="text-center mb-16">
                   <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Latest Insights</h1>
                   <p className="text-black text-lg">Tips, tutorials, and news from the WordPress world.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {blogPosts.map(post => (
                      <div key={post.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group" onClick={() => changeView('blog-post', post.id)}>
                         <div className="h-48 overflow-hidden relative">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-indigo-600 uppercase tracking-wide">
                               {post.category}
                            </div>
                         </div>
                         <div className="p-6">
                            <div className="text-xs text-black mb-3 flex items-center gap-2">
                               <span>{new Date(post.date).toLocaleDateString()}</span> • <span>{post.author}</span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">{post.title}</h2>
                            <p className="text-black text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                            <span className="text-indigo-600 font-bold text-sm flex items-center gap-1">Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* BLOG POST VIEW */}
          {currentView === 'blog-post' && selectedPost && (
             <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
                <button onClick={() => changeView('blog')} className="flex items-center gap-2 text-black hover:text-indigo-600 font-medium mb-8"><ArrowLeft size={18} /> Back to Blog</button>
                <div className="mb-8">
                   <div className="flex items-center gap-3 text-sm text-black mb-4">
                      <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold text-xs uppercase">{selectedPost.category}</span>
                      <span>{new Date(selectedPost.date).toLocaleDateString()}</span>
                   </div>
                   <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">{selectedPost.title}</h1>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">{selectedPost.author.charAt(0)}</div>
                      <span className="font-medium text-slate-900">{selectedPost.author}</span>
                   </div>
                </div>
                <div className="rounded-3xl overflow-hidden mb-12 shadow-lg">
                   <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-auto" />
                </div>
                <div className="prose prose-lg max-w-none prose-p:text-black prose-headings:text-black prose-li:text-black text-black">
                   {selectedPost.content}
                </div>
             </div>
          )}
          
          {/* SHOP VIEW */}
          {currentView === 'shop' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Desktop Sidebar / Mobile Horizontal Scroll */}
                <aside className="lg:w-64 shrink-0">
                  <div className="sticky top-24 z-30 bg-white lg:bg-transparent shadow-sm lg:shadow-none -mx-4 px-4 py-4 lg:mx-0 lg:px-0 lg:py-0 border-b lg:border-none border-slate-100">
                     <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                        {categories.map((category: string) => (
                           <button
                             key={category}
                             onClick={() => { setSelectedCategory(category); setCurrentPage(1); }}
                             className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                               selectedCategory === category
                                 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                 : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-100'
                             }`}
                           >
                              <span className={selectedCategory === category ? 'text-white' : 'text-slate-400'}>
                                {category === 'All' ? <Layout size={18} /> : getCategoryIcon(category)}
                              </span>
                              <span>{category}</span>
                              <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${selectedCategory === category ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                {category === 'All' ? products.length : products.filter(p => p.category === category).length}
                              </span>
                           </button>
                        ))}
                     </div>
                  </div>
                </aside>

                <div className="flex-1">
                   <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-slate-900">
                         {selectedCategory} <span className="text-slate-400 text-sm font-medium ml-2">({filteredProducts.length} results)</span>
                      </h2>
                      <div className="flex items-center gap-2">
                         <span className="text-sm text-slate-500 hidden sm:inline">Sort by:</span>
                         <select 
                           className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none cursor-pointer"
                           value={sortBy}
                           onChange={(e) => setSortBy(e.target.value)}
                         >
                            <option value="default">Relevance</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name: A-Z</option>
                         </select>
                      </div>
                   </div>

                   {filteredProducts.length === 0 ? (
                      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
                         <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                         <h3 className="text-lg font-medium text-slate-900">No products found</h3>
                         <p className="text-slate-500">Try adjusting your search or filter.</p>
                      </div>
                   ) : (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                          {paginatedProducts.map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              onAddToCart={handleAddToCart}
                              onViewDetails={() => handleViewProduct(product)}
                              isWishlisted={wishlist.some(p => p.id === product.id)}
                              onToggleWishlist={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                              priceMultiplier={selectedCurrency.rate}
                              currencySymbol={selectedCurrency.symbol}
                            />
                          ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="mt-12 flex justify-center gap-2">
                             <button 
                               onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo(0,0); }}
                               disabled={currentPage === 1}
                               className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                                <ChevronLeft size={20} />
                             </button>
                             {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                   key={page}
                                   onClick={() => { setCurrentPage(page); window.scrollTo(0,0); }}
                                   className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                                      currentPage === page 
                                      ? 'bg-indigo-600 text-white shadow-md' 
                                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                   }`}
                                >
                                   {page}
                                </button>
                             ))}
                             <button 
                               onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0,0); }}
                               disabled={currentPage === totalPages}
                               className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                                <ChevronRight size={20} />
                             </button>
                          </div>
                        )}
                      </>
                   )}
                </div>
              </div>
            </div>
          )}

          {/* CONTACT VIEW */}
          {currentView === 'contact' && (
             <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
                <div className="text-center mb-16">
                   <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Get in Touch</h1>
                   <p className="text-slate-500 text-lg">We'd love to hear from you. Our team is always here to chat.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                      <form className="space-y-6">
                         <div><label className="block text-sm font-bold text-slate-700 mb-2">Name</label><input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Your name" /></div>
                         <div><label className="block text-sm font-bold text-slate-700 mb-2">Email</label><input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="john@example.com" /></div>
                         <div><label className="block text-sm font-bold text-slate-700 mb-2">Message</label><textarea rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="How can we help?" /></div>
                         <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"><Send size={18} /> Send Message</button>
                      </form>
                   </div>
                   <div className="space-y-8">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                         <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><MapPin size={24} /></div>
                         <div><h3 className="font-bold text-slate-900 mb-1">Our Office</h3><p className="text-slate-500">{storeSettings.contactAddress}</p></div>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                         <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><Mail size={24} /></div>
                         <div><h3 className="font-bold text-slate-900 mb-1">Email Us</h3><p className="text-slate-500">{storeSettings.supportEmail}</p></div>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                         <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><Phone size={24} /></div>
                         <div><h3 className="font-bold text-slate-900 mb-1">Call Support</h3><p className="text-slate-500">{storeSettings.contactPhone}</p></div>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* PRODUCT DETAIL VIEW */}
          {currentView === 'product' && selectedProduct && (
             <div className="max-w-7xl mx-auto px-4 py-8">
               <ProductDetail 
                 product={selectedProduct}
                 onAddToCart={handleAddToCart}
                 onBack={() => changeView('shop')}
                 isWishlisted={wishlist.some(p => p.id === selectedProduct.id)}
                 onToggleWishlist={() => handleToggleWishlist(selectedProduct)}
                 priceMultiplier={selectedCurrency.rate}
                 currencySymbol={selectedCurrency.symbol}
                 recentlyViewed={recentlyViewed}
                 onViewHistoryItem={handleViewProduct}
                 currentUser={currentUser}
                 onAddReview={handleAddReview}
               />
             </div>
          )}

          {/* PAGE VIEW */}
          {currentView === 'page' && selectedPage && (
             <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">{selectedPage.title}</h1>
                <div className="prose prose-slate max-w-none bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                   {selectedPage.content}
                </div>
             </div>
          )}

          {/* WISHLIST VIEW */}
          {currentView === 'wishlist' && (
             <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-2"><Heart className="text-red-500 fill-red-500"/> My Wishlist</h1>
                {wishlist.length === 0 ? (
                   <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
                      <Heart className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                      <h3 className="text-lg font-medium text-slate-900">Your wishlist is empty</h3>
                      <button onClick={() => changeView('shop')} className="mt-4 text-indigo-600 font-bold hover:underline">Start Shopping</button>
                   </div>
                ) : (
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {wishlist.map(product => (
                         <ProductCard 
                            key={product.id} 
                            product={product} 
                            onAddToCart={handleAddToCart}
                            onViewDetails={() => handleViewProduct(product)}
                            isWishlisted={true}
                            onToggleWishlist={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                            priceMultiplier={selectedCurrency.rate}
                            currencySymbol={selectedCurrency.symbol}
                         />
                      ))}
                   </div>
                )}
             </div>
          )}

          {/* PROFILE VIEW */}
          {currentView === 'profile' && currentUser && (
             <CustomerDashboard 
               customer={currentUser} 
               onLogout={handleLogout}
               currencySymbol={selectedCurrency.symbol}
               onUpdateProfile={handleUpdateProfile}
               tickets={tickets}
               onOpenTicket={handleOpenTicket}
             />
          )}

          {/* CHECKOUT VIEW */}
          {currentView === 'checkout' && <CheckoutView />}

          {/* THANK YOU VIEW */}
          {currentView === 'thank-you' && <ThankYouView />}

        </main>

        <Footer 
          settings={storeSettings} 
          pages={pages}
          onChangeView={changeView}
          onOpenAdmin={() => changeView('admin')}
          onCategoryClick={(cat) => { setSelectedCategory(cat); changeView('shop'); }}
        />

        <MobileBottomNav 
          currentView={currentView}
          onChangeView={(view) => changeView(view)}
          cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          onOpenCart={() => setIsCartOpen(true)}
          wishlistCount={wishlist.length}
          onOpenWishlist={() => changeView('wishlist')}
        />

        <CartSidebar 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          items={cartItems} 
          onRemoveItem={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateCartQuantity}
          priceMultiplier={selectedCurrency.rate}
          currencySymbol={selectedCurrency.symbol}
          onCheckout={() => { setIsCartOpen(false); changeView('checkout'); }}
        />

        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onDemoLogin={handleDemoLogin}
        />

      </div>
    </>
  );
};

export default App;