

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
  demoUrl?: string;
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

// New License Type Definition
export type LicenseType = 'single' | 'double' | 'five' | 'ten' | 'unlimited';

export interface CartItem extends Product {
  quantity: number;
  // Added license specific fields
  licenseType: LicenseType;
  licenseLabel: string;
  basePrice: number; // The original price of 1 item
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'on-hold' | 'cancelled' | 'refunded';
  date: string;
  items: number;
  products?: CartItem[];
  billingDetails?: {
    address: string;
    city: string;
    country: string;
    zip: string;
    state?: string;
    phone?: string;
  };
}

export interface TicketReply {
  id: string;
  sender: 'customer' | 'admin';
  message: string;
  date: string;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'closed' | 'in-progress';
  date: string;
  image?: string;
  replies?: TicketReply[];
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
  isVerified?: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  usageLimit?: number;
  usedCount: number;
  expiryDate?: string;
  status: 'active' | 'expired';
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
  maintenanceMode: boolean;
  
  timezone: string;
  dateFormat: string;

  design: {
    primaryColor: string;
    heroHeadline: string;
    heroSubheadline: string;
    fontFamily: string;
    borderRadius: string;
    announcementBar: {
      enabled: boolean;
      text: string;
      link?: string;
      backgroundColor: string;
      textColor: string;
    };
  };

  payment: {
    currencySymbol: string;
    currencyCode: string;
    currencyPosition: 'left' | 'right';
    taxRate: number;
    stripeEnabled: boolean;
    stripePublishableKey: string;
    stripeSecretKey: string;
    paypalEnabled: boolean;
    paypalClientId: string;
    paypalSecret: string;
    testMode: boolean;
  };

  checkout: {
    guestCheckout: boolean;
    requirePhone: boolean;
    enableCoupons: boolean;
    termsUrl: string;
    privacyUrl: string;
    checkoutTitle: string;
    checkoutSubtitle: string;
    thankYouTitle: string;
    thankYouMessage: string;
    invoicePrefix: string;
  };

  emailSettings: {
    senderName: string;
    senderEmail: string;
    welcomeSubject: string;
    orderSubject: string;
  };

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

  socials: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };

  popularCategories: string[];
  categoryIcons?: Record<string, string>;
  
  adminPassword?: string;
}