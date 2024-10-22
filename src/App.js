import React, { useState, useEffect, useRef } from 'react';
import { useConversation } from '@11labs/react';
import RetroHackerTerminal from './RetroHackerTerminal';
import SoundEffects from './SoundEffects';

export default function App() {
  const [isTalking, setIsTalking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isConversationActive, setIsConversationActive] = useState(false);
  const conversationStartTimeRef = useRef(null);

  const conversation = useConversation({
    onMessage: (message) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
      if (message.source === 'ai') {
        console.log('AI message received, attempting to speak:', message.content);
        conversation.speak(message.content)
          .then(() => console.log('Speech successfully played'))
          .catch(error => console.error('Error speaking message:', error));
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
        console.log('Starting conversation with agent ID:', process.env.ELEVENLABS_AGENT_ID);
        const conversationId = await conversation.startSession({
          agentId: process.env.ELEVENLABS_AGENT_ID,
        });
        console.log('Conversation started:', conversationId);
        setIsTalking(true);
        setIsConversationActive(true);
        conversationStartTimeRef.current = Date.now();
      } catch (error) {
        console.error('Error starting conversation:', error);
      }
    } else {
      console.log('Ending conversation');
      SoundEffects.play('terminate');
      await conversation.endSession();
      setIsTalking(false);
      setIsConversationActive(false);
    }
  };

  useEffect(() => {
    console.log('Conversation status:', conversation.status);
  }, [conversation.status]);

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
        disabled={!isConversationActive && isTalking}
      >
        {isTalking ? 'TERMINATE' : 'INITIATE'}
      </button>
    </div>
  );
}
