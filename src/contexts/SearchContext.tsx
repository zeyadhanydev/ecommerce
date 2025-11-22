import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useProductsContext } from './ProductContext';
import { Product } from '../types';

interface SearchContextType {
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredProducts: Product[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { products } = useProductsContext(); // useProductsContext يحتوي على فحص للـ Context

  const filteredProducts = useMemo(() => {
    if (!query) return [];
    
    // تأكد من أن المنتجات مصفوفة قبل التصفية
    if (!Array.isArray(products)) {
        console.error("Products data is not an array in SearchContext.");
        return [];
    }

    // تصفية المنتجات مع معالجة آمنة لـ product.title
    return products.filter(product => {
        if (!product || typeof product.title !== 'string') return false;
        return product.title.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, products]);

  return (
    <SearchContext.Provider value={{ isSearchOpen, setIsSearchOpen, query, setQuery, filteredProducts }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};