import React, { useState, useEffect, useCallback } from "react";
import { useConversation } from "@11labs/react";
import RetroHackerTerminal from "./RetroHackerTerminal";
import SoundEffects from "./SoundEffects";

export default function App() {
  const [isTalking, setIsTalking] = useState(false);
  const [microphoneAccess, setMicrophoneAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState([]);

  const agentId = "e3LGkKXN9g8wzeFEmsik"; // Your actual agent ID

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs AI");
      setTranscript((prev) => [...prev, "CONNECTED TO AI AGENT."]);
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs AI");
      setTranscript((prev) => [...prev, "DISCONNECTED FROM AI AGENT."]);
    },
    onMessage: (message) => {
      console.log("Received message:", message);
      if (message.source === "ai" && message.message) {
        setTranscript((prev) => [...prev, `xAI: ${message.message}`]);
      } else if (message.source === "user" && message.message) {
        setTranscript((prev) => [...prev, `YOU: ${message.message}`]);
      }
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      setTranscript((prev) => [...prev, `ERROR: ${error.message}`]);
    },
  });

  useEffect(() => {
    const requestMicrophoneAccess = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicrophoneAccess(true);
        console.log("Microphone access granted");
      } catch (error) {
        console.error("Failed to get microphone access:", error);
        setMicrophoneAccess(false);
      }
    };

    requestMicrophoneAccess();
  }, []);

  const handleToggleTalking = useCallback(async () => {
    console.log("Toggle talking button clicked");
    if (!microphoneAccess) {
      alert(
        "Microphone access is required to use the AI agent. Please allow microphone access and try again.",
      );
      return;
    }

    setIsLoading(true);
    if (!isTalking) {
      console.log("Initiating conversation");
      SoundEffects.play("initiate");
      try {
        await conversation.startSession({ agentId });
        setIsTalking(true);
      } catch (error) {
        console.error("Failed to start conversation:", error);
        setTranscript((prev) => [
          ...prev,
          "ERROR: FAILED TO CONNECT TO AI AGENT.",
        ]);
      }
    } else {
      console.log("Terminating conversation");
      SoundEffects.play("terminate");
      conversation.endSession();
      setIsTalking(false);
    }
    setIsLoading(false);
  }, [isTalking, microphoneAccess, agentId, conversation]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <RetroHackerTerminal
        isTalking={isTalking}
        transcript={transcript}
        isSpeaking={conversation.isSpeaking}
      />
      <button
        className={`mt-8 px-6 py-3 font-mono rounded transition-colors uppercase font-bold tracking-wider border-2 shadow-lg ${
          isTalking
            ? "bg-red-500 text-white hover:bg-red-600 border-red-400"
            : "bg-green-500 text-black hover:bg-green-400 border-green-400"
        }`}
        onClick={handleToggleTalking}
        disabled={isLoading}
      >
        {isLoading ? "LOADING..." : isTalking ? "TERMINATE" : "INITIATE"}
      </button>
      {!microphoneAccess && (
        <p className="mt-4 text-red-500 font-mono">
          Microphone access is required. Please allow access and refresh the
          page.
        </p>
      )}
      <p className="mt-4 text-sm text-green-500 font-mono">
        Powered by{" "}
        <a className="underline" href="https://docs.x.ai/docs#getting-started">
          xAI's Grok
        </a>{" "}
        and{" "}
        <a
          className="underline"
          href="https://elevenlabs.io/docs/conversational-ai/overview"
        >
          ElevenLabs Conversational AI SDK
        </a>
      </p>
    </div>
  );
}
