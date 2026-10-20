import React from 'react';
import { notFound } from 'next/navigation';
import { LocaleCode } from '@/types/export-config';
import { LOCALES, isValidLocale, isRtl } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';
import { MainNavbar } from '@/components/layout/MainNavbar';
import { SmartRfqDrawer } from '@/components/rfq/SmartRfqDrawer';
import { LivePitchToolbar } from '@/components/pitch/LivePitchToolbar';
import { SmoothScroll } from '@/components/layout/SmoothScroll';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale as LocaleCode);
  const rtl = isRtl(locale);

  return (
    <SmoothScroll>
      <div
        dir={rtl ? 'rtl' : 'ltr'}
        lang={locale}
        className={`min-h-screen flex flex-col bg-[#0B0B0C] text-[#F5F5F4] antialiased ${
          rtl ? 'font-arabic' : ''
        }`}
      >
        <MainNavbar locale={locale as LocaleCode} dict={dict} />
        <div className="flex-1">{children}</div>
        <SmartRfqDrawer locale={locale as LocaleCode} dict={dict} />
        <LivePitchToolbar />
      </div>
    </SmoothScroll>
  );
}
