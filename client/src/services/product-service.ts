import { apiRequest, buildQueryString } from "./api-client";
import type { Product, ProductQuery, ProductsResponse } from "@/types";

type SingleProductResponse = { product?: Product; data?: Product } & Partial<Product>;

export const productService = {
  list: (query: ProductQuery = {}) =>
    apiRequest<ProductsResponse>(
      `/api/products${buildQueryString({
        page: query.page ?? 1,
        limit: query.limit ?? 6,
        category: query.category ?? "",
        search: query.search ?? "",
        minPrice: query.minPrice ?? "",
        maxPrice: query.maxPrice ?? "",
        sort: query.sort ?? "",
      })}`,
    ),

  getById: async (id: string) => {
    const res = await apiRequest<SingleProductResponse>(`/api/products/${id}`);
    return (res.product ?? res.data ?? (res as unknown as Product)) as Product;
  },
};