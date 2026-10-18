'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { PageRoute } from '../lib/types';
import { AkvioraLogoIcon } from './AkvioraLogo';

interface HeaderProps {
  activePage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  onOpenAssistant: () => void;
}

const NAV_ITEMS: { id: PageRoute; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'ai', label: 'AI' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'faq', label: 'FAQ' },
];

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  onOpenAssistant,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  const handleNavClick = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-gradient-to-b from-[#060B14]/80 to-transparent border-b-0">
      <motion.div
        style={{ scaleX }}
        className="h-[2px] w-full origin-left bg-gradient-to-r from-[#5CE1E6] via-[#7A86FF] to-[#5CE1E6]"
      />

      <div className="flex items-center justify-between gap-4 px-4 sm:px-8 lg:px-12 py-3.5 max-w-[1440px] mx-auto border-b-0">
        {/* Zone 1: Brand Icon + Wordmark */}
        <a
          href="/"
          aria-label="Akviora Home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="inline-flex items-center gap-2 font-display font-bold text-[20px] sm:text-[21px] leading-none tracking-tight text-[#EAF4F8] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
        >
          <AkvioraLogoIcon className="w-7 h-7 sm:w-[30px] sm:h-[30px] -translate-y-[2px] shrink-0" />
          <span className="leading-none">Akviora</span>
        </a>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-4 lg:gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative text-sm lg:text-[15px] transition-opacity whitespace-nowrap shrink-0 cursor-pointer pb-1 ${
                  isActive
                    ? 'text-[#EAF4F8] opacity-100 font-medium'
                    : 'text-[#EAF4F8] opacity-75 hover:opacity-100'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="headerActiveNavUnderline"
                    transition={{
                      type: 'spring',
                      stiffness: 360,
                      damping: 30,
                    }}
                    className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-[#5CE1E6] shadow-[0_0_8px_rgba(92,225,230,0.65)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenAssistant}
            className="hidden lg:inline-flex items-center gap-2 text-sm text-[#5CE1E6] hover:text-[#EAF4F8] border border-[#5CE1E6]/35 hover:border-[#5CE1E6] bg-[#5CE1E6]/10 px-4 py-2 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Ask AI Assistant
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('contact')}
            className="bg-[#EAF4F8] text-[#06101a] hover:bg-[#5CE1E6] text-xs sm:text-[15px] font-medium px-3.5 sm:px-4.5 py-2 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Start a Project
          </button>

          <button
            type="button"
            aria-label={
              mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg text-[#EAF4F8] hover:bg-white/10 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#060B14]/95 backdrop-blur-xl border-b border-[rgba(255,255,255,0.11)] px-6 py-5"
          >
            <div className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`text-left py-2 text-base font-medium border-b border-white/5 flex items-center justify-between ${
                      isActive ? 'text-[#5CE1E6]' : 'text-[#EAF4F8]/85'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="text-xs text-[#5CE1E6]">Active</span>
                    )}
                  </button>
                );
              })}
              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAssistant();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-full border border-[#5CE1E6]/40 bg-[#5CE1E6]/10 text-[#5CE1E6] text-xs sm:text-sm font-medium text-center"
                >
                  Ask AI Assistant
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('contact')}
                  className="flex-1 py-2.5 px-3 rounded-full bg-[#EAF4F8] text-[#06101a] text-xs sm:text-sm font-medium text-center"
                >
                  Start a Project
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
