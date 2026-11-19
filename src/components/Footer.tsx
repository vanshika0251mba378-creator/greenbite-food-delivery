import React from 'react';
import { Leaf, MessageCircle, ShieldCheck } from 'lucide-react';
import { AppSettings, DeliveryLocation, PageView } from '../types';
import { buildWhatsAppOrderUrl } from '../utils/storage';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  settings: AppSettings;
  location: DeliveryLocation;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, settings, location }) => {
  const sampleWhatsappUrl = buildWhatsAppOrderUrl(settings.whatsappNumber, [], location);

  const go = (page: PageView) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#143D29] text-white mt-16 border-t border-[#0E2B1D]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/15">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-white text-[#143D29] flex items-center justify-center">
                <Leaf className="w-4 h-4" aria-hidden="true" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight">GreenBite</span>
            </div>
            <p className="text-sm text-[#D6E6DC] font-medium">
              Eat Fresh. Study Better. Stay Green.
            </p>
            <p className="text-sm text-[#B4CEC0] max-w-md leading-relaxed">
              Hyper-local healthy late-night food delivery serving DBS Global University hostels, PGs, and student residences in Dehradun.
            </p>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-display text-sm font-semibold text-white">Explore</h3>
            <ul className="space-y-2 text-sm text-[#B4CEC0]">
              <li>
                <button type="button" onClick={() => go('menu')} className="hover:text-white transition-colors">
                  Food Menu
                </button>
              </li>
              <li>
                <button type="button" onClick={() => go('offers')} className="hover:text-white transition-colors">
                  Student Offers &amp; Referrals
                </button>
              </li>
              <li>
                <button type="button" onClick={() => go('orders')} className="hover:text-white transition-colors">
                  Track My Order
                </button>
              </li>
              <li>
                <button type="button" onClick={() => go('about')} className="hover:text-white transition-colors">
                  About &amp; Sustainability
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-sm font-semibold text-white">Campus Desk</h3>
            <p className="text-xs text-[#B4CEC0] leading-relaxed">
              {settings.campusName}
              <br />
              Hours: {settings.operatingHours}
            </p>
            <div className="flex flex-col items-start gap-2 pt-1">
              <a
                href={sampleWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#2D7A47] hover:bg-[#389456] text-white text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Order on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => go('admin')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Demo Admin Dashboard</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#B4CEC0]">
          <p>© {new Date().getFullYear()} GreenBite Campus Kitchen · Dehradun</p>
          <p>100% Biodegradable &amp; Plastic-Free Delivery</p>
        </div>
      </div>
    </footer>
  );
};
