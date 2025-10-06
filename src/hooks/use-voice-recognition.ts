
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Define the shape of the SpeechRecognition interface for TypeScript
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((this: SpeechRecognition, ev: any) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
  onend: (() => void) | null;
}

// Define the global window object to include webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

type UseVoiceRecognitionProps = {
  onCommand: (command: string) => void;
  onError?: (error: string) => void;
};

export function useVoiceRecognition({ onCommand, onError }: UseVoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const setupRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Stop listening after one phrase
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Use Indian English for better accuracy

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onCommand(transcript);
        setIsListening(false); // Stop listening after a command is processed
      };

      recognition.onerror = (event) => {
        if (onError) {
          onError(event.error);
        }
        setIsListening(false);
      };
      
      recognition.onend = () => {
          setIsListening(false);
      }

      recognitionRef.current = recognition;
    }
  }, [onCommand, onError]);
  
  // Setup recognition as soon as permission is granted
  useEffect(() => {
    if (isPermissionGranted) {
      setupRecognition();
    }
  }, [isPermissionGranted, setupRecognition]);


  const startListening = async () => {
    if (isListening) return;

    if (!isPermissionGranted) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsPermissionGranted(true);
        // The useEffect will now set up recognition. We'll call start again in a moment.
      } catch (err) {
        console.error("Microphone access denied:", err);
        if (onError) onError('not-allowed');
        return;
      }
    }
    
    // Use a short timeout to allow recognition to be set up by the effect after permission is granted
    setTimeout(() => {
        if (recognitionRef.current) {
            setIsListening(true);
            recognitionRef.current.start();
        } else if (onError) {
            onError('not-ready');
        }
    }, 100);

  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    isSupported: typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
    startListening,
    stopListening,
  };
}
