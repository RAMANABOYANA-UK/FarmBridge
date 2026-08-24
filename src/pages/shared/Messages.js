import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, Send, Search, User, Volume2, VolumeX } from 'lucide-react';
import VoiceInputField from '../../components/VoiceInputField';

const MessagesPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [chats, setChats] = useState([
    {
      id: '1',
      name: 'Rahul Sharma',
      lastMessage: 'Is the delivery available today?',
      time: '10:30 AM',
      unread: 2,
      messages: [
        { id: '1', text: 'Hi, is the delivery available today?', sender: 'other', time: '10:30 AM' },
        { id: '2', text: 'Yes, I can deliver by evening.', sender: 'me', time: '10:32 AM' },
        { id: '3', text: 'Great! I will place the order.', sender: 'other', time: '10:35 AM' }
      ]
    },
    {
      id: '2',
      name: 'Priya Patel',
      lastMessage: 'Thanks for the fresh tomatoes!',
      time: 'Yesterday',
      unread: 0,
      messages: [
        { id: '1', text: 'Thanks for the fresh tomatoes!', sender: 'other', time: 'Yesterday' },
        { id: '2', text: 'You are welcome!', sender: 'me', time: 'Yesterday' }
      ]
    },
    {
      id: '3',
      name: 'Amit Kumar',
      lastMessage: 'Can you deliver to HSR Layout?',
      time: 'Yesterday',
      unread: 1,
      messages: [
        { id: '1', text: 'Can you deliver to HSR Layout?', sender: 'other', time: 'Yesterday' }
      ]
    }
  ]);

  const langMap = { en:'en-IN', hi:'hi-IN', ta:'ta-IN', te:'te-IN', kn:'kn-IN', ml:'ml-IN', bn:'bn-IN', mr:'mr-IN', gu:'gu-IN', pa:'pa-IN', or:'or-IN' };

  const speakMsg = (id, text) => {
    if (speakingMsgId === id) {
      window.speechSynthesis?.cancel();
      setSpeakingMsgId(null);
      return;
    }
    window.speechSynthesis?.cancel();
    const utter = new SpeechSynthesisUtterance(String(text));
    utter.lang = langMap[language] || 'en-IN';
    utter.onend = () => setSpeakingMsgId(null);
    utter.onerror = () => setSpeakingMsgId(null);
    window.speechSynthesis.speak(utter);
    setSpeakingMsgId(id);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;
    setChats(prev => prev.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, { id: Date.now(), text: message, sender: 'me', time: 'Now' }],
          lastMessage: message
        };
      }
      return chat;
    }));
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold">{t('messages')}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chat List */}
          <div className="bg-white rounded-xl shadow">
            <div className="p-4 border-b">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <input type="text" placeholder={t('searchChats')} className="flex-grow bg-transparent outline-none text-sm" />
              </div>
            </div>
            <div className="divide-y">
              {chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full p-4 text-left hover:bg-gray-50 ${selectedChat?.id === chat.id ? 'bg-green-50' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{chat.name}</span>
                        <span className="text-xs text-gray-500">{chat.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 truncate">{chat.lastMessage}</span>
                        {chat.unread > 0 && (
                          <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{chat.unread}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="md:col-span-2 bg-white rounded-xl shadow flex flex-col h-[600px]">
            {selectedChat ? (
              <>
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">{selectedChat.name}</h3>
                      <p className="text-xs text-green-600">{t('online')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                  {selectedChat.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-2xl ${
                        msg.sender === 'me' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs ${msg.sender === 'me' ? 'text-green-200' : 'text-gray-500'}`}>{msg.time}</p>
                          <button
                            type="button"
                            onClick={() => speakMsg(msg.id, msg.text)}
                            title={t('speak')}
                            className={`ml-2 p-1 rounded ${msg.sender === 'me' ? 'text-green-200 hover:text-white' : 'text-gray-400 hover:text-blue-600'}`}
                          >
                            {speakingMsgId === msg.id ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <VoiceInputField
                        value={message}
                        onChange={setMessage}
                        language={language}
                        placeholder={t('typeMessage')}
                        textarea={false}
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-grow flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-gray-500">{t('selectChat')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;