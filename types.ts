
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  reviews?: Review[];
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'on-hold' | 'cancelled' | 'refunded';
  date: string;
  items: number;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'closed';
  date: string;
  image?: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image?: string;
  category: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Currency {
  code: string;
  symbol: string;
  rate: number;
  flag: string;
  name: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  password?: string; // Demo only
  joinDate: string;
}

export interface StoreSettings {
  storeName: string;
  siteUrl: string;
  supportEmail: string;
  contactAddress: string;
  contactPhone: string;
  footerDescription: string;
  logoUrl?: string;
  faviconUrl?: string;
  
  // Design & Branding
  design: {
    primaryColor: string;
    heroHeadline: string;
    heroSubheadline: string;
    fontFamily: string;
    borderRadius: string;
  };

  // Payment Configuration
  payment: {
    currencySymbol: string;
    currencyCode: string;
    stripeEnabled: boolean;
    stripePublishableKey: string;
    stripeSecretKey: string;
    paypalEnabled: boolean;
    paypalClientId: string;
    paypalSecret: string;
    testMode: boolean;
  };

  // Checkout Configuration
  checkout: {
    guestCheckout: boolean;
    requirePhone: boolean;
    enableCoupons: boolean;
    termsUrl: string;
    privacyUrl: string;
  };

  // SEO & Analytics
  seo: {
    title: string;
    description: string;
    googleAnalyticsId: string;
    googleSearchConsoleCode: string;
    bingWebmasterCode: string;
    shopTitle?: string;
    shopDescription?: string;
    contactTitle?: string;
    contactDescription?: string;
  };

  // Social Media
  socials: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };

  // Categorization
  popularCategories: string[];

  // AI Config
  aiSystemInstruction?: string;
  aiApiKey?: string;
  
  // Admin Security
  adminPassword?: string;
}
