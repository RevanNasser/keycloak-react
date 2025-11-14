'use client';

import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { getKeycloak, setAuthUpdateCallback } from '@/lib/keycloak';

interface LandingPageProps {
  onLoginSuccess: () => void;
}

export default function LandingPage({ onLoginSuccess }: LandingPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [kc, setKc] = useState<ReturnType<typeof getKeycloak> | null>(null);

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

      // Initial check
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

      // Check after a short delay
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Card style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>⏳</div>
          <p>Loading...</p>
        </Card>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to docs
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card style={{
        maxWidth: '600px',
        width: '100%',
        padding: '60px 40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        borderRadius: '16px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔐</div>
          <h1 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            color: '#2c3e50',
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            Keycloak Documentation
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#7f8c8d',
            lineHeight: '1.6',
            marginBottom: '8px'
          }}>
            Interactive guide to understand how Keycloak authentication works
          </p>
          <p style={{
            fontSize: '14px',
            color: '#95a5a6',
            fontStyle: 'italic'
          }}>
            Please login to access the documentation
          </p>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '32px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2c3e50',
            marginBottom: '16px'
          }}>
            📚 What you'll learn:
          </h3>
          <ul style={{
            textAlign: 'left',
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            <li style={{ padding: '8px 0', color: '#495057' }}>
              ✓ How Keycloak authentication works
            </li>
            <li style={{ padding: '8px 0', color: '#495057' }}>
              ✓ Understanding tokens and their lifecycle
            </li>
            <li style={{ padding: '8px 0', color: '#495057' }}>
              ✓ Interactive token inspection tools
            </li>
            <li style={{ padding: '8px 0', color: '#495057' }}>
              ✓ Role-based access control examples
            </li>
            <li style={{ padding: '8px 0', color: '#495057' }}>
              ✓ API request authentication
            </li>
          </ul>
        </div>

        <Button
          label="🔑 Login with Keycloak"
          onClick={handleLogin}
          severity="success"
          size="large"
          style={{
            width: '100%',
            height: '56px',
            fontSize: '18px',
            fontWeight: '600',
            borderRadius: '8px'
          }}
        />

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '12px',
          color: '#95a5a6'
        }}>
          Secure authentication powered by Keycloak
        </p>
      </Card>
    </div>
  );
}

