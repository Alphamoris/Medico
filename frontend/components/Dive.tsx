"use client"
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  X,
  Loader,
  Image,
  Smile,
  Mic,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  MessageSquare
} from 'lucide-react';
import { GiArtificialHive as Bot } from 'react-icons/gi';
interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

const Dive = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: "👋 Hi! I'm Dive, your friendly AI assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 100)}px`;
    }
  }, [inputValue]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I understand you're looking for assistance. This is a demo response - in a real implementation, I would be connected to an AI backend.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 2000);
  };

  // Floating button and greeting when chat is closed
  if (!isOpen) {
    return (
      <div className="fixed bottom-32 right-3 flex flex-col items-end z-49">
        {/* Greeting Message */}
        <div className={`
          transform transition-all duration-500 mb-2
          ${showGreeting ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <div className="bg-white rounded-lg shadow-lg p-2 flex items-center space-x-2 
                        border border-purple-100 max-w-[180px] group hover:shadow-xl
                        transition-all duration-300 cursor-pointer"
               onClick={() => setIsOpen(true)}>
            <Bot className="w-4 h-4 text-purple-500" />
            <div>
              <p className="text-xs font-medium text-gray-800">Hi! I'm Dive AI</p>
              <p className="text-[10px] text-gray-500">Click to chat with me!</p>
            </div>
            <div className="absolute -right-1 -bottom-1 w-2 h-2 bg-green-500 rounded-full 
                          border-2 border-white animate-pulse" />
          </div>
        </div>

        {/* Floating Button */}
        <button
        aria-label='button'
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          onClick={() => {
            setIsOpen(true);
            setShowGreeting(false);
          }}
          className="relative w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 
                   rounded-full shadow-lg hover:shadow-xl transition-all duration-300 
                   transform hover:scale-110 focus:outline-none focus:ring-2 
                   focus:ring-purple-300 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className={`absolute inset-0 ${isButtonHovered ? 'animate-ping-slow' : ''} 
                        bg-white/20 rounded-full`} />
          <div className={`absolute inset-0 ${isButtonHovered ? 'animate-ping-slower' : ''} 
                        bg-white/10 rounded-full`} />
          
          <Bot className="relative z-10 w-8 h-8 text-white mx-auto 
                        group-hover:scale-110 transition-transform duration-300 flex" />
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`fixed z-50 transition-all duration-300 ease-in-out
                ${isFullScreen 
                  ? 'inset-0' 
                  : 'bottom-4 right-4 w-[300px] h-[450px]'}
                scale-100 opacity-100`}
    >
      <div className={`bg-white shadow-2xl flex flex-col h-full overflow-hidden
                    ${!isFullScreen && 'rounded-xl border border-gray-200'}`}>
        {/* Header */}
        <div className="p-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-xs">Dive AI</h3>
                <p className="text-[10px] text-white/80">
                  {isTyping ? 'Typing...' : 'Online'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isFullScreen ? (
                  <Minimize2 className="w-4 h-4 text-white" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-white" />
                )}
              </button>
              <button
              aria-label='button'
                onClick={() => {
                  setIsOpen(false);
                  setShowGreeting(true);
                }}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} 
                         ${index === 0 ? '' : 'mt-2'}`}
            >
              <div className={`flex items-end space-x-1 max-w-[75%]`}>
                <div className={`message-bubble p-2 rounded-xl 
                                ${message.type === 'user'
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                  : 'bg-white text-gray-800 shadow-sm'
                                }`}>
                  <p className="text-xs whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <div className="flex justify-end mt-1">
                    <span className={`text-[9px] ${
                      message.type === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center space-x-2 text-gray-500 text-xs p-2">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
              <span className="text-[10px]">Dive is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-2 bg-white border-t border-gray-100">
          <div className="flex items-end space-x-1">
            <div className="flex space-x-1">
              <button 
              aria-label='button'
                onClick={() => setShowEmoji(!showEmoji)}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors 
                          rounded-lg hover:bg-gray-100"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message..."
                className="w-full px-3 py-1.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 
                         focus:ring-purple-500 resize-none text-xs min-h-[32px] max-h-[100px]
                         placeholder-gray-400 transition-shadow duration-200"
                style={{ overflow: 'hidden' }}
              />
            </div>
            <button
            aria-label='button'
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`p-1.5 rounded-xl transition-all duration-200
                ${inputValue.trim() 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-md hover:scale-105' 
                  : 'bg-gray-100 cursor-not-allowed'}`}
            >
              <Send className={`w-4 h-4 ${inputValue.trim() ? 'text-white' : 'text-gray-400'}`} />
            </button>
          </div>

          {/* Emoji Picker */}
          {showEmoji && (
            <div className="absolute bottom-full mb-2 left-2 bg-white rounded-lg shadow-xl 
                          border border-gray-200 p-2 w-48 max-h-36 overflow-y-auto">
              <div className="grid grid-cols-6 gap-1">
                {['😊', '😂', '❤️', '👍', '🎉', '🤔', '😎', '🙌', 
                  '👋', '🔥', '⭐', '💡'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setInputValue(prev => prev + emoji);
                      setShowEmoji(false);
                    }}
                    className="p-1 hover:bg-gray-100 rounded transition-colors text-sm"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-1.5 bg-gradient-to-r from-gray-50 to-white border-t 
                       border-gray-100 text-[9px] text-gray-400 flex justify-center items-center">
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-2.5 h-2.5" />
            <span>Powered by Dive AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dive;