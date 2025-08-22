import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color }) => {
  return (
    <div className="glassmorphism rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 flex flex-row items-center space-x-4">
      <div className={`p-3 rounded-full bg-slate-800`}>
         <Icon className={`w-8 h-8 ${color}`} />
      </div>
      <div>
        <p className="text-slate-300 text-sm font-medium">{label}</p>
        <p className={`text-2xl font-bold text-slate-100`}>{value}</p>
      </div>
    </div>
  );
};

export default StatCard;