import api from './api';

export interface Review {
  id: number;
  rating: number;
  title: string;
  comment: string;
  createdDate: string;
  userFirstName: string;
  userLastName: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  totalReviews: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  title: string;
  comment: string;
}

export interface UpdateReviewRequest {
  rating: number;
  title: string;
  comment: string;
}

class ReviewService {
  async getProductReviews(productId: number, page: number = 1, pageSize: number = 10): Promise<ReviewsResponse> {
    const response = await api.get(`/reviews/product/${productId}?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }

  async createReview(review: CreateReviewRequest): Promise<void> {
    await api.post('/reviews', review);
  }

  async updateReview(reviewId: number, review: UpdateReviewRequest): Promise<void> {
    await api.put(`/reviews/${reviewId}`, review);
  }

  async deleteReview(reviewId: number): Promise<void> {
    await api.delete(`/reviews/${reviewId}`);
  }

  async getUserReviews(page: number = 1, pageSize: number = 10): Promise<ReviewsResponse> {
    const response = await api.get(`/reviews/user?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }
}

export const reviewService = new ReviewService(); 