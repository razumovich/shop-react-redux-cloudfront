import { Product } from "~/models/Product";

export type CartResponse = {
  data: {
    cart: Cart;
  }
}

export type Cart = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  status: 'OPEN' | 'ORDERED';
  items: Array<{
    id: string;
    cart_id: string;
    product_id: string;
    count: number;
  }>
}

export type CartItem = {
  id?: string;
  cartId?: string;
  product: Product;
  count: number;
};
