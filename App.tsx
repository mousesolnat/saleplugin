
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
import { PRODUCTS as INITIAL_PRODUCTS, STORE_NAME, CURRENCIES } from './constants';
import { Product, CartItem, StoreSettings, Page, Currency, Customer, Review, BlogPost, Order, SupportTicket } from './types';
import { 
  Filter, ArrowRight, ArrowLeft, Mail, Phone, MapPin, Send, Zap, Trophy,
  ShieldCheck, Ban, RefreshCw, LifeBuoy, Search, CheckCircle, FileInput,
  ShoppingBag, Heart, User, Clock, CreditCard, AlertCircle, ChevronDown, 
  ChevronLeft, ChevronRight, HelpCircle, ChevronUp, Lock, Download, UserPlus, Key,
  Headphones, BarChart3, Layout, Layers, Wrench, GraduationCap, Calendar, Star, Check
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

const MOCK_ORDERS: Order[] = [
    { id: '#ORD-7829', customer: 'Alex Johnson', email: 'alex@example.com', total: 65, status: 'completed', date: '2024-03-10', items: 3 },
    { id: '#ORD-7830', customer: 'Sarah Smith', email: 'sarah@design.co', total: 20, status: 'completed', date: '2024-03-11', items: 1 },
    { id: '#ORD-7831', customer: 'Mike Brown', email: 'mike@agency.net', total: 125, status: 'pending', date: '2024-03-12', items: 5 },
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

  // Global Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('digimarket_settings');
    const defaultSettings: StoreSettings = {
      storeName: STORE_NAME,
      siteUrl: 'https://digimarket.pro',
      supportEmail: 'support@digimarket.pro',
      contactAddress: '123 Digital Avenue, Tech City, Cloud State, 90210',
      contactPhone: '+1 (555) 123-4567',
      footerDescription: 'The #1 marketplace for premium digital products, plugins, and themes. Instant delivery and verified quality.',
      
      design: {
        primaryColor: '#4f46e5',
        heroHeadline: 'Premium WordPress Tools Without The Premium Price',
        heroSubheadline: "Get instant access to 100% original, verified license keys for the world's best plugins and themes. Secure, affordable, and developer-friendly.",
        fontFamily: 'Inter',
        borderRadius: 'xl'
      },

      payment: {
        currencySymbol: '$',
        currencyCode: 'USD',
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
        thankYouMessage: 'Your order has been received. You will receive an email confirmation with your license keys shortly. You can also access your downloads from your account dashboard.'
      },

      seo: {
        title: 'DigiMarket Pro - Premium WordPress Tools',
        description: 'The best marketplace for WordPress plugins, themes, and builder integrations. Instant delivery and verified licenses.',
        googleAnalyticsId: '',
        googleSearchConsoleCode: '',
        bingWebmasterCode: '',
      },
      
      popularCategories: ['WordPress Plugins', 'Page Builders', 'SEO Tools', 'eCommerce'],
      
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
        design: { ...defaultSettings.design, ...parsed.design },
        payment: { ...defaultSettings.payment, ...parsed.payment },
        checkout: { ...defaultSettings.checkout, ...parsed.checkout },
        seo: { ...defaultSettings.seo, ...parsed.seo },
        socials: { ...defaultSettings.socials, ...parsed.socials },
      };
    }
    return defaultSettings;
  });

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // View State Management
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
  useEffect(() => { 
    if (currentUser) localStorage.setItem('digimarket_current_user', JSON.stringify(currentUser));
    else localStorage.removeItem('digimarket_current_user');
  }, [currentUser]);

  // SEO & Head Logic
  useEffect(() => {
    let title = storeSettings.seo.title;
    let description = storeSettings.seo.description;

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

    // Favicon
    let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = storeSettings.faviconUrl || 'https://lucide.dev/favicon.ico';

  }, [storeSettings, currentView]);

  const generateThemeStyles = () => {
     const primary = storeSettings.design.primaryColor || '#4f46e5';
     const font = storeSettings.design.fontFamily || 'Inter';
     const radiusKey = storeSettings.design.borderRadius || 'xl';

     const radiusMap: Record<string, string> = {
        'none': '0px', 'sm': '0.25rem', 'md': '0.5rem', 'lg': '0.75rem', 
        'xl': '1rem', '2xl': '1.5rem', '3xl': '2rem'
     };
     
     let radiusVal = radiusMap[radiusKey] || '1rem';
     if (!radiusVal && radiusKey.startsWith('rounded-')) radiusVal = '1rem';

     return (
       <>
         <link href={`https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`} rel="stylesheet" />
         <style>{`
           :root { --color-primary: ${primary}; --font-main: '${font}', sans-serif; --radius-theme: ${radiusVal}; }
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
    if (id) {
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
     const newUser: Customer = { id: `cust_${Date.now()}`, name, email, password: pass, joinDate: new Date().toISOString() };
     setUsers([...users, newUser]);
     setCurrentUser(newUser);
     return true;
  };

  const handleDemoLogin = () => {
    const demoUser: Customer = { id: 'cust_demo_123', name: 'Demo Customer', email: 'demo@example.com', joinDate: new Date().toISOString() };
    setCurrentUser(demoUser);
    setIsAuthModalOpen(false);
    setCurrentView('profile');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
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

  const handleSearchEnter = () => setCurrentView('shop');

  // --- Views ---

  const CheckoutView = () => {
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) * selectedCurrency.rate;
    const [form, setForm] = useState({ 
        firstName: '', lastName: '', email: currentUser?.email || '', phone: '', 
        country: '', streetAddress: '', city: '', state: '', zip: '',
        notes: '' 
    });
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
    const [createAccount, setCreateAccount] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePlaceOrder = (e: React.FormEvent) => {
       e.preventDefault();
       setIsSubmitting(true);
       
       setTimeout(() => { 
          // Create Order
          const newOrder: Order = {
              id: `#ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
              customer: `${form.firstName} ${form.lastName}`,
              email: form.email,
              total: Number(total.toFixed(2)),
              status: 'pending',
              date: new Date().toISOString().split('T')[0],
              items: cartItems.reduce((acc, i) => acc + i.quantity, 0)
          };
          setOrders(prev => [newOrder, ...prev]);
          setLastOrder(newOrder);

          // Create Account if Guest
          if (!currentUser) {
              const password = Math.random().toString(36).slice(-8);
              const newUser: Customer = { 
                  id: `cust_${Date.now()}`, 
                  name: `${form.firstName} ${form.lastName}`, 
                  email: form.email, 
                  password, 
                  joinDate: new Date().toISOString() 
              };
              // Always create an account for digital goods delivery
              setUsers(prev => [...prev, newUser]);
              setCurrentUser(newUser);
              setNewAccountDetails({ email: form.email, password });
          } else {
              setNewAccountDetails(null);
          }

          setIsSubmitting(false); 
          setCartItems([]); 
          setCurrentView('thank-you'); 
          window.scrollTo(0,0);
       }, 2000);
    };

    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-black">
            <Lock className="text-indigo-600" /> {storeSettings.checkout.checkoutTitle}
        </h1>
        
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Billing Details */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-black">Billing Details</h2>
                  
                  <div className="grid grid-cols-2 gap-6 mb-4">
                     <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">First Name <span className="text-red-500">*</span></label>
                         <input required type="text" className="p-3 border border-slate-300 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                     </div>
                     <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                         <input required type="text" className="p-3 border border-slate-300 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Phone <span className="text-red-500">*</span></label>
                        <input required type="tel" className="p-3 border border-slate-300 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Email address <span className="text-red-500">*</span></label>
                        <input required type="email" className="p-3 border border-slate-300 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                     </div>
                  </div>

                  <div className="mb-4">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Country / Region <span className="text-red-500">*</span></label>
                      <select required className="p-3 border border-slate-300 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none bg-white" value={form.country} onChange={e => setForm({...form, country: e.target.value})}>
                          <option value="">Select a country / region...</option>
                          <option value="US">United States (US)</option>
                          <option value="UK">United Kingdom (UK)</option>
                          <option value="CA">Canada</option>
                          <option value="AU">Australia</option>
                          <option value="MA">Morocco</option>
                          <option value="FR">France</option>
                          <option value="DE">Germany</option>
                          <option value="IN">India</option>
                          <option value="Other">Other</option>
                      </select>
                  </div>

                  <div className="mb-4">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Street address <span className="text-red-500">*</span></label>
                      <input required type="text" placeholder="House number and street name" className="p-3 border border-slate-300 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none" value={form.streetAddress} onChange={e => setForm({...form, streetAddress: e.target.value})} />
                  </div>

                  <div className="mb-4">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Town / City <span className="text-red-500">*</span></label>
                      <input required type="text" className="p-3 border border-slate-300 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">State / County (Optional)</label>
                          <input type="text" className="p-3 border border-slate-300 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none" value={form.state} onChange={e => setForm({...form, state: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Postcode / ZIP <span className="text-red-500">*</span></label>
                          <input required type="text" className="p-3 border border-slate-300 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none" value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} />
                      </div>
                  </div>
                  
                  {!currentUser && (
                      <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                          <label className="flex items-center gap-3 cursor-pointer select-none">
                              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${createAccount ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                                  {createAccount && <Check size={14} className="text-white" />}
                              </div>
                              <input type="checkbox" checked={createAccount} onChange={e => setCreateAccount(e.target.checked)} className="hidden" />
                              <span className="font-bold text-slate-800">Create an account?</span>
                          </label>
                          <p className="text-sm text-slate-600 mt-2 pl-8">
                             We will automatically create an account for you so you can access your downloads instantly.
                          </p>
                      </div>
                  )}

                  <div className="mt-8 pt-8 border-t border-slate-100">
                      <h3 className="text-lg font-bold mb-4">Additional information</h3>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Order notes (optional)</label>
                      <textarea 
                        rows={4} 
                        placeholder="Notes about your order, e.g. special notes for delivery." 
                        className="p-3 border border-slate-300 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        value={form.notes}
                        onChange={e => setForm({...form, notes: e.target.value})}
                      />
                  </div>
              </div>
           </div>

           {/* Order Summary */}
           <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg sticky top-24">
                 <h2 className="text-xl font-bold mb-6 text-black">Your Order</h2>
                 
                 <div className="bg-slate-50 rounded-xl p-4 mb-6">
                     <div className="flex justify-between text-xs uppercase font-bold text-slate-500 mb-3 border-b border-slate-200 pb-2">
                         <span>Product</span>
                         <span>Subtotal</span>
                     </div>
                     <div className="space-y-3 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
                         {cartItems.map(item => (
                             <div key={item.id} className="flex justify-between text-sm">
                                 <span className="text-slate-700 pr-2">{item.name} <strong className="text-slate-900">× {item.quantity}</strong></span>
                                 <span className="font-bold text-slate-900 whitespace-nowrap">{selectedCurrency.symbol}{(item.price * item.quantity * selectedCurrency.rate).toFixed(2)}</span>
                             </div>
                         ))}
                     </div>
                     <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-slate-700 mb-2">
                         <span>Subtotal</span>
                         <span>{selectedCurrency.symbol}{total.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between font-extrabold text-xl text-indigo-600">
                         <span>Total</span>
                         <span>{selectedCurrency.symbol}{total.toFixed(2)}</span>
                     </div>
                 </div>

                 <div className="space-y-4 mb-8">
                     <h3 className="font-bold text-slate-800">Payment Method</h3>
                     
                     <div 
                        onClick={() => setPaymentMethod('card')}
                        className={`border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                     >
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-indigo-600' : 'border-slate-300'}`}>
                                {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                            </div>
                            <span className="font-bold text-slate-900 flex items-center gap-2"><CreditCard size={18}/> Credit Card (Stripe)</span>
                        </div>
                        <p className="text-xs text-slate-500 pl-8">Pay securely with your credit card via Stripe.</p>
                     </div>

                     <div 
                        onClick={() => setPaymentMethod('paypal')}
                        className={`border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                     >
                         <div className="flex items-center gap-3 mb-2">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'paypal' ? 'border-indigo-600' : 'border-slate-300'}`}>
                                {paymentMethod === 'paypal' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                            </div>
                            <span className="font-bold text-slate-900">PayPal</span>
                        </div>
                        <p className="text-xs text-slate-500 pl-8">Pay via your PayPal account.</p>
                     </div>
                 </div>

                 <button 
                    type="submit" 
                    disabled={isSubmitting || cartItems.length === 0} 
                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                     {isSubmitting ? (
                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                     ) : (
                        <><Lock size={18} /> Place Order {selectedCurrency.symbol}{total.toFixed(2)}</>
                     )}
                 </button>

                 <div className="mt-4 text-center">
                    <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                        <ShieldCheck size={12} /> Secure 256-bit SSL Encrypted Payment
                    </p>
                 </div>
              </div>
           </div>
        </form>
      </div>
    );
  };

  const ThankYouView = () => (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in">
       
       <div className="text-center mb-12 relative">
           <div className="w-28 h-28 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200 border-4 border-white ring-4 ring-green-100 animate-pop">
               <CheckCircle size={56} strokeWidth={3} />
           </div>
           <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{storeSettings.checkout.thankYouTitle}</h1>
           <p className="text-xl text-slate-500 max-w-2xl mx-auto">{storeSettings.checkout.thankYouMessage}</p>
       </div>

       {newAccountDetails && (
         <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-2xl shadow-indigo-200 mb-12 border border-indigo-800 relative overflow-hidden transform hover:-translate-y-1 transition-transform">
            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 p-24 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <UserPlus className="text-green-400" size={28} /> Account Created Successfully
                </h3>
                <p className="text-indigo-200 mb-6 text-lg">We've automatically created an account for you. Save these details to access your downloads!</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
                        <span className="text-xs uppercase font-bold text-indigo-300 block mb-2 tracking-wider">Username / Email</span>
                        <div className="font-mono text-xl font-bold tracking-wide select-all">{newAccountDetails.email}</div>
                    </div>
                    <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
                        <span className="text-xs uppercase font-bold text-indigo-300 block mb-2 tracking-wider">Password</span>
                        <div className="font-mono text-xl font-bold flex items-center gap-3">
                            <span className="select-all">{newAccountDetails.password}</span>
                            <span className="text-[10px] bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Auto-generated</span>
                        </div>
                    </div>
                </div>
            </div>
         </div>
       )}

       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12">
           <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="text-lg font-bold text-slate-900">Order Details</h3>
               {lastOrder && <span className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">{lastOrder.id}</span>}
           </div>
           
           <div className="p-8">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-sm">
                   <div>
                       <span className="block text-slate-500 mb-1">Order Number:</span>
                       <strong className="text-slate-900">{lastOrder?.id}</strong>
                   </div>
                   <div>
                       <span className="block text-slate-500 mb-1">Date:</span>
                       <strong className="text-slate-900">{lastOrder?.date}</strong>
                   </div>
                   <div>
                       <span className="block text-slate-500 mb-1">Total:</span>
                       <strong className="text-slate-900">{selectedCurrency.symbol}{lastOrder?.total}</strong>
                   </div>
                   <div>
                       <span className="block text-slate-500 mb-1">Payment Method:</span>
                       <strong className="text-slate-900">Credit Card / PayPal</strong>
                   </div>
               </div>

               <h4 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Order Items</h4>
               <div className="space-y-4">
                   <div className="bg-slate-50 p-6 rounded-xl text-center text-slate-500">
                       <Mail className="mx-auto mb-2 text-slate-400" size={24} />
                       <p className="font-medium text-slate-900">Check your email</p>
                       <p className="text-sm">We've sent the receipt and download links to <strong>{lastOrder?.email}</strong></p>
                   </div>
               </div>
           </div>
       </div>

       <div className="flex flex-col sm:flex-row justify-center gap-4">
           <button onClick={() => setCurrentView('profile')} className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
               <User size={20} /> Go to My Account
           </button>
           <button onClick={() => setCurrentView('shop')} className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all">
               Continue Shopping
           </button>
       </div>
    </div>
  );

  const getCategoryIcon = (cat: string) => {
    if (cat.includes('Builder')) return <Layout size={18} />;
    if (cat.includes('SEO')) return <BarChart3 size={18} />;
    if (cat.includes('eCommerce') || cat.includes('Shop')) return <ShoppingBag size={18} />;
    if (cat.includes('Form')) return <FileInput size={18} />;
    if (cat.includes('Performance')) return <Zap size={18} />;
    if (cat.includes('LMS')) return <GraduationCap size={18} />;
    if (cat.includes('Booking')) return <Calendar size={18} />;
    return <Layers size={18} />;
  };

  const filteredProducts = useMemo(() => {
    let result = [...products]; 
    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedCategory !== 'All') result = result.filter(p => p.category === selectedCategory);
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // --- RENDER ADMIN EXCLUSIVELY ---
  if (currentView === 'admin') {
     return (
        <div className="bg-slate-50 min-h-screen">
            {generateThemeStyles()}
            <AdminDashboard
              products={products}
              onAdd={(p) => setProducts(prev => [...prev, p])}
              onUpdate={(p) => setProducts(prev => prev.map(prod => prod.id === p.id ? p : prod))}
              onDelete={(id) => setProducts(prev => prev.filter(p => p.id !== id))}
              onClose={() => setCurrentView('home')} // Return to store
              storeSettings={storeSettings}
              onUpdateSettings={setStoreSettings}
              pages={pages}
              onAddPage={p => setPages(prev => [...prev, p])}
              onUpdatePage={p => setPages(prev => prev.map(page => page.id === p.id ? p : page))}
              onDeletePage={id => setPages(prev => prev.filter(p => p.id !== id))}
              blogPosts={blogPosts}
              onAddPost={p => setBlogPosts(prev => [...prev, p])}
              onUpdatePost={p => setBlogPosts(prev => prev.map(post => post.id === p.id ? p : post))}
              onDeletePost={id => setBlogPosts(prev => prev.filter(p => p.id !== id))}
              orders={orders}
              onUpdateOrder={o => setOrders(prev => prev.map(order => order.id === o.id ? o : order))}
              tickets={tickets}
              onUpdateTicket={t => setTickets(prev => prev.map(ticket => ticket.id === t.id ? t : ticket))}
            />
        </div>
     );
  }

  return (
    <div className="font-sans bg-slate-50 min-h-screen flex flex-col">
      {generateThemeStyles()}
      <Header
        storeName={storeSettings.storeName}
        logoUrl={storeSettings.logoUrl}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAdmin={() => setCurrentView('admin')}
        currentView={currentView}
        onChangeView={(view, id) => changeView(view, id)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setCurrentView('wishlist')}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        currentUser={currentUser}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenProfile={() => setCurrentView('profile')}
        onViewProduct={handleViewProduct}
        searchResults={searchQuery ? filteredProducts.slice(0, 5) : []}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <div className="animate-fade-in">
             {/* Hero Section */}
             <div className="bg-indigo-600 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
                   <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-float"></div>
                   <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-float-delayed"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10 text-center">
                   <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                     {storeSettings.design.heroHeadline}
                   </h1>
                   <p className="text-xl md:text-2xl text-indigo-100 mb-10 max-w-3xl mx-auto font-light">
                     {storeSettings.design.heroSubheadline}
                   </p>
                   
                   {/* Hero Search */}
                   <div className="max-w-2xl mx-auto relative mb-10 group">
                      <input 
                        type="text" 
                        placeholder="Search for plugins, themes, or tools..." 
                        className="w-full py-5 pl-14 pr-6 rounded-full text-slate-900 shadow-2xl focus:ring-4 focus:ring-indigo-400 focus:outline-none text-lg transition-transform focus:scale-105"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchEnter()}
                      />
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" size={24} />
                   </div>

                   <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button onClick={() => setCurrentView('shop')} className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2">
                         <ShoppingBag size={20} /> Browse Shop
                      </button>
                      <button onClick={() => setCurrentView('contact')} className="bg-indigo-700/50 backdrop-blur-md border border-indigo-400 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                         <Mail size={20} /> Contact Support
                      </button>
                   </div>
                </div>
             </div>

             {/* Trust Badges */}
             <div className="bg-white border-b border-slate-100 py-12">
               <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                 <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                   <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><ShieldCheck size={28} /></div>
                   <div><h3 className="font-bold text-slate-900">Original Items</h3><p className="text-sm text-slate-500">100% Verified Licenses</p></div>
                 </div>
                 <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                   <div className="bg-red-100 p-3 rounded-xl text-red-600"><Ban size={28} /></div>
                   <div><h3 className="font-bold text-slate-900">No GPL/Nulled</h3><p className="text-sm text-slate-500">Safe & Secure Files</p></div>
                 </div>
                 <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                   <div className="bg-green-100 p-3 rounded-xl text-green-600"><RefreshCw size={28} /></div>
                   <div><h3 className="font-bold text-slate-900">Regular Updates</h3><p className="text-sm text-slate-500">Direct from Dashboard</p></div>
                 </div>
                 <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                   <div className="bg-amber-100 p-3 rounded-xl text-amber-600"><LifeBuoy size={28} /></div>
                   <div><h3 className="font-bold text-slate-900">Quick Support</h3><p className="text-sm text-slate-500">Expert Assistance</p></div>
                 </div>
               </div>
             </div>

             <div className="max-w-7xl mx-auto px-4 py-16">
                {/* Best Sellers */}
                <div className="mb-16">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                        <Trophy className="text-amber-500 fill-amber-500" /> Best Sellers
                      </h2>
                      <p className="text-slate-500 mt-2">Top rated products loved by our customers</p>
                    </div>
                    <button onClick={() => setCurrentView('shop')} className="hidden sm:flex items-center gap-1 text-indigo-600 font-bold hover:underline">View All <ArrowRight size={16}/></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                </div>

                {/* Featured Products */}
                <div className="mb-16">
                  <div className="text-center mb-10">
                     <h2 className="text-3xl font-extrabold text-slate-900">Featured Products</h2>
                     <p className="text-slate-500 mt-2">Explore our hand-picked selections for professional developers</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.slice(0, 8).map(product => (
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
                  <div className="mt-8 text-center">
                    <button onClick={() => setCurrentView('shop')} className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all">Load More Products</button>
                  </div>
                </div>
                
                {/* Forms & Leads Category Section */}
                <div className="mb-24">
                   <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><FileInput className="text-pink-500" /> Forms & Leads</h2>
                      <button onClick={() => { setSelectedCategory('Forms & Leads'); setCurrentView('shop'); }} className="text-indigo-600 font-bold text-sm">See All</button>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
                </div>

                <div className="my-24">
                  <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">What Our Clients Say</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {TESTIMONIALS.map(testimonial => (
                        <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-1 transition-transform">
                           <div className="flex items-center gap-4 mb-4">
                              <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                              <div>
                                 <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                                 <p className="text-xs text-indigo-600 font-bold uppercase">{testimonial.role}</p>
                              </div>
                           </div>
                           <div className="flex text-amber-400 mb-3"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
                           <p className="text-slate-600 leading-relaxed italic">"{testimonial.text}"</p>
                        </div>
                     ))}
                  </div>
                </div>

                <FAQSection />
             </div>
             <NewsletterSection />
          </div>
        )}

        {currentView === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
             <div className="flex flex-col md:flex-row gap-8">
                {/* Left Sidebar Filters */}
                <aside className="w-full md:w-64 shrink-0">
                   <div className="sticky top-24 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm max-h-[80vh] overflow-y-auto custom-scrollbar">
                      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Filter size={18} /> Categories</h3>
                      <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar">
                         {['All', ...Array.from(new Set(products.map(p => p.category)))].map((cat: string) => (
                            <button
                               key={cat}
                               onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                               className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between whitespace-nowrap ${
                                  selectedCategory === cat ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                               }`}
                            >
                               <span className="flex items-center gap-2">
                                  {cat !== 'All' && getCategoryIcon(cat)}
                                  {cat}
                               </span>
                               {cat !== 'All' && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                     {products.filter(p => p.category === cat).length}
                                  </span>
                               )}
                            </button>
                         ))}
                      </div>
                   </div>
                </aside>

                {/* Right Product Grid */}
                <div className="flex-1">
                   <div className="flex justify-between items-center mb-6">
                      <h1 className="text-2xl font-bold text-slate-900">{selectedCategory} Products <span className="text-slate-400 text-lg font-normal">({filteredProducts.length})</span></h1>
                      <select 
                         value={sortBy}
                         onChange={(e) => setSortBy(e.target.value)}
                         className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                         <option value="default">Sort by: Default</option>
                         <option value="price-asc">Price: Low to High</option>
                         <option value="price-desc">Price: High to Low</option>
                      </select>
                   </div>
                   
                   {paginatedProducts.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                          {paginatedProducts.map(product => (
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
                        {totalPages > 1 && (
                           <div className="flex justify-center gap-2">
                              <button onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo(0,0); }} disabled={currentPage === 1} className="p-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50"><ChevronLeft size={20}/></button>
                              <span className="px-4 py-2 font-bold text-slate-700">Page {currentPage} of {totalPages}</span>
                              <button onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0,0); }} disabled={currentPage === totalPages} className="p-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50"><ChevronRight size={20}/></button>
                           </div>
                        )}
                      </>
                   ) : (
                      <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                         <Search className="mx-auto text-slate-300 mb-4" size={48} />
                         <h3 className="text-xl font-bold text-slate-900">No products found</h3>
                         <p className="text-slate-500">Try adjusting your search or filters.</p>
                      </div>
                   )}
                </div>
             </div>
          </div>
        )}

        {currentView === 'product' && selectedProduct && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ProductDetail
              product={selectedProduct}
              onAddToCart={handleAddToCart}
              onBack={() => setCurrentView('shop')}
              isWishlisted={wishlist.some(p => p.id === selectedProduct.id)}
              onToggleWishlist={() => handleToggleWishlist(selectedProduct)}
              priceMultiplier={selectedCurrency.rate}
              currencySymbol={selectedCurrency.symbol}
              recentlyViewed={recentlyViewed.filter(p => p.id !== selectedProduct.id)}
              onViewHistoryItem={handleViewProduct}
              currentUser={currentUser}
              onAddReview={(productId, review) => {
                const newReview: Review = { ...review, id: `rev_${Date.now()}`, productId, date: new Date().toISOString(), status: 'pending' as const };
                setProducts(prev => prev.map(p => p.id === productId ? { ...p, reviews: [...(p.reviews || []), newReview] } : p));
              }}
            />
          </div>
        )}

        {currentView === 'profile' && currentUser && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <CustomerDashboard
              customer={currentUser}
              onLogout={handleLogout}
              currencySymbol={selectedCurrency.symbol}
              tickets={tickets}
              onUpdateProfile={(data) => {
                const updatedUser = { ...currentUser, ...data };
                setCurrentUser(updatedUser);
                setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
              }}
              onOpenTicket={(ticketData) => {
                const newTicket: SupportTicket = { ...ticketData, id: `#TKT-${Date.now()}`, date: new Date().toISOString(), status: 'open' };
                setTickets(prev => [...prev, newTicket]);
              }}
            />
          </div>
        )}
        
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'thank-you' && <ThankYouView />}

        {/* Static Pages (Contact, About, CMS Pages) */}
        {currentView === 'contact' && (
           <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
              <h1 className="text-4xl font-bold text-center text-slate-900 mb-4">Get in Touch</h1>
              <p className="text-center text-slate-500 mb-12">We'd love to hear from you. Our team is always here to chat.</p>
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-xl mb-6">Contact Information</h3>
                    <div className="space-y-4">
                       <div className="flex items-start gap-4"><MapPin className="text-indigo-600 mt-1"/> <div><h4 className="font-bold">Address</h4><p className="text-slate-600">{storeSettings.contactAddress}</p></div></div>
                       <div className="flex items-center gap-4"><Mail className="text-indigo-600"/> <div><h4 className="font-bold">Email</h4><p className="text-slate-600">{storeSettings.supportEmail}</p></div></div>
                       <div className="flex items-center gap-4"><Phone className="text-indigo-600"/> <div><h4 className="font-bold">Phone</h4><p className="text-slate-600">{storeSettings.contactPhone}</p></div></div>
                    </div>
                 </div>
                 <form className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Name</label><input type="text" className="w-full border p-3 rounded-xl" placeholder="Your Name" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Email</label><input type="email" className="w-full border p-3 rounded-xl" placeholder="your@email.com" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Message</label><textarea className="w-full border p-3 rounded-xl" rows={4} placeholder="How can we help?" /></div>
                    <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors">Send Message</button>
                 </form>
              </div>
           </div>
        )}

        {currentView === 'page' && selectedPage && (
           <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
              <h1 className="text-4xl font-bold text-slate-900 mb-8">{selectedPage.title}</h1>
              <div className="prose prose-slate max-w-none bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                 <div dangerouslySetInnerHTML={{ __html: selectedPage.content }} />
              </div>
           </div>
        )}

        {currentView === 'wishlist' && (
           <div className="max-w-7xl mx-auto px-4 py-12">
              <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-2"><Heart className="text-red-500 fill-red-500" /> My Wishlist ({wishlist.length})</h1>
              {wishlist.length === 0 ? (
                 <div className="text-center py-20"><Heart className="mx-auto text-slate-200 mb-4" size={64} /><h3 className="text-xl font-bold text-slate-400">Your wishlist is empty</h3></div>
              ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
      </main>

      <Footer
        settings={storeSettings}
        pages={pages}
        onChangeView={(view, id) => changeView(view, id)}
        onOpenAdmin={() => setCurrentView('admin')}
        onCategoryClick={(category) => {
          setSelectedCategory(category);
          setCurrentView('shop');
        }}
      />
      
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateCartQuantity}
        priceMultiplier={selectedCurrency.rate}
        currencySymbol={selectedCurrency.symbol}
        onCheckout={() => {
          setIsCartOpen(false);
          setCurrentView('checkout');
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onDemoLogin={handleDemoLogin}
      />
      
      <MobileBottomNav
        currentView={currentView}
        onChangeView={(view) => changeView(view)}
        cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setCurrentView('wishlist')}
      />
    </div>
  );
};

export default App;
