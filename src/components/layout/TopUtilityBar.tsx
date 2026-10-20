'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LocaleCode } from '@/types/export-config';
import { LOCALES, LOCALE_LABELS, isRtl } from '@/lib/i18n';
import { Messages } from '@/lib/dictionary';
import { usePitch } from '@/context/PitchContext';
import { siteConfig } from '@/config/site-config';

interface TopUtilityBarProps {
  locale: LocaleCode;
  dict: Messages;
}

export function TopUtilityBar({ locale, dict }: TopUtilityBarProps) {
  const pathname = usePathname();
  const { isPitchActive, setIsPitchActive } = usePitch();
  const rtl = isRtl(locale);

  // Switch locale in current URL
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
    <header className="w-full bg-[#0B0C0E] text-xs text-[#9CA3AF] hairline-b-dark z-40 select-none">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
        {/* Left: Verified Exporter Status */}
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#15803D] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#15803D]"></span>
          </span>
          <span className="font-mono text-[11px] text-[#DCFCE7] font-medium tracking-wider uppercase">
            {dict.topbar.verifiedExporter}
          </span>
          <span className="text-[#2A2E39] hidden sm:inline">|</span>
          <span className="font-mono text-[11px] text-[#9CA3AF] hidden sm:inline">
            {siteConfig.company.nibNumber}
          </span>
          <span className="text-[#2A2E39] hidden md:inline">|</span>
          <span className="font-mono text-[11px] text-[#9CA3AF] hidden lg:inline">
            {dict.topbar.ports}
          </span>
        </div>

        {/* Right: Currency & Locale Switcher */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-[#9CA3AF]">
            <span className="px-1.5 py-0.5 bg-[#1A1D24] text-[#E2E0D8] rounded-sm hairline-dark">
              {dict.topbar.incoterms}
            </span>
            <span className="text-[#D96B27] font-semibold">USD ($)</span>
          </div>

          <div className="h-3 w-[1px] bg-[#2A2E39] hidden md:block" />

          {/* 4-Language Switcher */}
          <div className="flex items-center gap-1 font-mono text-[11px]">
            {LOCALES.map((l) => {
              const active = l === locale;
              return (
                <Link
                  key={l}
                  href={getLocaleUrl(l)}
                  className={`px-2 py-0.5 rounded-sm transition-colors ${
                    active
                      ? 'bg-[#D96B27] text-white font-bold'
                      : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1A1D24]'
                  }`}
                  title={LOCALE_LABELS[l].nativeName}
                >
                  <span className="hidden sm:inline mr-1">{LOCALE_LABELS[l].flag}</span>
                  <span>{l.toUpperCase()}</span>
                </Link>
              );
            })}
          </div>

          {/* Secret Pitch Mode Indicator */}
          {isPitchActive && (
            <button
              onClick={() => setIsPitchActive(!isPitchActive)}
              className="bg-[#D96B27]/20 border border-[#D96B27] text-[#D96B27] px-1.5 py-0.5 rounded text-[10px] font-mono font-bold animate-pulse"
              title="Pitch Mode Active"
            >
              PITCH MODE
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
