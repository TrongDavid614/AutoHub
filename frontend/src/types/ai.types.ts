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

export interface AiChatMessage {
  id: string;
  sender: AiMessageSender;
  senderTitle: string;
  timestamp: string;
  avatarText?: string;
  content: string;
  functionCall?: AiFunctionCallNotification;
  rationale?: string;
  recommendedVehicle?: AiRecommendedVehicle;
  recommendedAccessory?: AiRecommendedAccessory;
  suggestedPrompts?: string[];
}
