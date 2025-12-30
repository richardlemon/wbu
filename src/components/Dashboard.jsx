import React from 'react';
import RoutineCard from './RoutineCard';
import routines from '../data/routines.json';

const Dashboard = ({ onStartRoutine }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">FlexFlow</h1>
        <p className="text-slate-600 mt-2">Your daily stretching companion.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routines.map((routine) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            onStart={onStartRoutine}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
