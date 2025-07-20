import React, { useContext } from 'react';
import './App.css';
import va from './assets/ai.png';
import { CiMicrophoneOn } from "react-icons/ci";
import { DataContext } from './context/DataContext';

function App() {
  const { startRecognition, isListening, lastResponse } = useContext(DataContext);

  return (
    <div className='main'>
      <img src={va} alt="AI Assistant" id="syfer" />
      <span>I'm Syfer, Your AI assistant</span>
      <button onClick={startRecognition} disabled={isListening}>
        {isListening ? "Listening..." : "Ask Me"} <CiMicrophoneOn />
      </button>
      {lastResponse && (
        <div className="response">
          <strong>Gemini:</strong> {lastResponse}
        </div>
      )}
    </div>
  );
}

export default App;