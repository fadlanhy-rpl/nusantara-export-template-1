'use client';

import React, { useState } from 'react';
import { CommodityProduct } from '@/types/product';
import { LocaleCode } from '@/types/export-config';
import { Messages } from '@/lib/dictionary';
import { Copy, Check, Printer, FileDown } from 'lucide-react';

interface LabSpecTableProps {
  product: CommodityProduct;
  locale: LocaleCode;
  dict: Messages;
}

export function LabSpecTable({ product, locale, dict }: LabSpecTableProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyTable = () => {
    const rows = [
      `Parameter\tPlatinum Value\tStandard Value\tTest Method`,
      ...product.labSpecifications.map(
        (s) =>
          `${s.parameter[locale]}\t${s.value}\t${s.standardGradeValue || 'N/A'}\t${s.testMethod}`
      ),
    ];
    navigator.clipboard.writeText(rows.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="lab-specs" className="w-full bg-white border border-[#E2E0D8] rounded-md overflow-hidden">
      {/* Table Header Bar */}
      <div className="p-4 sm:p-6 bg-[#F9F8F5] border-b border-[#E2E0D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-semibold text-[#D96B27] uppercase tracking-wider block">
            {dict.labTable.title}
          </span>
          <p className="font-mono text-xs text-[#525866] mt-0.5">
            {dict.labTable.subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto no-print">
          <button
            type="button"
            onClick={handleCopyTable}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E0D8] hover:border-[#D96B27] text-xs font-mono text-[#111317] rounded transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#15803D]" />
                <span className="text-[#15803D] font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#525866]" />
                <span>{dict.labTable.copyTable}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#111317] hover:bg-[#1A1D24] text-xs font-mono text-white rounded transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#D96B27]" />
            <span>{dict.labTable.printPdf}</span>
          </button>
        </div>
      </div>

      {/* Table Area (Horizontal Scroll on Mobile) */}
      <div className="overflow-x-auto">
        <table className="w-full text-start text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-[#111317] text-[#F3F4F6] border-b border-[#2A2E39]">
              <th className="py-3 px-4 sm:px-6 text-start font-bold uppercase tracking-wider w-1/3">
                {dict.labTable.paramCol}
              </th>
              <th className="py-3 px-4 sm:px-6 text-start font-bold uppercase tracking-wider text-[#DCFCE7] bg-[#161F1A]">
                {dict.labTable.platCol}
              </th>
              <th className="py-3 px-4 sm:px-6 text-start font-bold uppercase tracking-wider text-[#9CA3AF]">
                {dict.labTable.stdCol}
              </th>
              <th className="py-3 px-4 sm:px-6 text-start font-bold uppercase tracking-wider text-[#D96B27]">
                {dict.labTable.methodCol}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E0D8]">
            {product.labSpecifications.map((spec, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? 'bg-white hover:bg-[#F9F8F5]' : 'bg-[#FAF9F5] hover:bg-[#F3F1EA]'}
              >
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#111317] whitespace-nowrap">
                  {spec.parameter[locale]}
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-[#15803D] bg-[#F0FDF4]/70 whitespace-nowrap">
                  {spec.value}
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-[#525866] whitespace-nowrap">
                  {spec.standardGradeValue || '—'}
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-[#78350F] font-medium whitespace-nowrap">
                  {spec.testMethod}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Official Footnote */}
      <div className="p-4 bg-[#F9F8F5] border-t border-[#E2E0D8] text-[11px] font-mono text-[#64748B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span>
          ● Reference: Sucofindo Batch Analysis #NO-2026-10 / SGS Certificate #SGS-SUB-88194.
        </span>
        <span className="text-[#15803D] font-semibold">
          ISO 17025 Accredited Laboratory Protocol
        </span>
      </div>
    </div>
  );
}
