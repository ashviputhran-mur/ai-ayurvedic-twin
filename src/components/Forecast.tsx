import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, AlertCircle, TrendingUp } from 'lucide-react';

interface ForecastProps {
  current: string;
  future: string;
  prediction: string;
}

export const Forecast: React.FC<ForecastProps> = ({ current, future, prediction }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 p-4 rounded-xl bg-[#F9FAF7] border border-[#E5E7EB] relative overflow-hidden group">
          <div className="text-[10px] uppercase tracking-widest text-[#6B7280] font-bold mb-1">Current State</div>
          <div className="text-lg font-bold text-[#1E2D24]">{current}</div>
        </div>
        
        <div className="text-[#C5A059]">
          <ArrowRight size={18} />
        </div>

        <div className="flex-1 p-4 rounded-xl bg-[#F9FAF7] border border-[#E5E7EB] relative overflow-hidden group">
          <div className="text-[10px] uppercase tracking-widest text-[#6B7280] font-bold mb-1">Future Prediction</div>
          <div className="text-lg font-bold text-[#4C6B5F]">{future}</div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#4C6B5F]/5 border border-[#4C6B5F]/10">
        <div className="text-[10px] uppercase tracking-widest text-[#4C6B5F] font-bold mb-2">AI Insights</div>
        <p className="text-sm text-[#1A1A1A] leading-relaxed italic">
          "{prediction}"
        </p>
      </div>
    </div>
  );
};
