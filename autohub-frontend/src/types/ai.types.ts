export type AiMessageSender = 'AI' | 'USER';

export interface AiFunctionCallNotification {
  querySegment: string;
  priceRange: string;
  matchPercentage: number;
}

export interface AiRecommendedVehicle {
  variantId: number;
  modelId: number;
  name: string;
  badge: string;
  categoryBadge: string;
  availabilityBadge: string;
  flagshipLabel: string;
  listedPrice: number;
  priceNote: string;
  imageUrl: string;
  acceleration0100: string;
  rangeKm: number;
  interior: string;
  seats: string;
  safetyRating: string;
  safetyOrg: string;
  deliveryTime: string;
  depositAmount: number;
}

export interface AiRecommendedAccessory {
  accessoryId: number;
  matchPercentage: number;
  badgeTitle: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  sku: string;
  imageUrl?: string;
}

export type UiBlockType =
  | 'CAR_CARD'
  | 'ROLLOUT_TABLE'
  | 'INVENTORY_CARD'
  | 'ACCESSORY_LIST'
  | 'DEPOSIT_POLICY'
  | 'NONE';

export interface RolloutFeeData {
  tenPhienBan: string;
  tinhThanh: string;
  giaNiemYet: number;
  isElectric: boolean;
  tyLePhiTruocBa: number;
  phiTruocBa: number;
  phiCapBienSo: number;
  phiDangKiem: number;
  phiBaoTriDuongBo: number;
  phiBaoHiemTNDS: number;
  tongChiPhiLanBanh: number;
  ghiChuChinhSach?: string;
}

export interface InventoryStockDetail {
  tenPhienBan: string;
  mauSac: string;
  tenShowroom: string;
  diaChiShowroom: string;
  soLuongKhaDung: number;
  soLuongDangGiuCho?: number;
  trangThaiGiao: string;
}

export interface AiChatMessage {
  id: string;
  sender: AiMessageSender;
  senderTitle: string;
  timestamp: string;
  avatarText?: string;
  content: string;
  uiBlockType?: UiBlockType;
  rolloutFeeData?: RolloutFeeData;
  inventoryData?: InventoryStockDetail[];
  functionCall?: AiFunctionCallNotification;
  rationale?: string;
  recommendedVehicle?: AiRecommendedVehicle;
  recommendedAccessory?: AiRecommendedAccessory;
  suggestedPrompts?: string[];
}

export interface AiChatPayload {
  prompt: string;
  consultationId?: number;
  contextCarId?: number;
  contextCarName?: string;
}
