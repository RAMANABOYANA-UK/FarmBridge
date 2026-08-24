import React, { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const VoiceInputField = ({ onResult, language = 'en', placeholder = '', textarea = false, value: externalValue, onChange }) => {
  const [internalValue, setInternalValue] = useState('');
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  const value = externalValue !== undefined ? externalValue : internalValue;

  const langMap = {
    en:'en-IN', hi:'hi-IN', ta:'ta-IN', te:'te-IN', kn:'kn-IN',
    ml:'ml-IN', bn:'bn-IN', mr:'mr-IN', gu:'gu-IN', pa:'pa-IN', or:'or-IN'
  };

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = langMap[language] || 'en-IN';
    rec.continuous = false;
    rec.interimResults = true;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e) => {
      const text = Array.from(e.results).map(r => r[0]).map(r => r.transcript).join('');
      setInternalValue(text);
      if (onChange) onChange(text);
      if (onResult) onResult(text);
    };
    recognitionRef.current = rec;
    rec.start();
  };

  const toggleSpeak = () => {
    if (speaking) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      return;
    }
    if (!value) return;
    const utter = new SpeechSynthesisUtterance(String(value));
    utter.lang = langMap[language] || 'en-IN';
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setInternalValue(v);
    if (onChange) onChange(v);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 focus-within:border-green-500 bg-white">
        {textarea ? (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            rows={3}
            className="w-full outline-none resize-none bg-transparent"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full outline-none bg-transparent"
          />
        )}
      </div>
      <button
        type="button"
        onClick={toggleListening}
        title="Voice input"
        className={`p-2.5 rounded-xl transition-colors ${
          listening ? 'bg-red-500 text-white animate-pulse' : 'bg-green-100 text-green-600 hover:bg-green-200'
        }`}
      >
        {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </button>
      <button
        type="button"
        onClick={toggleSpeak}
        title="Listen"
        className={`p-2.5 rounded-xl transition-colors ${
          speaking ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
        }`}
      >
        {speaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default VoiceInputField;