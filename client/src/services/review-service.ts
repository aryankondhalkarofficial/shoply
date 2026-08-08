import { apiRequest } from "./api-client";
import type { Review } from "@/types";

type ReviewsResponse = { reviews?: Review[]; data?: Review[] };

export const reviewService = {
  listByProduct: async (productId: string) => {
    const res = await apiRequest<ReviewsResponse | Review[]>(`/api/reviews/${productId}`);
    if (Array.isArray(res)) return res;
    return res.reviews ?? res.data ?? [];
  },

  create: (productId: string, payload: { rating: number; comment: string }) =>
    apiRequest<unknown>(`/api/reviews/${productId}`, { method: "POST", body: payload }),
};