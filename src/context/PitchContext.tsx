'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { siteConfig } from '@/config/site-config';
import { PITCH_PRESETS, PitchPreset } from '@/config/pitch-presets';
import { PricingMode, LocaleCode } from '@/types/export-config';

export interface RfqPrefillData {
  productSlug?: string;
  variantId?: string;
  containerType?: '20FT_DRY' | '40FT_DRY' | '40FT_HC';
  containerQty?: number;
  estimatedTotalMT?: number;
  targetPrice?: number;
  packagingOption?: '10kg_master_with_inner' | '20kg_bulk_no_inner';
  inquiryType?: 'QUOTATION_REQUEST' | 'FREE_SAMPLE_REQUEST';
}

interface PitchContextType {
  // Live Pitch State
  isPitchActive: boolean;
  setIsPitchActive: (val: boolean) => void;
  clientCompanyName: string;
  setClientCompanyName: (val: string) => void;
  clientBrandName: string;
  setClientBrandName: (val: string) => void;
  activePresetKey: 'charcoal' | 'coffee' | 'spices';
  setPresetKey: (key: 'charcoal' | 'coffee' | 'spices') => void;
  activePreset: PitchPreset;
  pricingMode: PricingMode;
  setPricingMode: (mode: PricingMode) => void;
  targetWhatsAppNumber: string;
  setTargetWhatsAppNumber: (phone: string) => void;
  resetToDefault: () => void;

  // Global RFQ Drawer State
  isRfqOpen: boolean;
  rfqPrefill: RfqPrefillData;
  openRfq: (data?: RfqPrefillData) => void;
  closeRfq: () => void;
}

const PitchContext = createContext<PitchContextType | undefined>(undefined);

export function PitchProvider({ children }: { children: React.ReactNode }) {
  const [isPitchActive, setIsPitchActive] = useState(false);
  const [clientCompanyName, setClientCompanyName] = useState(siteConfig.company.legalName);
  const [clientBrandName, setClientBrandName] = useState(siteConfig.company.brandName);
  const [activePresetKey, setActivePresetKey] = useState<'charcoal' | 'coffee' | 'spices'>('charcoal');
  const [pricingMode, setPricingMode] = useState<PricingMode>(siteConfig.features.pricingMode);
  const [targetWhatsAppNumber, setTargetWhatsAppNumber] = useState(siteConfig.contact.whatsappNumber);

  // Global RFQ Drawer
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [rfqPrefill, setRfqPrefill] = useState<RfqPrefillData>({
    productSlug: 'premium-shisha-coconut-charcoal-briquettes',
    containerType: '40FT_HC',
    containerQty: 2,
    estimatedTotalMT: 52,
    inquiryType: 'QUOTATION_REQUEST',
    packagingOption: '10kg_master_with_inner',
  });

  // Check URL param ?pitch=true on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('pitch') === 'true' || localStorage.getItem('pitch_mode') === 'true') {
        setIsPitchActive(true);
      }

      const savedName = localStorage.getItem('pitch_client_name');
      if (savedName) setClientCompanyName(savedName);

      const savedBrand = localStorage.getItem('pitch_brand_name');
      if (savedBrand) setClientBrandName(savedBrand);

      const savedPhone = localStorage.getItem('pitch_wa_phone');
      if (savedPhone) setTargetWhatsAppNumber(savedPhone);

      const savedPreset = localStorage.getItem('pitch_preset') as 'charcoal' | 'coffee' | 'spices';
      if (savedPreset && PITCH_PRESETS[savedPreset]) {
        setActivePresetKey(savedPreset);
      }
    }
  }, []);

  const setPresetKey = (key: 'charcoal' | 'coffee' | 'spices') => {
    setActivePresetKey(key);
    const p = PITCH_PRESETS[key];
    setClientCompanyName(p.defaultClientName);
    setClientBrandName(p.brandName);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pitch_preset', key);
      localStorage.setItem('pitch_client_name', p.defaultClientName);
      localStorage.setItem('pitch_brand_name', p.brandName);
    }
  };

  const handleSetCompanyName = (name: string) => {
    setClientCompanyName(name);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pitch_client_name', name);
    }
  };

  const handleSetBrandName = (brand: string) => {
    setClientBrandName(brand);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pitch_brand_name', brand);
    }
  };

  const handleSetWhatsApp = (phone: string) => {
    setTargetWhatsAppNumber(phone);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pitch_wa_phone', phone);
    }
  };

  const resetToDefault = () => {
    setClientCompanyName(siteConfig.company.legalName);
    setClientBrandName(siteConfig.company.brandName);
    setActivePresetKey('charcoal');
    setPricingMode(siteConfig.features.pricingMode);
    setTargetWhatsAppNumber(siteConfig.contact.whatsappNumber);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pitch_client_name');
      localStorage.removeItem('pitch_brand_name');
      localStorage.removeItem('pitch_preset');
      localStorage.removeItem('pitch_wa_phone');
    }
  };

  const openRfq = (data?: RfqPrefillData) => {
    if (data) {
      setRfqPrefill((prev) => ({ ...prev, ...data }));
    }
    setIsRfqOpen(true);
  };

  const closeRfq = () => {
    setIsRfqOpen(false);
  };

  return (
    <PitchContext.Provider
      value={{
        isPitchActive,
        setIsPitchActive: (val: boolean) => {
          setIsPitchActive(val);
          if (typeof window !== 'undefined') {
            localStorage.setItem('pitch_mode', val ? 'true' : 'false');
          }
        },
        clientCompanyName,
        setClientCompanyName: handleSetCompanyName,
        clientBrandName,
        setClientBrandName: handleSetBrandName,
        activePresetKey,
        setPresetKey,
        activePreset: PITCH_PRESETS[activePresetKey],
        pricingMode,
        setPricingMode,
        targetWhatsAppNumber,
        setTargetWhatsAppNumber: handleSetWhatsApp,
        resetToDefault,
        isRfqOpen,
        rfqPrefill,
        openRfq,
        closeRfq,
      }}
    >
      {children}
    </PitchContext.Provider>
  );
}

export function usePitch() {
  const context = useContext(PitchContext);
  if (!context) {
    throw new Error('usePitch must be used within a PitchProvider');
  }
  return context;
}
