import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase';
import { ShoppingBag, Star, Info, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  ingredients: string[];
  remedies: string[];
  category: string;
}

export const ProductCatalog: React.FC<{ recommendedRemedies?: string[] }> = ({ recommendedRemedies = [] }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });
    return () => unsubscribe();
  }, []);

  const categories = ['All', 'Skin Care', 'Digestion', 'Immunity'];
  const filteredProducts = filter === 'All' ? products : products.filter(p => p.category === filter);

  if (loading) return <div className="p-8 text-center text-sm font-mono text-[#6B7280]">Loading Products...</div>;

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
              filter === cat 
                ? "bg-[#1E2D24] text-white" 
                : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#C5A059]"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommended Section */}
      {recommendedRemedies.length > 0 && (
        <div className="p-6 bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <Star className="text-[#C5A059]" size={20} fill="currentColor" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#1E2D24]">AI Recommended for You</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.filter(p => p.remedies.some(r => recommendedRemedies.includes(r))).map(product => (
              <ProductCard key={product.id} product={product} isRecommended />
            ))}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product, isRecommended?: boolean }> = ({ product, isRecommended }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="tech-card group"
  >
    <div className="relative aspect-square mb-4 bg-[#F9FAF7] rounded-2xl overflow-hidden border border-[#E5E7EB] flex items-center justify-center">
      <ShoppingBag className="text-[#E5E7EB] group-hover:text-[#C5A059] transition-colors" size={48} />
      {product.stock < 5 && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-[8px] font-bold uppercase rounded-full">
          Low Stock
        </div>
      )}
    </div>
    
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-[#1E2D24] text-sm">{product.name}</h4>
        <span className="font-mono text-sm font-bold text-[#4C6B5F]">${product.price.toFixed(2)}</span>
      </div>
      <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
        {product.description || "Traditional Ayurvedic formulation for holistic wellness."}
      </p>
      
      <div className="pt-4 flex items-center justify-between">
        <button className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] flex items-center gap-1 hover:gap-2 transition-all">
          View Details <ChevronRight size={12} />
        </button>
        <button 
          disabled={product.stock === 0}
          className="p-2 rounded-xl bg-[#1E2D24] text-white hover:bg-[#4C6B5F] transition-colors disabled:opacity-50"
        >
          <ShoppingBag size={16} />
        </button>
      </div>
    </div>
  </motion.div>
);

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
