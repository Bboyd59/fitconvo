import React, { useState, useEffect, useRef } from 'react';
import SystemStatus from './SystemStatus';
import CommandInput from './CommandInput';

const ASCII_LOGO = `
                         @@@@@@@     
                        @@@@@@@@     
                       @@@@@@@@@     
                     @@@@@@@@@@@     
                    @@@@@@@@@@@@     
     @@@@@@@       @@@@@@@@@@@@@     
     @@@@@@@@    @@@@@@@@ @@@@@@     
       @@@@@@@  @@@@@@@@  @@@@@@     
        @@@@@@@@@@@@@@     @@@@@     
         @@@@@@@@@@@@      @@@@@     
           @@@@@@@@@       @@@@@     
           @@@@@@@@@       @@@@@     
         @@@@@@@@@@@@      @@@@@     
        @@@@@@@@@@@@@@     @@@@@     
       @@@@@@@  @@@@@@@@   @@@@@     
     @@@@@@@@    @@@@@@@@  @@@@@     
     @@@@@@@       @@@@@@  @@@@@     
`;

const RetroHackerTerminal = ({ isTalking, messages }) => {
  const [cursorVisible, setCursorVisible] = useState(true);
  const [logoFrame, setLogoFrame] = useState(0);
  const [audioLevels, setAudioLevels] = useState(Array(10).fill(0));
  const transcriptRef = useRef(null);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (isTalking) {
      const animationInterval = setInterval(() => {
        setLogoFrame(prev => (prev + 1) % 3);
        setAudioLevels(Array(10).fill(0).map(() => Math.random()));
      }, 100);

      return () => {
        clearInterval(animationInterval);
      };
    } else {
      setLogoFrame(0);
      setAudioLevels(Array(10).fill(0));
    }
  }, [isTalking]);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages]);

  const animatedLogo = ASCII_LOGO.split('\n').map((line, i) => {
    if (isTalking && i > 0 && i < ASCII_LOGO.split('\n').length - 1) {
      const animatedLine = line.split('').map((char, j) => {
        if (char === '@') {
          return ['@', '#', '*'][Math.floor((j + i + logoFrame) % 3)];
        }
        return char;
      }).join('');
      return animatedLine;
    }
    return line;
  }).join('\n');

  return (
    <div className="font-mono text-green-400 bg-black p-4 rounded-lg shadow-lg w-full max-w-2xl border-2 border-green-400 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-green-400 opacity-5 pointer-events-none"></div>
      <div className="relative">
        <pre className="whitespace-pre-wrap text-xs leading-3 mb-4">{animatedLogo}</pre>
        <SystemStatus audioLevels={audioLevels} />
        <div className="mt-4 border-t border-green-400 pt-4">
          <div ref={transcriptRef} className="h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-black">
            {messages.map((message, index) => (
              <div key={index} className="mb-1">
                <span className="text-yellow-400">[{new Date().toLocaleTimeString()}]</span> {message.content}
              </div>
            ))}
            {isTalking && (
              <div className="flex items-center">
                <span className="text-yellow-400">[{new Date().toLocaleTimeString()}]</span>
                <span className={`ml-1 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}>▋</span>
              </div>
            )}
          </div>
        </div>
        <CommandInput onSubmit={(command) => console.log('Command submitted:', command)} />
      </div>
    </div>
  );
};

export default RetroHackerTerminal;
