import React, { useState } from 'react';
import { Check, Copy, Gift, MessageCircle, Tag, Users } from 'lucide-react';
import { AppSettings, CustomerProfile, PageView } from '../types';
import { STUDENT_COUPONS } from '../data/seedData';

interface OffersViewProps {
  profile: CustomerProfile;
  settings: AppSettings;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => void;
  onNavigate: (page: PageView) => void;
}

export const OffersView: React.FC<OffersViewProps> = ({
  profile,
  settings,
  appliedCoupon,
  onApplyCoupon,
  onNavigate,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const referralShareMessage = `Hey! Order fresh healthy late-night food at DBS Global University from GreenBite. Use my referral code ROOMIE20 (or ${profile.referralCode}) for ₹20 off your first hostel meal!`;
  const referralWhatsappUrl = `https://wa.me/?text=${encodeURIComponent(referralShareMessage)}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
      <div className="space-y-2 max-w-2xl">
        <p className="text-xs font-semibold text-[#2D7A47] uppercase tracking-wide">
          Campus Deals &amp; Student Perks
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#12241A]">
          Student Offers &amp; Referral Program
        </h1>
        <p className="text-sm sm:text-base text-[#4A5D52]">
          Built around student budgets at {settings.campusName}. Apply any promo code below to automatically discount your cart.
        </p>
      </div>

      {/* Promo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STUDENT_COUPONS.map((coupon) => {
          const isApplied = appliedCoupon === coupon.code;
          return (
            <div
              key={coupon.code}
              className="bg-white border border-[#E4DFD3] rounded-2xl p-6 flex flex-col justify-between gap-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-[#2D7A47]">{coupon.tag}</span>
                  <span className="font-mono text-[#6E7E74] tabular-nums">
                    Min. order ₹{coupon.minOrder}
                  </span>
                </div>

                <h2 className="font-display text-xl font-bold text-[#12241A]">
                  {coupon.title}
                </h2>
                <p className="text-sm text-[#4A5D52] leading-relaxed">
                  {coupon.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F2EDE2] flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF8F3] border border-dashed border-[#2D7A47]">
                  <Tag className="w-3.5 h-3.5 text-[#2D7A47]" aria-hidden="true" />
                  <span className="font-mono text-sm font-bold text-[#143D29]">
                    {coupon.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(coupon.code)}
                    aria-label={`Copy ${coupon.code}`}
                    className="text-[#4A5D52] hover:text-[#143D29] ml-1"
                  >
                    {copiedCode === coupon.code ? (
                      <Check className="w-3.5 h-3.5 text-[#2D7A47]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onApplyCoupon(coupon.code);
                    onNavigate('menu');
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                    isApplied
                      ? 'bg-[#2D7A47] text-white'
                      : 'bg-[#143D29] hover:bg-[#2D7A47] text-white'
                  }`}
                >
                  {isApplied ? 'Applied · Go to Menu' : 'Apply & Order'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Refer a Roommate Banner */}
      <section className="bg-[#143D29] text-white rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#A7E3BA]">
            <Users className="w-4 h-4" aria-hidden="true" />
            <span>Hostel Referral Program</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">
            Refer a Roommate and Get ₹20 Off
          </h2>
          <p className="text-sm sm:text-base text-[#D6E6DC] leading-relaxed max-w-xl">
            Studying together past midnight? Share your referral code with a roommate or hostel friend. Both of you get ₹20 off your next healthy bowl, wrap, or study combo.
          </p>
        </div>

        <div className="lg:col-span-5 bg-white/10 border border-white/15 rounded-xl p-5 space-y-4">
          <div>
            <span className="text-xs text-[#D6E6DC] block">Your Hostel Referral Code</span>
            <div className="mt-1.5 flex items-center justify-between gap-2 bg-[#0E2B1D] rounded-lg px-3.5 py-2.5">
              <span className="font-mono text-base font-bold tracking-wide">
                {profile.referralCode}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(profile.referralCode)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#A7E3BA] hover:text-white"
              >
                {copiedCode === profile.referralCode ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <a
              href={referralWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#2D7A47] hover:bg-[#389456] text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Invite on WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={() => {
                onApplyCoupon('ROOMIE20');
                onNavigate('menu');
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-[#143D29] hover:bg-[#FAF8F3] text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <Gift className="w-4 h-4" aria-hidden="true" />
              <span>Use ROOMIE20</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
