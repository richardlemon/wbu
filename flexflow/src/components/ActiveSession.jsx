import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import { ChevronRight, X } from 'lucide-react';

const ActiveSession = ({ routine, onExit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [exercises, setExercises] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Append Savasana to the routine exercises
    const savasana = {
      name: "Savasana",
      duration: 120, // 2 minutes
      image: "https://dummyimage.com/400x300/e2e8f0/0f172a&text=Savasana"
    };
    setExercises([...routine.exercises, savasana]);
  }, [routine]);

  const handleNext = () => {
    if (currentStep < exercises.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Session Complete
      onExit();
    }
  };

  const handleTimerComplete = () => {
      handleNext();
  };

  if (exercises.length === 0) return <div>Loading...</div>;

  const currentExercise = exercises[currentStep];
  const nextExercise = currentStep < exercises.length - 1 ? exercises[currentStep + 1] : null;

  return (
    <div className="fixed inset-0 bg-stone-50 z-50 flex flex-col items-center justify-between p-6">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-900">{routine.name}</h2>
        <button onClick={onExit} className="p-2 bg-stone-200 rounded-full text-slate-700 hover:bg-stone-300">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        <div className="mb-8 w-full">
            <img
                src={currentExercise.image}
                alt={currentExercise.name}
                className="w-full h-64 object-cover rounded-2xl shadow-lg mb-6"
            />
            <h1 className="text-3xl font-bold text-slate-900 text-center mb-2">{currentExercise.name}</h1>
        </div>

        <Timer
            duration={currentExercise.duration}
            onComplete={handleTimerComplete}
            isActive={!isPaused}
        />

        <button
            onClick={() => setIsPaused(!isPaused)}
            className="mt-8 px-8 py-3 bg-sage text-white font-semibold rounded-full shadow hover:bg-sage-dark transition-colors"
        >
            {isPaused ? "Resume" : "Pause"}
        </button>
      </div>

      <div className="w-full max-w-md mt-6 p-4 bg-white rounded-xl shadow-sm border border-stone-200">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500 uppercase tracking-wide">Up Next</p>
                <p className="text-lg font-medium text-slate-900">
                    {nextExercise ? nextExercise.name : "Session Complete"}
                </p>
            </div>
             {nextExercise && <ChevronRight className="text-slate-400" />}
        </div>
      </div>
    </div>
  );
};

export default ActiveSession;
