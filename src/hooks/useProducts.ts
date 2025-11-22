import { useState, useEffect } from 'react';
import { Product } from '../types';
import { useProductsContext } from '../contexts/ProductContext';
import { fetchProduct, transformFakeStoreProduct } from '../lib/api';

// No changes needed for useProducts, as it relies on useProductsContext which is now hardened.
export function useProducts() {
  return useProductsContext();
}

export function useProduct(id: string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { products, categories, error: contextError, loading: contextLoading } = useProductsContext();
  
    useEffect(() => {
      // التحقق من id
      const productId = parseInt(id);
      if (isNaN(productId) || productId <= 0) {
        setLoading(false);
        setError("Invalid product ID.");
        return;
      }
      if (contextLoading) return; // انتظر تحميل السياق أولاً

      const findProduct = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // 1. Try to find the product in the context (already loaded products)
          const existingProduct = products.find(p => p.id === productId);
          
          if (existingProduct) {
            setProduct(existingProduct);
          } else {
            // 2. If not found in context, fetch from API
            console.log(`🔄 Fetching product ${id} from Fake Store API...`);
            // تأكد من أن الـ categories متاحة قبل التحويل
            if (categories.length === 0 && contextError) {
              throw new Error(`Cannot fetch product details. Categories failed to load: ${contextError}`);
            }

            const fakeStoreProduct = await fetchProduct(productId);
            // تحويل المنتج
            const transformedProduct = transformFakeStoreProduct(fakeStoreProduct, categories);
            
            // تحقق من تحويل المنتج بنجاح
            if (!transformedProduct || transformedProduct.id !== productId) {
                throw new Error(`Failed to transform product ${productId} data.`);
            }

            setProduct(transformedProduct);
            console.log(`✅ Product ${id} fetched successfully`);
          }

        } catch (err: any) {
          const errorMessage = err.message || `Failed to fetch product ${id}.`;
          console.error(`❌ Error fetching product ${id}:`, err);
          setError(errorMessage);
          setProduct(null);
        } finally {
          setLoading(false);
        }
      };
  
      findProduct();
    }, [id, products, categories, contextLoading, contextError]);
  
    // عند وجود خطأ في السياق بأكمله، يجب عكس ذلك
    if (!loading && contextError) {
        return { product: null, loading: false, error: contextError };
    }

    return { product, loading, error };
}