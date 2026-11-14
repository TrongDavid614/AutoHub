export interface AccessoryCategory {
  id: number;
  categoryName: string;
  slug: string;
  count?: number;
}

export interface AccessoryCompatibility {
  carModelId: number;
  carModelName: string;
  manufactureYearStart: number;
  manufactureYearEnd: number;
  note?: string;
}

export interface AccessoryReview {
  id: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Accessory {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryBadge?: string;
  name: string;
  sku: string;
  brand: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  thumbnailUrl: string;
  imageUrl?: string;
  images: string[];
  galleryUrls?: string[];
  description: string;
  installationGuide?: string;
  specifications: Record<string, string>;
  specPills?: string[];
  tags?: string[];
  compatibilities: AccessoryCompatibility[];
  compatibility?: AccessoryCompatibility[];
  reviews?: AccessoryReview[];
  rating?: number;
  reviewCount?: number;
  isActive: boolean;
  readyInShowroom?: boolean;
  homeInstallation?: boolean;
  isGenuine?: boolean;
  warrantyYears?: number;
  dungChung?: boolean;
  isUniversal?: boolean;
}

export interface AccessoryFilterParams {
  categoryId?: number;
  carModelId?: number;
  year?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  readyInShowroom?: boolean;
  homeInstallation?: boolean;
  isGenuine?: boolean;
  warrantyYears?: number;
  sortBy?: 'popular' | 'price-asc' | 'price-desc' | 'newest';
}
