'use client';

import React, { useState } from 'react';
import { CertificateDoc } from '@/types/product';
import { LocaleCode } from '@/types/export-config';
import { Messages } from '@/lib/dictionary';
import { usePitch } from '@/context/PitchContext';
import { ShieldCheck, Eye, Lock } from 'lucide-react';

interface WatermarkedCertCardProps {
  cert: CertificateDoc;
  locale: LocaleCode;
  dict: Messages;
}

export function WatermarkedCertCard({
  cert,
  locale,
  dict,
}: WatermarkedCertCardProps) {
  const { clientCompanyName, openRfq } = usePitch();
  const [modalOpen, setModalOpen] = useState(false);

  const watermarkString = `ISSUED TO ${clientCompanyName.toUpperCase()} • OFFICIAL COMPLIANCE • ANTI-FRAUD VERIFIED • `;

  return (
    <>
      <div className="bg-[#141416] border border-[rgba(245,245,244,0.12)] rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-[#E8742A]/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-black/60">
        {/* Document Preview Frame with Anti-Theft Watermark */}
        <div
          onContextMenu={(e) => e.preventDefault()}
          className="relative h-60 sm:h-64 w-full bg-[#0B0B0C] overflow-hidden select-none cursor-pointer"
          onClick={() => setModalOpen(true)}
        >
          {/* Background Image Scan */}
          <img
            src={cert.previewUrl}
            alt={cert.title}
            draggable={false}
            className="w-full h-full object-cover object-top opacity-80 group-hover:scale-105 transition-transform duration-700 filter contrast-125 brightness-90"
          />

          {/* Diagonal Repeating Semi-Transparent Watermark Overlay */}
          <div className="absolute inset-0 cert-watermark-overlay flex items-center justify-center p-4">
            <div className="cert-watermark-text text-white/40 text-center font-mono text-[11px] sm:text-xs uppercase leading-loose select-none pointer-events-none tracking-wider">
              {watermarkString}
              <br />
              {watermarkString}
              <br />
              {watermarkString}
            </div>
          </div>

          {/* Security Status Badge */}
          <div className="absolute top-3 right-3 bg-[#0B0B0C]/90 backdrop-blur-md border border-[rgba(245,245,244,0.12)] text-[#3E8E5C] font-mono text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3E8E5C]" />
            <span>
              {locale === 'ar'
                ? 'محمي بعلامة مائية'
                : locale === 'zh'
                ? '防伪水印保护'
                : locale === 'id'
                ? 'Terverifikasi Resmi'
                : 'Official Verified'}
            </span>
          </div>

          {/* Issuer Tag Top-Left */}
          <div className="absolute top-3 left-3 bg-[#0B0B0C]/85 backdrop-blur-md border border-white/10 text-[#E8742A] font-mono text-[10px] px-2.5 py-1 rounded-md tracking-wider">
            {cert.issuer}
          </div>

          {/* Corner Precision Plus Crosshair */}
          <div className="absolute bottom-3 left-3 text-white/20 font-mono text-xs select-none">
            +
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-xs backdrop-blur-xs">
            <Eye className="w-4 h-4 text-[#E8742A]" />
            <span>{dict.quality.inspectPreview}</span>
          </div>
        </div>

        {/* Card Metadata & Actions */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            {/* Certificate ID & Validity Badge */}
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-[#E8742A] font-medium tracking-wide">
                {cert.refNumber}
              </span>
              <span className="text-[#3E8E5C] font-medium px-2 py-0.5 rounded bg-[#3E8E5C]/10 border border-[#3E8E5C]/20 text-[10px]">
                {cert.issueDate}
              </span>
            </div>

            {/* Document Title matching site's font-sans */}
            <h3 className="font-sans font-medium text-base text-[#F5F5F4] group-hover:text-[#E8742A] transition-colors leading-snug tracking-tight">
              {cert.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-[#8E8E93] mt-2 leading-relaxed line-clamp-3">
              {cert.description[locale]}
            </p>
          </div>

          {/* Action Buttons with Fitts's Law Full-Width Stack (Eliminates awkward multi-line wrapping) */}
          <div className="pt-3 border-t border-[rgba(245,245,244,0.12)] space-y-2">
            {/* Primary Action Button (Conversion / High Contrast) */}
            <button
              type="button"
              onClick={() =>
                openRfq({
                  inquiryType: 'QUOTATION_REQUEST',
                  variantId: `Unredacted COA Request: ${cert.refNumber}`,
                })
              }
              className="w-full h-10 px-4 rounded-[10px] bg-[#E8742A] hover:bg-[#C95E1B] text-white text-xs font-medium tracking-wide flex items-center justify-between transition-all duration-200 cursor-pointer shadow-md shadow-[#E8742A]/15 hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Lock className="w-3.5 h-3.5 text-white/90 shrink-0" />
                <span className="truncate">{dict.quality.requestUnredacted}</span>
              </div>
              <span className="text-white/70 ml-2 font-mono text-xs shrink-0">→</span>
            </button>

            {/* Secondary Action Button (Exploration / Subtle Surface) */}
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="w-full h-9 px-4 rounded-[10px] bg-[#1B1B1E] hover:bg-[#25252A] border border-[rgba(245,245,244,0.12)] hover:border-white/20 text-[#F5F5F4] text-xs font-medium flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <Eye className="w-3.5 h-3.5 text-[#E8742A]" />
              <span className="truncate">{dict.quality.inspectPreview}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Large Inspect Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-[#141416] border border-[rgba(245,245,244,0.15)] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-[rgba(245,245,244,0.12)] flex items-center justify-between">
              <div>
                <h4 className="font-sans font-medium text-base text-white">
                  {cert.title}
                </h4>
                <span className="font-mono text-xs text-[#8E8E93]">
                  {cert.refNumber} • Issuer: {cert.issuer}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#1B1B1E] hover:bg-[#26262B] border border-white/10 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Document Body with Anti-Theft Protection */}
            <div className="relative flex-1 overflow-y-auto p-4 bg-[#0B0B0C] flex items-center justify-center select-none">
              <img
                src={cert.previewUrl}
                alt={cert.title}
                draggable={false}
                className="max-h-[60vh] object-contain rounded border border-white/10 filter contrast-125"
              />

              {/* Watermark Diagonal Overlay */}
              <div className="absolute inset-0 cert-watermark-overlay flex items-center justify-center p-8 pointer-events-none select-none">
                <div className="cert-watermark-text text-white/30 text-center font-mono text-sm sm:text-base uppercase leading-loose">
                  {watermarkString}
                  <br />
                  {watermarkString}
                  <br />
                  {watermarkString}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#141416] border-t border-[rgba(245,245,244,0.12)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <span className="text-[#8E8E93]">
                Original unredacted PDF is provided after buyer LOI verification.
              </span>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  openRfq({
                    inquiryType: 'QUOTATION_REQUEST',
                    variantId: `Unredacted COA Request: ${cert.refNumber}`,
                  });
                }}
                className="px-5 py-2.5 bg-[#E8742A] hover:bg-[#C95E1B] text-white font-medium rounded-lg transition-colors cursor-pointer"
              >
                Request Official Spec Copy →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
