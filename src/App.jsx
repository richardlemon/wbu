import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import Dashboard from './components/Dashboard';
import ActiveSession from './components/ActiveSession';
import RoutineDetail from './components/RoutineDetail';
import routinesData from './data/routines.json';

function App() {
  console.log('App component rendering');
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, detail, active
  const [selectedRoutine, setSelectedRoutine] = useState(null);

  const handleSelectRoutine = (routine) => {
    setSelectedRoutine(routine);
    setCurrentView('detail');
  };

  const handleStartRoutine = (routine) => {
    setCurrentView('active');
  };

  const handleBackToDashboard = () => {
    setSelectedRoutine(null);
    setCurrentView('dashboard');
  };

  const handleSessionComplete = () => {
    alert("Namaste. Session Complete.");
    handleBackToDashboard();
  };

  const handleExitSession = () => {
      // Could add confirmation here
      handleBackToDashboard();
  }

  return (
    <div className="font-sans antialiased text-slate-900 bg-stone-50 min-h-screen">
      {currentView === 'dashboard' && (
        <Dashboard
          routines={routinesData}
          onSelectRoutine={handleSelectRoutine}
        />
      )}

      {currentView === 'detail' && selectedRoutine && (
        <RoutineDetail
            routine={selectedRoutine}
            onBack={handleBackToDashboard}
            onStart={handleStartRoutine}
        />
      )}

      {currentView === 'active' && selectedRoutine && (
        <ActiveSession
          routine={selectedRoutine}
          onComplete={handleSessionComplete}
          onExit={handleExitSession}
        />
      )}
    </div>
  );
}

export default App;
