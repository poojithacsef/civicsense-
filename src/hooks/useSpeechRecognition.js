import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

export function useSpeechRecognition({ onResult, onError }) {
  const [isListening, setIsListening] = useState(false);
  const [micStatus, setMicStatus] = useState("Stopped"); // "Listening", "Stopped", "Permission denied", "Error"
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);
  const SILENCE_TIMEOUT = 30000; // 30 seconds max duration

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setMicStatus("Not Supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // Or map from i18n later if needed

    recognition.onstart = () => {
      setIsListening(true);
      setMicStatus("Listening");
      // Add safety timeout
      timeoutRef.current = setTimeout(() => {
        stopListening();
        toast("Microphone stopped automatically after 30 seconds.", { icon: "⏳" });
      }, SILENCE_TIMEOUT);
    };

    recognition.onresult = (event) => {
      // Reset timeout on speech
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          stopListening();
        }, SILENCE_TIMEOUT); // wait for 30s of silence to auto stop
      }

      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript && onResult) {
        onResult(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setMicStatus("Permission denied");
        if (onError) onError("Microphone permission denied. Check your browser settings.");
      } else {
        setMicStatus("Error");
        if (onError) onError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setMicStatus("Stopped");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onResult, onError]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      if (onError) onError("Speech recognition is not supported in this browser (Try Chrome/Safari/Edge).");
      return;
    }
    
    if (isListening) return;

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error(e);
      if (onError) onError("Failed to start recording.");
    }
  }, [isListening, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return { isListening, micStatus, startListening, stopListening, isSupported: !!recognitionRef.current };
}
