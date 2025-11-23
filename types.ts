
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
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

export interface StoreSettings {
  storeName: string;
  siteUrl: string; // New: Needed for Sitemap
  supportEmail: string;
  currencySymbol: string;
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
}
