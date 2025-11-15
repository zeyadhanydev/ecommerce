import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Product, Category } from '../types';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Fetching products from Supabase...');

        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(*)
          `);

        if (productsError) {
          console.error('❌ Products fetch error:', productsError);
          throw productsError;
        }

        console.log('✅ Products fetched:', productsData?.length || 0, 'items');

        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*');

        if (categoriesError) {
          console.error('❌ Categories fetch error:', categoriesError);
          throw categoriesError;
        }

        console.log('✅ Categories fetched:', categoriesData?.length || 0, 'items');

        // The rating from the DB is a string, so we need to parse it.
        const parsedProducts = productsData?.map(p => ({
            ...p,
            rating: typeof p.rating === 'string' ? JSON.parse(p.rating) : p.rating,
        })) as Product[] || [];


        setProducts(parsedProducts);
        setCategories(categoriesData || []);

        console.log('✅ Data loaded successfully');

      } catch (err: any) {
        console.error("❌ Error fetching data from Supabase:", err);
        setError(err.message || 'Failed to fetch products or categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <ProductContext.Provider value={{ products, categories, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductsContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductsContext must be used within a ProductProvider');
  }
  return context;
};
