import axios from "axios";
import { FakeStoreProduct, Product, Category } from "../types";

// Base URL for Fake Store API
const FAKE_STORE_API_BASE = "https://fakestoreapi.com";

// Create axios instance with default config
const api = axios.create({
  baseURL: FAKE_STORE_API_BASE,
  timeout: 10000, // 10 second timeout
});

// ---------------------------------------------
// HELPER: Error Handler for Axios
// ---------------------------------------------
const handleApiError = (error: unknown, resourceName: string) => {
  let errorMessage = `Failed to fetch ${resourceName}.`;
  if (axios.isAxiosError(error)) {
    if (error.response) {
      errorMessage += ` Status: ${error.response.status}.`;
    } else if (error.request) {
      errorMessage += ` No response received.`;
    } else {
      errorMessage += ` Request setup error.`;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  console.error(`Error fetching ${resourceName}:`, error);
  throw new Error(errorMessage);
};


/**
 * Fetch all products from Fake Store API
 */
export const fetchProducts = async (): Promise<FakeStoreProduct[]> => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

/**
 * Fetch a single product by ID
 */
export const fetchProduct = async (id: number): Promise<FakeStoreProduct> => {
  try {
    const response = await api.get(`/products/${id}`);
    if (!response.data || typeof response.data.id !== 'number') {
      throw new Error(`Product ${id} not found or invalid format.`);
    }
    return response.data;
  } catch (error) {
    handleApiError(error, `product ${id}`);
    throw new Error(`Failed to fetch product ${id}`);
  }
};

/**
 * Fetch all categories from Fake Store API
 */
export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get("/products/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

/**
 * Fetch products by category
 */
export const fetchProductsByCategory = async (
  category: string
): Promise<FakeStoreProduct[]> => {
  try {
    const response = await api.get(`/products/category/${category}`);
    if (!Array.isArray(response.data)) {
      throw new Error(`Products for category ${category} returned invalid data format.`);
    }
    return response.data;
  } catch (error) {
    handleApiError(error, `products for category ${category}`);
    throw new Error(`Failed to fetch products for category ${category}`);
  }
};

/**
 * Transform Fake Store API product to our internal Product type
 */
export const transformFakeStoreProduct = (
  fakeProduct: FakeStoreProduct,
  categories: Category[]
): Product => {
  const categoryObj = categories.find(
    (cat) => cat.name === fakeProduct.category
  );

  return {
    id: fakeProduct.id,
    title: fakeProduct.title,
    price: fakeProduct.price,
    description: fakeProduct.description,
    image: fakeProduct.image,
    rating: fakeProduct.rating,
    category: categoryObj || {
      id: 0,
      name: fakeProduct.category,
      created_at: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
  };
};

/**
 * Transform category names to Category objects with IDs
 */
export const transformCategories = (categoryNames: string[]): Category[] => {
  if (!Array.isArray(categoryNames)) return []; // حماية إضافية
  return categoryNames.map((name, index) => ({
    id: index + 1,
    name,
    created_at: new Date().toISOString(),
  }));
};

/**
 * Fetch and transform all data for the application
 */
export const fetchAllData = async (): Promise<{
  products: Product[];
  categories: Category[];
}> => {
  try {
    // Fetch categories first
    const categoryNames = await fetchCategories();
    const categories = transformCategories(categoryNames);

    // Fetch products
    const fakeProducts = await fetchProducts();
    const products = fakeProducts.map((product) =>
      transformFakeStoreProduct(product, categories)
    );

    return { products, categories };
  } catch (error) {
    console.error("Error fetching all data:", error);
    throw error;
  }
};
