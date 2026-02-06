'use client';

import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { getKeycloak, setAuthUpdateCallback, getTokenInfo, getKeycloakConfigForDisplay, type TokenInfo } from '@/lib/keycloak';
import { httpClient } from '@/lib/httpClient';
import AIChatbot from '@/components/AIChatbot';

interface DocumentationPageProps {
  onLogout: () => void;
}

export default function DocumentationPage({ onLogout }: DocumentationPageProps) {
  const [infoMessage, setInfoMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [keycloakReady, setKeycloakReady] = useState(false);
  const [kc, setKc] = useState<ReturnType<typeof getKeycloak> | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tokens');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const keycloak = getKeycloak();
      setKc(keycloak);

      setAuthUpdateCallback(() => {
        if (keycloak) {
          const authStatus = keycloak.authenticated || false;
          setIsAuthenticated(authStatus);
          setKeycloakReady(true);
          if (!authStatus) {
            onLogout();
          }
        }
      });

      const checkAuth = () => {
        if (keycloak) {
          const authStatus = keycloak.authenticated || false;
          setIsAuthenticated(authStatus);
          setKeycloakReady(true);
          if (!authStatus) {
            onLogout();
          }
        }
      };

      checkAuth();

      const timeout = setTimeout(() => {
        checkAuth();
      }, 500);

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          setTimeout(checkAuth, 100);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      const interval = setInterval(checkAuth, 2000);

      return () => {
        setAuthUpdateCallback(null);
        clearTimeout(timeout);
        clearInterval(interval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [onLogout]);

  useEffect(() => {
    if (kc?.authenticated && keycloakReady) {
      const info = getTokenInfo(kc);
      setTokenInfo(info);
      if (kc.token) {
        httpClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;
      }
    } else {
      setTokenInfo(null);
    }
  }, [isAuthenticated, keycloakReady, kc]);

  const handleLogout = () => {
    if (kc) {
      kc.logout({ redirectUri: window.location.origin + '/' });
    }
    onLogout();
  };

  const config = getKeycloakConfigForDisplay();

  const tools = [
    { 
      id: 'status', 
      label: 'Check Status', 
      icon: '✓',
      action: () => setInfoMessage(`✅ Authentication Status: ${kc?.authenticated ? 'TRUE' : 'FALSE'}\n\nYou are currently authenticated and your session is active.`),
      desc: 'Verify your login status'
    },
    { 
      id: 'token', 
      label: 'View Token', 
      icon: '🎫',
      action: () => {
        if (!kc?.token) return;
        const token = kc.token;
        setInfoMessage(`🎫 Access Token (first 100 characters):\n\n${token.substring(0, 100)}...\n\n📋 Full token has been logged to browser console`);
        console.log('Full Access Token:', token);
      },
      desc: 'See your JWT token'
    },
    { 
      id: 'parsed', 
      label: 'Parsed Token', 
      icon: '📋',
      action: () => {
        if (!kc?.tokenParsed) return;
        const parsed = kc.tokenParsed;
        setInfoMessage(`📋 Parsed Token:\n\n${JSON.stringify(parsed, null, 2)}\n\n📝 Full details logged to console.`);
        console.log('Parsed Token:', parsed);
      },
      desc: 'Decode token contents'
    },
    { 
      id: 'expiry', 
      label: 'Check Expiry', 
      icon: '⏰',
      action: () => {
        if (!kc) return;
        const expired = kc.isTokenExpired(5);
        setInfoMessage(`⏰ Token Expiration Check:\n\nExpires in 5 seconds: ${expired ? 'YES ⚠️' : 'NO ✅'}\n\nToken expires at: ${tokenInfo?.expiresAt}\n\nYour token is ${expired ? 'about to expire' : 'still valid'}.`);
      },
      desc: 'Check token validity'
    },
    { 
      id: 'refresh', 
      label: 'Refresh Token', 
      icon: '🔄',
      action: () => {
        if (!kc) return;
        kc.updateToken(10)
          .then((refreshed) => {
            setInfoMessage(`🔄 Token Refresh:\n\nToken refreshed: ${refreshed ? 'YES ✅' : 'NO (still valid)'}\n\nNew token has been logged to console.\n\nYour session has been extended.`);
            const info = getTokenInfo(kc);
            setTokenInfo(info);
            console.log('New token:', kc.token);
          })
          .catch((e: any) => {
            setInfoMessage(`❌ Refresh Error:\n\n${e.message}\n\nPlease try logging in again.`);
          });
      },
      desc: 'Get fresh token'
    },
    { 
      id: 'admin', 
      label: 'Check Admin Role', 
      icon: '👤',
      action: () => {
        if (!kc) return;
        const hasAdmin = kc.hasRealmRole('admin');
        setInfoMessage(`👤 Realm Role Check:\n\nHas realm role "admin": ${hasAdmin ? 'YES ✅' : 'NO ❌'}\n\n💡 To assign this role:\n1. Go to Keycloak Admin Console\n2. Navigate to Users → Your User → Role Mappings\n3. Assign the "admin" realm role`);
      },
      desc: 'Verify admin access'
    },
  ];

  if (!isAuthenticated || !kc) {
    return null;
  }

  return (
    <div className="docs-page">
      {/* Animated Background */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      {/* Header */}
      <header className="docs-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">🔐</div>
            <div>
              <h1>Keycloak Interactive</h1>
              <p>Explore authentication in real-time</p>
            </div>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                {tokenInfo?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-details">
                <span className="username">{tokenInfo?.username || 'User'}</span>
                <span className="user-email">{tokenInfo?.email || 'No email'}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="docs-main">
        {/* Success Banner */}
        <div className="success-banner">
          <div className="success-icon">🎉</div>
          <div className="success-content">
            <h3>Welcome back, {tokenInfo?.username || 'User'}!</h3>
            <p>You are successfully authenticated. Explore the tools below to learn about your tokens and session.</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="docs-grid">
          {/* Left Column - Tools */}
          <div className="tools-section">
            <h2 className="section-title">
              <span className="title-icon">🛠️</span>
              Interactive Tools
            </h2>
            <div className="tools-grid">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={tool.action}
                  className="tool-card"
                >
                  <div className="tool-icon">{tool.icon}</div>
                  <h4>{tool.label}</h4>
                  <p>{tool.desc}</p>
                  <div className="tool-glow"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Token Info & Output */}
          <div className="info-section">
            {/* Token Info Card */}
            {tokenInfo && (
              <div className="token-card">
                <h3 className="card-title">
                  <span>🎫</span>
                  Your Token Info
                </h3>
                <div className="token-details">
                  <div className="detail-row">
                    <span className="detail-label">User ID</span>
                    <span className="detail-value mono">{tokenInfo.subject}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Username</span>
                    <span className="detail-value">{tokenInfo.username || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{tokenInfo.email || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Realm</span>
                    <span className="detail-value">{tokenInfo.realm}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Expires</span>
                    <span className="detail-value">{tokenInfo.expiresAt}</span>
                  </div>
                  {tokenInfo.roles.length > 0 && (
                    <div className="detail-row roles">
                      <span className="detail-label">Roles</span>
                      <div className="roles-list">
                        {tokenInfo.roles.map((role, idx) => (
                          <span key={idx} className="role-badge">{role}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Output Panel */}
            <div className="output-panel">
              <h3 className="card-title">
                <span>📊</span>
                Output Console
              </h3>
              <div className="output-content">
                {infoMessage ? (
                  <pre className="output-text">{infoMessage}</pre>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">👆</div>
                    <p>Click a tool above to see results here</p>
                    <span className="empty-hint">Explore your authentication data</span>
                  </div>
                )}
              </div>
            </div>

            {/* Config Card */}
            <div className="config-card">
              <h3 className="card-title">
                <span>⚙️</span>
                Configuration
              </h3>
              <div className="config-details">
                <div className="config-item">
                  <span className="config-label">URL</span>
                  <code className="config-value">{config.url}</code>
                </div>
                <div className="config-item">
                  <span className="config-label">Realm</span>
                  <code className="config-value">{config.realm}</code>
                </div>
                <div className="config-item">
                  <span className="config-label">Client ID</span>
                  <code className="config-value">{config.clientId}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Chatbot */}
      <AIChatbot isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />

      {/* Floating AI Button */}
      <button
        onClick={() => setIsAIChatOpen(!isAIChatOpen)}
        className="floating-ai-btn"
      >
        <div className="btn-ripple"></div>
        <span className="btn-icon">{isAIChatOpen ? '✕' : '🤖'}</span>
        {!isAIChatOpen && <span className="btn-text">Ask AI</span>}
      </button>

      <style jsx>{`
        .docs-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #0f172a 50%, #1e3a8a 100%);
          position: relative;
          overflow-x: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Background Orbs */
        .bg-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          animation: float 20s ease-in-out infinite;
          pointer-events: none;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
          top: -100px;
          right: -100px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #1d4ed8 0%, transparent 70%);
          bottom: -100px;
          left: -100px;
          animation-delay: -7s;
        }

        .orb-3 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, #60a5fa 0%, transparent 70%);
          top: 50%;
          left: 50%;
          animation-delay: -14s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        /* Header */
        .docs-header {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
          padding: 16px 40px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
        }

        .header-left h1 {
          color: white;
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        .header-left p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          margin: 2px 0 0 0;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 16px;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .username {
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .user-email {
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
        }

        .logout-btn {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: translateY(-2px);
        }

        /* Main Content */
        .docs-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px;
        }

        /* Success Banner */
        .success-banner {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 16px;
          padding: 24px 32px;
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 40px;
          backdrop-filter: blur(10px);
        }

        .success-icon {
          font-size: 40px;
          animation: bounce 1s ease infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .success-content h3 {
          color: white;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 6px 0;
        }

        .success-content p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin: 0;
        }

        /* Grid Layout */
        .docs-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 40px;
        }

        /* Section Title */
        .section-title {
          color: white;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .title-icon {
          font-size: 28px;
        }

        /* Tools Grid */
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .tool-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .tool-card:hover {
          transform: translateY(-4px);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.2);
        }

        .tool-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .tool-card h4 {
          color: white;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 6px 0;
        }

        .tool-card p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          margin: 0;
        }

        .tool-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          background: #3b82f6;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }

        .tool-card:hover .tool-glow {
          opacity: 0.3;
        }

        /* Info Section */
        .info-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Cards */
        .token-card,
        .output-panel,
        .config-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
        }

        .card-title {
          background: rgba(0, 0, 0, 0.2);
          padding: 16px 24px;
          margin: 0;
          color: white;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Token Details */
        .token-details {
          padding: 20px 24px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row.roles {
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }

        .detail-label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
        }

        .detail-value {
          color: white;
          font-size: 14px;
          font-weight: 500;
        }

        .detail-value.mono {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #60a5fa;
        }

        .roles-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .role-badge {
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #60a5fa;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        /* Output Panel */
        .output-content {
          padding: 20px 24px;
          min-height: 200px;
          max-height: 300px;
          overflow-y: auto;
        }

        .output-text {
          color: #e2e8f0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.7;
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          text-align: center;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 16px;
          margin: 0 0 8px 0;
        }

        .empty-hint {
          color: rgba(255, 255, 255, 0.4);
          font-size: 13px;
        }

        /* Config Card */
        .config-details {
          padding: 20px 24px;
        }

        .config-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .config-item:last-child {
          border-bottom: none;
        }

        .config-label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
        }

        .config-value {
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
          padding: 4px 12px;
          border-radius: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
        }

        /* Floating AI Button */
        .floating-ai-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border: none;
          color: white;
          padding: 16px 24px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
          z-index: 1000;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
        }

        .floating-ai-btn:hover {
          transform: scale(1.05) translateY(-3px);
          box-shadow: 0 15px 40px rgba(59, 130, 246, 0.5);
        }

        .btn-ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: ripple 2s ease-out infinite;
        }

        @keyframes ripple {
          0% { width: 0; height: 0; opacity: 1; }
          100% { width: 200px; height: 200px; opacity: 0; }
        }

        .btn-icon {
          font-size: 20px;
          position: relative;
          z-index: 1;
        }

        .btn-text {
          position: relative;
          z-index: 1;
        }

        @media (max-width: 900px) {
          .docs-grid {
            grid-template-columns: 1fr;
          }

          .tools-grid {
            grid-template-columns: 1fr;
          }

          .header-content {
            flex-direction: column;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}
