import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product, Category } from "../types";
import { fetchAllData } from "../lib/api";

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
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔄 Fetching data from Fake Store API...");

        // استخدم try-catch هنا لضمان معالجة أي خطأ في fetchAllData
        const result = await fetchAllData();
        const fetchedProducts = result.products;
        const fetchedCategories = result.categories;

        // التحقق من نوعية البيانات المسترجعة
        if (!Array.isArray(fetchedProducts) || !Array.isArray(fetchedCategories)) {
          throw new Error('API returned malformed data (not arrays).');
        }

        setProducts(fetchedProducts);
        setCategories(fetchedCategories);

        console.log("✅ Data loaded successfully from Fake Store API");
        console.log(
          `📦 Products: ${products.length}, 📂 Categories: ${categories.length}`
        );
      } catch (err: any) {
        // معالجة الخطأ
        const errorMessage = err.message || 'Failed to fetch products or categories from Fake Store API. Check network and API status.';
        console.error("❌ Error fetching data from Fake Store API:", err);
        setError(
          err.message ||
          "Failed to fetch products or categories from Fake Store API."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
    throw new Error("useProductsContext must be used within a ProductProvider");
  }
  return context;
};
