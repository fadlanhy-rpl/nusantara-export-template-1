'use client';

import React from 'react';
import { usePitch } from '@/context/PitchContext';
import { LocaleCode } from '@/types/export-config';
import { Messages } from '@/lib/dictionary';
import { isRtl } from '@/lib/i18n';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface StickyMobileBarProps {
  locale: LocaleCode;
  dict: Messages;
}

export function StickyMobileBar({ locale, dict }: StickyMobileBarProps) {
  const { openRfq, pricingMode } = usePitch();
  const rtl = isRtl(locale);
  const ArrowIcon = rtl ? ArrowLeft : ArrowRight;

  return (
    <aside aria-label="Mobile quote navigation" className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-[#111317] border-t-2 border-[#D96B27] px-4 py-3 shadow-2xl flex items-center justify-between">
      <div className="flex flex-col">
        <span className="font-mono text-[10px] text-[#9CA3AF] uppercase tracking-wider">
          {dict.calculator.indicativePriceLabel.split(':')[0]}
        </span>
        {pricingMode === 'HIDDEN_QUOTE_ONLY' ? (
          <span className="font-mono font-bold text-sm text-[#F3F4F6]">
            CUSTOM QUOTE
          </span>
        ) : (
          <span className="font-mono font-bold text-base text-[#F3F4F6]" dir="ltr">
            $1,235 – $1,280 <span className="text-xs text-[#9CA3AF] font-normal">/ MT</span>
          </span>
        )}
      </div>

      <button
        onClick={() => openRfq()}
        className="h-11 px-5 bg-[#D96B27] hover:bg-[#B8561B] text-white font-bold text-xs uppercase tracking-wider rounded flex items-center gap-2 shadow-lg"
      >
        <span>Quote</span>
        <ArrowIcon className="w-4 h-4" />
      </button>
    </aside>
  );
}
