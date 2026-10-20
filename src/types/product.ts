import { LocaleCode } from './export-config';

export interface CommodityProduct {
  id: string;
  slug: string;
  hsCode: string;
  category: 'CHARCOAL' | 'COFFEE' | 'SPICES' | 'COCONUT_DERIVATIVES';
  name: Record<LocaleCode, string>;
  shortSummary: Record<LocaleCode, string>;
  heroImage: string;
  galleryImages: string[];
  readyCapacityMonth: string;
  pricing: {
    currency: 'USD';
    incotermBase: 'FOB';
    fobPriceMinPerMT: number;
    fobPriceMaxPerMT: number;
    priceNote: Record<LocaleCode, string>;
  };
  packaging: {
    masterBoxNetWeightKg: number;
    masterBoxGrossWeightKg: number;
    masterBoxDimensionsCm: { l: number; w: number; h: number };
    innerBoxDetails: Record<LocaleCode, string>;
    moqDescription: Record<LocaleCode, string>;
  };
  labSpecifications: {
    parameter: Record<LocaleCode, string>;
    value: string;
    standardGradeValue?: string;
    testMethod: string;
  }[];
  variantsOrGrades: {
    id: string;
    name: string;
    dimensionsOrSpec: string;
    piecesPerKg?: string;
    description?: string;
    image?: string;
  }[];
}

export interface CertificateDoc {
  id: string;
  refNumber: string;
  title: string;
  type: 'SGS_COA' | 'SVLK_FORESTRY' | 'HALAL' | 'MSDS_NON_DG' | 'NIB_EXPORTER' | 'SUCOFINDO';
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  previewUrl: string;
  watermarkText: string;
  description: Record<LocaleCode, string>;
}
