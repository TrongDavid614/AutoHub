import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';
import type { AdminReview, BatchApproveResponse, ReviewStatus } from '@/types/admin-review.types';

export const adminReviewService = {
  async getReviews(status?: ReviewStatus, signal?: AbortSignal): Promise<AdminReview[]> {
    const params = status ? { status } : {};
    const res = await axiosClient.get<unknown, ApiResponse<AdminReview[]>>(
      API_CONFIG.ENDPOINTS.ADMIN.REVIEWS,
      { params, signal }
    );
    return res.data || [];
  },

  async updateStatus(id: number, status: ReviewStatus): Promise<AdminReview> {
    const res = await axiosClient.put<unknown, ApiResponse<AdminReview>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.REVIEWS}/${id}/status`,
      null,
      { params: { status } }
    );
    return res.data;
  },

  async batchApprove(reviewIds?: number[]): Promise<BatchApproveResponse> {
    const res = await axiosClient.post<unknown, ApiResponse<BatchApproveResponse>>(
      `${API_CONFIG.ENDPOINTS.ADMIN.REVIEWS}/batch-approve`,
      reviewIds || []
    );
    return res.data;
  },
};
