export interface User {
  _id: string;
  name: string;
  email: string;
  address?: string;
  city?: string;
  postalCode?: string;
  state?: string;
  country?: string;
  createdAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  brand?: string;
  image?: string;
  images?: string[];
  countInStock?: number;
  ratings?: number;
  numReviews?: number;
}

export interface Pagination {
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination: Pagination;
}

export interface CartItem {
  _id?: string;
  product: Product | string;
  quantity: number;
  price?: number;
}

export interface Cart {
  _id?: string;
  user?: string;
  items: CartItem[];
  totalPrice?: number;
}

export interface OrderItem {
  product?: string;
  name: string;
  image?: string;
  /** Backend order schema stores the unit price as `amount`. */
  amount: number;
  /** Legacy/compat field — older orders may still carry `price`. */
  price?: number;
  quantity: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  state?: string | undefined;
  country: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status?: string;
  isPaid?: boolean;
  createdAt?: string;
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  user?: { _id: string; name: string } | string;
  createdAt?: string;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}
