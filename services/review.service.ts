import api from "@/lib/axios";
import type { Review, ApiResponse, PaginatedResponse } from "@/types";

interface ReviewMeta {
  page:       number;
  limit:      number;
  total:      number;
  totalPages: number;
  avgRating:  number;
}

interface ReviewsResponse {
  success: boolean;
  data:    Review[];
  meta:    ReviewMeta;
}

export const reviewService = {
  // Get reviews for a job (public)
  async getByJob(
    jobId:  string,
    params?: { page?: number; limit?: number }
  ): Promise<ReviewsResponse> {
    const { data } = await api.get<ReviewsResponse>(
      `/reviews/job/${jobId}`,
      { params }
    );
    return data;
  },

  // Create review (USER)
  async create(dto: {
    jobId:   string;
    rating:  number;
    comment: string;
  }): Promise<Review> {
    const { data } = await api.post<ApiResponse<{ review: Review }>>(
      "/reviews",
      dto
    );
    return data.data.review;
  },

  // Update own review (USER)
  async update(
    id:  string,
    dto: { rating?: number; comment?: string }
  ): Promise<Review> {
    const { data } = await api.patch<ApiResponse<{ review: Review }>>(
      `/reviews/${id}`,
      dto
    );
    return data.data.review;
  },

  //  Delete review (own or ADMIN) 
  async delete(id: string): Promise<void> {
    await api.delete(`/reviews/${id}`);
  },
};