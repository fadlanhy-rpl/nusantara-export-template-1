'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { LocaleCode } from '@/types/export-config';
import { getDictionary } from '@/lib/dictionary';
import { productsData } from '@/data/products';
import { usePitch } from '@/context/PitchContext';
import { GradeComparisonMatrix } from '@/components/product/GradeComparisonMatrix';
import { isRtl } from '@/lib/i18n';
import { ArrowRight, ArrowLeft, Search, Filter, SlidersHorizontal, CheckSquare, Square, Download } from 'lucide-react';

export default function ProductsCatalogPage() {
  const params = useParams();
  const locale = (params?.locale as LocaleCode) || 'en';
  const dict = getDictionary(locale);
  const rtl = isRtl(locale);
  const ArrowIcon = rtl ? ArrowLeft : ArrowRight;

  const { openRfq } = usePitch();

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchHsCode, setSearchHsCode] = useState<string>('');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  const filteredProducts = productsData.filter((prod) => {
    const matchesCat = selectedCategory === 'ALL' || prod.category === selectedCategory;
    const matchesHs = !searchHsCode || prod.hsCode.includes(searchHsCode) || prod.slug.includes(searchHsCode.toLowerCase());
    return matchesCat && matchesHs;
  });

  return (
    <div className="w-full pb-20">
      {/* 1. Header & Breadcrumb Banner */}
      <section className="w-full bg-[#111317] text-white border-b border-[#2A2E39] py-10 sm:py-14">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="font-mono text-xs text-[#9CA3AF] mb-2 flex items-center gap-1.5">
                <Link href={`/${locale}`} className="hover:text-white transition-colors">
                  {locale === 'ar' ? 'الرئيسية' : locale === 'zh' ? '首页' : locale === 'id' ? 'BERANDA' : 'HOME'}
                </Link>
                <span>/</span>
                <span className="text-[#D96B27]">{dict.nav.commodities.toUpperCase()}</span>
                <span>/</span>
                <span>{locale === 'ar' ? 'جميع المنتجات ورموز HS' : locale === 'zh' ? '所有等级与海关编码' : locale === 'id' ? 'SEMUA PRODUK & KODE HS' : 'ALL GRADES & HS CODES'}</span>
              </div>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#F3F4F6] tracking-tight">
                {dict.catalog.title}
              </h1>
            </div>

            <button
              onClick={() => openRfq()}
              className="px-4 py-2.5 bg-[#1A1D24] hover:bg-[#222731] border border-[#2A2E39] text-[#DCFCE7] font-mono text-xs rounded transition-colors whitespace-nowrap self-stretch md:self-auto text-center"
            >
              {dict.nav.requestQuote} -&gt;
            </button>
          </div>
        </div>
      </section>

      {/* 2. Main Split Content (12 Cols) */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar Filter (3 Cols) */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-[#E2E0D8] rounded-md p-5 space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E0D8]">
                <span className="font-mono text-xs font-bold uppercase text-[#111317] flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#D96B27]" />
                  {locale === 'ar' ? 'تصفية الدليل' : locale === 'zh' ? '筛选目录' : locale === 'id' ? 'Filter Katalog' : 'Filter Directory'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchHsCode('');
                  }}
                  className="font-mono text-[11px] text-[#64748B] hover:text-[#D96B27]"
                >
                  {locale === 'ar' ? 'إعادة ضبط' : locale === 'zh' ? '重置' : locale === 'id' ? 'Reset' : 'Reset'}
                </button>
              </div>

              {/* Search HS Code */}
              <div>
                <label className="block font-mono text-xs font-semibold text-[#525866] uppercase mb-2">
                  {dict.catalog.searchHsCode}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchHsCode}
                    onChange={(e) => setSearchHsCode(e.target.value)}
                    placeholder="e.g. 4402.90 or 0901"
                    className="w-full h-9 pl-3 pr-8 bg-[#FAF9F5] border border-[#E2E0D8] rounded font-mono text-xs focus:ring-1 focus:ring-[#D96B27] focus:outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute right-2.5 top-3" />
                </div>
              </div>

              {/* Commodity Categories */}
              <div>
                <label className="block font-mono text-xs font-semibold text-[#525866] uppercase mb-2.5">
                  {dict.catalog.filterCategory}
                </label>
                <div className="space-y-2 font-mono text-xs">
                  {[
                    { id: 'ALL', label: dict.catalog.filterAll, count: productsData.length },
                    { id: 'CHARCOAL', label: dict.catalog.filterCharcoal, count: 2 },
                    { id: 'COFFEE', label: dict.catalog.filterCoffee, count: 1 },
                    { id: 'SPICES', label: dict.catalog.filterSpices, count: 1 },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between p-2 rounded text-start transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-[#111317] text-white font-bold'
                          : 'bg-[#FAF9F5] text-[#525866] hover:bg-[#F3F1EA]'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-black/10 rounded">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Container Stuffing Specs */}
              <div className="pt-2 border-t border-[#E2E0D8] text-[11px] font-mono text-[#64748B] space-y-1">
                <span className="block font-bold uppercase text-[#111317]">
                  {locale === 'ar' ? 'معايير الشحن:' : locale === 'zh' ? '标准装柜规格:' : locale === 'id' ? 'Standar Muat:' : 'Standard Stuffing:'}
                </span>
                <span>● 20ft Dry FCL = 18 MT</span>
                <span>● 40ft HC FCL = 26 MT</span>
              </div>
            </div>
          </aside>

          {/* Right Main Content (9 Cols) */}
          <main className="lg:col-span-9 space-y-8">
            {/* View Switcher & Result Count */}
            <div className="flex items-center justify-between p-3.5 bg-white border border-[#E2E0D8] rounded-md font-mono text-xs">
              <span className="text-[#525866]">
                Showing <strong className="text-[#111317]">{filteredProducts.length}</strong> Export-Grade Commodities
              </span>

              <div className="flex items-center gap-1 bg-[#FAF9F5] p-1 border border-[#E2E0D8] rounded">
                <button
                  type="button"
                  onClick={() => setViewMode('GRID')}
                  className={`px-3 py-1 rounded transition-colors ${
                    viewMode === 'GRID' ? 'bg-[#111317] text-white font-bold' : 'text-[#64748B]'
                  }`}
                >
                  {dict.catalog.gridCatalogView}
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('TABLE')}
                  className={`px-3 py-1 rounded transition-colors ${
                    viewMode === 'TABLE' ? 'bg-[#111317] text-white font-bold' : 'text-[#64748B]'
                  }`}
                >
                  {dict.catalog.masterSpecTable}
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {viewMode === 'GRID' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white border border-[#E2E0D8] rounded-md overflow-hidden flex flex-col justify-between hover:border-[#D96B27] transition-all group"
                  >
                    <div>
                      {/* Top Bar inside card */}
                      <div className="p-3 bg-[#FAF9F5] border-b border-[#E2E0D8] flex items-center justify-between font-mono text-xs">
                        <span className="text-[#111317] font-semibold">
                          HS CODE: {prod.hsCode}
                        </span>
                        <span className="text-[#15803D] font-bold text-[10px] bg-[#DCFCE7] px-2 py-0.5 rounded">
                          {prod.readyCapacityMonth}
                        </span>
                      </div>

                      {/* Image Frame */}
                      <div className="relative h-48 w-full bg-[#111317] overflow-hidden">
                        <img
                          src={prod.heroImage}
                          alt={prod.name[locale]}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-2 left-2 bg-[#111317]/90 text-white font-mono text-[10px] px-2 py-0.5 rounded border border-[#2A2E39]">
                          {prod.variantsOrGrades[0]?.dimensionsOrSpec}
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <h2 className="font-heading font-bold text-base text-[#111317] group-hover:text-[#D96B27] transition-colors">
                          {prod.name[locale]}
                        </h2>

                        {/* 4-Cell Monospace Lab Grid */}
                        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                          {prod.labSpecifications.slice(0, 4).map((spec, sIdx) => (
                            <div key={sIdx} className="bg-[#FAF9F5] p-2 rounded border border-[#E2E0D8]/60">
                              <span className="text-[10px] text-[#64748B] block truncate">
                                {spec.parameter[locale]}
                              </span>
                              <span className="font-bold text-[#111317] block mt-0.5 truncate">
                                {spec.value}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="text-[11px] font-mono text-[#64748B] pt-1">
                          {locale === 'ar' ? 'كرتون ماستر:' : locale === 'zh' ? '外箱规格:' : locale === 'id' ? 'Kardus Master:' : 'Master Box:'} {prod.packaging.masterBoxNetWeightKg} kg • MOQ: {prod.packaging.moqDescription[locale]}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Pricing & Action Bar */}
                    <div className="p-4 bg-[#F9F8F5] border-t border-[#E2E0D8] space-y-2.5">
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="text-[#64748B]">{dict.commoditiesSection.fobFrom} Surabaya:</span>
                        <span className="font-bold text-[#111317]">
                          ${prod.pricing.fobPriceMinPerMT.toLocaleString()} – ${prod.pricing.fobPriceMaxPerMT.toLocaleString()} {dict.commoditiesSection.perMt}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/${locale}/products/${prod.slug}`}
                          className="flex-1 py-2 px-3 bg-[#D96B27] hover:bg-[#B8561B] text-white font-mono text-xs font-bold rounded text-center transition-colors flex items-center justify-center gap-1.5"
                        >
                          <span>{locale === 'ar' ? 'محاكاة حمولة الحاوية ->' : locale === 'zh' ? '测算集装箱装载 ->' : locale === 'id' ? 'Simulasikan Kontainer ->' : 'Simulate Container ->'}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Master Spec Comparison Table View */
              <GradeComparisonMatrix locale={locale} dict={dict} />
            )}

            {/* Bottom Grade Comparison Matrix (Always visible under grid) */}
            {viewMode === 'GRID' && (
              <div className="pt-6">
                <GradeComparisonMatrix locale={locale} dict={dict} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
