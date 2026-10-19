import React from 'react';
import { motion } from 'motion/react';

interface DoshaChartProps {
  data: {
    vata: number;
    pitta: number;
    kapha: number;
  };
}

export const DoshaChart: React.FC<DoshaChartProps> = ({ data }) => {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        {[
          { label: 'Vata (Energy)', value: data.vata, color: '#C5A059' },
          { label: 'Pitta (Metabolism)', value: data.pitta, color: '#4C6B5F' },
          { label: 'Kapha (Structure)', value: data.kapha, color: '#CBD5E0' },
        ].map((dosha, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span>{dosha.label}</span>
              <span className="font-bold">{dosha.value}%</span>
            </div>
            <div className="h-1.5 bg-[#EDF2F7] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dosha.value}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: dosha.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
