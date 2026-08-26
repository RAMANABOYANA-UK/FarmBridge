import React, { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const VoiceInputField = ({ onResult, language = 'en', placeholder = '', textarea = false, value: externalValue, onChange, onEnter }) => {
  const [internalValue, setInternalValue] = useState('');
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  const value = externalValue !== undefined ? externalValue : internalValue;
  const isBrowser = typeof window !== 'undefined';

  const langMap = {
    en:'en', hi:'hi', ta:'ta', te:'te', kn:'kn', ml:'ml', bn:'bn',
    mr:'mr', gu:'gu', pa:'pa', or:'or', as:'as', ur:'ur', ks:'ks',
    sa:'sa', sd:'sd', mai:'mai', kok:'kok', doi:'doi', mni:'mni', sat:'sat'
  };

  const toggleListening = () => {
    if (!isBrowser) return;
    if (listening) {
      try { recognitionRef.current?.stop(); } catch (e) {}
      setListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('Speech recognition not supported in this browser');
      return;
    }
    try {
      const rec = new SR();
      rec.lang = langMap[language] || 'en';
      rec.continuous = false;
      rec.interimResults = true;
      rec.onstart = () => setListening(true);
      rec.onend = () => setListening(false);
      rec.onresult = (e) => {
        try {
          const text = Array.from(e.results).map(r => r[0]).map(r => r.transcript).join('');
          setInternalValue(text);
          if (onChange) onChange(text);
          if (onResult) onResult(text);
        } catch (err) {}
      };
      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      alert('Could not start voice input');
    }
  };

  const toggleSpeak = () => {
    if (!isBrowser) return;
    if (speaking) {
      try { window.speechSynthesis?.cancel(); } catch (e) {}
      setSpeaking(false);
      return;
    }
    if (!value) return;
    try {
      const utter = new SpeechSynthesisUtterance(String(value));
      utter.lang = langMap[language] || 'en';
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
      setSpeaking(true);
    } catch (err) {}
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setInternalValue(v);
    if (onChange) onChange(v);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onEnter) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 focus-within:border-green-500 bg-white">
        {textarea ? (
          <textarea
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={3}
            className="w-full outline-none resize-none bg-transparent"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
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