import React, { useState, useEffect, useRef } from 'react';
import { speak } from '../utils/voice';
import { Pause, Play, X, SkipForward, Volume2, VolumeX, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ActiveSession = ({ routine, onComplete, onExit }) => {
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const initialTimeRef = useRef(null);

  useEffect(() => {
    // Add Savasana to the end of the routine
    const routineWithSavasana = [
      ...routine.exercises,
      {
        name: "Savasana",
        duration: 120, // 2 minutes
        image: "https://images.unsplash.com/photo-1544367563-12123d8959bd?auto=format&fit=crop&q=80&w=1000",
        description: "Lie flat on your back, arms by your side, palms facing up. Close your eyes and surrender to the earth."
      }
    ];
    setExercises(routineWithSavasana);

    // Initialize first exercise
    if (routineWithSavasana.length > 0) {
      setTimeLeft(routineWithSavasana[0].duration);
      initialTimeRef.current = routineWithSavasana[0].duration;
      setIsActive(true);
    }

    return () => clearInterval(timerRef.current);
  }, [routine]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
           if (prev <= 1) {
               handleNextExercise();
               return 0;
           }
           return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, currentIndex, exercises]);

  // Voice Cues
  useEffect(() => {
    if (isMuted) return;

    if (timeLeft === 30) {
      speak("Nog 30 seconden te gaan");
    }
    if (timeLeft === 10) {
       speak("Nog 10");
    }
    if (timeLeft <= 3 && timeLeft > 0) {
        speak(timeLeft.toString());
    }
  }, [timeLeft, isMuted]);

  // Announce exercise name on start
  useEffect(() => {
      if (exercises.length > 0 && exercises[currentIndex] && !isMuted) {
          speak(`Begin met ${exercises[currentIndex].name}`);
      }
  }, [currentIndex, exercises, isMuted]);


  const handleNextExercise = () => {
    clearInterval(timerRef.current);
    if (currentIndex < exercises.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setTimeLeft(exercises[nextIndex].duration);
      initialTimeRef.current = exercises[nextIndex].duration;
      setIsActive(true);
    } else {
      setIsActive(false);
      onComplete();
    }
  };

  const togglePause = () => {
    setIsActive(!isActive);
  };

  const toggleMute = () => {
      setIsMuted(!isMuted);
  };

  const currentExercise = exercises[currentIndex];
  const nextExercise = exercises[currentIndex + 1];

  if (!currentExercise) return <div>Loading...</div>;

  const progress = ((initialTimeRef.current - timeLeft) / initialTimeRef.current) * 100;
  const radius = 160; // Increased radius for visibility
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col h-screen bg-background relative overflow-hidden"
    >
        {/* Background Image with Blur */}
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-stone-50/90 backdrop-blur-3xl z-10" />
             <img
                src={currentExercise.image}
                className="w-full h-full object-cover opacity-20"
                alt="bg"
            />
        </div>

      {/* Header */}
      <div className="flex items-center justify-between p-6 z-20 relative">
        <button onClick={onExit} className="p-3 bg-white border border-stone-200 rounded-full hover:bg-stone-50 transition-colors shadow-sm">
            <X className="w-5 h-5 text-slate-700" />
        </button>
        <div className="flex flex-col items-center">
             <span className="text-xs font-bold tracking-widest uppercase text-sage-dark mb-1">
                 Exercise {currentIndex + 1} of {exercises.length}
             </span>
             <h2 className="text-sm font-medium text-stone-500">{routine.name}</h2>
        </div>
        <button onClick={toggleMute} className="p-3 bg-white border border-stone-200 rounded-full hover:bg-stone-50 transition-colors shadow-sm">
            {isMuted ? <VolumeX className="w-5 h-5 text-slate-700" /> : <Volume2 className="w-5 h-5 text-slate-700" />}
        </button>
      </div>

      {/* Main Content: Centered Image and Timer Below */}
      <div className="flex-1 flex flex-col items-center justify-center z-20 relative px-6 space-y-8">

        {/* Centered Image Card */}
        <motion.div
            key={currentExercise.image}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white"
        >
             <img
                src={currentExercise.image}
                className="w-full h-full object-cover"
                alt={currentExercise.name}
            />
        </motion.div>

        {/* Circular Timer Below Image */}
        <div className="relative">
            <svg
                height={radius * 2}
                width={radius * 2}
                className="rotate-[-90deg] drop-shadow-xl"
                >
                <circle
                    stroke="#E7E5E4"
                    strokeWidth={stroke}
                    fill="white"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke="#9CAF88" // Sage Green
                    strokeWidth={stroke + 2}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear' }}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <h1 className="text-2xl font-bold text-slate-900 mb-1 text-center px-4 max-w-[80%] line-clamp-1">{currentExercise.name}</h1>
                <span className="text-6xl font-light text-slate-800 tabular-nums tracking-tight">
                    {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </span>

                {/* Controls Inside Timer */}
                 <button
                    onClick={togglePause}
                    className="mt-4 w-12 h-12 bg-sage text-white rounded-full flex items-center justify-center shadow-md hover:scale-105 hover:bg-sage-dark transition-all duration-300"
                >
                    {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                </button>
            </div>
        </div>

      </div>

      {/* Up Next Card */}
      <AnimatePresence>
        {nextExercise && (
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="p-6 z-20 relative w-full max-w-xl mx-auto"
            >
                <div className="bg-white/80 backdrop-blur-md border border-white/50 p-4 rounded-2xl flex items-center gap-5 shadow-lg shadow-stone-200/50">
                    <div className="w-16 h-16 rounded-xl bg-stone-200 overflow-hidden flex-shrink-0">
                        <img src={nextExercise.image} alt={nextExercise.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <span className="text-xs font-bold text-sage-dark uppercase tracking-wider mb-1 block">Volgende Oefening</span>
                        <h4 className="font-bold text-slate-800 text-lg">{nextExercise.name}</h4>
                    </div>
                     <button
                        onClick={handleNextExercise}
                        className="w-10 h-10 bg-secondary text-slate-600 rounded-full flex items-center justify-center hover:bg-stone-300 transition-colors"
                    >
                        <SkipForward className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ActiveSession;
