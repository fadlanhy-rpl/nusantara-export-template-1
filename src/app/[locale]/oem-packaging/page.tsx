'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { LocaleCode } from '@/types/export-config';
import { getDictionary } from '@/lib/dictionary';
import { usePitch } from '@/context/PitchContext';
import { isRtl } from '@/lib/i18n';
import { Package, Shield, Download, ArrowRight, ArrowLeft, CheckCircle2, Layers, Check, FileCode } from 'lucide-react';

export default function OemPackagingPage() {
  const params = useParams();
  const locale = (params?.locale as LocaleCode) || 'en';
  const dict = getDictionary(locale);
  const rtl = isRtl(locale);
  const ArrowIcon = rtl ? ArrowLeft : ArrowRight;

  const { openRfq } = usePitch();

  const dielineTemplates = [
    {
      title: '1kg Cube 25mm Inner Box Dieline',
      spec: '150 x 105 x 105 mm • Duplex 310 GSM',
      format: 'PDF / AI / CDR (Vector)',
      size: '2.4 MB',
    },
    {
      title: '2kg Shisha Lounge Pack Dieline',
      spec: '150 x 210 x 105 mm • Heavy Duty Cardstock',
      format: 'PDF / AI (Vector)',
      size: '3.1 MB',
    },
    {
      title: '10kg Master Carton Outer Shipping Mark Guide',
      spec: '320 x 260 x 215 mm • ISO Shipping Marks',
      format: 'PDF Guidelines',
      size: '1.2 MB',
    },
  ];

  return (
    <div className="w-full pb-20">
      {/* 1. Industrial Header */}
      <section className="w-full bg-[#111317] text-white border-b border-[#2A2E39] py-12 sm:py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="font-mono text-xs font-semibold text-[#D96B27] bg-[#1A1D24] px-3 py-1 border border-[#D96B27]/40 rounded inline-block uppercase tracking-wider">
              {dict.oem.badge}
            </span>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#F3F4F6] tracking-tight">
              {dict.oem.title}
            </h1>
            <p className="font-body text-sm sm:text-base text-[#9CA3AF] leading-relaxed">
              {dict.oem.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Interactive 3-Layer Packaging Anatomy Breakdown */}
      <section className="py-14 sm:py-18 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 pb-4 border-b border-[#E2E0D8]">
          <span className="font-mono text-xs font-semibold text-[#D96B27] uppercase tracking-wider block">
            Engineering Precision
          </span>
          <h2 className="font-heading font-bold text-2xl text-[#111317] tracking-tight mt-1">
            3-Stage Hermetic Moisture & Crush-Proof Anatomy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Layer 1 */}
          <div className="bg-white border border-[#E2E0D8] rounded-md p-6 flex flex-col justify-between space-y-4 hover:border-[#D96B27] transition-all">
            <div>
              <div className="h-10 w-10 bg-[#FAF9F5] border border-[#E2E0D8] rounded flex items-center justify-center text-[#D96B27] mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-[#111317]">
                {dict.oem.layer1Title}
              </h3>
              <p className="font-mono text-xs text-[#525866] mt-2 leading-relaxed">
                {dict.oem.layer1Desc}
              </p>
            </div>
            <div className="pt-3 border-t border-[#E2E0D8] font-mono text-[11px] text-[#15803D] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>100% Hermetic Heat Sealing</span>
            </div>
          </div>

          {/* Layer 2 */}
          <div className="bg-white border border-[#E2E0D8] rounded-md p-6 flex flex-col justify-between space-y-4 hover:border-[#D96B27] transition-all">
            <div>
              <div className="h-10 w-10 bg-[#FAF9F5] border border-[#E2E0D8] rounded flex items-center justify-center text-[#D96B27] mb-4">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-[#111317]">
                {dict.oem.layer2Title}
              </h3>
              <p className="font-mono text-xs text-[#525866] mt-2 leading-relaxed">
                {dict.oem.layer2Desc}
              </p>
            </div>
            <div className="pt-3 border-t border-[#E2E0D8] font-mono text-[11px] text-[#D96B27] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Free Cylinder/Plate on 1x 20ft FCL</span>
            </div>
          </div>

          {/* Layer 3 */}
          <div className="bg-white border border-[#E2E0D8] rounded-md p-6 flex flex-col justify-between space-y-4 hover:border-[#D96B27] transition-all">
            <div>
              <div className="h-10 w-10 bg-[#FAF9F5] border border-[#E2E0D8] rounded flex items-center justify-center text-[#D96B27] mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-[#111317]">
                {dict.oem.layer3Title}
              </h3>
              <p className="font-mono text-xs text-[#525866] mt-2 leading-relaxed">
                {dict.oem.layer3Desc}
              </p>
            </div>
            <div className="pt-3 border-t border-[#E2E0D8] font-mono text-[11px] text-[#15803D] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Tested for 26 MT Container Stacking</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Container Stowage & Moisture Protection SOP Section (Dark #111317) */}
      <section className="bg-[#111317] text-white border-y border-[#2A2E39] py-14 sm:py-18">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left (6 Cols) - SOP Steps */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="font-mono text-xs font-semibold text-[#D96B27] uppercase tracking-wider block">
                  Export Sea Freight Standard
                </span>
                <h2 className="font-heading font-bold text-2xl text-white mt-1">
                  {dict.oem.stowageTitle}
                </h2>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 bg-[#1A1D24] border border-[#2A2E39] rounded space-y-1">
                  <span className="text-[#D96B27] font-bold block uppercase">
                    Stage 01: {dict.oem.sop1.split('(')[0]}
                  </span>
                  <p className="text-[#9CA3AF] leading-relaxed">
                    Visual light inspection from inside container with doors closed to verify zero pinhole light leaks, floor wood moisture check (&lt; 15%), and zero contamination.
                  </p>
                </div>

                <div className="p-4 bg-[#1A1D24] border border-[#2A2E39] rounded space-y-1">
                  <span className="text-[#D96B27] font-bold block uppercase">
                    Stage 02: {dict.oem.sop2.split('&')[0]}
                  </span>
                  <p className="text-[#9CA3AF] leading-relaxed">
                    Corrugated kraft cardboard paper fully lined along all interior metal walls to absorb condensation ("container rain") during equatorial crossing.
                  </p>
                </div>

                <div className="p-4 bg-[#1A1D24] border border-[#2A2E39] rounded space-y-1">
                  <span className="text-[#D96B27] font-bold block uppercase">
                    Stage 03: {dict.oem.sop3.split('(')[0]}
                  </span>
                  <p className="text-[#9CA3AF] leading-relaxed">
                    Tight interlocking brick-pattern floor loading allows maximum 26 MT in 40ft HC with uniform weight distribution and zero carton movement at sea.
                  </p>
                </div>

                <div className="p-4 bg-[#1A1D24] border border-[#2A2E39] rounded space-y-1">
                  <span className="text-[#D96B27] font-bold block uppercase">
                    Stage 04: {dict.oem.sop4.split('&')[0]}
                  </span>
                  <p className="text-[#9CA3AF] leading-relaxed">
                    Statutory fumigation treatment certificate plus high-resolution photography of the high-security bottle container seal serial number dispatched to buyer prior to ship sailing.
                  </p>
                </div>
              </div>
            </div>

            {/* Right (6 Cols) - Download Blank Dielines & Upload CTA */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="font-mono text-xs font-semibold text-[#15803D] uppercase tracking-wider block">
                  Design Department Assets
                </span>
                <h3 className="font-heading font-bold text-2xl text-white mt-1">
                  {dict.oem.dielineTitle}
                </h3>
                <p className="font-mono text-xs text-[#9CA3AF] mt-1">
                  {dict.oem.dielineSub}
                </p>
              </div>

              {/* Dieline Templates Table */}
              <div className="space-y-3">
                {dielineTemplates.map((d, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#1A1D24] border border-[#2A2E39] hover:border-[#D96B27] rounded flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-mono font-bold text-xs text-white block">
                        {d.title}
                      </span>
                      <span className="font-mono text-[11px] text-[#9CA3AF] block mt-0.5">
                        {d.spec} • {d.format}
                      </span>
                    </div>

                    <button
                      onClick={() => openRfq({ inquiryType: 'QUOTATION_REQUEST', variantId: `Dieline Download: ${d.title}` })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#14171E] hover:bg-[#D96B27] text-white font-mono text-xs rounded border border-[#2A2E39] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Upload Artwork Box */}
              <div className="p-6 bg-[#221A15] border-s-4 border-[#D96B27] border-y border-e border-[#3A2A20] rounded space-y-3">
                <span className="font-mono text-xs font-bold text-[#D96B27] uppercase block">
                  Already Have Your Registered Box Artwork?
                </span>
                <p className="font-mono text-xs text-[#F3F4F6] leading-relaxed">
                  Submit your PDF or AI files directly via our RFQ Drawer. Our printing technician will evaluate color separation and confirm 100% free plate-making on full container orders.
                </p>
                <button
                  onClick={() => openRfq({ inquiryType: 'QUOTATION_REQUEST', variantId: 'Artwork Free Evaluation' })}
                  className="w-full py-3 bg-[#D96B27] hover:bg-[#B8561B] text-white font-mono text-xs font-bold rounded flex items-center justify-center gap-2"
                >
                  <span>Open RFQ &amp; Attach Packaging Specs -&gt;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
