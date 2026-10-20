'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LocaleCode } from '@/types/export-config';
import { Messages } from '@/lib/dictionary';
import { usePitch } from '@/context/PitchContext';
import { LOCALES, LOCALE_LABELS, isRtl } from '@/lib/i18n';
import { Globe, Menu, X } from 'lucide-react';

interface MainNavbarProps {
  locale: LocaleCode;
  dict: Messages;
}

export function MainNavbar({ locale, dict }: MainNavbarProps) {
  const { clientBrandName, openRfq } = usePitch();
  const [hideNav, setHideNav] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const rtl = isRtl(locale);

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    let prevY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > prevY + 6 && currentY > 200) {
        setHideNav(true);
      } else if (currentY < prevY - 6 || currentY < 100) {
        setHideNav(false);
      }
      prevY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when mobile menu is open, handle keyboard & resize
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setLangOpen(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getLocaleUrl = (newLocale: LocaleCode) => {
    if (!pathname) return `/${newLocale}`;
    const segments = pathname.split('/');
    if (segments.length > 1 && LOCALES.includes(segments[1] as LocaleCode)) {
      segments[1] = newLocale;
      return segments.join('/');
    }
    return `/${newLocale}${pathname}`;
  };

  return (
    <>
      {/* Mobile Menu Fullscreen Backdrop with Blur */}
      {mobileOpen && (
        <div
          className="nav-mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <header className={`nav ${hideNav ? 'hide' : ''}`} id="nav">
        {/* Brand with 45deg ember diamond mark */}
        <Link href={`/${locale}`} className="brand shrink-0" aria-label={`${clientBrandName}, back to top`}>
          <span className="mark shrink-0" aria-hidden="true" />
          <span className="truncate max-w-[115px] sm:max-w-none">{clientBrandName}</span>
        </Link>

        {/* Center Nav Links (Desktop >= 1024px) */}
        <nav className="nav-links" aria-label="Main">
          <a href="#commodities" data-scroll>
            {dict.nav.commodities}
          </a>
          <a href="#planner" data-scroll>
            {dict.nav.calculator}
          </a>
          <a href="#process" data-scroll>
            {dict.nav.qualityLegal}
          </a>
          <a href="#trust" data-scroll>
            {dict.nav.auditProof}
          </a>
          <a href="#contact" data-scroll>
            {dict.nav.contact}
          </a>
        </nav>

        {/* Right Actions: Language Switcher, Quote CTA, Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language selector toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="p-1.5 sm:p-2 text-[#8E8E93] hover:text-[#F5F5F4] transition-colors rounded-lg flex items-center gap-1 font-mono text-xs"
              aria-label="Change language"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="uppercase text-[11px] sm:text-xs">{locale}</span>
            </button>

            {langOpen && (
              <div className={`absolute top-full mt-2 ${rtl ? 'left-0' : 'right-0'} bg-[#141416] border border-[#2A2E39] rounded-xl shadow-2xl p-1.5 min-w-[130px] z-50 flex flex-col gap-1`}>
                {LOCALES.map((l) => (
                  <Link
                    key={l}
                    href={getLocaleUrl(l)}
                    onClick={() => setLangOpen(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                      l === locale
                        ? 'bg-[#E8742A] text-white font-bold'
                        : 'text-[#8E8E93] hover:text-[#F5F5F4] hover:bg-[#1B1B1E]'
                    }`}
                  >
                    <span>{LOCALE_LABELS[l].nativeName}</span>
                    <span className="opacity-70">{LOCALE_LABELS[l].flag}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Primary CTA Button: Full on desktop (>= 1024px), compact RFQ badge on tablet/mobile (< 1024px) */}
          <button
            className="nav-btn-desktop btn btn-light btn-sm font-semibold"
            type="button"
            onClick={() => openRfq()}
          >
            {dict.nav.requestQuote}
          </button>

          <button
            className="nav-btn-mobile btn btn-light font-semibold"
            type="button"
            onClick={() => openRfq()}
            aria-label={dict.nav.requestQuote}
          >
            <span>{locale === 'id' ? 'RFQ →' : locale === 'ar' ? 'تسعير ←' : locale === 'zh' ? '询价 →' : 'RFQ →'}</span>
          </button>

          {/* Mobile Menu Toggle (< 1024px) */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="nav-toggle-btn"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown Drawer with Rich Blur */}
        {mobileOpen && (
          <div className="nav-mobile-dropdown">
            <a
              href="#commodities"
              data-scroll
              onClick={() => setMobileOpen(false)}
            >
              <span>{dict.nav.commodities}</span>
              <span className="num">01</span>
            </a>
            <a
              href="#planner"
              data-scroll
              onClick={() => setMobileOpen(false)}
            >
              <span>{dict.nav.calculator}</span>
              <span className="num">02</span>
            </a>
            <a
              href="#process"
              data-scroll
              onClick={() => setMobileOpen(false)}
            >
              <span>{dict.nav.qualityLegal}</span>
              <span className="num">03</span>
            </a>
            <a
              href="#trust"
              data-scroll
              onClick={() => setMobileOpen(false)}
            >
              <span>{dict.nav.auditProof}</span>
              <span className="num" style={{ color: 'var(--ember)' }}>04</span>
            </a>
            <a
              href="#contact"
              data-scroll
              onClick={() => setMobileOpen(false)}
            >
              <span>{dict.nav.contact}</span>
              <span className="num">05</span>
            </a>

            <div className="divider" />

            <button
              onClick={() => {
                setMobileOpen(false);
                openRfq();
              }}
              className="w-full btn btn-light btn-sm justify-center font-semibold mt-1"
            >
              {dict.nav.requestQuote}
            </button>
          </div>
        )}
      </header>
    </>
  );
}
