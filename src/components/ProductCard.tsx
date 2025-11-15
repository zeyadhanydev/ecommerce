import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/products/${product.id}`} className="flex flex-col items-center text-center">
        <div className="bg-brand-gray-light w-full aspect-square overflow-hidden mb-4">
          <img 
            src={product.image || ''} 
            alt={product.title} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="text-base font-medium uppercase text-brand-black mb-1 h-12 overflow-hidden">{product.title}</h3>
        <p className="text-base font-semibold text-brand-black">€{product.price.toFixed(2)}</p>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
