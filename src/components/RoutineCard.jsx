import React from 'react';
import { Clock, Play } from 'lucide-react';

const RoutineCard = ({ routine, onClick }) => {
  const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)} min`;
  };

  return (
    <div
      onClick={() => onClick(routine)}
      className="group relative bg-white border border-stone-200 rounded-[2rem] overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="h-56 w-full overflow-hidden relative">
        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10" />
        <img
          src={routine.image}
          alt={routine.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-800 rounded-full shadow-sm">
                {routine.tag}
            </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
             <h3 className="text-xl font-bold text-slate-900 group-hover:text-sage-dark transition-colors">{routine.name}</h3>
        </div>

        <p className="text-stone-500 text-sm leading-relaxed mb-6 line-clamp-2">{routine.description}</p>

        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
             <div className="flex items-center text-stone-400 text-xs font-medium gap-1.5">
                <Clock className="w-4 h-4" />
                {formatTime(routine.duration + 120)}
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-sage-dark opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                Begin <Play className="w-4 h-4 fill-current" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default RoutineCard;
