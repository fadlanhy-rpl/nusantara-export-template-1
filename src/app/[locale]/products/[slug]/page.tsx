import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LocaleCode } from '@/types/export-config';
import { LOCALES, isValidLocale, isRtl } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';
import { productsData } from '@/data/products';
import { siteConfig } from '@/config/site-config';
import { ContainerPriceSimulator } from '@/components/calculator/ContainerPriceSimulator';
import { LabSpecTable } from '@/components/product/LabSpecTable';
import { ShapeSelector } from '@/components/product/ShapeSelector';
import { ShieldCheck, Check, ArrowRight, ArrowLeft, Download, Award, Flame, Box } from 'lucide-react';

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of LOCALES) {
    for (const prod of productsData) {
      params.push({ locale, slug: prod.slug });
    }
  }
  return params;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const product = productsData.find((p) => p.slug === slug);
  if (!product) {
    notFound();
  }

  const dict = getDictionary(locale as LocaleCode);
  const rtl = isRtl(locale);
  const ArrowIcon = rtl ? ArrowLeft : ArrowRight;

  // JSON-LD Structured Data for Global B2B SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name.en,
    image: product.galleryImages,
    description: product.shortSummary.en,
    sku: product.id,
    mpn: product.hsCode,
    brand: {
      '@type': 'Brand',
      name: siteConfig.company.brandName,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: product.pricing.currency,
      lowPrice: product.pricing.fobPriceMinPerMT,
      highPrice: product.pricing.fobPriceMaxPerMT,
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      eligibleQuantity: {
        '@type': 'QuantitativeValue',
        value: 18,
        unitCode: 'TNE',
      },
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Harmonized System Code (HS Code)',
        value: product.hsCode,
      },
      ...product.labSpecifications.map((s) => ({
        '@type': 'PropertyValue',
        name: s.parameter.en,
        value: s.value,
      })),
    ],
  };

  return (
    <div className="w-full pb-20">
      {/* JSON-LD Script Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Top Breadcrumb & Compliance Badge Bar */}
      <section className="bg-white border-b border-[#E2E0D8] py-4">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="font-mono text-xs text-[#525866] flex items-center gap-1.5 flex-wrap">
            <Link href={`/${locale}`} className="hover:text-[#D96B27]">
              {locale === 'ar' ? 'الرئيسية' : locale === 'zh' ? '首页' : locale === 'id' ? 'BERANDA' : 'HOME'}
            </Link>
            <span>/</span>
            <Link href={`/${locale}#commodities`} className="hover:text-[#D96B27]">
              {dict.nav.commodities.toUpperCase()}
            </Link>
            <span>/</span>
            <span className="text-[#111317] font-semibold uppercase">{product.slug}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap font-mono text-[11px]">
            <span className="px-2 py-0.5 bg-[#111317] text-white rounded">
              HS CODE: {product.hsCode}
            </span>
            <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#15803D] font-bold rounded border border-[#15803D]/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              SGS & MSDS CERTIFIED
            </span>
            <span className="px-2 py-0.5 bg-[#FAF9F5] text-[#525866] rounded border border-[#E2E0D8]">
              NON-DG SAFE CARGO (SP 925)
            </span>
          </div>
        </div>
      </section>

      {/* 2. Upper 12-Column Split: Visuals & Shape Selector (6 Cols) vs Container Simulator (6 Cols) */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Main Visual Display */}
            <div className="bg-white border border-[#E2E0D8] rounded-md overflow-hidden">
              <div className="relative h-80 sm:h-96 w-full bg-[#111317]">
                <img
                  src={product.heroImage}
                  alt={product.name[locale]}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#111317]/90 backdrop-blur-sm border border-[#2A2E39] text-white font-mono text-xs px-3 py-1.5 rounded">
                  {locale === 'ar' ? 'بلد المنشأ: جاوة الشرقية، إندونيسيا' : locale === 'zh' ? '产地: 印尼东爪哇' : locale === 'id' ? 'ASAL: JAWA TIMUR, INDONESIA' : 'ORIGIN: EAST JAVA, INDONESIA'}
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-[#111317]/90 backdrop-blur-sm border border-[#2A2E39] text-white p-3 rounded font-mono text-xs flex items-center justify-between">
                  <span className="text-[#DCFCE7]">
                    {locale === 'ar' ? 'مقاسات وغربلة معتمدة' : locale === 'zh' ? '标准精细筛分与规格切割' : locale === 'id' ? 'Ukuran Ayakan & Potongan Terkalibrasi' : 'Calibrated Screen Size & Slicing'}
                  </span>
                  <span className="text-[#D96B27] font-bold">
                    {locale === 'ar' ? 'جودة معتمدة (درجة أولى)' : locale === 'zh' ? '特级 A+ 质检认证' : locale === 'id' ? 'Tersertifikasi Grade A+' : 'Grade A+ Certified'}
                  </span>
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="p-3 bg-[#FAF9F5] border-t border-[#E2E0D8] grid grid-cols-3 gap-2">
                {product.galleryImages.map((imgUrl, i) => (
                  <div key={i} className="h-20 bg-[#111317] rounded overflow-hidden border border-[#E2E0D8]">
                    <img src={imgUrl} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Shape & Sizing Specs Selector */}
            <ShapeSelector product={product} locale={locale as LocaleCode} dict={dict} />
          </div>

          {/* Right Column (6 Cols) - Interactive Container Load & Hybrid Pricing Calculator */}
          <div className="lg:col-span-6">
            <ContainerPriceSimulator
              locale={locale as LocaleCode}
              dict={dict}
              selectedCommodityIndex={
                product.category === 'CHARCOAL' ? 0 : product.category === 'COFFEE' ? 2 : 3
              }
            />
          </div>
        </div>

        {/* 3. Lower Section: Laboratory COA ASTM Spec Table */}
        <div className="pt-12">
          <LabSpecTable product={product} locale={locale as LocaleCode} dict={dict} />
        </div>
      </div>
    </div>
  );
}
