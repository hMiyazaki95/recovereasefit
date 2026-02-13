// TypeScript types for the e-commerce application

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stripe_price_id: string;
  stock_quantity: number;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  stripe_checkout_id: string;
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
}

export interface CheckoutSessionRequest {
  items: {
    product_id: string;
    quantity: number;
  }[];
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}
