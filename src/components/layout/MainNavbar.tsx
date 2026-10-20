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
    <header className={`nav ${hideNav ? 'hide' : ''}`} id="nav">
      {/* Brand with 45deg ember diamond mark */}
      <Link href={`/${locale}`} className="brand" aria-label={`${clientBrandName}, back to top`}>
        <span className="mark" aria-hidden="true" />
        <span>{clientBrandName}</span>
      </Link>

      {/* Center Nav Links */}
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
        <a href="#contact" data-scroll>
          {dict.nav.contact}
        </a>
      </nav>

      {/* Right Actions: Language Switcher & Request Quote */}
      <div className="flex items-center gap-2">
        {/* Language selector toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangOpen(!langOpen)}
            className="p-2 text-[#8E8E93] hover:text-[#F5F5F4] transition-colors rounded-lg flex items-center gap-1 font-mono text-xs"
            aria-label="Change language"
          >
            <Globe className="w-4 h-4" />
            <span className="uppercase">{locale}</span>
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

        {/* Primary CTA Button */}
        <button
          className="btn btn-light btn-sm"
          type="button"
          onClick={() => openRfq()}
        >
          {dict.nav.requestQuote}
        </button>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[#8E8E93] hover:text-white"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="absolute top-[68px] inset-x-0 bg-[#141416]/95 backdrop-blur-md border border-[#2A2E39] rounded-2xl p-4 flex flex-col gap-2 shadow-2xl md:hidden">
          <a
            href="#commodities"
            data-scroll
            onClick={() => setMobileOpen(false)}
            className="p-2.5 text-sm text-[#F5F5F4] hover:bg-[#1B1B1E] rounded-lg"
          >
            {dict.nav.commodities}
          </a>
          <a
            href="#planner"
            data-scroll
            onClick={() => setMobileOpen(false)}
            className="p-2.5 text-sm text-[#F5F5F4] hover:bg-[#1B1B1E] rounded-lg"
          >
            {dict.nav.calculator}
          </a>
          <a
            href="#process"
            data-scroll
            onClick={() => setMobileOpen(false)}
            className="p-2.5 text-sm text-[#F5F5F4] hover:bg-[#1B1B1E] rounded-lg"
          >
            {dict.nav.qualityLegal}
          </a>
          <a
            href="#contact"
            data-scroll
            onClick={() => setMobileOpen(false)}
            className="p-2.5 text-sm text-[#F5F5F4] hover:bg-[#1B1B1E] rounded-lg"
          >
            {dict.nav.contact}
          </a>
          <div className="pt-2 border-t border-[#2A2E39]">
            <button
              onClick={() => {
                setMobileOpen(false);
                openRfq();
              }}
              className="w-full btn btn-light btn-sm"
            >
              {dict.nav.requestQuote}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
