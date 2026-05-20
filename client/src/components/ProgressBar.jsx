import React from 'react';

const ProgressBar = ({ current, total, className = '' }) => {
  const percentage = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between mb-1.5 text-[10px] font-medium tracking-wider text-gray-500 uppercase">
        <span>{percentage}%</span>
        <span>{current} / {total} pages</span>
      </div>
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#f59e0b] rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
