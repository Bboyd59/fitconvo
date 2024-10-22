import React, { useState } from 'react';
import SoundEffects from './SoundEffects';

const CommandInput = ({ onSubmit }) => {
  const [command, setCommand] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim()) {
      onSubmit(command);
      setCommand('');
      SoundEffects.play('response');
    }
  };

  const handleKeyPress = () => {
    SoundEffects.play('keyPress');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex">
      <span className="text-green-400 mr-2">&gt;</span>
      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-grow bg-transparent text-green-400 focus:outline-none"
        placeholder="Enter command..."
      />
    </form>
  );
};

export default CommandInput;
