export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdminReview {
  id: number;
  displayId: string;
  userId?: number;
  customer: string;
  accessoryId?: number;
  product: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  submittedAt: string;
  status: ReviewStatus;
  flaggedToxic?: boolean;
  moderationNote?: string;
  accessoryAverageRating?: number;
  accessoryReviewCount?: number;
}

export interface BatchApproveResponse {
  approvedCount: number;
}
