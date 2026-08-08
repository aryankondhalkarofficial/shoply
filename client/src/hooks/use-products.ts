import { queryOptions, useQuery } from "@tanstack/react-query";

import { productService } from "@/services/product-service";
import type { ProductQuery } from "@/types";

export const productsQueryOptions = (query: ProductQuery) =>
  queryOptions({
    queryKey: ["products", query],
    queryFn: () => productService.list(query),
    staleTime: 30_000,
  });

export const productQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["product", id],
    queryFn: () => productService.getById(id),
    enabled: Boolean(id),
  });

export function useProducts(query: ProductQuery) {
  return useQuery(productsQueryOptions(query));
}

export function useProduct(id: string) {
  return useQuery(productQueryOptions(id));
}