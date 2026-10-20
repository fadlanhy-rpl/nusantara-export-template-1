import { SiteConfig } from '@/types/export-config';

export const siteConfig: SiteConfig = {
  company: {
    legalName: 'PT Nusantara Agro Charcoal Indonesia',
    brandName: 'NusantaraOrigin',
    tagline: {
      en: 'Premium Indonesian Coconut Charcoal Briquettes & Agro Commodities for Global Bulk Importers',
      ar: 'فحم جوز الهند الإندونيسي الفاخر للشيشة والسلع الزراعية لكبار المستوردين حول العالم',
      zh: '印尼高品质纯椰壳炭块及特色农产品全球大宗直接出口商',
      id: 'Briket Arang Kelapa Premium & Komoditas Agro Indonesia untuk Importir Grosir Global',
    },
    nibNumber: '9120301928371 (Verified Export License - Kemendag RI)',
    establishedYear: 2018,
    monthlyCapacityMT: 350,
    factoryAddress: 'Jl. Raya Industri Manyar Km 12, Kawasan Industri Gresik, Jawa Timur 61151, Indonesia',
    headOfficeAddress: 'Treasury Tower 28th Fl, SCBD District 8, South Jakarta 12190, Indonesia',
    googleMapsEmbedUrl: 'https://maps.google.com/?q=-7.1566,112.6555',
    coordinates: 'FACTORY: GRESIK, EAST JAVA (-7.1566° S, 112.6555° E)',
    loadingPorts: [
      'Port of Tanjung Perak, Surabaya (IDSUB) — 25 km away',
      'Port of Tanjung Priok, Jakarta (IDJKT)',
    ],
  },
  contact: {
    whatsappNumber: '+6281234567890',
    wechatId: 'nusantara_export_sales',
    salesEmail: 'export@nusantaraorigin.com',
    linkedinUrl: 'https://linkedin.com/company/nusantaraorigin',
  },
  theme: {
    preset: 'charcoal-gold',
    primaryHex: '#D96B27',
    backgroundDarkHex: '#111317',
  },
  features: {
    pricingMode: 'TIERED_DISCOUNT', // 'RANGE_NEGOTIABLE' | 'TIERED_DISCOUNT' | 'HIDDEN_QUOTE_ONLY'
    rfqDeliveryMode: 'VERSION_C_DUAL', // 'VERSION_A_WHATSAPP' | 'VERSION_B_EMAIL' | 'VERSION_C_DUAL'
    enableTargetPriceInput: true,
    enableFreeSampleRequest: true,
    enablePitchSwitcher: true, // Enables ?pitch=true secret dock
  },
  containers: [
    {
      type: '20FT_DRY',
      label: '20ft Dry FCL',
      maxPayloadKg: 18000,
      internalCbm: 33.2,
      volumeDiscountPercent: 0,
    },
    {
      type: '40FT_DRY',
      label: '40ft Dry FCL',
      maxPayloadKg: 25000,
      internalCbm: 67.7,
      volumeDiscountPercent: 0,
    },
    {
      type: '40FT_HC',
      label: '40ft High Cube (Recommended)',
      maxPayloadKg: 26000,
      internalCbm: 76.3,
      volumeDiscountPercent: 5, // -5% bulk efficiency discount
    },
  ],
};
