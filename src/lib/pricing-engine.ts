import { SiteConfig } from '@/types/export-config';
import { CommodityProduct } from '@/types/product';

export interface CalculationResult {
  containerType: '20FT_DRY' | '40FT_DRY' | '40FT_HC';
  containerLabel: string;
  containerQty: number;
  totalMasterBoxes: number;
  boxesPerContainer: number;
  totalNetWeightKg: number;
  totalNetWeightMT: number;
  boxVolumeCbm: number;
  totalVolumeCbm: number;
  containerTotalCbm: number;
  volumeUtilizationPct: number;
  fobPriceMinPerMT: number;
  fobPriceMaxPerMT: number;
  discountAppliedPct: number;
  isVipContract: boolean;
  estTotalMinUsd: number;
  estTotalMaxUsd: number;
  productionLeadDays: number;
}

export function calculateContainerAndPricing(
  product: CommodityProduct,
  containerType: '20FT_DRY' | '40FT_DRY' | '40FT_HC',
  containerQty: number,
  config: SiteConfig,
  packagingOption: '10kg_master_with_inner' | '20kg_bulk_no_inner' = '10kg_master_with_inner'
): CalculationResult {
  const container = config.containers.find((c) => c.type === containerType) || config.containers[0];

  // Adjust master box net weight based on packaging option
  let boxNetWeight = product.packaging.masterBoxNetWeightKg;
  let dims = product.packaging.masterBoxDimensionsCm;
  let packageDeductionPerMT = 0;

  if (packagingOption === '20kg_bulk_no_inner') {
    boxNetWeight = 20;
    dims = { l: 45, w: 32, h: 25 };
    packageDeductionPerMT = 45; // Save $45/MT for bulk
  }

  // Formula 1: Boxes per container
  const boxesPerContainer = Math.floor(container.maxPayloadKg / boxNetWeight);
  const totalMasterBoxes = boxesPerContainer * containerQty;

  // Formula 2: Total Net Weight
  const totalNetWeightKg = totalMasterBoxes * boxNetWeight;
  const totalNetWeightMT = Number((totalNetWeightKg / 1000).toFixed(2));

  // Formula 3: CBM Volume
  const boxVolumeCbm = (dims.l * dims.w * dims.h) / 1000000;
  const totalVolumeCbm = Number((totalMasterBoxes * boxVolumeCbm).toFixed(2));
  const containerTotalCbm = container.internalCbm * containerQty;

  // Formula 4: Volume Utilization %
  const volumeUtilizationPct = Math.min(
    98.5,
    Number(((totalVolumeCbm / containerTotalCbm) * 100).toFixed(1))
  );

  // Formula 5: Pricing Tiering
  let discountPct = 0;
  if (containerType === '40FT_HC' || containerQty >= 2) {
    discountPct = container.volumeDiscountPercent || 5;
  }

  const isVipContract = containerQty >= 4 || totalNetWeightMT >= 75;

  let baseMin = product.pricing.fobPriceMinPerMT - packageDeductionPerMT;
  let baseMax = product.pricing.fobPriceMaxPerMT - packageDeductionPerMT;

  if (discountPct > 0) {
    baseMin = Math.round(baseMin * (1 - discountPct / 100));
    baseMax = Math.round(baseMax * (1 - discountPct / 100));
  }

  const estTotalMinUsd = Math.round(baseMin * totalNetWeightMT);
  const estTotalMaxUsd = Math.round(baseMax * totalNetWeightMT);

  // Production lead time estimation
  // Base 14 days + 3 days per container
  const productionLeadDays = Math.min(35, 14 + (containerQty - 1) * 3);

  return {
    containerType,
    containerLabel: container.label,
    containerQty,
    totalMasterBoxes,
    boxesPerContainer,
    totalNetWeightKg,
    totalNetWeightMT,
    boxVolumeCbm: Number(boxVolumeCbm.toFixed(4)),
    totalVolumeCbm,
    containerTotalCbm,
    volumeUtilizationPct,
    fobPriceMinPerMT: baseMin,
    fobPriceMaxPerMT: baseMax,
    discountAppliedPct: discountPct,
    isVipContract,
    estTotalMinUsd,
    estTotalMaxUsd,
    productionLeadDays,
  };
}
