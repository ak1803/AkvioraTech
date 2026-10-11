'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown } from 'lucide-react';

export const INPUT_FIELD_CLASSES =
  'w-full bg-gradient-to-b from-[#0B1424]/90 to-[#060B14]/95 border border-white/[0.12] hover:border-[#5CE1E6]/45 focus:border-[#5CE1E6] focus:bg-[#0B1628] rounded-2xl px-4 py-3.5 text-sm text-[#EAF4F8] placeholder-[#8EA6B4]/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.25)] focus:shadow-[inset_0_1px_0_rgba(92,225,230,0.22),0_0_0_4px_rgba(92,225,230,0.12),0_12px_32px_-6px_rgba(92,225,230,0.22)] !outline-none focus:!outline-none focus-visible:!outline-none transition-all duration-300 ease-out';

export const COMPACT_INPUT_FIELD_CLASSES =
  'w-full bg-gradient-to-b from-[#0B1424]/90 to-[#060B14]/95 border border-white/[0.12] hover:border-[#5CE1E6]/45 focus:border-[#5CE1E6] focus:bg-[#0B1628] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#EAF4F8] placeholder-[#8EA6B4]/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_16px_rgba(0,0,0,0.22)] focus:shadow-[inset_0_1px_0_rgba(92,225,230,0.22),0_0_0_3px_rgba(92,225,230,0.12),0_8px_24px_-4px_rgba(92,225,230,0.2)] !outline-none focus:!outline-none focus-visible:!outline-none transition-all duration-300 ease-out';

export const INPUT_LABEL_CLASSES =
  'block text-xs font-medium tracking-wide text-[#8EA6B4] group-hover:text-[#EAF4F8] group-focus-within:text-[#5CE1E6] mb-2 transition-colors duration-200';

export const FocusBeam: React.FC<{ className?: string }> = ({
  className = 'bottom-0 left-4 right-4',
}) => (
  <span
    aria-hidden="true"
    className={`pointer-events-none absolute h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#5CE1E6] to-[#7A86FF] opacity-0 scale-x-50 group-focus-within:opacity-100 group-focus-within:scale-x-100 transition-all duration-300 ease-out ${className}`}
  />
);

export interface AnimatedSelectOption {
  value: string;
  label: string;
}

export interface AnimatedSelectProps {
  id: string;
  label?: string;
  ariaLabel?: string;
  value: string;
  options: AnimatedSelectOption[];
  onChange: (val: string) => void;
  compact?: boolean;
}

export const AnimatedSelect: React.FC<AnimatedSelectProps> = ({
  id,
  label,
  ariaLabel,
  value,
  options,
  onChange,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  const triggerBaseClasses = compact
    ? COMPACT_INPUT_FIELD_CLASSES
    : INPUT_FIELD_CLASSES;

  return (
    <div ref={containerRef} className="relative group">
      {label && (
        <label
          htmlFor={id}
          className={`block text-xs font-medium tracking-wide mb-2 transition-colors duration-200 ${
            isOpen
              ? 'text-[#5CE1E6]'
              : 'text-[#8EA6B4] group-hover:text-[#EAF4F8]'
          }`}
        >
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        aria-label={ariaLabel || label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${triggerBaseClasses} flex items-center justify-between gap-2 text-left cursor-pointer ${
          isOpen
            ? '!border-[#5CE1E6] !bg-[#0B1628] !shadow-[inset_0_1px_0_rgba(92,225,230,0.22),0_0_0_4px_rgba(92,225,230,0.12),0_12px_32px_-6px_rgba(92,225,230,0.22)]'
            : ''
        }`}
      >
        <span className="truncate font-medium text-[#EAF4F8]">
          {selectedOption?.label || value}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          className={`shrink-0 ${
            compact ? 'w-5 h-5 rounded-md' : 'w-6 h-6 rounded-lg'
          } flex items-center justify-center transition-colors ${
            isOpen
              ? 'bg-[#5CE1E6]/20 text-[#5CE1E6]'
              : 'bg-white/[0.04] text-[#8EA6B4] group-hover:text-[#5CE1E6]'
          }`}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>

      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-0 left-3.5 right-3.5 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#5CE1E6] to-[#7A86FF] transition-all duration-300 ease-out ${
          isOpen ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
        }`}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            role="listbox"
            aria-labelledby={label ? id : undefined}
            aria-label={!label ? ariaLabel : undefined}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 26,
              mass: 0.7,
            }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl border border-[#5CE1E6]/35 bg-[#081120]/95 backdrop-blur-xl p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_32px_rgba(92,225,230,0.16)] space-y-1 overflow-hidden"
          >
            {options.map((opt, idx) => {
              const active = opt.value === value;
              return (
                <motion.li
                  key={opt.value}
                  role="option"
                  aria-selected={active}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18, delay: idx * 0.03 }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2.5 ${
                      compact ? 'px-3 py-2 text-xs' : 'px-3.5 py-2.5 text-xs sm:text-sm'
                    } rounded-xl text-left transition-all cursor-pointer !outline-none ${
                      active
                        ? 'bg-gradient-to-r from-[#5CE1E6]/20 to-[#7A86FF]/15 text-[#5CE1E6] font-semibold border border-[#5CE1E6]/30'
                        : 'text-[#b8cdd8] hover:text-[#EAF4F8] hover:bg-white/[0.06] hover:translate-x-0.5'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {active && (
                      <motion.span
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-4 h-4 rounded-full bg-[#5CE1E6]/20 text-[#5CE1E6] flex items-center justify-center shrink-0"
                      >
                        <Check className="w-3 h-3" />
                      </motion.span>
                    )}
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
