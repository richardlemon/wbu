import React from 'react';
import RoutineCard from './RoutineCard';
import { Sparkles, CheckCircle2, Layout, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4 min-w-[140px] flex-1">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
            <div className="text-2xl font-bold text-slate-800">{value}</div>
            <div className="text-xs font-medium text-stone-400 uppercase tracking-wide">{label}</div>
        </div>
    </div>
);

const Dashboard = ({ routines, onSelectRoutine }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-stone-50 p-6 md:p-8"
    >
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-3"
            >
                <div className="p-2 bg-sage/20 rounded-full">
                    <Sparkles className="w-4 h-4 text-sage-dark" />
                </div>
                <span className="text-sm font-semibold text-sage-dark uppercase tracking-wide">Welcome Back</span>
            </motion.div>
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
            >
                Ready to flow today?
            </motion.h1>

            {/* Stats Section */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-8"
            >
                <StatCard
                    icon={CheckCircle2}
                    label="Completed"
                    value="12"
                    color="bg-sage"
                />
                <StatCard
                    icon={Layout}
                    label="Routines"
                    value="4"
                    color="bg-slate-400"
                />
                <StatCard
                    icon={Flame}
                    label="Streak"
                    value="5"
                    color="bg-orange-400"
                />
            </motion.div>

            <motion.p
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.4 }}
               className="text-lg text-stone-500 max-w-lg"
            >
                Select a routine below to begin your mindful practice.
            </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routines.map((routine, index) => (
            <motion.div
              key={routine.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + (index * 0.1) }}
            >
                <RoutineCard
                  routine={routine}
                  onClick={onSelectRoutine}
                />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
