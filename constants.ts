

import { Product, Currency, LicenseType } from './types';

export const STORE_NAME = "AllPluginsWP";

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1, flag: '🇺🇸', name: 'USD' },
  { code: 'EUR', symbol: '€', rate: 0.92, flag: '🇪🇺', name: 'EUR' },
  { code: 'GBP', symbol: '£', rate: 0.79, flag: '🇬🇧', name: 'GBP' },
  { code: 'MAD', symbol: 'DH', rate: 10.12, flag: '🇲🇦', name: 'MAD' },
];

// Configuration for License Tiers
export const LICENSE_OPTIONS: { type: LicenseType; label: string; multiplier: number; badge?: string }[] = [
  { type: 'single', label: '1 Site Activation', multiplier: 1 },
  { type: 'double', label: '2 Sites Activation', multiplier: 1.5, badge: 'Popular' },
  { type: 'five', label: '5 Sites Activation', multiplier: 2.5 },
  { type: 'ten', label: '10 Sites Activation', multiplier: 4 },
  { type: 'unlimited', label: 'Unlimited Sites', multiplier: 8, badge: 'Best Value' },
];

const categorize = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('builder') || n.includes('bricks') || n.includes('oxygen') || n.includes('divi') || n.includes('elementor') || n.includes('spectra') || n.includes('crocoblock') || n.includes('addon')) return 'Builders & Addons';
  if (n.includes('seo') || n.includes('rank math') || n.includes('schema') || n.includes('link') || n.includes('google')) return 'SEO & Marketing';
  if (n.includes('woo') || n.includes('shop') || n.includes('cart') || n.includes('sellkit') || n.includes('payment') || n.includes('revenue')) return 'eCommerce';
  if (n.includes('form') || n.includes('login') || n.includes('optin')) return 'Forms & Leads';
  if (n.includes('performance') || n.includes('cache') || n.includes('perfmatters') || n.includes('imagify') || n.includes('flyingpress')) return 'Performance';
  if (n.includes('booking') || n.includes('schedule') || n.includes('event')) return 'Booking & Events';
  if (n.includes('lms') || n.includes('tutor') || n.includes('learn')) return 'LMS & Education';
  return 'Plugins & Tools';
};

