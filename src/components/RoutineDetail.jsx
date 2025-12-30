import React from 'react';
import { ArrowLeft, Clock, Activity, Play } from 'lucide-react';

const RoutineDetail = ({ routine, onBack, onStart }) => {
  const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)} min`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-72 md:h-96 w-full">
        <img
          src={routine.image}
          alt={routine.name}
          className="w-full h-full object-cover rounded-b-[2rem]"
        />
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-foreground hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to routines
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent rounded-b-[2rem]">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white mb-2 border border-white/20">
                {routine.tag}
            </span>
            <h1 className="text-3xl font-bold text-white mb-2">{routine.name}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6 max-w-2xl mx-auto w-full">

        {/* Stats */}
        <div className="flex items-center gap-6 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatTime(routine.duration + 120)}</span> {/* Added Savasana time */}
            </div>
            <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>{routine.exercises.length + 1} exercises</span>
            </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed">
            {routine.description}
        </p>

        {/* Action Button */}
        <button
            onClick={() => onStart(routine)}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
            <Play className="w-5 h-5 fill-current" />
            Start Routine
        </button>

        {/* Exercises List */}
        <div className="space-y-4 pt-4">
            <h3 className="font-semibold text-foreground">Exercises</h3>
            {routine.exercises.map((exercise, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white border border-border rounded-xl">
                    <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-sm font-medium text-muted-foreground">
                        {index + 1}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-foreground">{exercise.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{exercise.description}</p>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                        {Math.floor(exercise.duration / 60) > 0 ? `${Math.floor(exercise.duration / 60)}m ` : ''}
                        {exercise.duration % 60}s
                    </div>
                </div>
            ))}
             {/* Savasana Item */}
             <div className="flex items-start gap-4 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-medium text-primary-foreground">
                        {routine.exercises.length + 1}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-foreground">Savasana</h4>
                        <p className="text-sm text-muted-foreground mt-1">Final relaxation to absorb the practice.</p>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                        2m 0s
                    </div>
                </div>
        </div>
      </div>
    </div>
  );
};

export default RoutineDetail;
