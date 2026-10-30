export interface CarBrand {
  id: number;
  name: string;
  logoUrl: string;
  originCountry: string;
}

export interface CarModel {
  id: number;
  brandId: number;
  brandName: string;
  modelName: string;
  bodyType: 'SEDAN' | 'SUV' | 'CROSSOVER' | 'MPV' | 'PICKUP' | 'HATCHBACK';
  segment: 'A' | 'B' | 'C' | 'D' | 'E';
  releaseYear: number;
  basePrice: number;
}

export interface CarColor {
  id: number;
  colorName: string;
  colorCodeHex: string;
}

export interface CarImage {
  id: number;
  imageUrl: string;
  viewType: 'EXTERIOR_360' | 'INTERIOR_360' | 'GALLERY' | 'THUMBNAIL';
  displayOrder: number;
}

export interface CarVariant {
  id: number;
  modelId: number;
  variantName: string;
  engineSpecs: string;
  horsepower: number;
  transmission: 'AUTOMATIC' | 'MANUAL' | 'CVT' | 'DUAL_CLUTCH';
  fuelType: 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  listedPrice: number;
  depositPrice: number;
  colors: CarColor[];
  images: CarImage[];
}

export interface CarInventory {
  vinNumber: string;
  variantId: number;
  colorId: number;
  showroomLocation: string;
  status: 'IN_STOCK' | 'RESERVED_FOR_DEPOSIT' | 'SOLD';
}

export interface CarDemo {
  id: number;
  plateNumber: string;
  variantId: number;
  colorId: number;
  showroomLocation: string;
  status: 'AVAILABLE' | 'ON_TEST_DRIVING' | 'MAINTENANCE';
}

export interface CarFilterParams {
  brandId?: number;
  bodyType?: string;
  segment?: string;
  minPrice?: number;
  maxPrice?: number;
  fuelType?: string;
  transmission?: string;
}
