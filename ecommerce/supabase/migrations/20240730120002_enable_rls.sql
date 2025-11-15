/*
          # [Operation] Enable Row Level Security
          [This script enables Row Level Security (RLS) for all tables that have security policies defined. This is a critical security measure to ensure that users can only access their own data.]

          ## Query Description: [This operation activates the security rules for your database. It ensures that the policies for profiles, orders, and order items are enforced, preventing unauthorized data access. It is a safe and necessary operation.]
          
          ## Metadata:
          - Schema-Category: "Security"
          - Impact-Level: "High"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Tables affected: profiles, orders, order_items, products, categories
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: No (Enables existing policies)
          - Auth Requirements: Enforces existing auth requirements
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: [Low. RLS adds a small overhead to queries, but this is essential for security.]
          */

-- Enable RLS for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS for the orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Enable RLS for the order_items table
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Enable RLS for products (to enforce the public read policy)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Enable RLS for categories (to enforce the public read policy)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
