import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ActiveSession from './components/ActiveSession';

function App() {
  const [activeRoutine, setActiveRoutine] = useState(null);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-900">
      {activeRoutine ? (
        <ActiveSession
            routine={activeRoutine}
            onExit={() => setActiveRoutine(null)}
        />
      ) : (
        <Dashboard onStartRoutine={setActiveRoutine} />
      )}
    </div>
  );
}

export default App;
