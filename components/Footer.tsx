'use client';

import React from 'react';
import { PageRoute } from '../lib/types';
import { AkvioraLogoIcon } from './AkvioraLogo';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/akviora-technologies',
    label: 'Connect with Akviora on LinkedIn',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24m1.4 9.74v-8.37H5.06v8.37h2.8z" />
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/akvioratech',
    label: 'Follow Akviora on Twitter / X',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/akvioratechnologies',
    label: 'Follow Akviora on Instagram',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/akvioratechnologies',
    label: 'Visit Akviora on Facebook',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative z-10 px-4 sm:px-8 lg:px-12 pt-12 pb-8 text-[#8EA6B4] text-[15px] border-t border-[rgba(255,255,255,0.11)] bg-[#060B14]/85 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-8 border-b border-[rgba(255,255,255,0.08)]">
          {/* Left Column: Brand, Mission & Social Media Icons */}
          <div className="lg:col-span-5 space-y-4">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2.5 text-left hover:opacity-90 transition-opacity cursor-pointer group"
            >
              <AkvioraLogoIcon color="white" className="w-8 h-8 sm:w-[34px] sm:h-[34px] -translate-y-[2px] shrink-0 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.22)] group-hover:scale-105 transition-transform" />
              <b className="font-display font-bold text-[20px] sm:text-[21px] leading-none text-[#EAF4F8]">
                Akviora Technologies
              </b>
            </button>
            <p className="text-[#8EA6B4] text-sm sm:text-base leading-relaxed">
              Design the experience. Automate the work. Build what&apos;s next.
            </p>
            <p className="text-xs sm:text-sm text-[#8EA6B4]/80 leading-relaxed">
              Websites · Web Apps · SaaS Platforms · AI Voice &amp; Chat Assistants · Custom Workflow Automation · UI/UX Design Systems
            </p>

            {/* Social Media Channels */}
            <div className="pt-2 space-y-2.5">
              <span className="text-xs font-mono text-[#5CE1E6] uppercase tracking-wider block">
                Connect With Akviora
              </span>
              <div className="flex items-center gap-2.5">
                {SOCIAL_LINKS.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    title={item.label}
                    className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.12] hover:border-[#5CE1E6]/60 hover:bg-[#5CE1E6]/10 text-[#8EA6B4] hover:text-[#5CE1E6] transition-all flex items-center justify-center cursor-pointer hover:shadow-[0_0_15px_rgba(92,225,230,0.25)] hover:scale-105 active:scale-95 shrink-0"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Quick Links & Direct Contact */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono text-[#8EA6B4] uppercase tracking-wider block">
                Navigation &amp; Capabilities
              </span>
              <div className="flex flex-wrap gap-x-5 sm:gap-x-7 gap-y-2.5 text-sm sm:text-[15px]">
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="text-[#EAF4F8] hover:text-[#5CE1E6] transition-colors cursor-pointer"
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="text-[#EAF4F8] hover:text-[#5CE1E6] transition-colors cursor-pointer"
                >
                  Services
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('pricing')}
                  className="text-[#EAF4F8] hover:text-[#5CE1E6] transition-colors cursor-pointer"
                >
                  Pricing &amp; Packages
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('ai')}
                  className="text-[#EAF4F8] hover:text-[#5CE1E6] transition-colors cursor-pointer"
                >
                  AI Studio
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('work')}
                  className="text-[#EAF4F8] hover:text-[#5CE1E6] transition-colors cursor-pointer"
                >
                  Case Studies
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="text-[#EAF4F8] hover:text-[#5CE1E6] transition-colors cursor-pointer"
                >
                  About &amp; Process
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('faq')}
                  className="text-[#EAF4F8] hover:text-[#5CE1E6] transition-colors cursor-pointer"
                >
                  FAQ
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="text-[#EAF4F8] hover:text-[#5CE1E6] transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[rgba(255,255,255,0.06)]">
              <span className="text-xs font-mono text-[#8EA6B4] block">
                Direct Project Inquiries &amp; Discovery Calls:
              </span>
              <p className="text-sm sm:text-base">
                <a
                  href="mailto:hello@akvioratechnologies.com"
                  className="text-[#5CE1E6] hover:underline font-mono"
                >
                  hello@akvioratechnologies.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between flex-wrap gap-4 text-xs sm:text-sm text-[#8EA6B4] text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span>© 2026 Akviora Technologies. All rights reserved.</span>
          </div>
          <span className="leading-relaxed">
            Privacy Policy · Terms of Service · Cookie Policy · WCAG 2.1 AA Compliant
          </span>
        </div>
      </div>
    </footer>
  );
};
