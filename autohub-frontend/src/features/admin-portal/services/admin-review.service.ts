import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse, PageResponse } from '@/types/api.types';
import type { AdminReview, BatchApproveResponse, ReviewStatus } from '@/types/admin-review.types';

export interface GetReviewsParams {
  status?: ReviewStatus;
  page?: number;
  size?: number;
}

export interface ReviewAiModerationDto {
  reviewId: number;
  displayId: string;
  rating: number;
  comment: string;
  classification: 'CLEAN_POSITIVE' | 'COMPLAINT_VALID' | 'TOXIC_SPAM';
  confidence: number;
  reason: string;
  suggestedAction: 'APPROVE' | 'REJECT' | 'MANUAL_CHECK';
}

export const adminReviewService = {
  async getReviews(params?: GetReviewsParams, signal?: AbortSignal): Promise<PageResponse<AdminReview>> {
    const queryParams: Record<string, string | number> = {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
    };
    if (params?.status) {
      queryParams.status = params.status;
    }
    const res = await axiosClient.get<unknown, ApiResponse<PageResponse<AdminReview>>>(
      API_CONFIG.ENDPOINTS.ADMIN.REVIEWS,
      { params: queryParams, signal }
    );
    return res.data || {
      items: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 1,
      first: true,
      last: true,
    };
  },

  async updateStatus(id: number, status: ReviewStatus): Promise<AdminReview> {
    const res = await axiosClient.put<unknown, ApiResponse<AdminReview>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.REVIEWS}/${id}/status`,
      null,
      { params: { status } }
    );
    return res.data;
  },

  async deleteReview(id: number): Promise<void> {
    await axiosClient.delete(`${API_CONFIG.ENDPOINTS.ADMIN.REVIEWS}/${id}`);
  },

  async batchApprove(reviewIds?: number[]): Promise<BatchApproveResponse> {
    const res = await axiosClient.post<unknown, ApiResponse<BatchApproveResponse>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.REVIEWS}/batch-approve`,
      reviewIds || []
    );
    return res.data;
  },

  async scanPendingReviews(): Promise<ReviewAiModerationDto[]> {
    const res = await axiosClient.post<unknown, ApiResponse<ReviewAiModerationDto[]>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.REVIEWS}/ai-scan-pending`
    );
    return res.data || [];
  },
};
