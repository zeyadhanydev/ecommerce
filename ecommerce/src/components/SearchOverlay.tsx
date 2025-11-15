import React, { useEffect } from 'react';
import { useSearch } from '../contexts/SearchContext';
import { X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const SearchOverlay = () => {
  const { isSearchOpen, setIsSearchOpen, query, setQuery, filteredProducts } = useSearch();

  useEffect(() => {
    // Reset query when overlay is closed
    if (!isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen, setQuery]);

  const handleClose = () => {
    setIsSearchOpen(false);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-brand-white z-50 flex flex-col"
        >
          <header className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-24 border-b border-brand-gray">
            <div className="flex items-center w-full gap-4">
              <Search className="h-6 w-6 text-brand-black/50" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full text-lg bg-transparent focus:outline-none"
                autoFocus
              />
              <button onClick={handleClose} className="text-brand-black">
                <X className="h-8 w-8" />
              </button>
            </div>
          </header>

          <main className="flex-grow overflow-y-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {query && filteredProducts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {filteredProducts.map(product => (
                    <Link to={`/products/${product.id}`} key={product.id} onClick={handleClose} className="group">
                      <div className="flex flex-col items-start text-left">
                        <div className="bg-brand-gray-light w-full aspect-square overflow-hidden mb-4">
                          <img 
                            src={product.image} 
                            alt={product.title} 
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="text-sm font-medium uppercase text-brand-black mb-1">{product.title}</h3>
                        <p className="text-sm font-semibold text-brand-black">€{product.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {query && filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-lg text-brand-black/70">No results found for "{query}"</p>
                </div>
              )}
              {!query && (
                 <div className="text-center py-20">
                    <p className="text-lg text-brand-black/70">Start typing to find your favorite coffee.</p>
                </div>
              )}
            </div>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
