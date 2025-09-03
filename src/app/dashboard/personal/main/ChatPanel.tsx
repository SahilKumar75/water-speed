import React, { useRef, useEffect } from 'react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  input: string;
  loading: boolean;
  onInputChange: (val: string) => void;
  onSend: () => void;
}


const ChatPanel: React.FC<ChatPanelProps> = ({ messages, input, loading, onInputChange, onSend }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  return (
    <div
      className="hidden md:flex w-1/3 lg:w-2/5 min-h-full bg-[#e6f7f1] flex flex-col"
      style={{ '--input-area-height': '88px' } as React.CSSProperties}
    >
      {/* Reply container: scrollable, never overlaps input */}
      <div
        className="overflow-y-auto p-6 space-y-4"
        style={{ maxHeight: 'calc(100vh - var(--input-area-height))' }}
      >
        {messages.length === 0 && (
          <div className="text-[#143726]/60 text-center mt-20">Start a conversation with <span className="font-bold text-[#224b32]">Wind Speed</span>!</div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow ${msg.sender === 'user' ? 'bg-white text-[#143726]' : 'bg-gradient-to-r from-green-400/20 to-cyan-400/20 text-[#224b32] border border-green-400/30'}`}>
              {msg.sender === 'ai' && (
                <span className="font-bold text-green-600 mr-2">Wind Speed:</span>
              )}
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[70%] px-4 py-2 rounded-2xl shadow bg-gradient-to-r from-green-400/20 to-cyan-400/20 text-[#224b32] border border-green-400/30 animate-pulse">
              <span className="font-bold text-green-600 mr-2">Wind Speed:</span>
              Generating reply...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form
        className="w-full p-6 bg-white z-10 shadow-lg"
        style={{ position: 'sticky', bottom: 0, height: 'var(--input-area-height)' }}
        onSubmit={e => { e.preventDefault(); onSend(); }}
      >
        <div className="flex gap-2">
          <input
            type="text"
            className="w-full px-4 py-3 rounded-full border border-[#143726]/30 focus:outline-none focus:ring-2 focus:ring-[#143726]/40 bg-white text-[#143726] shadow"
            placeholder="Type your message..."
            value={input}
            onChange={e => onInputChange(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-[#c0e57b] text-[#224b32] font-bold shadow border border-[#224b32] hover:bg-[#c0e57b]/90 transition-colors"
            disabled={loading || !input.trim()}
          >Send</button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
