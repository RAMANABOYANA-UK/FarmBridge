import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X } from 'lucide-react';

const VoiceInput = ({ onVoiceResult, language = 'en' }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = getLanguageCode(language);
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setTranscript(transcript);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        if (transcript && onVoiceResult) {
          onVoiceResult(transcript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      setRecognition(recognition);
    }
  }, [language]);

  const getLanguageCode = (lang) => {
    const languageMap = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'bn': 'bn-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN',
      'pa': 'pa-IN',
      'or': 'or-IN'
    };
    return languageMap[lang] || 'en-IN';
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={toggleListening}
          className={`p-3 rounded-full ${
            isListening
              ? 'bg-red-100 text-red-600 animate-pulse'
              : 'bg-green-100 text-green-600 hover:bg-green-200'
          }`}
        >
          {isListening ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </button>
        
        {transcript && (
          <button
            type="button"
            onClick={clearTranscript}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        <div className="text-sm text-gray-500">
          {isListening ? 'Listening... Speak now' : 'Click microphone to use voice input'}
        </div>
      </div>
      
      {transcript && (
        <div className="p-3 bg-gray-50 rounded-lg border">
          <div className="text-sm text-gray-600">Voice input:</div>
          <div className="mt-1 text-gray-900">{transcript}</div>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;