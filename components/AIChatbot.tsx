'use client';

import { useState, useRef, useEffect } from 'react';
import { generateAIResponse, type AIMessage, quickReplies } from '@/lib/aiKnowledge';

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="code-lang">{language || 'code'}</span>
        <button onClick={handleCopy} className={`copy-btn ${copied ? 'copied' : ''}`}>
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="code-body">
        <code>{code}</code>
      </pre>
      <style jsx>{`
        .code-block {
          background: #0f172a;
          border-radius: 12px;
          margin: 16px 0;
          overflow: hidden;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }
        .code-header {
          background: rgba(0, 0, 0, 0.3);
          padding: 10px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }
        .code-lang {
          color: #60a5fa;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .copy-btn {
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #60a5fa;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .copy-btn:hover {
          background: rgba(59, 130, 246, 0.3);
        }
        .copy-btn.copied {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }
        .code-body {
          margin: 0;
          padding: 16px;
          overflow-x: auto;
          color: #e2e8f0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.7;
        }
      `}</style>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
          if (match) {
            const [, language, code] = match;
            return <CodeBlock key={index} code={code.trim()} language={language} />;
          }
        }

        const lines = part.split('\n');
        return (
          <div key={index}>
            {lines.map((line, lineIndex) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={lineIndex} className="bold-line">{line.slice(2, -2)}</p>;
              }
              if (line.match(/^\d+\./)) {
                return (
                  <div key={lineIndex} className="numbered-line">
                    <span className="line-number">{line.match(/^\d+/)?.[0]}.</span>
                    <span>{line.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                );
              }
              if (line.startsWith('•') || line.startsWith('-')) {
                return (
                  <div key={lineIndex} className="bullet-line">
                    <span className="bullet">•</span>
                    <span>{line.slice(1).trim()}</span>
                  </div>
                );
              }
              if (line.endsWith(':') && line.length < 50 && !line.includes('http')) {
                return <p key={lineIndex} className="header-line">{line}</p>;
              }
              if (line === '---') {
                return <hr key={lineIndex} className="line-divider" />;
              }
              if (!line.trim()) {
                return <div key={lineIndex} className="line-spacer" />;
              }
              return <p key={lineIndex} className="text-line">{line}</p>;
            })}
          </div>
        );
      })}
      <style jsx>{`
        .bold-line {
          font-weight: 700;
          margin: 10px 0;
          color: white;
        }
        .numbered-line {
          display: flex;
          gap: 10px;
          margin: 6px 0;
        }
        .line-number {
          color: #60a5fa;
          font-weight: 700;
          min-width: 20px;
        }
        .bullet-line {
          display: flex;
          gap: 10px;
          margin: 5px 0;
          padding-left: 8px;
        }
        .bullet {
          color: #60a5fa;
          font-weight: 700;
        }
        .header-line {
          font-weight: 600;
          color: #60a5fa;
          margin: 14px 0 6px 0;
          font-size: 14px;
        }
        .line-divider {
          border: none;
          border-top: 1px solid rgba(59, 130, 246, 0.3);
          margin: 16px 0;
        }
        .line-spacer {
          height: 8px;
        }
        .text-line {
          margin: 5px 0;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.9);
        }
      `}</style>
    </>
  );
}

