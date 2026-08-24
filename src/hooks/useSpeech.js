import { useState, useCallback, useEffect } from 'react';

const useSpeech = (language = 'en') => {
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  const speak = useCallback((text) => {
    if (!text) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on locale
      const langMap = {
        en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN',
        kn: 'kn-IN', ml: 'ml-IN', bn: 'bn-IN', mr: 'mr-IN',
        gu: 'gu-IN', pa: 'pa-IN', or: 'or-IN'
      };
      utterance.lang = langMap[language] || 'en-IN';
      
      // Pick a voice
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith(language)) || voices[0];
      if (voice) utterance.voice = voice;
      
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  }, [language]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, []);

  const startListening = useCallback((lang = language, onResult) => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    
    const langMap = {
      en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN',
      kn: 'kn-IN', ml: 'ml-IN', bn: 'bn-IN', mr: 'mr-IN',
      gu: 'gu-IN', pa: 'pa-IN', or: 'or-IN'
    };
    rec.lang = langMap[lang] || 'en-IN';
    rec.continuous = false;
    rec.interimResults = true;
    
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = (e) => { 
      console.error('Speech error:', e.error); 
      setListening(false);
      setRecognition(null);
    };
    rec.onresult = (e) => {
      const text = Array.from(e.results)
        .map(r => r[0])
        .map(r => r.transcript)
        .join('');
      setTranscript(text);
      if (onResult) onResult(text);
    };
    
    setRecognition(rec);
    rec.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognition) recognition.stop();
    setListening(false);
    setRecognition(null);
  }, [recognition]);

  return { speak, stopSpeaking, startListening, stopListening, listening, speaking, transcript, setTranscript };
};

export default useSpeech;