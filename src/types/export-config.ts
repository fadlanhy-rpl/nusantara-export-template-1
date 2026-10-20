export type LocaleCode = 'en' | 'ar' | 'zh' | 'id';
export type PricingMode = 'RANGE_NEGOTIABLE' | 'TIERED_DISCOUNT' | 'HIDDEN_QUOTE_ONLY';
export type RfqDeliveryMode = 'VERSION_A_WHATSAPP' | 'VERSION_B_EMAIL' | 'VERSION_C_DUAL';

export interface SiteConfig {
  company: {
    legalName: string;
    brandName: string;
    tagline: Record<LocaleCode, string>;
    nibNumber: string;
    establishedYear: number;
    monthlyCapacityMT: number;
    factoryAddress: string;
    headOfficeAddress: string;
    googleMapsEmbedUrl: string;
    loadingPorts: string[];
    coordinates: string;
  };
  contact: {
    whatsappNumber: string;
    wechatId?: string;
    salesEmail: string;
    linkedinUrl?: string;
  };
  theme: {
    preset: 'charcoal-gold' | 'coffee-earth' | 'spice-terracotta';
    primaryHex: string;
    backgroundDarkHex: string;
  };
  features: {
    pricingMode: PricingMode;
    rfqDeliveryMode: RfqDeliveryMode;
    enableTargetPriceInput: boolean;
    enableFreeSampleRequest: boolean;
    enablePitchSwitcher: boolean;
  };
  containers: {
    type: '20FT_DRY' | '40FT_DRY' | '40FT_HC';
    label: string;
    maxPayloadKg: number;
    internalCbm: number;
    volumeDiscountPercent: number;
  }[];
}
