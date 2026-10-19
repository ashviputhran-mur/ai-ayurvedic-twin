import React from 'react';
import { motion } from 'motion/react';
import { Stethoscope, Calendar, MessageSquare, Video } from 'lucide-react';

export const DoctorConsultancy: React.FC = () => {
  const doctors = [
    { name: "Dr. Ananya Sharma", specialty: "Senior Ayurvedic Consultant", availability: "Available Now" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Stethoscope className="text-[#C5A059]" size={20} />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Expert Consultancy</h3>
      </div>

      {doctors.map((doc, i) => (
        <div key={i} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#C5A059] border-2 border-white/20 flex items-center justify-center">
              <span className="text-sm font-bold text-[#1E2D24]">AS</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white">{doc.name}</div>
              <div className="text-[11px] opacity-70">{doc.specialty}</div>
            </div>
          </div>
          <p className="text-xs leading-relaxed opacity-90">
            Based on your twin's predictive data, Dr. Sharma suggests a 15-minute consultation regarding your digestion cycle.
          </p>
        </div>
      ))}

      <button className="w-full py-3 bg-[#C5A059] text-[#1E2D24] font-bold rounded-xl text-sm hover:opacity-90 transition-opacity">
        Schedule Video Consult
      </button>
    </div>
  );
};
