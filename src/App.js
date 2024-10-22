import React, { useState, useEffect, useRef } from 'react';
import { useConversation } from '@11labs/react';
import RetroHackerTerminal from './RetroHackerTerminal';
import SoundEffects from './SoundEffects';

export default function App() {
  const [isTalking, setIsTalking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
      setErrorMessage('An error occurred during the conversation. Please try again.');
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
        setErrorMessage('');
      } catch (error) {
        console.error('Error starting conversation:', error);
        setErrorMessage('Failed to start the conversation. Please try again.');
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
    if (isConversationActive) {
      const keepAliveInterval = setInterval(() => {
        console.log('Keeping conversation alive');
        // You can add any lightweight action here to keep the connection active
      }, 5000); // Send a keep-alive signal every 5 seconds

      return () => clearInterval(keepAliveInterval);
    }
  }, [isConversationActive]);

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
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
      <button
        className="mt-8 px-6 py-3 bg-green-500 text-black font-mono rounded hover:bg-green-400 transition-colors uppercase font-bold tracking-wider border-2 border-green-400 shadow-lg"
        onClick={handleToggleTalking}
      >
        {isTalking ? 'TERMINATE' : 'INITIATE'}
      </button>
    </div>
  );
}
