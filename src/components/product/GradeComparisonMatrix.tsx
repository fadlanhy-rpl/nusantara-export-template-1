'use client';

import React from 'react';
import { LocaleCode } from '@/types/export-config';
import { Messages } from '@/lib/dictionary';
import { usePitch } from '@/context/PitchContext';
import { Check, ShieldCheck } from 'lucide-react';

interface GradeComparisonMatrixProps {
  locale: LocaleCode;
  dict: Messages;
}

export function GradeComparisonMatrix({ locale, dict }: GradeComparisonMatrixProps) {
  const { openRfq } = usePitch();

  const comparisonRows = [
    {
      metric: 'Raw Material Origin',
      platinum: '100% Mature Sulawesi Coconut Shells (Drum Carbonized)',
      standard: 'Selected Indonesian Coconut Shells',
      bbq: '70% Hardwood + 30% Coconut Shell',
    },
    {
      metric: 'Ash Content (Proximate Analysis)',
      platinum: '1.9% – 2.2% (ASTM D3174)',
      standard: '2.5% – 3.0% (ASTM D3174)',
      bbq: 'Max 4.0% (ASTM D3174)',
    },
    {
      metric: 'Ash Color Residue',
      platinum: 'Snow White / Clean Silver',
      standard: 'Natural Light Grey',
      bbq: 'Greyish Silver',
    },
    {
      metric: 'Gross Calorific Value',
      platinum: '7,500 – 7,800 kcal/kg',
      standard: '7,000 – 7,200 kcal/kg',
      bbq: '7,200 – 7,500 kcal/kg',
    },
    {
      metric: 'Continuous Burning Duration',
      platinum: '2.5 – 3.0 Hours',
      standard: '2.0 Hours',
      bbq: '4.5 – 5.5 Hours (Hollow Center)',
    },
    {
      metric: 'Drop Test (1.5m Drop x 3 Drops)',
      platinum: '98% Intact (Zero Cracking)',
      standard: '95% Intact',
      bbq: '94% Intact',
    },
    {
      metric: 'Fixed Carbon Rate',
      platinum: 'Min 81.5% (By Difference)',
      standard: 'Min 75.0%',
      bbq: 'Min 78.0%',
    },
    {
      metric: 'Packaging Master Carton',
      platinum: '10kg (10x1kg Custom Brand Inner Box)',
      standard: '10kg Standard Box',
      bbq: '10kg or 20kg Heavy Duty Carton',
    },
    {
      metric: '40ft HC Container Payload',
      platinum: '26.0 Metric Tons (2,600 Boxes)',
      standard: '26.0 Metric Tons (2,600 Boxes)',
      bbq: '26.0 Metric Tons (2,600 Boxes)',
    },
    {
      metric: 'Indicative FOB Price Surabaya',
      platinum: 'USD $1,280 – $1,350 / MT',
      standard: 'USD $1,150 – $1,220 / MT',
      bbq: 'USD $950 – $1,080 / MT',
    },
  ];

  return (
    <div className="w-full bg-white border border-[#E2E0D8] rounded-md overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-[#111317] text-white border-b border-[#2A2E39] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="font-mono text-xs font-semibold text-[#D96B27] uppercase tracking-wider block">
            {dict.catalog.sideBySideTitle}
          </span>
          <p className="font-mono text-xs text-[#9CA3AF] mt-0.5">
            Technical laboratory benchmarking for international procurement managers.
          </p>
        </div>
        <span className="font-mono text-[11px] text-[#DCFCE7] bg-[#14171E] px-2.5 py-1 border border-[#15803D]/40 rounded">
          ● ISO 17025 Calibrated
        </span>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-start text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-[#1A1D24] text-white border-b border-[#2A2E39]">
              <th className="py-3 px-4 sm:px-6 text-start uppercase tracking-wider w-1/4">
                Inspection Criteria
              </th>
              <th className="py-3 px-4 sm:px-6 text-start uppercase tracking-wider text-[#DCFCE7] bg-[#142319] w-1/4 border-x border-[#2A2E39]">
                Platinum Shisha (Grade A+)
              </th>
              <th className="py-3 px-4 sm:px-6 text-start uppercase tracking-wider text-[#F3F4F6] w-1/4">
                Standard Hookah Grade
              </th>
              <th className="py-3 px-4 sm:px-6 text-start uppercase tracking-wider text-[#D96B27] w-1/4">
                Hexagonal BBQ Grade
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E0D8]">
            {comparisonRows.map((row, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? 'bg-white hover:bg-[#F9F8F5]' : 'bg-[#FAF9F5] hover:bg-[#F3F1EA]'}
              >
                <td className="py-3 px-4 sm:px-6 font-semibold text-[#111317] whitespace-nowrap">
                  {row.metric}
                </td>
                <td className="py-3 px-4 sm:px-6 font-bold text-[#15803D] bg-[#F0FDF4]/60 border-x border-[#E2E0D8] whitespace-nowrap">
                  {row.platinum}
                </td>
                <td className="py-3 px-4 sm:px-6 text-[#525866] whitespace-nowrap">
                  {row.standard}
                </td>
                <td className="py-3 px-4 sm:px-6 text-[#78350F] font-medium whitespace-nowrap">
                  {row.bbq}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer CTA Strip */}
      <div className="p-4 sm:p-5 bg-[#F9F8F5] border-t border-[#E2E0D8] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs text-[#525866]">
          Need a custom formula or mixed container of 2 grades? Contact our lab director.
        </span>
        <button
          onClick={() => openRfq()}
          className="px-5 py-2.5 bg-[#D96B27] hover:bg-[#B8561B] text-white font-mono text-xs font-bold rounded"
        >
          Request Custom Blended Quote -&gt;
        </button>
      </div>
    </div>
  );
}
