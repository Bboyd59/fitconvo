import React, { useState, useEffect } from 'react';
import SoundEffects from './SoundEffects';

const hackerPhrases = [
  "Bypassing firewall...",
  "Cracking encryption...",
  "Injecting malicious code...",
  "Exploiting vulnerabilities...",
  "Initiating DDoS attack...",
  "Breaching mainframe...",
  "Decrypting classified data...",
  "Deploying trojan horse...",
  "Intercepting network traffic...",
  "Overriding security protocols...",
];

const CommandInput = () => {
  const [currentPhrase, setCurrentPhrase] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * hackerPhrases.length);
      setCurrentPhrase(hackerPhrases[randomIndex]);
      SoundEffects.play('keyPress');
    }, 2000); // Change phrase every 2 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="mt-4 flex">
      <span className="text-green-400 mr-2">&gt;</span>
      <div className="flex-grow text-green-400">
        {currentPhrase}
        <span className="animate-pulse">█</span>
      </div>
    </div>
  );
};

export default CommandInput;
