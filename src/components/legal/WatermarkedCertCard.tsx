'use client';

import React, { useState } from 'react';
import { CertificateDoc } from '@/types/product';
import { LocaleCode } from '@/types/export-config';
import { Messages } from '@/lib/dictionary';
import { usePitch } from '@/context/PitchContext';
import { ShieldCheck, Eye, Lock, FileDown, CheckCircle } from 'lucide-react';

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

  const watermarkString = `ISSUED TO ${clientCompanyName.toUpperCase()} • COPY PROTECTED • OFFICIAL VERIFICATION REQUIRED • `;

  return (
    <>
      <div className="bg-white border border-[#E2E0D8] rounded-md overflow-hidden flex flex-col justify-between group hover:border-[#D96B27] transition-all">
        {/* Document Preview Frame with Anti-Theft Watermark */}
        <div
          onContextMenu={(e) => e.preventDefault()}
          className="relative h-64 sm:h-72 w-full bg-[#1A1D24] overflow-hidden select-none cursor-pointer"
          onClick={() => setModalOpen(true)}
        >
          {/* Background Image Scan */}
          <img
            src={cert.previewUrl}
            alt={cert.title}
            draggable={false}
            className="w-full h-full object-cover object-top opacity-85 group-hover:scale-105 transition-transform duration-500 filter contrast-125"
          />

          {/* Diagonal Repeating Semi-Transparent Watermark Overlay */}
          <div className="absolute inset-0 cert-watermark-overlay flex items-center justify-center p-4">
            <div className="cert-watermark-text text-[#F3F4F6] text-center font-mono text-sm uppercase leading-loose select-none pointer-events-none">
              {watermarkString}
              <br />
              {watermarkString}
              <br />
              {watermarkString}
            </div>
          </div>

          {/* Security Status Badge */}
          <div className="absolute top-3 right-3 bg-[#0B0C0E]/90 backdrop-blur-sm border border-[#2A2E39] text-[#DCFCE7] font-mono text-[10px] px-2 py-1 rounded flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
            <span>{locale === 'ar' ? 'محمي بعلامة مائية' : locale === 'zh' ? '防伪水印保护' : locale === 'id' ? 'Dilindungi Watermark' : 'Watermark Protected'}</span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-xs">
            <Eye className="w-4 h-4 text-[#D96B27]" />
            <span>{dict.quality.inspectPreview}</span>
          </div>
        </div>

        {/* Card Metadata & Actions */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] mb-1">
              <span>{cert.refNumber}</span>
              <span className="text-[#15803D] font-semibold">{cert.issueDate}</span>
            </div>

            <h3 className="font-heading font-bold text-sm sm:text-base text-[#111317]">
              {cert.title}
            </h3>

            <p className="font-mono text-xs text-[#525866] mt-2 leading-relaxed">
              {cert.description[locale]}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#E2E0D8] flex items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex-1 py-2 px-3 bg-[#F9F8F5] hover:bg-[#F3F1EA] border border-[#E2E0D8] text-[#111317] rounded transition-colors text-center font-medium"
            >
              {dict.quality.inspectPreview}
            </button>

            <button
              type="button"
              onClick={() =>
                openRfq({
                  inquiryType: 'QUOTATION_REQUEST',
                  variantId: `Unredacted COA Request: ${cert.refNumber}`,
                })
              }
              className="flex-1 py-2 px-3 bg-[#111317] hover:bg-[#1A1D24] text-white rounded transition-colors text-center font-medium flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#D96B27]" />
              <span>{dict.quality.requestUnredacted}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Large Inspect Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-[#111317] border border-[#2A2E39] rounded-md max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col text-white"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-[#2A2E39] flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-base text-white">{cert.title}</h4>
                <span className="font-mono text-xs text-[#9CA3AF]">{cert.refNumber} • Issuer: {cert.issuer}</span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-[#9CA3AF] hover:text-white bg-[#1A1D24] rounded"
              >
                ✕
              </button>
            </div>

            {/* Document Body with Anti-Theft Protection */}
            <div className="relative flex-1 overflow-y-auto p-4 bg-[#0B0C0E] flex items-center justify-center select-none">
              <img
                src={cert.previewUrl}
                alt={cert.title}
                draggable={false}
                className="max-h-[60vh] object-contain no-drag"
              />

              {/* Watermark Diagonal Overlay */}
              <div className="absolute inset-0 cert-watermark-overlay flex items-center justify-center p-8 pointer-events-none select-none">
                <div className="cert-watermark-text text-white text-center font-mono text-base uppercase leading-loose">
                  {watermarkString}
                  <br />
                  {watermarkString}
                  <br />
                  {watermarkString}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#14171E] border-t border-[#2A2E39] flex items-center justify-between text-xs font-mono">
              <span className="text-[#9CA3AF]">
                Original unredacted PDF is provided after LOI verification.
              </span>
              <button
                onClick={() => {
                  setModalOpen(false);
                  openRfq({
                    inquiryType: 'QUOTATION_REQUEST',
                    variantId: `Unredacted COA Request: ${cert.refNumber}`,
                  });
                }}
                className="px-4 py-2 bg-[#D96B27] hover:bg-[#B8561B] text-white font-bold rounded"
              >
                Request Unredacted Copy -&gt;
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
