
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, ArrowRight, Package, Lock } from 'lucide-react';
import { StoreSettings, Page } from '../types';

interface FooterProps {
  settings: StoreSettings;
  pages?: Page[];
  onChangeView: (view: string, id?: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, pages = [], onChangeView, onOpenAdmin }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white mb-4">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Package size={24} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight">{settings.storeName}</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {settings.footerDescription || settings.seoDescription}
            </p>
            <div className="flex gap-4 pt-2">
              {settings.socials.facebook && (
                <a 
                  href={settings.socials.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-[#1877F2] p-2 rounded-full text-white hover:brightness-110 transition-all duration-300 group shadow-md hover:shadow-lg hover:-translate-y-1"
                  aria-label="Facebook"
                >
                  <Facebook size={18} className="transition-transform group-hover:scale-110" />
                </a>
              )}
              {settings.socials.twitter && (
                <a 
                  href={settings.socials.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-[#1DA1F2] p-2 rounded-full text-white hover:brightness-110 transition-all duration-300 group shadow-md hover:shadow-lg hover:-translate-y-1"
                  aria-label="Twitter"
                >
                  <Twitter size={18} className="transition-transform group-hover:scale-110" />
                </a>
              )}
              {settings.socials.instagram && (
                <a 
                  href={settings.socials.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-2 rounded-full text-white hover:brightness-110 transition-all duration-300 group shadow-md hover:shadow-lg hover:-translate-y-1"
                  aria-label="Instagram"
                >
                  <Instagram size={18} className="transition-transform group-hover:scale-110" />
                </a>
              )}
              {settings.socials.linkedin && (
                <a 
                  href={settings.socials.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-[#0077b5] p-2 rounded-full text-white hover:brightness-110 transition-all duration-300 group shadow-md hover:shadow-lg hover:-translate-y-1"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} className="transition-transform group-hover:scale-110" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => onChangeView('home')} className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                  <ArrowRight size={14} /> Home
                </button>
              </li>
              <li>
                <button onClick={() => onChangeView('shop')} className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                  <ArrowRight size={14} /> Browse Shop
                </button>
              </li>
              <li>
                <button onClick={() => onChangeView('contact')} className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                  <ArrowRight size={14} /> Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold mb-6">Popular Categories</h3>
            <ul className="space-y-3">
              {settings.popularCategories && settings.popularCategories.length > 0 ? (
                settings.popularCategories.map((cat, idx) => (
                   <li key={idx} className="hover:text-indigo-400 cursor-pointer">{cat.trim()}</li>
                ))
              ) : (
                <>
                  <li className="hover:text-indigo-400 cursor-pointer">WordPress Plugins</li>
                  <li className="hover:text-indigo-400 cursor-pointer">Page Builders</li>
                  <li className="hover:text-indigo-400 cursor-pointer">SEO Tools</li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-indigo-500 shrink-0 mt-1" size={18} />
                <span className="text-sm">{settings.contactAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-indigo-500 shrink-0" size={18} />
                <a href={`mailto:${settings.supportEmail}`} className="text-sm hover:text-white transition-colors">{settings.supportEmail}</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-indigo-500 shrink-0" size={18} />
                <span className="text-sm">{settings.contactPhone}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} {settings.storeName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-slate-500 justify-center items-center">
            {pages.map(page => (
              <button 
                key={page.id} 
                onClick={() => onChangeView('page', page.id)}
                className="hover:text-white cursor-pointer"
              >
                {page.title}
              </button>
            ))}
            {!pages.length && (
              <>
                 <span className="hover:text-white cursor-pointer">Privacy Policy</span>
                 <span className="hover:text-white cursor-pointer">Terms of Service</span>
              </>
            )}
            {onOpenAdmin && (
              <button onClick={onOpenAdmin} className="hover:text-white cursor-pointer flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                 <Lock size={12} /> Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
