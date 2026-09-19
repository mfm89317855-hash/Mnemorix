import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, Zap } from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';

export const SentinelCopilotDrawer: React.FC = () => {
  const { isCopilotOpen, setIsCopilotOpen, copilotMessages, sendCopilotMessage, isCopilotTyping } = useSentinel();
  const [inputPrompt, setInputPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCopilotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [copilotMessages, isCopilotOpen, isCopilotTyping]);

  if (!isCopilotOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isCopilotTyping) return;
    sendCopilotMessage(inputPrompt.trim());
    setInputPrompt('');
  };

  const quickPrompts = [
    'How does Merkle DAG detect memory tampering?',
    'Explain 3-Layer Firewall defense pipeline',
    'How to prevent Indirect Prompt Injection in RAG?',
    'Show NIST AI RMF governance checklist',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white border-l border-slate-200 shadow-2xl flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 bg-slate-50">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 border border-red-700 text-white shadow-md shadow-red-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display text-sm font-bold text-slate-900">Sentinel AI Copilot</span>
              <span className="rounded-md bg-red-100 px-1.5 py-0.5 text-[9px] font-mono text-red-700 font-bold border border-red-200">
                Gemini 2.5 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Autonomous Memory Security Advisor</p>
          </div>
        </div>

        <button
          onClick={() => setIsCopilotOpen(false)}
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-200 transition-all"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50/70 flex items-center space-x-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-mono text-red-600 font-semibold shrink-0 flex items-center">
          <Zap className="h-3 w-3 mr-1" /> Quick Prompts:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => sendCopilotMessage(qp)}
            className="shrink-0 rounded-full border border-slate-200 bg-white hover:border-red-300 hover:bg-red-50 hover:text-red-700 px-3 py-1 text-[11px] font-mono text-slate-600 transition-all whitespace-nowrap shadow-2xs"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans bg-slate-50/30">
        {copilotMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                msg.sender === 'user'
                  ? 'bg-slate-800 border-slate-900 text-white'
                  : 'bg-red-50 border-red-200 text-red-600'
              }`}
            >
              {msg.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-red-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-800'
              }`}
            >
              <div className="prose prose-xs max-w-none whitespace-pre-wrap font-sans">
                {msg.text}
              </div>
              <div className={`mt-2 flex justify-end text-[9px] font-mono ${
                msg.sender === 'user' ? 'text-red-100' : 'text-slate-400'
              }`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isCopilotTyping && (
          <div className="flex items-start space-x-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600">
              <Bot className="h-3.5 w-3.5 animate-spin" />
            </div>
            <div className="rounded-2xl p-3 border border-red-200 bg-red-50/60 flex items-center space-x-2 text-red-700 text-xs font-mono">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
              <span>Sentinel Copilot analyzing neural memory telemetry...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="border-t border-slate-200 p-4 bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask Copilot about memory attacks, hash verification, or policies..."
            disabled={isCopilotTyping}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-3.5 pr-12 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isCopilotTyping}
            className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-30 text-white transition-all shadow-md active:scale-95"
          >
            <Send className="h-3.5 w-3.5 font-bold" />
          </button>
        </div>
      </form>
    </div>
  );
};
