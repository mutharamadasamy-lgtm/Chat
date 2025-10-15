import { useState, useEffect, useRef } from 'react';
import { Send, Users, Search, Menu, X } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
}

interface Channel {
  id: string;
  name: string;
  unread: number;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey! How are you doing today?',
      sender: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 3600000),
      isOwn: false,
    },
    {
      id: '2',
      text: "I'm doing great! Just working on some new designs. How about you?",
      sender: 'You',
      timestamp: new Date(Date.now() - 3500000),
      isOwn: true,
    },
    {
      id: '3',
      text: 'Same here! Would love to see what you\'re working on.',
      sender: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 3400000),
      isOwn: false,
    },
  ]);

  const [channels] = useState<Channel[]>([
    { id: '1', name: 'general', unread: 0 },
    { id: '2', name: 'design-team', unread: 3 },
    { id: '3', name: 'random', unread: 0 },
    { id: '4', name: 'project-alpha', unread: 1 },
  ]);

  const [activeChannel, setActiveChannel] = useState('design-team');
  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputValue,
        sender: 'You',
        timestamp: new Date(),
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-slate-800">Channels</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search channels..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => {
                  setActiveChannel(channel.name);
                  setIsSidebarOpen(false);
                }}
                className={`w-full px-4 py-2.5 rounded-lg text-left flex items-center justify-between group transition-all ${
                  activeChannel === channel.name
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2 font-medium">
                  <span className="text-slate-400 group-hover:text-slate-500">#</span>
                  {channel.name}
                </span>
                {channel.unread > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {channel.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
              ME
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">Your Name</p>
              <p className="text-xs text-slate-500">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-slate-500 hover:text-slate-700 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">#</span>
              <h2 className="text-lg font-semibold text-slate-800">{activeChannel}</h2>
            </div>
          </div>
          <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all">
            <Users size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : ''}`}
            >
              {!message.isOwn && (
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  SJ
                </div>
              )}
              <div className={`flex flex-col ${message.isOwn ? 'items-end' : 'items-start'} max-w-md lg:max-w-lg`}>
                {!message.isOwn && (
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-800">{message.sender}</span>
                    <span className="text-xs text-slate-500">{formatTime(message.timestamp)}</span>
                  </div>
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl ${
                    message.isOwn
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                {message.isOwn && (
                  <span className="text-xs text-slate-500 mt-1">{formatTime(message.timestamp)}</span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-slate-200 p-4 lg:p-6">
          <div className="flex items-end gap-3">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message #${activeChannel}`}
                className="w-full px-4 py-3 bg-transparent resize-none focus:outline-none text-slate-800 placeholder-slate-400"
                rows={1}
                style={{ maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
