export interface PitchPreset {
  id: 'charcoal' | 'coffee' | 'spices';
  name: string;
  defaultClientName: string;
  brandName: string;
  primaryHex: string;
  category: 'CHARCOAL' | 'COFFEE' | 'SPICES';
  defaultSlug: string;
  tagline: string;
  monthlyOutput: string;
}

export const PITCH_PRESETS: Record<'charcoal' | 'coffee' | 'spices', PitchPreset> = {
  charcoal: {
    id: 'charcoal',
    name: 'Coconut Charcoal Briquettes',
    defaultClientName: 'PT Berkah Arang Nusantara',
    brandName: 'NusantaraOrigin Charcoal',
    primaryHex: '#D96B27', // Kiln Amber
    category: 'CHARCOAL',
    defaultSlug: 'premium-shisha-coconut-charcoal-briquettes',
    tagline: 'Export-Grade High Calorie 100% Coconut Charcoal Briquettes',
    monthlyOutput: '350 MT / Month',
  },
  coffee: {
    id: 'coffee',
    name: 'Specialty Green Coffee Beans',
    defaultClientName: 'PT Sumatra Kopi Mandiri',
    brandName: 'NusantaraOrigin Coffee',
    primaryHex: '#78350F', // Espresso Brown
    category: 'COFFEE',
    defaultSlug: 'sumatra-mandheling-arabica-green-beans',
    tagline: 'Single-Origin Specialty Grade 1 Indonesian Arabica Beans',
    monthlyOutput: '180 MT / Month',
  },
  spices: {
    id: 'spices',
    name: 'Premium Indonesian Spices',
    defaultClientName: 'PT Rempah Maluku Ekspor',
    brandName: 'NusantaraOrigin Spices',
    primaryHex: '#C2410C', // Terracotta Spice
    category: 'SPICES',
    defaultSlug: 'maluku-lalpari-cloves-handpicked',
    tagline: 'Sun-Dried Lalpari Cloves & Whole Nutmeg with High Essential Oil',
    monthlyOutput: '120 MT / Month',
  },
};
