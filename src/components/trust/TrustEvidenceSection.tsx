'use client';

import React, { useState } from 'react';
import { LocaleCode } from '@/types/export-config';
import { Messages } from '@/lib/dictionary';
import { certificatesData } from '@/data/certificates';
import { WatermarkedCertCard } from '@/components/legal/WatermarkedCertCard';
import {
  ShieldCheck,
  Truck,
  Warehouse,
  Anchor,
  Lock,
  FileCheck2,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface TrustEvidenceSectionProps {
  locale: LocaleCode;
  dict: Messages;
}

export function TrustEvidenceSection({ locale, dict }: TrustEvidenceSectionProps) {
  const [activeTab, setActiveTab] = useState<'gallery' | 'certs'>('gallery');
  const [selectedIdx, setSelectedIdx] = useState(0);

  const galleryItems = [
    {
      num: '01',
      title: dict.trustEvidence.g1Title,
      desc: dict.trustEvidence.g1Desc,
      tag: 'BUFFER FACILITY',
      loc: 'Gresik Industrial Estate (07°09\'23"S 112°39\'19"E)',
      metrics: '350 MT Capacity • 12 Moisture Bays • Palletized Crates',
      icon: Warehouse,
      img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=85',
      highlights: [
        'Dedicated climate-controlled storage bays',
        'Floor-moisture barrier and ambient humidity sensors',
        'Palletized master carton organization for rapid container loading',
      ],
    },
    {
      num: '02',
      title: dict.trustEvidence.g2Title,
      desc: dict.trustEvidence.g2Desc,
      tag: 'STUFFING & DESICCANTS',
      loc: 'Stuffing Bay #3 • 40ft HC Quality Log',
      metrics: 'Super Dry 2000g Poles • Strict RH < 60% Protocol',
      icon: Truck,
      img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1400&q=85',
      highlights: [
        'Installation of active Super Dry calcium chloride desiccant poles',
        'Continuous container interior humidity & temperature inspection',
        'Reinforced carton stacking to eliminate cargo shifting at sea',
      ],
    },
    {
      num: '03',
      title: dict.trustEvidence.g3Title,
      desc: dict.trustEvidence.g3Desc,
      tag: 'PORT OF LOADING',
      loc: 'Port of Tanjung Perak, Surabaya (IDSUB)',
      metrics: 'Direct 25 km Transport Corridor • Gantry Crane Vessel Staging',
      icon: Anchor,
      img: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1400&q=85',
      highlights: [
        'Direct 25 km toll-road haulage from Gresik factory to terminal',
        'Official Surabaya Customs export clearance prior to vessel gate-in',
        'Real-time vessel loading tracking with forwarder bills of lading',
      ],
    },
    {
      num: '04',
      title: dict.trustEvidence.g4Title,
      desc: dict.trustEvidence.g4Desc,
      tag: 'ISO 17712 BOLT SEAL',
      loc: 'Seal Verification: ID-SUB-849201',
      metrics: 'Tamper-Evident High-Security Bolt • B/L Registered Serial',
      icon: Lock,
      img: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1400&q=85',
      highlights: [
        'Tamper-proof high-security bolt seal meeting ISO 17712 standards',
        'Seal photo timestamped and officially logged on Bill of Lading',
        'Buyer receives photo confirmation before container departs gate',
      ],
    },
  ];

  const currentGallery = galleryItems[selectedIdx];

  return (
    <section
      className="relative z-10 border-t border-b border-[rgba(245,245,244,0.12)] bg-[#0B0B0C] py-24 sm:py-32 scroll-mt-24 sm:scroll-mt-28"
      id="trust"
    >
      <div className="wrap">
        {/* Section Editorial Header - matching exactly with other sections */}
        <div className="sec-head rv mb-12 sm:mb-16">
          <p className="label">{dict.trustEvidence.label}</p>
          <h2>
            {locale === 'id' ? (
              <>
                Fasilitas fisik, <em className="serif">stuffing</em> terverifikasi.
              </>
            ) : locale === 'ar' ? (
              <>
                مرافق مادية، <em className="serif">شحن موثق</em> ومطابق.
              </>
            ) : locale === 'zh' ? (
              <>
                真实生产设施，<em className="serif">装箱与合规</em>全流程验证。
              </>
            ) : (
              <>
                Physical facilities, verified <em className="serif">stuffing</em>.
              </>
            )}
          </h2>
          <p className="lead max-w-2xl mt-4">
            {dict.trustEvidence.subtitle}
          </p>
        </div>

        {/* Global Standard Buttons for Tab Switching */}
        <div className="flex items-center gap-3 mb-10 select-none">
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`btn btn-sm ${
              activeTab === 'gallery' ? 'btn-light' : 'btn-line'
            } cursor-pointer`}
          >
            <Truck className="w-4 h-4 text-[#E8742A]" />
            <span>{dict.trustEvidence.galleryTab}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('certs')}
            className={`btn btn-sm ${
              activeTab === 'certs' ? 'btn-light' : 'btn-line'
            } cursor-pointer`}
          >
            <FileCheck2 className="w-4 h-4 text-[#E8742A]" />
            <span>{dict.trustEvidence.certsTab}</span>
          </button>
        </div>

        {/* Tab 1: Interactive Cinematic Inspection Station */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Main Interactive Inspection Viewfinder (7 cols) */}
            <div className="lg:col-span-7 bg-[#141416] border border-[rgba(245,245,244,0.12)] rounded-2xl overflow-hidden relative shadow-2xl flex flex-col group">
              {/* Image Frame with HUD Overlays */}
              <div className="relative aspect-16/10 sm:aspect-16/9 w-full bg-[#0B0B0C] overflow-hidden select-none">
                <img
                  key={currentGallery.img}
                  src={currentGallery.img}
                  alt={currentGallery.title}
                  className="w-full h-full object-cover filter brightness-90 contrast-110 transition-all duration-700 group-hover:scale-102"
                />

                {/* Subtle Industrial Grid Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(245,245,244,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,244,0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />

                {/* Corner Precision Marks */}
                <div className="absolute top-3 left-3 text-white/30 font-mono text-xs select-none">
                  +
                </div>
                <div className="absolute top-3 right-3 text-white/30 font-mono text-xs select-none">
                  +
                </div>

                {/* Top-Left Live Status Badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#0B0B0C]/85 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#3E8E5C] animate-pulse" />
                  <span className="text-[#E8742A] font-semibold">
                    {currentGallery.tag}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/80">VERIFIED EXPORT ASSET</span>
                </div>

                {/* Top-Right Location Tag */}
                <div className="absolute top-4 right-4 hidden sm:flex px-3 py-1.5 rounded-full bg-[#0B0B0C]/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#8E8E93]">
                  {currentGallery.loc}
                </div>
              </div>

              {/* Bottom Information & Checklist Panel */}
              <div className="p-6 sm:p-8 bg-[#141416] border-t border-[rgba(245,245,244,0.12)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(245,245,244,0.12)] pb-4">
                  <div>
                    <span className="font-mono text-xs text-[#E8742A] font-medium tracking-wide">
                      STAGE {currentGallery.num} OF 04
                    </span>
                    <h3 className="font-sans text-xl sm:text-2xl font-medium text-[#F5F5F4] tracking-tight mt-0.5">
                      {currentGallery.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-[#8E8E93] bg-[#1B1B1E] px-3 py-1.5 rounded-md border border-[rgba(245,245,244,0.12)] self-start sm:self-auto">
                    {currentGallery.metrics}
                  </span>
                </div>

                <p className="text-sm text-[#8E8E93] leading-relaxed">
                  {currentGallery.desc}
                </p>

                {/* Verified Checklist Items */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/90 font-sans">
                  {currentGallery.highlights.map((item, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#3E8E5C] shrink-0 mt-0.5" />
                      <span className="leading-tight text-[#D1D1D6]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Thumbnail Selector Reel (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="px-2 pb-1 text-xs font-mono text-[#8E8E93] uppercase tracking-wider flex items-center justify-between">
                <span>Inspection Stages</span>
                <span>Select to inspect</span>
              </div>

              {galleryItems.map((item, idx) => {
                const isSelected = selectedIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedIdx(idx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-[#1B1B1E] border-[#E8742A] shadow-lg shadow-[#E8742A]/5'
                        : 'bg-[#141416] border-[rgba(245,245,244,0.12)] hover:border-white/25 hover:bg-[#18181B]'
                    }`}
                  >
                    {/* Active Accent Bar */}
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E8742A]" />
                    )}

                    {/* Thumbnail Preview */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black">
                      <img
                        src={item.img}
                        alt={item.title}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isSelected ? 'scale-105 brightness-100' : 'brightness-75'
                        }`}
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[9px] text-white">
                        {item.num}
                      </span>
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#E8742A]">
                          {item.tag}
                        </span>
                      </div>
                      <h4
                        className={`text-sm font-medium truncate ${
                          isSelected ? 'text-white' : 'text-[#D1D1D6]'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#8E8E93] truncate mt-0.5 font-mono">
                        {item.metrics}
                      </p>
                    </div>

                    <ChevronRight
                      className={`w-5 h-5 shrink-0 transition-transform ${
                        isSelected
                          ? 'text-[#E8742A] translate-x-0.5'
                          : 'text-[#8E8E93]/40'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Verified Laboratory & Legal Credentials Vault */}
        {activeTab === 'certs' && (
          <div className="space-y-6">
            <div className="p-4 bg-[#141416] rounded-xl border border-[rgba(245,245,244,0.12)] text-xs text-[#8E8E93] font-mono flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#E8742A] shrink-0" />
                <span>{dict.trustEvidence.verifyNotice}</span>
              </div>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-[#3E8E5C]/10 border border-[#3E8E5C]/20 text-[#3E8E5C] text-[11px] font-mono">
                COMPLIANCE ACTIVE 2026/2027
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {certificatesData.map((cert) => (
                <WatermarkedCertCard
                  key={cert.id}
                  cert={cert}
                  locale={locale}
                  dict={dict}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
