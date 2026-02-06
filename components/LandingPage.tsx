'use client';

import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { getKeycloak, setAuthUpdateCallback } from '@/lib/keycloak';
import AIChatbot from '@/components/AIChatbot';

interface LandingPageProps {
  onLoginSuccess: () => void;
}

export default function LandingPage({ onLoginSuccess }: LandingPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [kc, setKc] = useState<ReturnType<typeof getKeycloak> | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const keycloak = getKeycloak();
      setKc(keycloak);

      setAuthUpdateCallback(() => {
        if (keycloak) {
          const authStatus = keycloak.authenticated || false;
          setIsAuthenticated(authStatus);
          setIsLoading(false);
          if (authStatus) {
            onLoginSuccess();
          }
        }
      });

      const checkAuth = () => {
        if (keycloak) {
          const authStatus = keycloak.authenticated || false;
          setIsAuthenticated(authStatus);
          setIsLoading(false);
          if (authStatus) {
            onLoginSuccess();
          }
        }
      };

      checkAuth();

      const timeout = setTimeout(() => {
        checkAuth();
      }, 500);

      return () => {
        setAuthUpdateCallback(null);
        clearTimeout(timeout);
      };
    }
  }, [onLoginSuccess]);

  const handleLogin = () => {
    kc?.login();
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="lock-icon">🔐</div>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
          <p className="loading-text">Securing your session...</p>
        </div>
        <style jsx>{`
          .loading-screen {
            min-height: 100vh;
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .loading-container {
            text-align: center;
          }
          .lock-icon {
            font-size: 64px;
            animation: bounce 1s ease infinite;
            margin-bottom: 30px;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          .loading-bar {
            width: 200px;
            height: 4px;
            background: rgba(255,255,255,0.2);
            border-radius: 2px;
            overflow: hidden;
            margin: 0 auto 20px;
          }
          .loading-progress {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #60a5fa);
            border-radius: 2px;
            animation: load 2s ease-in-out infinite;
          }
          @keyframes load {
            0% { width: 0%; margin-left: 0%; }
            50% { width: 100%; margin-left: 0%; }
            100% { width: 0%; margin-left: 100%; }
          }
          .loading-text {
            color: rgba(255,255,255,0.7);
            font-size: 14px;
            animation: pulse 1.5s ease infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const features = [
    { icon: '📚', title: 'Complete Documentation', desc: 'Step-by-step guides for Keycloak setup and integration with React', color: '#3b82f6' },
    { icon: '🎯', title: 'Live Demo', desc: 'Interactive playground to test authentication flow in real-time', color: '#1e40af' },
    { icon: '🔧', title: 'Integration Examples', desc: 'Working code samples for React, Next.js, and API integration', color: '#1d4ed8' },
    { icon: '🛠️', title: 'Troubleshooting Tools', desc: 'Debug tokens, check roles, and diagnose common issues', color: '#2563eb' },
  ];

  const steps = [
    { num: 1, title: 'Read Docs', desc: 'Learn Keycloak concepts and setup', icon: '📖' },
    { num: 2, title: 'Try Demo', desc: 'Login and explore live features', icon: '🎯' },
    { num: 3, title: 'Inspect Tokens', desc: 'View and analyze JWT tokens', icon: '🔍' },
    { num: 4, title: 'Integrate', desc: 'Copy code patterns to your app', icon: '💻' },
  ];

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Header */}
        <header className="header">
          <div className="logo-container">
            <div className="logo-glow"></div>
            <span className="logo-text">🔐 Keycloak Guide</span>
          </div>
          <div className="header-badge">
            <span className="pulse-dot"></span>
            Interactive Documentation
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="gradient-text">Keycloak Integration</span>
              <br />
              <span className="subtitle">Documentation & Demo</span>
            </h1>
            <p className="hero-description">
              A complete interactive guide to integrating Keycloak authentication into your React applications. 
              Learn setup, configuration, token management, and troubleshooting with live examples and hands-on tools.
            </p>
            
            <div className="cta-container">
              <Button
                label="🚀 Start Exploring"
                onClick={handleLogin}
                className="cta-button"
              />
              <div className="stats">
                <div className="stat">
                  <span className="stat-number">5min</span>
                  <span className="stat-label">Setup Time</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Config Files</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Interactive</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards with hover animation */}
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-border"></div>
                <div className="feature-icon-wrapper" style={{ background: feature.color }}>
                  <span className="feature-emoji">{feature.icon}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
                <div className="card-glow" style={{ background: feature.color }}></div>
              </div>
            ))}
          </div>
        </section>

        {/* Test User Info */}
        <section className="test-user-section">
          <div className="test-user-card">
            <div className="test-user-icon">👤</div>
            <div className="test-user-content">
              <h3>Ready to Test?</h3>
              <p>Use these credentials to login and explore:</p>
              <div className="credentials">
                <div className="credential-item">
                  <span className="credential-label">Username:</span>
                  <code className="credential-value">github</code>
                </div>
                <div className="credential-item">
                  <span className="credential-label">Password:</span>
                  <code className="credential-value">github</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Steps */}
        <section className="steps-section">
          <h2 className="section-title">
            <span className="title-highlight">How It Works</span>
          </h2>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-item" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="step-connector"></div>
                <div className="step-card">
                  <div className="step-number">{step.num}</div>
                  <div className="step-icon">{step.icon}</div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Demo Preview */}
        <section className="demo-preview">
          <div className="demo-window">
            <div className="window-header">
              <div className="window-dot red"></div>
              <div className="window-dot yellow"></div>
              <div className="window-dot green"></div>
              <span className="window-title">Keycloak Admin Console</span>
            </div>
            <div className="window-content">
              <div className="mock-sidebar">
                <div className="mock-item active">🏠 Dashboard</div>
                <div className="mock-item">👥 Users</div>
                <div className="mock-item">🔌 Clients</div>
                <div className="mock-item">🎭 Roles</div>
              </div>
              <div className="mock-main">
                <div className="mock-card">
                  <h5>Quick Setup Guide</h5>
                  <div className="mock-progress">
                    <div className="mock-progress-bar" style={{ width: '75%' }}></div>
                  </div>
                  <p>3 of 4 steps completed</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* AI Assistant */}
      <AIChatbot isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />

      {/* Floating AI Button */}
      <button
        onClick={() => setIsAIChatOpen(!isAIChatOpen)}
        className="floating-ai-button"
      >
        <div className="button-ripple"></div>
        <span className="button-icon">{isAIChatOpen ? '✕' : '🤖'}</span>
        {!isAIChatOpen && <span className="button-label">Ask AI</span>}
      </button>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: #0a0a0a;
          position: relative;
          overflow-x: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Animated Background */
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          animation: float 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
          top: -200px;
          left: -200px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #1e40af 0%, transparent 70%);
          bottom: -150px;
          right: -150px;
          animation-delay: -5s;
        }

        .orb-3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #1d4ed8 0%, transparent 70%);
          top: 50%;
          left: 50%;
          animation-delay: -10s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        /* Content Wrapper */
        .content-wrapper {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 60px;
        }

        .logo-container {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-glow {
          position: absolute;
          width: 60px;
          height: 60px;
          background: #3b82f6;
          border-radius: 50%;
          filter: blur(20px);
          opacity: 0.5;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }

        .logo-text {
          font-size: 24px;
          font-weight: 700;
          color: white;
          position: relative;
          z-index: 1;
        }

        .header-badge {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 20px;
          color: white;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          animation: blink 1.5s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Hero Section */
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          margin-bottom: 80px;
        }

        .hero-title {
          font-size: 56px;
          font-weight: 800;
          color: white;
          line-height: 1.1;
          margin-bottom: 24px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: 40px;
          font-weight: 600;
        }

        .hero-description {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.7;
          margin-bottom: 40px;
          max-width: 500px;
        }

        .cta-container {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        :global(.cta-button) {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
          border: none !important;
          padding: 18px 40px !important;
          font-size: 18px !important;
          font-weight: 700 !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4) !important;
          transition: all 0.3s ease !important;
          width: fit-content !important;
        }

        :global(.cta-button:hover) {
          transform: translateY(-3px) scale(1.02) !important;
          box-shadow: 0 15px 40px rgba(59, 130, 246, 0.5) !important;
        }

        .stats {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-number {
          font-size: 28px;
          font-weight: 800;
          color: white;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
        }

        /* Feature Cards with new hover animation */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          animation: fadeInUp 0.6s ease-out backwards;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .feature-card:hover {
          transform: translateY(-8px);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 0 30px rgba(59, 130, 246, 0.2);
        }

        .card-border {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          padding: 1px;
          background: linear-gradient(135deg, transparent, rgba(59, 130, 246, 0.3), transparent);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .feature-card:hover .card-border {
          opacity: 1;
        }

        .card-glow {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .feature-card:hover .card-glow {
          opacity: 0.4;
        }

        .feature-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-card:hover .feature-icon-wrapper {
          transform: scale(1.1) rotate(5deg);
        }

        .feature-emoji {
          font-size: 28px;
        }

        .feature-card h3 {
          color: white;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
          transition: color 0.3s;
        }

        .feature-card:hover h3 {
          color: #60a5fa;
        }

        .feature-card p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          line-height: 1.5;
        }

        /* Steps Section */
        .steps-section {
          margin-bottom: 80px;
        }

        .section-title {
          font-size: 36px;
          color: white;
          text-align: center;
          margin-bottom: 50px;
          font-weight: 700;
        }

        .title-highlight {
          color: #3b82f6;
        }

        .steps-container {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .step-item {
          position: relative;
          animation: fadeInUp 0.6s ease-out backwards;
        }

        .step-connector {
          position: absolute;
          top: 30px;
          left: 100%;
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, transparent);
        }

        .step-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          width: 200px;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .step-card:hover {
          transform: translateY(-5px) scale(1.02);
          border-color: #3b82f6;
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.2);
        }

        .step-number {
          position: absolute;
          top: -10px;
          left: -10px;
          width: 30px;
          height: 30px;
          background: #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 14px;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
          z-index: 10;
        }

        .step-icon {
          font-size: 32px;
          margin-bottom: 12px;
          transition: transform 0.3s;
        }

        .step-card:hover .step-icon {
          transform: scale(1.2);
        }

        .step-card h4 {
          color: white;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .step-card p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
        }

        /* Test User Section */
        .test-user-section {
          display: flex;
          justify-content: center;
          margin-bottom: 60px;
        }

        .test-user-card {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 20px;
          padding: 32px 40px;
          display: flex;
          align-items: center;
          gap: 24px;
          max-width: 600px;
          width: 100%;
          animation: fadeInUp 0.6s ease-out;
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.2);
        }

        .test-user-icon {
          font-size: 48px;
          animation: bounce 2s ease infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .test-user-content h3 {
          color: white;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .test-user-content p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          margin: 0 0 16px 0;
        }

        .credentials {
          display: flex;
          gap: 20px;
        }

        .credential-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .credential-label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
        }

        .credential-value {
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.4);
          color: #60a5fa;
          padding: 6px 12px;
          border-radius: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          font-weight: 600;
        }

        @media (max-width: 600px) {
          .test-user-card {
            flex-direction: column;
            text-align: center;
            padding: 24px;
          }

          .credentials {
            flex-direction: column;
            gap: 12px;
          }
        }

        /* Demo Preview */
        .demo-preview {
          display: flex;
          justify-content: center;
          margin-bottom: 60px;
        }

        .demo-window {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          width: 100%;
          max-width: 700px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: fadeInUp 0.8s ease-out;
        }

        .window-header {
          background: rgba(255, 255, 255, 0.05);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .window-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .window-dot.red { background: #ff5f57; }
        .window-dot.yellow { background: #febc2e; }
        .window-dot.green { background: #28c840; }

        .window-title {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          margin-left: 12px;
        }

        .window-content {
          display: flex;
          height: 250px;
        }

        .mock-sidebar {
          width: 150px;
          background: rgba(255, 255, 255, 0.03);
          padding: 16px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mock-item {
          padding: 10px 12px;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
          margin-bottom: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mock-item:hover,
        .mock-item.active {
          background: rgba(59, 130, 246, 0.2);
          color: white;
        }

        .mock-main {
          flex: 1;
          padding: 24px;
        }

        .mock-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
        }

        .mock-card h5 {
          color: white;
          margin-bottom: 16px;
          font-size: 16px;
        }

        .mock-progress {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .mock-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          border-radius: 4px;
          animation: progress 2s ease-in-out infinite;
        }

        @keyframes progress {
          0%, 100% { width: 75%; }
          50% { width: 85%; }
        }

        .mock-card p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
        }

        /* Floating AI Button */
        .floating-ai-button {
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

        .floating-ai-button:hover {
          transform: scale(1.05) translateY(-3px);
          box-shadow: 0 15px 40px rgba(59, 130, 246, 0.5);
        }

        .button-ripple {
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

        .button-icon {
          font-size: 20px;
          position: relative;
          z-index: 1;
        }

        .button-label {
          position: relative;
          z-index: 1;
        }

        @media (max-width: 900px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .hero-title {
            font-size: 40px;
          }

          .subtitle {
            font-size: 28px;
          }

          .features-grid {
            order: -1;
          }

          .stats {
            justify-content: center;
          }

          .steps-container {
            flex-direction: column;
            align-items: center;
          }

          .step-connector {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