const rawData = [
  { name: "CartFlows", price: 45 },
  { name: "CodeSnippets + AI", price: 25 },
  { name: "Convert PRO", price: 20 },
  { name: "Core Framework Bricks Builder Integration", price: 20 },
  { name: "Core Framework Oxygen Builder Integration", price: 20 },
  { name: "Divi Monk", price: 20 },
  { name: "Divi Supreme", price: 20 },
  { name: "DiviFlash", price: 20 },
  { name: "Docus Pro", price: 20 },
  { name: "Element Pack Pro", price: 20 },
  { name: "Elementor Pro", price: 20 },
  { name: "Greenshift – Original License Key", price: 20 },
  { name: "GutenKit", price: 19 },
  { name: "Happy Addons", price: 20 },
  { name: "HappyFiles", price: 20 },
  { name: "HashBar Pro", price: 20 },
  { name: "Hide My WP Ghost", price: 20 },
  { name: "HT Mega Menu", price: 20 },
  { name: "HT Script Pro – Original License Key", price: 20 },
  { name: "Hydrogen Pack", price: 20 },
  { name: "Imagify Pro", price: 20 },
  { name: "JetFormBuilder Pro", price: 20 },
  { name: "Just Tables – Original License Key", price: 20 },
  { name: "Kitpapa", price: 20 },
  { name: "LoginPress Pro", price: 20 },
  { name: "MailPoet", price: 25 },
  { name: "MetaBox Pro", price: 20 },
  { name: "Email Candy Pro", price: 20 },
  { name: "Eventin Pro", price: 20 },
  { name: "Exclusive Addons", price: 20 },
  { name: "Fluent Forms Pro", price: 20 },
  { name: "Oxy Ultimate & Woo", price: 20 },
  { name: "OxyExtras", price: 20 },
  { name: "Oxygen Builder", price: 20 },
  { name: "OxyMade", price: 20 },
  { name: "OxyProps", price: 20 },
  { name: "Perfmatters", price: 20 },
  { name: "Ultimate Addons for Beaver Builder", price: 20 },
  { name: "UltimatePost Kit", price: 19 },
  { name: "Unlimited Elements", price: 20 },
  { name: "UpFilter Pro", price: 20 },
  { name: "Was this Helpful? – Original License Key", price: 20 },
  { name: "WC Builder", price: 20 },
  { name: "Whols Pro", price: 20 },
  { name: "Woolenter Pro", price: 20 },
  { name: "WowOptin Pro", price: 20 },
  { name: "WowRevenue Pro", price: 20 },
  { name: "WP Adminify", price: 19 },
  { name: "WP All Export Pro", price: 20 },
  { name: "WP All Import Pro", price: 20 },
  { name: "WP CodeBox Pro", price: 20 },
  { name: "Essential Addons for Elementor Pro", price: 20 },
  { name: "Schema PRO", price: 20 },
  { name: "Sellkit", price: 19 },
  { name: "SEOPress Pro", price: 20 },
  { name: "ShopEngine", price: 19 },
  { name: "StudioCart Pro", price: 19 },
  { name: "Swatchly Pro", price: 20 },
  { name: "Templately Pro", price: 20 },
  { name: "The Plus Addon For Elementor", price: 20 },
  { name: "Ultimate Addons", price: 20 },
  { name: "PowerPack Elements", price: 20 },
  { name: "Premium Addons Pro", price: 20 },
  { name: "Prime Slider Pro", price: 20 },
  { name: "Multi Currency Pro", price: 20 },
  { name: "Ninja Tables Pro", price: 20 },
  { name: "NotificationX Pro", price: 20 },
  { name: "OceanWP Bundle", price: 20 },
  { name: "Rank Math Pro", price: 20 },
  { name: "ACPT (Advanced Custom Post Types) Pro", price: 20 },
  { name: "Advanced Custom Fields (ACF) Pro", price: 20 },
  { name: "Advanced Scripts Manager", price: 20 },
  { name: "Bricks Builder", price: 20 },
  { name: "WP Funnels", price: 20 },
  { name: "WP Plugin Manager Pro", price: 20 },
  { name: "WP Portfolio", price: 20 },
  { name: "WP Reset Pro", price: 20 },
  { name: "YABE Webfonts", price: 20 },
  { name: "Zion Builder", price: 20 },
  { name: "Advanced Themer", price: 20 },
  { name: "Amelia Booking", price: 20 },
  { name: "Better Payment Pro", price: 20 },
  { name: "BetterDocs Pro", price: 20 },
  { name: "BetterLinks Pro", price: 20 },
  { name: "Bit Form", price: 20 },
  { name: "Crocoblock Wizard", price: 20 },
  { name: "CSS Hero – Original License Key", price: 25 },
  { name: "Bricks Templates – Original License Key", price: 25 },
  { name: "Brizy PRO Builder", price: 25 },
  { name: "Elements Kit – Original License Key", price: 25 },
  { name: "EmbedPress Pro", price: 20 },
  { name: "Essential Blocks Pro", price: 20 },
  { name: "FlyingPress", price: 25 },
  { name: "JetPlugins", price: 20 },
  { name: "WP Social", price: 20 },
  { name: "WP Ultimo (Annual License)", price: 89 },
  { name: "WPML (Annual)", price: 20 },
  { name: "Motion.page", price: 20 },
  { name: "Otter Blocks Pro", price: 20 },
  { name: "Piotnet Forms", price: 20 },
  { name: "Notification X Pro", price: 20 },
  { name: "ProductX Pro (WowStore)", price: 20 },
  { name: "ReviewX Pro", price: 20 },
  { name: "SchedulePress Pro", price: 20 },
  { name: "Smart Slider 3", price: 25 },
  { name: "Spectra Pro", price: 20 },
  { name: "The Addon for Elementor", price: 20 },
  { name: "Tutor LMS Pro", price: 49 },
  { name: "WP Forms", price: 25 }
];

const uniqueData = Array.from(new Map(rawData.map(item => [item.name, item])).values());

const getPlaceholderImage = (name: string, category: string) => {
  const bgColors: Record<string, string> = {
    'Builders & Addons': '2563eb',
    'SEO & Marketing': '059669',
    'eCommerce': '7c3aed',
    'Forms & Leads': 'db2777',
    'Performance': 'd97706',
    'Booking & Events': 'dc2626',
    'LMS & Education': '0891b2',
    'Plugins & Tools': '475569'
  };
  
  const color = bgColors[category] || '475569';
  const text = encodeURIComponent(name);
  return `https://placehold.co/600x400/${color}/ffffff?text=${text}`;
};

export const PRODUCTS: Product[] = uniqueData.map((item, index) => {
  const category = categorize(item.name);
  return {
    id: `prod_${index + 1}`,
    name: item.name,
    price: item.price,
    category: category,
    description: `Premium license key for ${item.name}. Instant digital delivery.`,
    image: getPlaceholderImage(item.name, category)
  };
});