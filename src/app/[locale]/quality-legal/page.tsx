'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { LocaleCode } from '@/types/export-config';
import { getDictionary } from '@/lib/dictionary';
import { certificatesData } from '@/data/certificates';
import { WatermarkedCertCard } from '@/components/legal/WatermarkedCertCard';
import { usePitch } from '@/context/PitchContext';
import { isRtl } from '@/lib/i18n';
import { ShieldCheck, Video, MapPin, CheckCircle2, ArrowRight, ArrowLeft, Award, FileSearch } from 'lucide-react';

export default function QualityLegalPage() {
  const params = useParams();
  const locale = (params?.locale as LocaleCode) || 'en';
  const dict = getDictionary(locale);
  const rtl = isRtl(locale);
  const ArrowIcon = rtl ? ArrowLeft : ArrowRight;

  const { clientCompanyName, targetWhatsAppNumber, openRfq } = usePitch();

  const qcStages = dict.processSection.stages.map((st, idx) => ({
    num: `0${idx + 1}`,
    title: st.title,
    desc: st.desc,
    metric: st.metric,
  }));

  return (
    <div className="w-full pb-20">
      {/* 1. Factory Identity & Coordinates Banner */}
      <section className="w-full bg-[#111317] text-white border-b border-[#2A2E39] py-12 sm:py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <span className="font-mono text-xs font-semibold text-[#15803D] bg-[#142319] px-3 py-1 border border-[#15803D]/40 rounded inline-block uppercase tracking-wider">
                ● Registered Exporter Legal Transparency
              </span>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#F3F4F6] tracking-tight">
                {dict.quality.title}
              </h1>
              <p className="font-mono text-xs text-[#DCFCE7]">
                Entity: {clientCompanyName}
              </p>
            </div>

            {/* Coordinates Monospace Box */}
            <div className="p-4 bg-[#1A1D24] border border-[#2A2E39] rounded font-mono text-xs space-y-1.5 max-w-md">
              <div className="flex items-center gap-2 text-[#D96B27]">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="font-bold">VERIFIED GEO-COORDINATES</span>
              </div>
              <p className="text-[#9CA3AF] leading-relaxed">
                {dict.quality.coordinates}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 5-Stage Batch Quality Control Pipeline */}
      <section className="py-14 sm:py-18 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 pb-4 border-b border-[#E2E0D8]">
          <span className="font-mono text-xs font-semibold text-[#D96B27] uppercase tracking-wider block">
            Quality Assurance Protocol
          </span>
          <h2 className="font-heading font-bold text-2xl text-[#111317] tracking-tight mt-1">
            {dict.quality.pipelineTitle}
          </h2>
          <p className="font-mono text-xs text-[#525866] mt-1">
            {dict.quality.pipelineSub}
          </p>
        </div>

        <div className="space-y-4">
          {qcStages.map((st) => (
            <div
              key={st.num}
              className="bg-white border border-[#E2E0D8] rounded-md p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#D96B27] transition-colors"
            >
              <div className="flex items-start gap-4">
                <span className="h-10 w-10 shrink-0 bg-[#111317] text-[#D96B27] font-mono font-bold text-sm rounded flex items-center justify-center">
                  {st.num}
                </span>
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-base text-[#111317]">
                    {st.title}
                  </h3>
                  <p className="font-mono text-xs text-[#525866] leading-relaxed max-w-3xl">
                    {st.desc}
                  </p>
                </div>
              </div>

              <div className="self-stretch md:self-auto shrink-0 bg-[#FAF9F5] border border-[#E2E0D8] p-3 rounded font-mono text-xs text-[#15803D] font-bold text-end">
                {st.metric}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Verifiable Certificate & Legal Vault (Watermarked Anti-Theft Gallery) */}
      <section className="py-14 sm:py-18 bg-white border-y border-[#E2E0D8]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 pb-4 border-b border-[#E2E0D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-semibold text-[#15803D] uppercase tracking-wider block">
                Statutory Export Licenses
              </span>
              <h2 className="font-heading font-bold text-2xl text-[#111317] tracking-tight mt-1">
                {dict.quality.vaultTitle}
              </h2>
              <p className="font-mono text-xs text-[#525866] mt-1">
                {dict.quality.vaultSub}
              </p>
            </div>

            <div className="font-mono text-xs text-[#64748B] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              <span>Anti-Theft Dynamic Security Watermark Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </section>

      {/* 4. Live Factory Video Walk-Through Banner */}
      <section className="py-14 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A1D24] border-2 border-[#D96B27] rounded-md p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-[#D96B27] font-mono text-xs font-bold uppercase">
              <Video className="w-4 h-4 fill-current" />
              <span>Live Video Inspection Guarantee</span>
            </div>
            <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white">
              {dict.quality.videoBookTitle}
            </h3>
            <p className="font-mono text-xs text-[#9CA3AF] leading-relaxed">
              {dict.quality.videoBookDesc}
            </p>
          </div>

          <div className="w-full lg:w-auto">
            <button
              onClick={() => {
                const url = `https://wa.me/${targetWhatsAppNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello Factory Director, I want to schedule a 15-minute live video warehouse inspection for container orders.`
                )}`;
                window.open(url, '_blank');
              }}
              className="w-full sm:w-auto px-8 py-4 bg-[#D96B27] hover:bg-[#B8561B] text-white font-mono text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-xl"
            >
              <span>{dict.quality.videoBookCta}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
