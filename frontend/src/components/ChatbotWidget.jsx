'use client';

import React, { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
  "Comment réserver une place ?",
  "Où télécharger mon ticket PDF ?",
  "Quelles sont les pièces à fournir ?",
  "Conseils de prévention santé",
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Bonjour ! 👋 Je suis l'**Assistant virtuel FOSMEF AI**.\nComment puis-je vous aider aujourd'hui concernant vos réservations ou la prévention médicale ?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend = null) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || loading) return;

    const newMessages = [...messages, { role: 'user', content: queryText }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la communication avec l\'IA.');
      }

      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: `⚠️ Erreur : ${err.message || 'Impossible d\'obtenir une réponse pour le moment.'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper to render simple markdown formatting (*, **, \n)
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Convert bold **text** to <strong>
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc my-0.5">
            {formattedLine}
          </li>
        );
      }

      return (
        <p key={idx} className={idx > 0 && line === '' ? 'h-2' : 'my-0.5'}>
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-brand-blue to-brand-teal text-white rounded-full shadow-2xl hover:shadow-brand-teal/30 hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-extrabold uppercase tracking-wider">Assistant AI</span>
            <span className="text-[10px] text-emerald-200 font-semibold"> AI • En ligne</span>
          </div>
        </button>
      )}

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">

          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-brand-blue via-brand-blue to-brand-teal text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-brand-blue"></span>
              </div>
              <div>
                <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                  Assistant FOSMEF AI
                  <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-emerald-400/30">Gemini</span>
                </h3>
                <p className="text-[10px] text-slate-300 font-medium">Prévention Médicale & Réservations</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer text-white"
              title="Fermer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-brand-teal text-white flex items-center justify-center flex-shrink-0 text-[10px] font-extrabold shadow-xs mt-1">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3 rounded-2xl leading-relaxed text-xs shadow-xs ${msg.role === 'user'
                      ? 'bg-brand-blue text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                    }`}
                >
                  {renderFormattedText(msg.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-lg bg-brand-teal text-white flex items-center justify-center flex-shrink-0 text-[10px] font-extrabold shadow-xs">
                  AI
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-brand-teal rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-brand-teal rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-brand-teal rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length < 4 && (
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(s)}
                  disabled={loading}
                  className="text-[10px] font-bold text-brand-teal bg-brand-teal/10 hover:bg-brand-teal/20 px-2.5 py-1 rounded-full transition-all border border-brand-teal/20 cursor-pointer disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question à ASSISTANT AI..."
              className="flex-1 px-3.5 py-2.5 bg-slate-100 text-slate-800 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal transition-all placeholder:text-slate-400"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || loading}
              className="p-2.5 bg-brand-teal hover:bg-brand-teal-hover text-white rounded-xl shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
              title="Envoyer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
