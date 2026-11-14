export interface CarBrand {
  id: number;
  name: string;
  logoUrl?: string;
  originCountry?: string;
}

export interface CarModel {
  id: number;
  brandId: number;
  brandName: string;
  modelName: string;
  bodyType?: 'SEDAN' | 'SUV' | 'CROSSOVER' | 'MPV' | 'PICKUP' | 'HATCHBACK' | string;
  segment?: 'A' | 'B' | 'C' | 'D' | 'E' | string;
  releaseYear?: number;
  basePrice?: number;
}

export interface CarColor {
  id: number;
  colorName: string;
  colorCodeHex: string;
  name?: string;
  hex?: string;
}

export interface CarImage {
  id: number;
  imageUrl: string;
  viewType: 'EXTERIOR_360' | 'INTERIOR_360' | 'GALLERY' | 'THUMBNAIL' | string;
  displayOrder: number;
}

export interface CarVariantSibling {
  id: number | string;
  variantName: string;
  tenPhienBan?: string;
  name?: string;
  listedPrice: number;
  giaNiemYet?: number;
  depositPrice?: number;
  mucTienCoc?: number;
  depositAmount?: number;
  transmission?: string;
  hopSo?: string;
  fuelType?: string;
  loaiNhienLieu?: string;
  rangeKm?: number;
  tamHoatDongKm?: number;
  desc?: string;
  badge?: string;
  isCurrent?: boolean;
}

export interface CarVariant {
  id: number;
  modelId: number;
  variantName: string;
  engineSpecs?: string;
  horsepower?: number;
  transmission?: 'AUTOMATIC' | 'MANUAL' | 'CVT' | 'DUAL_CLUTCH' | string;
  fuelType?: 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID' | string;
  listedPrice: number;
  depositPrice: number;
  colors?: CarColor[];
  images?: CarImage[];
  variants?: CarVariantSibling[];
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

export interface AdminCarMasterItem {
  id: string; // VF8-01, VF9-01, STF-01, CRV-01
  variantId: number;
  modelId: number;
  brandId: number;
  brandName: string;
  name: string; // VinFast VF8
  version: string; // Plus AWD (402 HP)
  segment: string; // D-SUV • Thuần Điện
  bodySegment?: string;
  powertrain?: string;
  price: string; // 1.499.000.000 ₫
  rawPrice?: number;
  deposit: string; // 20.000.000 ₫
  rawDeposit?: number;
  demoCount: string; // 3 Xe sẵn sàng
  demoCountNumber?: number;
  vectorStatus: string; // Đã Đồng Bộ Vector (18ms)
  isVectorSynced?: boolean;
  vectorLatencyMs?: number;
  lastVectorSyncAt?: string;
  status: string; // Đang mở bán, Ngừng kinh doanh
  active: boolean;
  releaseYear?: number;
  transmission?: string;
  seats?: number;
  tamHoatDongKm?: number;
  dungLuongPinKwh?: number;
  thongSoKyThuat?: string;
  imageUrl?: string;
}

export interface CreateCarMasterPayload {
  brandId?: number;
  brandName?: string;
  modelId?: number;
  modelName?: string;
  segment?: string;
  origin?: string;
  versionName: string;
  releaseYear?: number;
  transmission?: string;
  fuelType?: string;
  seats?: number;
  price: number;
  deposit: number;
  tamHoatDongKm?: number;
  dungLuongPinKwh?: number;
  specs?: string;
  imageUrl?: string;
  demoCount?: number;
}

export interface UpdateCarMasterPayload {
  modelName?: string;
  segment?: string;
  versionName?: string;
  releaseYear?: number;
  transmission?: string;
  fuelType?: string;
  seats?: number;
  price?: number;
  deposit?: number;
  tamHoatDongKm?: number;
  dungLuongPinKwh?: number;
  specs?: string;
  active?: boolean;
  imageUrl?: string;
}

export interface VectorSyncResult {
  totalSynced: number;
  latencyMs: number;
  syncedAt: string;
  message: string;
}
