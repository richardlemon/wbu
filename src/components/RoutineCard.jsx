import React from 'react';
import { Play } from 'lucide-react';

const RoutineCard = ({ routine, onStart }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
            <h3 className="text-xl font-bold text-slate-900">{routine.name}</h3>
            <p className="text-slate-500 mt-1">{routine.description}</p>
        </div>
        <span className="text-sm font-medium bg-stone-100 text-slate-600 px-3 py-1 rounded-full">
            {Math.floor(routine.duration / 60)} min
        </span>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex -space-x-2">
            {routine.exercises.slice(0, 3).map((ex, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-stone-200 border-2 border-white overflow-hidden" title={ex.name}>
                    {/* Placeholder for small exercise preview */}
                    <div className="w-full h-full bg-sage opacity-50"></div>
                </div>
            ))}
            {routine.exercises.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-stone-100 border-2 border-white flex items-center justify-center text-xs text-slate-500">
                    +{routine.exercises.length - 3}
                </div>
            )}
        </div>

        <button
            onClick={() => onStart(routine)}
            className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-colors"
        >
            <Play size={16} fill="currentColor" />
            <span>Start</span>
        </button>
      </div>
    </div>
  );
};

export default RoutineCard;
