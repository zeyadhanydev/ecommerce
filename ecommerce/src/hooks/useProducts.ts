import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Product } from '../types';
import { useProductsContext } from '../contexts/ProductContext';

export function useProducts() {
  return useProductsContext();
}

export function useProduct(id: string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      if (!id) return;

      const fetchProduct = async () => {
        try {
          setLoading(true);
          const { data, error: productError } = await supabase
            .from('products')
            .select(`
                *,
                category:categories(*)
            `)
            .eq('id', id)
            .single();

          if (productError) throw productError;
          
          const parsedProduct = {
              ...data,
              rating: typeof data.rating === 'string' ? JSON.parse(data.rating) : data.rating,
          } as Product;

          setProduct(parsedProduct);

        } catch (err: any) {
          setError('Failed to fetch product.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchProduct();
    }, [id]);
  
    return { product, loading, error };
  }