export default function AIChatbot({ isOpen, onClose }: AIChatbotProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: 'assistant',
      content: `Hey there! 👋 I'm your Keycloak Guide.

I can help you:
• Set up Keycloak with Docker
• Troubleshoot 401/CORS errors
• Create users, roles & realms
• Understand tokens & security
• Deploy to production

What would you like to explore? 🚀`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || inputMessage;
    if (!text.trim()) return;

    const userMessage: AIMessage = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    const delay = 600 + Math.random() * 400;
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content);
      
      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Chat cleared! 👋 What would you like to know about Keycloak?`,
      timestamp: new Date()
    }]);
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-container">
        {/* Header */}
        <div className="chat-header">
          <div className="header-info">
            <div className="avatar">
              <span className="avatar-icon">🤖</span>
              <div className="avatar-pulse"></div>
            </div>
            <div className="header-text">
              <h3>Keycloak Guide</h3>
              <span className="status">
                <span className="status-dot"></span>
                Online
              </span>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={clearChat} className="action-btn" title="Clear chat">
              🗑️
            </button>
            <button onClick={onClose} className="action-btn close" title="Close">
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="messages-area" ref={scrollRef}>
          {messages.map((message, index) => (
            <div key={index} className={`message-wrapper ${message.role}`}>
              {message.role === 'assistant' && (
                <div className="message-avatar">
                  <span>🤖</span>
                </div>
              )}
              <div className="message-bubble">
                {message.role === 'user' ? (
                  <>
                    {message.content}
                    <span className="msg-time">{formatTime(message.timestamp)}</span>
                  </>
                ) : (
                  <div className="assistant-content">
                    <MessageContent content={message.content} />
                    <span className="msg-time">{formatTime(message.timestamp)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message-wrapper assistant">
              <div className="message-avatar">
                <span>🤖</span>
              </div>
              <div className="typing-bubble">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Replies */}
        {messages.length < 3 && !isTyping && (
          <div className="quick-replies">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(reply.text)}
                className="quick-reply-btn"
              >
                <span>{reply.icon}</span>
                {reply.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="input-area">
          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about Keycloak..."
              rows={1}
              className="chat-input"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isTyping}
              className={`send-btn ${!inputMessage.trim() || isTyping ? 'disabled' : ''}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .chatbot-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .chatbot-container {
          width: 90%;
          max-width: 600px;
          height: 80vh;
          max-height: 700px;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
          border-radius: 24px;
          border: 1px solid rgba(59, 130, 246, 0.3);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 100px rgba(59, 130, 246, 0.2);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Header */
        .chat-header {
          background: rgba(0, 0, 0, 0.3);
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .avatar {
          position: relative;
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
        }

        .avatar-icon {
          font-size: 22px;
          z-index: 1;
        }

        .avatar-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background: #3b82f6;
          border-radius: 14px;
          animation: avatarPulse 2s ease-out infinite;
        }

        @keyframes avatarPulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }

        .header-text h3 {
          color: white;
          font-size: 16px;
          font-weight: 700;
          margin: 0;
        }

        .status {
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          animation: statusPulse 2s infinite;
        }

        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: rgba(255, 255, 255, 0.7);
          width: 36px;
          height: 36px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
        }

        .action-btn.close:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        /* Messages */
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message-wrapper {
          display: flex;
          gap: 12px;
          animation: messageSlide 0.3s ease;
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-wrapper.user {
          justify-content: flex-end;
        }

        .message-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .message-bubble {
          max-width: 75%;
          padding: 14px 18px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.6;
          color: white;
          position: relative;
        }

        .message-wrapper.user .message-bubble {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-bottom-right-radius: 4px;
        }

        .assistant-content {
          background: rgba(255, 255, 255, 0.05);
          padding: 16px 20px;
          border-radius: 18px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-bottom-left-radius: 4px;
        }

        .msg-time {
          display: block;
          font-size: 11px;
          opacity: 0.6;
          margin-top: 8px;
          text-align: right;
        }

        .typing-bubble {
          background: rgba(255, 255, 255, 0.05);
          padding: 18px 24px;
          border-radius: 18px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          display: flex;
          gap: 6px;
          align-items: center;
          border-bottom-left-radius: 4px;
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
          animation: typingBounce 1.4s infinite ease-in-out both;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0.6); }
          40% { transform: scale(1); }
        }

        /* Quick Replies */
        .quick-replies {
          padding: 16px 24px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          background: rgba(0, 0, 0, 0.2);
          border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        .quick-reply-btn {
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #60a5fa;
          padding: 10px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .quick-reply-btn:hover {
          background: rgba(59, 130, 246, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        /* Input */
        .input-area {
          padding: 20px 24px;
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        .input-wrapper {
          display: flex;
          gap: 12px;
          align-items: flex-end;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 6px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          transition: all 0.2s;
        }

        .input-wrapper:focus-within {
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
        }

        .chat-input {
          flex: 1;
          background: transparent;
          border: none;
          padding: 12px 16px;
          font-size: 14px;
          color: white;
          resize: none;
          outline: none;
          font-family: inherit;
          min-height: 24px;
          max-height: 120px;
        }

        .chat-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .send-btn {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .send-btn:hover:not(.disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }

        .send-btn.disabled {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.3);
          cursor: not-allowed;
        }

        @media (max-width: 600px) {
          .chatbot-container {
            width: 100%;
            height: 100%;
            max-height: none;
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
}
