import { LocaleCode } from './export-config';

export type InquiryType = 'QUOTATION_REQUEST' | 'FREE_SAMPLE_REQUEST';

export interface RfqFormData {
  inquiryType: InquiryType;
  locale: LocaleCode;
  productSlug: string;
  selectedVariant: string;
  containerType: '20FT_DRY' | '40FT_DRY' | '40FT_HC';
  containerQty: number;
  estimatedTotalMT: number;
  incoterm: 'EXW' | 'FOB' | 'CIF' | 'CFR';
  destinationPort: string;
  paymentTermPreference: 'T/T (30/70)' | 'T/T (50/50)' | 'L/C at Sight' | 'DISCUSS_CUSTOM';
  buyerTargetPriceUsdPerMT?: number;
  oemPackagingRequired: boolean;
  packagingOption?: '10kg_master_with_inner' | '20kg_bulk_no_inner';
  buyer: {
    fullName: string;
    companyName: string;
    country: string;
    email: string;
    whatsappOrPhone: string;
    additionalNotes?: string;
  };
}

export interface RfqApiResponse {
  status: 'success' | 'error';
  referenceId?: string;
  timestamp?: string;
  message?: string;
  whatsappRedirectUrl?: string;
}
