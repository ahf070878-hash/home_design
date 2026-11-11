export interface ArchitectStudio {
  name: string;
  straNo: string;
  isOfficial: boolean;
  avatarText: string;
  city: string;
  totalDesigns: number;
}

export interface BlueprintDesign {
  id: string;
  code: string;
  sku: string;
  title: string;
  tagline: string;
  category: 'Tropis Modern' | 'Minimalis' | 'Japandi' | 'Industrial' | 'Klasik Kontemporer';
  architect: ArchitectStudio;
  rating: number;
  reviewCount: number;
  
  // Dimensions & specs
  minLandWidth: number; // in meters (e.g., 8)
  minLandLength: number; // in meters (e.g., 15)
  landArea: number; // e.g. 120 m²
  buildingArea: number; // e.g. 145 m²
  levels: number; // e.g. 2
  bedrooms: number; // e.g. 4
  bathrooms: number; // e.g. 3
  carport: number; // e.g. 2
  featureHighlight: string; // e.g. 'Cross-Vent', 'Dry Courtyard', 'Balkon Lebar'
  badgeTag: string; // e.g. 'PBG READY', 'HEMAT ENERGI', 'BATA EKSPOS'

  // Pricing
  priceDED: number; // e.g. 4500000
  priceOriginal: number; // e.g. 15000000
  priceWithConsultation: number; // e.g. 5500000
  estConstructionCost: string; // e.g. 'Rp 650 Jt'

  // Document metrics
  totalSheets: number; // e.g. 42
  simbgCompliance: number; // e.g. 100

  // Images
  mainImage: string;
  floorplanImage: string;
  sectionImage: string;
  interiorImage: string;

  // Highlights
  description: string;
}

export interface CartItem {
  blueprint: BlueprintDesign;
  packageType: 'standard' | 'consultation';
  price: number;
}

export interface FilterState {
  landWidth: string;
  architectStyle: string;
  roomConfig: string;
  selectedCategory: string;
  sortBy: string;
  searchQuery: string;
}

export type MaterialCategory = 'lantai' | 'pintuJendela' | 'dinding' | 'plafon' | 'kloset' | 'wastafel';

export interface MaterialOption {
  id: string;
  category: MaterialCategory;
  categoryLabel: string;
  name: string;
  brand: string;
  spec: string;
  colorName?: string;
  colorHex?: string;
  priceDelta: number; // Selisih harga estimasi RAB fisik (IDR)
  grade: 'Standar' | 'Menengah' | 'Premium' | 'Luxury';
  features: string[];
}

export interface CustomMaterialSelections {
  lantai: MaterialOption;
  pintuJendela: MaterialOption;
  dinding: MaterialOption;
  plafon: MaterialOption;
  kloset: MaterialOption;
  wastafel: MaterialOption;
}

export type RoomPerspective = 'living' | 'bathroom' | 'bedroom' | 'facade';

export interface RoomViewConfig {
  id: RoomPerspective;
  name: string;
  subtitle: string;
  icon: string;
  description?: string;
  applicableCategories: MaterialCategory[];
}

export interface RabVariableItem {
  code: string;
  category: MaterialCategory;
  categoryLabel: string;
  componentName: string;
  brand: string;
  spec: string;
  unit: string;
  volume: number;
  unitPrice: number;
  laborPrice: number;
  subtotal: number;
}
