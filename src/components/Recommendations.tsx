import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Sparkles, Droplets } from 'lucide-react';

interface Recommendation {
  name: string;
  benefit: string;
  image: string;
}

interface RecommendationsProps {
  items: Recommendation[];
}

export const Recommendations: React.FC<RecommendationsProps> = ({ items }) => {
  const getIcon = (keyword: string) => {
    if (keyword.includes('neem')) return <Leaf className="text-[#4C6B5F]" />;
    if (keyword.includes('turmeric')) return <Sparkles className="text-[#C5A059]" />;
    return <Droplets className="text-blue-400" />;
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-4 rounded-2xl bg-[#F9FAF7] border border-[#E5E7EB] flex flex-col items-center text-center group hover:border-[#C5A059] transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3 border border-[#E5E7EB] shadow-sm group-hover:scale-110 transition-transform">
            {getIcon(item.image.toLowerCase())}
          </div>
          <div className="text-xs font-bold text-[#1A1A1A] mb-1">{item.name}</div>
          <div className="text-[9px] uppercase tracking-wider text-[#6B7280] font-bold">{item.benefit}</div>
        </motion.div>
      ))}
    </div>
  );
};
