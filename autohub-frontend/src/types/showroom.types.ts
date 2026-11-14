export interface AdminShowroomItem {
  id: number;
  code: string;
  name: string;
  provinceId: number;
  provinceName: string;
  region: 'Miền Bắc' | 'Miền Trung' | 'Miền Nam' | string;
  address: string;
  hotline: string;
  openTime?: string;
  closeTime?: string;
  active: boolean;
  staffCount: number;
  demoFleet: number;
  demoFleetReady: number;
  inventoryPhysical: number;
  inventoryReserved: number;
}

export interface DemoCarItem {
  id: number;
  carVersionId: number;
  carModelName: string;
  carVersionName: string;
  licensePlate: string;
  currentOdo: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  status: 'SAN_SANG' | 'DANG_LAI_THU' | 'BAO_DUONG' | string;
  active: boolean;
}

export interface InventoryItem {
  id: number;
  carVersionId: number;
  carModelName: string;
  carVersionName: string;
  colorName: string;
  colorHex: string;
  availableStock: number;
  reservedStock: number;
  totalStock: number;
}

export interface StaffItem {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

export interface AdminShowroomDetail {
  showroom: AdminShowroomItem;
  demoCars: DemoCarItem[];
  inventoryItems: InventoryItem[];
  staffMembers: StaffItem[];
}

export interface AdminShowroomStats {
  totalShowrooms: number;
  activeShowrooms: number;
  inactiveShowrooms: number;
  totalDemoFleet: number;
  readyDemoFleet: number;
  totalPhysicalInventory: number;
  totalReservedInventory: number;
  totalStaff: number;
  regionDistribution: Record<string, number>;
}

export interface ProvinceOption {
  id: number;
  name: string;
  region: string;
  licensePrefixZone?: string;
}

export interface CreateShowroomPayload {
  name: string;
  provinceId: number;
  address: string;
  hotline: string;
  openTime?: string;
  closeTime?: string;
  active?: boolean;
}

export interface UpdateShowroomPayload {
  name?: string;
  provinceId?: number;
  address?: string;
  hotline?: string;
  openTime?: string;
  closeTime?: string;
  active?: boolean;
}

export interface CreateDemoCarPayload {
  carVersionId: number;
  licensePlate: string;
  currentOdo?: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  status?: string;
}
