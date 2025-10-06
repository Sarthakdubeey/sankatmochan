
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
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onCommand(transcript);
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

  useEffect(() => {
    if (isPermissionGranted) {
      setupRecognition();
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isPermissionGranted, setupRecognition]);

  const startListening = async () => {
    if (isListening || !window.navigator.mediaDevices) {
      return;
    }
    
    if (!isPermissionGranted) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsPermissionGranted(true);
        // Recognition will be set up by the useEffect, we call start again inside it.
      } catch (err) {
        console.error("Microphone access denied:", err);
        if (onError) {
          onError('not-allowed');
        }
        return;
      }
    }
    
    // Check if recognition is ready, if not, it will be started by the useEffect
    if (recognitionRef.current) {
        setIsListening(true);
        recognitionRef.current.start();
    }
  };

  // Effect to start listening once permission is granted and recognition is set up
  useEffect(() => {
    if (isPermissionGranted && recognitionRef.current && !isListening) {
      // This ensures that if startListening was called before permission was granted,
      // it will start listening now.
      if (isListening) { // This seems counterintuitive, but we re-check state
        recognitionRef.current.start();
      }
    }
  }, [isPermissionGranted, isListening]);
  

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  return {
    isListening,
    isSupported: typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
    startListening,
    stopListening,
  };
}
