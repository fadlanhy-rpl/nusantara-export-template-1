'use client';

import React, { useState } from 'react';
import { LocaleCode } from '@/types/export-config';
import { Messages } from '@/lib/dictionary';
import { certificatesData } from '@/data/certificates';
import { WatermarkedCertCard } from '@/components/legal/WatermarkedCertCard';
import { ShieldCheck, Truck, Warehouse, Anchor, Lock, FileCheck2 } from 'lucide-react';

interface TrustEvidenceSectionProps {
  locale: LocaleCode;
  dict: Messages;
}

export function TrustEvidenceSection({ locale, dict }: TrustEvidenceSectionProps) {
  const [activeTab, setActiveTab] = useState<'gallery' | 'certs'>('gallery');

  const galleryItems = [
    {
      title: dict.trustEvidence.g1Title,
      desc: dict.trustEvidence.g1Desc,
      tag: 'BUFFER FACILITY',
      icon: Warehouse,
      img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: dict.trustEvidence.g2Title,
      desc: dict.trustEvidence.g2Desc,
      tag: 'HUMIDITY CONTROL',
      icon: Truck,
      img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: dict.trustEvidence.g3Title,
      desc: dict.trustEvidence.g3Desc,
      tag: 'PORT OF LOADING',
      icon: Anchor,
      img: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: dict.trustEvidence.g4Title,
      desc: dict.trustEvidence.g4Desc,
      tag: 'SEAL: ID-SUB-849201',
      icon: Lock,
      img: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#0B0F17] border-t border-b border-[#222731] relative z-10" id="trust">
      <div className="wrap">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8742A]/10 border border-[#E8742A]/30 text-[#E8742A] text-xs font-mono mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>{dict.trustEvidence.label}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-white leading-tight">
            {dict.trustEvidence.title}
          </h2>
          <p className="mt-4 text-[#8E8E93] text-base sm:text-lg leading-relaxed">
            {dict.trustEvidence.subtitle}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-3 mb-10 border-b border-[#222731] pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-white text-[#0B0B0C] shadow-md'
                : 'bg-[#14171E] text-[#8E8E93] hover:text-white border border-[#222731]'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>{dict.trustEvidence.galleryTab}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('certs')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'certs'
                ? 'bg-white text-[#0B0B0C] shadow-md'
                : 'bg-[#14171E] text-[#8E8E93] hover:text-white border border-[#222731]'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{dict.trustEvidence.certsTab}</span>
          </button>
        </div>

        {/* Tab 1: Physical Stuffing & Facility Gallery */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryItems.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="group rounded-2xl overflow-hidden border border-[#222731] bg-[#14171E] flex flex-col justify-between hover:border-[#E8742A]/60 transition-all shadow-lg"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-black">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-110"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/90 flex items-center gap-1.5">
                      <IconComp className="w-3 h-3 text-[#E8742A]" />
                      <span>{item.tag}</span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                    <h3 className="text-base font-semibold text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#8E8E93] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Watermarked Laboratory & Legal Certificates */}
        {activeTab === 'certs' && (
          <div className="space-y-4">
            <div className="p-3 bg-[#14171E] rounded-xl border border-[#222731] text-xs text-[#8E8E93] font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E8742A] shrink-0" />
              <span>{dict.trustEvidence.verifyNotice}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
