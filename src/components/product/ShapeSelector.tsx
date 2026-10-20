'use client';

import React, { useState } from 'react';
import { CommodityProduct } from '@/types/product';
import { LocaleCode } from '@/types/export-config';
import { Messages } from '@/lib/dictionary';
import { Box, Ruler, Check, Package } from 'lucide-react';

interface ShapeSelectorProps {
  product: CommodityProduct;
  locale: LocaleCode;
  dict: Messages;
  onSelectVariant?: (variantId: string) => void;
}

export function ShapeSelector({
  product,
  locale,
  dict,
  onSelectVariant,
}: ShapeSelectorProps) {
  const [activeVariantId, setActiveVariantId] = useState(
    product.variantsOrGrades[0]?.id || ''
  );

  const activeVariant =
    product.variantsOrGrades.find((v) => v.id === activeVariantId) ||
    product.variantsOrGrades[0];

  const handleSelect = (id: string) => {
    setActiveVariantId(id);
    if (onSelectVariant) {
      onSelectVariant(id);
    }
  };

  return (
    <div className="w-full bg-white border border-[#E2E0D8] rounded-md p-5 sm:p-6 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs font-semibold text-[#D96B27] uppercase tracking-wider">
            Available Export Shapes & Sizing Specs
          </span>
          <span className="font-mono text-[11px] text-[#525866]">
            Custom cuts available upon request
          </span>
        </div>

        {/* Shape Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {product.variantsOrGrades.map((v) => {
            const isSelected = v.id === activeVariantId;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => handleSelect(v.id)}
                className={`p-3 text-start rounded border transition-all ${
                  isSelected
                    ? 'bg-[#111317] border-[#111317] text-white'
                    : 'bg-[#F9F8F5] border-[#E2E0D8] hover:border-[#D96B27] text-[#111317]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold block truncate">
                    {v.name}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#D96B27]" />}
                </div>
                {v.piecesPerKg && (
                  <span className={`text-[10px] font-mono block mt-1 ${isSelected ? 'text-[#DCFCE7]' : 'text-[#64748B]'}`}>
                    {v.piecesPerKg}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2D Technical Schematic Wireframe & Packaging Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Technical Wireframe Blueprint */}
        <div className="bg-[#111317] border border-[#2A2E39] rounded p-4 text-white flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#2A2E39] pb-2 text-xs font-mono">
            <span className="text-[#9CA3AF] uppercase">2D Dimension Schematic</span>
            <span className="text-[#D96B27] font-bold">1:1 Caliper Ratio</span>
          </div>

          <div className="py-6 flex flex-col items-center justify-center">
            {/* Visual Box Diagram */}
            <div className="relative border-2 border-dashed border-[#D96B27] bg-[#1A1D24] w-28 h-28 rounded flex items-center justify-center">
              <span className="font-mono font-bold text-xs text-white text-center px-1">
                {activeVariant.dimensionsOrSpec}
              </span>
              <div className="absolute -top-3 px-1.5 bg-[#111317] text-[10px] font-mono text-[#9CA3AF]">
                W: 25mm
              </div>
              <div className="absolute -right-3 py-1 bg-[#111317] text-[10px] font-mono text-[#9CA3AF] rotate-90">
                H: 25mm
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-[#9CA3AF] bg-[#14171E] p-2 rounded border border-[#2A2E39]">
            {activeVariant.description || 'Precision extruded and cut using calibrated CNC industrial slicer.'}
          </div>
        </div>

        {/* Master Carton Packaging Dimensions */}
        <div className="bg-[#FAF9F5] border border-[#E2E0D8] rounded p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#E2E0D8] pb-2 text-xs font-mono">
            <span className="text-[#525866] font-semibold uppercase flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-[#D96B27]" />
              Master Box Dimensions
            </span>
            <span className="text-[#15803D] font-bold">Export Grade</span>
          </div>

          <div className="space-y-2.5 py-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#E2E0D8]/60 pb-1.5">
              <span className="text-[#64748B]">Dimensions (L x W x H):</span>
              <span className="font-bold text-[#111317]">
                {product.packaging.masterBoxDimensionsCm.l} x {product.packaging.masterBoxDimensionsCm.w} x {product.packaging.masterBoxDimensionsCm.h} cm
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[#E2E0D8]/60 pb-1.5">
              <span className="text-[#64748B]">Net / Gross Weight:</span>
              <span className="font-bold text-[#111317]">
                {product.packaging.masterBoxNetWeightKg} kg / {product.packaging.masterBoxGrossWeightKg} kg
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[#E2E0D8]/60 pb-1.5">
              <span className="text-[#64748B]">Carton Material:</span>
              <span className="font-bold text-[#111317]">5-Ply Double Wall Kraft</span>
            </div>

            <div className="text-[11px] text-[#525866] leading-relaxed pt-1">
              {product.packaging.innerBoxDetails[locale]}
            </div>
          </div>

          <div className="text-[11px] font-mono text-[#D96B27] bg-[#FFF4ED] p-2 rounded border border-[#D96B27]/30">
            {product.packaging.moqDescription[locale]}
          </div>
        </div>
      </div>
    </div>
  );
}
