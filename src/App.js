import React, { useState } from 'react';
import RetroHackerTerminal from './RetroHackerTerminal';
import SoundEffects from './SoundEffects';

export default function App() {
  const [isTalking, setIsTalking] = useState(false);

  const handleToggleTalking = () => {
    if (!isTalking) {
      SoundEffects.play('initiate');
    } else {
      SoundEffects.play('terminate');
    }
    setIsTalking(!isTalking);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <RetroHackerTerminal isTalking={isTalking} />
      <button
        className="mt-8 px-6 py-3 bg-green-500 text-black font-mono rounded hover:bg-green-400 transition-colors uppercase font-bold tracking-wider border-2 border-green-400 shadow-lg"
        onClick={handleToggleTalking}
      >
        {isTalking ? 'TERMINATE' : 'INITIATE'}
      </button>
    </div>
  );
}
