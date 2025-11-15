import { Tables } from './supabase';

export type Product = Omit<Tables<'products'>, 'category_id'> & {
    category: Tables<'categories'>;
    rating: {
        rate: number;
        count: number;
    }
};

export type Category = Tables<'categories'>;

export type CartItem = Product & {
  quantity: number;
};

export type Profile = Tables<'profiles'>;

export type Order = Omit<Tables<'orders'>, 'user_id'> & {
    order_items: (Omit<Tables<'order_items'>, 'product_id'> & {
        products: Product | null;
    })[]
};

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  featured?: boolean;
}
