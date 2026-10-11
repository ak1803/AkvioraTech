'use client';

import React from 'react';
import { PageRoute } from '../lib/types';
import { AkvioraLogoIcon } from './AkvioraLogo';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative z-10 px-5 sm:px-8 lg:px-12 pt-12 pb-8 text-[#8EA6B4] text-[15px] border-t border-[rgba(255,255,255,0.11)] bg-[#060B14]/85 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between flex-wrap gap-8 pb-8 border-b border-[rgba(255,255,255,0.08)]">
          <div className="max-w-md space-y-2">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 text-left hover:opacity-90 transition-opacity cursor-pointer"
            >
              <AkvioraLogoIcon className="w-7 h-7 sm:w-[30px] sm:h-[30px] -translate-y-[2px] shrink-0" />
              <b className="font-display font-bold text-[21px] leading-none text-[#EAF4F8]">
                Akviora Technologies
              </b>
            </button>
            <p className="text-[#8EA6B4]">
              Design the experience. Automate the work. Build what&apos;s next.
            </p>
            <p className="text-sm text-[#8EA6B4]/80 pt-1">
              Websites · Web Apps · SaaS · AI Assistants · Automation · UI/UX ·
              Business Systems
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
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
            <p className="text-sm">
              <a
                href="mailto:hello@akvioratechnologies.com"
                className="text-[#5CE1E6] hover:underline"
              >
                hello@akvioratechnologies.com
              </a>
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between flex-wrap gap-3 text-sm text-[#8EA6B4]">
          <span>© 2026 Akviora Technologies. All rights reserved.</span>
          <span>
            Privacy Policy · Terms of Service · Cookie Policy · WCAG 2.1 AA
            Compliant
          </span>
        </div>
      </div>
    </footer>
  );
};
