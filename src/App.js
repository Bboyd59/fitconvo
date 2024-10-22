import React, { useState, useEffect } from 'react';
import { useConversation } from '@11labs/react';
import RetroHackerTerminal from './RetroHackerTerminal';
import SoundEffects from './SoundEffects';

export default function App() {
  const [isTalking, setIsTalking] = useState(false);
  const [messages, setMessages] = useState([]);
  const conversation = useConversation({
    onMessage: (message) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
      if (message.type === 'agent' && message.content) {
        console.log('AI agent message received, attempting to speak');
        conversation.speak(message.content)
          .then(() => {
            console.log('Speech successfully played');
          })
          .catch(error => {
            console.error('Error speaking message:', error);
          });
      }
    },
    onError: (error) => {
      console.error('Conversation error:', error);
    },
  });

  const handleToggleTalking = async () => {
    if (!isTalking) {
      SoundEffects.play('initiate');
      try {
        console.log('Requesting microphone permissions');
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone permissions granted');
        
        console.log('Starting conversation session');
        const conversationId = await conversation.startSession({
          agentId: process.env.ELEVENLABS_AGENT_ID,
        });
        console.log('Conversation started:', conversationId);
        
        // Check and set volume
        await conversation.setVolume({ volume: 1.0 });
        console.log('Volume set to maximum');
        
        setIsTalking(true);
      } catch (error) {
        console.error('Error starting conversation:', error);
      }
    } else {
      SoundEffects.play('terminate');
      console.log('Ending conversation session');
      await conversation.endSession();
      setIsTalking(false);
    }
  };

  useEffect(() => {
    return () => {
      if (isTalking) {
        console.log('Cleaning up: ending conversation session');
        conversation.endSession();
      }
    };
  }, [isTalking, conversation]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <RetroHackerTerminal isTalking={isTalking} messages={messages} />
      <button
        className="mt-8 px-6 py-3 bg-green-500 text-black font-mono rounded hover:bg-green-400 transition-colors uppercase font-bold tracking-wider border-2 border-green-400 shadow-lg"
        onClick={handleToggleTalking}
      >
        {isTalking ? 'TERMINATE' : 'INITIATE'}
      </button>
    </div>
  );
}
