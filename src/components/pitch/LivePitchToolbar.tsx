'use client';

import React, { useState } from 'react';
import { usePitch } from '@/context/PitchContext';
import { PITCH_PRESETS } from '@/config/pitch-presets';
import { PricingMode } from '@/types/export-config';
import { Zap, X, RotateCcw, ChevronUp, ChevronDown, Check } from 'lucide-react';

export function LivePitchToolbar() {
  const {
    isPitchActive,
    setIsPitchActive,
    clientCompanyName,
    setClientCompanyName,
    clientBrandName,
    setClientBrandName,
    activePresetKey,
    setPresetKey,
    pricingMode,
    setPricingMode,
    targetWhatsAppNumber,
    setTargetWhatsAppNumber,
    resetToDefault,
  } = usePitch();

  const [isMinimized, setIsMinimized] = useState(false);

  if (!isPitchActive) {
    return null;
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-[#111317] hover:bg-[#1A1D24] text-[#D96B27] border-2 border-[#D96B27] px-3 py-2 rounded-full font-mono text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>⚡ PITCH CONTROLLER</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-full max-w-sm sm:max-w-md bg-[#111317]/95 backdrop-blur-md border-2 border-[#D96B27] rounded-md shadow-2xl p-4 text-white font-mono text-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2A2E39] mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#D96B27] fill-current" />
          <span className="font-bold text-[#F3F4F6] uppercase text-[11px] tracking-wide">
            AGENCY LIVE PITCH CONTROLLER
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={resetToDefault}
            title="Reset to Factory Defaults"
            className="p-1 text-[#9CA3AF] hover:text-white hover:bg-[#1A1D24] rounded"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            title="Minimize"
            className="p-1 text-[#9CA3AF] hover:text-white hover:bg-[#1A1D24] rounded"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsPitchActive(false)}
            title="Close Pitch Mode"
            className="p-1 text-[#9CA3AF] hover:text-red-400 hover:bg-[#1A1D24] rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Controls Form */}
      <div className="space-y-3">
        {/* 1. Client Company Name */}
        <div>
          <label className="block text-[10px] text-[#9CA3AF] uppercase mb-1">
            1. Prospect Client Legal Name (Realtime)
          </label>
          <input
            type="text"
            value={clientCompanyName}
            onChange={(e) => setClientCompanyName(e.target.value)}
            placeholder="e.g. PT Mandiri Arang Abadi"
            className="w-full h-8 px-2.5 bg-[#1A1D24] border border-[#2A2E39] focus:border-[#D96B27] text-white rounded text-xs focus:outline-none"
          />
        </div>

        {/* 2. Commodity Preset Toggle */}
        <div>
          <label className="block text-[10px] text-[#9CA3AF] uppercase mb-1">
            2. Commodity Archetype Preset
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['charcoal', 'coffee', 'spices'] as const).map((key) => {
              const preset = PITCH_PRESETS[key];
              const isSelected = activePresetKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPresetKey(key)}
                  className={`py-1.5 px-2 rounded text-[10px] font-bold border transition-colors truncate ${
                    isSelected
                      ? 'bg-[#D96B27] border-[#D96B27] text-white'
                      : 'bg-[#1A1D24] border-[#2A2E39] text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  {preset.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Pricing Display Mode */}
        <div>
          <label className="block text-[10px] text-[#9CA3AF] uppercase mb-1">
            3. Pricing Visibility Strategy
          </label>
          <select
            value={pricingMode}
            onChange={(e) => setPricingMode(e.target.value as PricingMode)}
            className="w-full h-8 px-2.5 bg-[#1A1D24] border border-[#2A2E39] focus:border-[#D96B27] text-white rounded text-xs focus:outline-none"
          >
            <option value="TIERED_DISCOUNT">Tiered Volume Discount (-5% on 40ft HC)</option>
            <option value="RANGE_NEGOTIABLE">Indicative Range + Open for Negotiation</option>
            <option value="HIDDEN_QUOTE_ONLY">Hidden Quote (Custom RFQ Only)</option>
          </select>
        </div>

        {/* 4. Target Client Phone for Live WA Demo */}
        <div>
          <label className="block text-[10px] text-[#9CA3AF] uppercase mb-1">
            4. Client WhatsApp (Test live dispatch on Zoom!)
          </label>
          <input
            type="text"
            value={targetWhatsAppNumber}
            onChange={(e) => setTargetWhatsAppNumber(e.target.value)}
            placeholder="+6281234567890"
            className="w-full h-8 px-2.5 bg-[#1A1D24] border border-[#2A2E39] focus:border-[#15803D] text-[#DCFCE7] rounded text-xs focus:outline-none font-bold"
          />
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[#2A2E39] flex items-center justify-between text-[10px] text-[#64748B]">
        <span>⚡ Mode URL: `?pitch=true`</span>
        <span className="text-[#15803D] font-bold">Auto-saved to Browser</span>
      </div>
    </div>
  );
}
