import { apiRequest } from "./api-client";
import type { Order, OrderItem, ShippingAddress } from "@/types";

export interface CreateOrderPayload {
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
}

type OrdersResponse = { orders?: Order[]; data?: Order[] };
type OrderResponse = { order?: Order; data?: Order } & Partial<Order>;

export const orderService = {
  create: async (payload: CreateOrderPayload) => {
    const res = await apiRequest<OrderResponse>("/api/orders", { method: "POST", body: payload });
    return (res.order ?? res.data ?? (res as unknown as Order)) as Order;
  },

  list: async () => {
    const res = await apiRequest<OrdersResponse | Order[]>("/api/orders");
    if (Array.isArray(res)) return res;
    return res.orders ?? res.data ?? [];
  },

  getById: async (id: string) => {
    const res = await apiRequest<OrderResponse>(`/api/orders/${id}`);
    return (res.order ?? res.data ?? (res as unknown as Order)) as Order;
  },
};