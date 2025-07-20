import React, { useMemo, useEffect, useState } from 'react';
import { DataContext } from './DataContext';
import askGemini from '../gemini';

export default function UserContext({ children }) {
  const [isListening, setIsListening] = useState(false);
  const [lastResponse, setLastResponse] = useState('');
  const [lastTranscript, setLastTranscript] = useState('');

  const recognition = useMemo(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.interimResults = false;
    recog.continuous = false;
    return recog;
  }, []);

  async function speak(text) {
    console.log("🔊 Speaking:", text);
    const synth = window.speechSynthesis;
    synth.cancel(); // Cancel any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);

    const voices = synth.getVoices();
    const selectedVoice = voices.find(v =>
      (v.lang === "en-US" || v.lang === "en-UK") &&
      /female|woman|Google UK English Female|Google US English Female|Jenny|Samantha/i.test(v.name)
    );

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    return new Promise((resolve) => {
      utterance.onend = resolve;
      synth.speak(utterance);
    });
  }

  useEffect(() => {
    recognition.onstart = () => {
      setIsListening(true);
      console.log("🎙️ Listening started...");
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log("🛑 Listening ended...");
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.trim();
      console.log("User said:", transcript);

      if (transcript === lastTranscript) {
        console.log("Duplicate transcript, skipping...");
        return;
      }

      setLastTranscript(transcript);

      try {
        const response = await askGemini(transcript);
        console.log("Gemini:", response);
        setLastResponse(response);

        if (response && typeof response === "string") {
          await speak(response);
        } else {
          await speak("Sorry, I couldn't process that.");
        }
      } catch (err) {
        console.error("Gemini error:", err);
        await speak("Sorry, something went wrong.");
      }
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
      speak("Sorry, I couldn't understand.");
      setIsListening(false);
    };
  }, [recognition, lastTranscript]);

  const startRecognition = () => {
    if (!isListening) {
      recognition.start();
    } else {
      console.log("Recognition already running...");
    }
  };

  const value = {
    startRecognition,
    isListening,
    lastResponse
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}