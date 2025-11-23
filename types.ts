
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
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
  status: 'completed' | 'pending' | 'refunded';
  date: string;
  items: number;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
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
  siteUrl: string; // New: Needed for Sitemap
  supportEmail: string;
  currencySymbol: string; // Base currency symbol (usually USD)
  currencyCode: string;   // Base currency code
  seoTitle: string;
  seoDescription: string;
  // SEO & Analytics Integration
  googleAnalyticsId: string;
  googleSearchConsoleCode: string; // The content of the meta tag
  bingWebmasterCode: string; // The content of the meta tag
  // Contact & Content
  contactAddress: string;
  contactPhone: string;
  footerDescription: string;
  logoUrl?: string;
  popularCategories: string[];
  socials: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  // AI Config
  aiSystemInstruction?: string;
  aiApiKey?: string;
  // Page Specific SEO
  shopSeoTitle?: string;
  shopSeoDescription?: string;
  contactSeoTitle?: string;
  contactSeoDescription?: string;
  faviconUrl?: string;
}
