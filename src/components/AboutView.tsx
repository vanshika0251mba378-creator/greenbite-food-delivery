import React, { useState } from 'react';
import { Clock, Leaf, MapPin, MessageCircle, Recycle, ShieldCheck } from 'lucide-react';
import { AppSettings, DeliveryLocation, PageView } from '../types';
import { CAMPUS_HOSTELS, ECO_PACKAGING_IMAGE } from '../data/seedData';
import { buildWhatsAppOrderUrl } from '../utils/storage';

interface AboutViewProps {
  settings: AppSettings;
  location: DeliveryLocation;
  onNavigate: (page: PageView) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  settings,
  location,
  onNavigate,
}) => {
  const [imgError, setImgError] = useState(false);
  const whatsappUrl = buildWhatsAppOrderUrl(settings.whatsappNumber, [], location);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-14">
      {/* Brand Story */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        <div className="lg:col-span-7 space-y-5 flex flex-col justify-center">
          <p className="text-xs font-semibold text-[#2D7A47] uppercase tracking-wide">
            About GreenBite · Dehradun
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#12241A] [text-wrap:balance]">
            Eat Fresh. Study Better. Stay Green.
          </h1>
          <p className="text-base sm:text-lg text-[#4A5D52] leading-relaxed">
            GreenBite is a student-focused, hyper-local late-night food delivery venture designed to solve the problem of limited healthy and affordable food options around university campuses. We deliver freshly prepared meals and snacks directly to hostel residents while promoting sustainability through biodegradable and plastic-free packaging.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-white border border-[#E4DFD3] rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#143D29]">
                <Clock className="w-4 h-4 text-[#2D7A47]" aria-hidden="true" />
                <span>Late-Night Hours</span>
              </div>
              <p className="text-xs text-[#4A5D52]">{settings.operatingHours}</p>
            </div>
            <div className="bg-white border border-[#E4DFD3] rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#143D29]">
                <MapPin className="w-4 h-4 text-[#2D7A47]" aria-hidden="true" />
                <span>Primary Campus</span>
              </div>
              <p className="text-xs text-[#4A5D52]">{settings.campusName}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('menu')}
              className="px-5 py-2.5 rounded-lg bg-[#143D29] hover:bg-[#2D7A47] text-white text-sm font-semibold transition-colors"
            >
              Order Healthy Meals
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#E4DFD3] bg-white hover:bg-[#F2EDE2] text-[#143D29] text-sm font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#2D7A47]" aria-hidden="true" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-[#E4DFD3] bg-[#F2EDE2] min-h-[280px]">
          {!imgError ? (
            <img
              src={ECO_PACKAGING_IMAGE}
              alt="GreenBite biodegradable packaging materials"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover lg:absolute lg:inset-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-8 text-[#143D29]">
              <Leaf className="w-12 h-12" />
            </div>
          )}
        </div>
      </section>

      {/* Dedicated Sustainability Section */}
      <section className="bg-white border border-[#E4DFD3] rounded-2xl p-6 sm:p-10 space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D7A47]">
            <Leaf className="w-4 h-4" aria-hidden="true" />
            <span>Delivered with Care for the Planet</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#12241A]">
            Our Sustainability Commitment
          </h2>
          <p className="text-sm sm:text-base text-[#4A5D52]">
            Late-night campus delivery shouldn&apos;t leave behind mountains of single-use plastic in hostel bins. Every GreenBite package is designed to return safely to soil.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#FAF8F3] border border-[#E4DFD3] rounded-xl p-5 space-y-2">
            <Recycle className="w-5 h-5 text-[#2D7A47]" aria-hidden="true" />
            <h3 className="font-display text-base font-bold text-[#12241A]">
              100% Biodegradable Packaging
            </h3>
            <p className="text-sm text-[#4A5D52] leading-relaxed">
              Meals are packed in molded sugarcane bagasse bowls and unbleached kraft paper boxes that compost naturally within 60–90 days.
            </p>
          </div>

          <div className="bg-[#FAF8F3] border border-[#E4DFD3] rounded-xl p-5 space-y-2">
            <ShieldCheck className="w-5 h-5 text-[#2D7A47]" aria-hidden="true" />
            <h3 className="font-display text-base font-bold text-[#12241A]">
              Plastic-Free Food Delivery
            </h3>
            <p className="text-sm text-[#4A5D52] leading-relaxed">
              Zero polythene bags, zero styrofoam containers, and zero plastic spoons—we supply smooth birchwood cutlery and paper seals.
            </p>
          </div>

          <div className="bg-[#FAF8F3] border border-[#E4DFD3] rounded-xl p-5 space-y-2">
            <Leaf className="w-5 h-5 text-[#2D7A47]" aria-hidden="true" />
            <h3 className="font-display text-base font-bold text-[#12241A]">
              Zero Campus Waste Initiative
            </h3>
            <p className="text-sm text-[#4A5D52] leading-relaxed">
              Hyper-local cycle &amp; EV drop-offs keep emissions minimal while helping DBS Global University reduce single-use plastic across hostels.
            </p>
          </div>
        </div>
      </section>

      {/* Campus Coverage */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-[#12241A]">
          Hostels &amp; PG Zones We Serve (15–20 Min Delivery)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CAMPUS_HOSTELS.map((hostel) => (
            <div
              key={hostel}
              className="bg-white border border-[#E4DFD3] rounded-xl px-4 py-3 flex items-center gap-2.5 text-sm font-medium text-[#12241A]"
            >
              <MapPin className="w-4 h-4 text-[#2D7A47] shrink-0" aria-hidden="true" />
              <span className="truncate">{hostel}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
