'use client';

import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { getKeycloak, setAuthUpdateCallback, getTokenInfo, getKeycloakConfigForDisplay, type TokenInfo } from '@/lib/keycloak';
import { httpClient } from '@/lib/httpClient';

interface DocumentationPageProps {
  onLogout: () => void;
}

export default function DocumentationPage({ onLogout }: DocumentationPageProps) {
  const [infoMessage, setInfoMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [keycloakReady, setKeycloakReady] = useState(false);
  const [kc, setKc] = useState<ReturnType<typeof getKeycloak> | null>(null);

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

  const callBackend = async () => {
    if (!kc?.token) {
      setInfoMessage('❌ No access token available. Please login first.');
      return;
    }

    setInfoMessage('⏳ Sending API request with your access token...\n\nThis demonstrates how your Keycloak token is automatically included in API requests.');

    try {
      // Show what we're sending
      const tokenPreview = kc.token.substring(0, 50) + '...';
      const requestInfo = `📤 Request Details:\n\nURL: https://mockbin.com/request\nMethod: GET\n\n🔑 Authorization Header:\nBearer ${tokenPreview}\n\n⏳ Sending request...`;

      setInfoMessage(requestInfo);

      const response = await httpClient.get('https://mockbin.com/request');
      
      // Extract request info from response (mockbin returns the request it received)
      const requestReceived = response.data;
      const authHeader = requestReceived?.headers?.['authorization'] || requestReceived?.headers?.['Authorization'] || 'Not found';
      
      const successMessage = `✅ API Request Successful!\n\n📊 Response Status: ${response.status} ${response.statusText}\n\n🔑 Token Sent in Request:\nThe Authorization header was automatically included:\n\n${authHeader.substring(0, 80)}...\n\n📋 What This Demonstrates:\n• Your Keycloak access token was sent in the HTTP Authorization header\n• The backend API received your token (see above)\n• In a real application, the server would:\n  - Validate the token with Keycloak\n  - Verify your identity\n  - Check your permissions\n  - Return data specific to you\n\n🌐 Real-World Use Cases:\n• Fetching your user profile: GET /api/users/me\n• Loading your orders: GET /api/orders\n• Creating posts: POST /api/posts\n• Updating settings: PUT /api/settings\n\n💡 This is how your frontend communicates with backend APIs securely!\n\n📝 Check browser console (F12) for full request/response details.`;

      setInfoMessage(successMessage);
      console.log('=== API Request with Token ===');
      console.log('Request URL:', 'https://mockbin.com/request');
      console.log('Authorization Header:', `Bearer ${kc.token.substring(0, 50)}...`);
      console.log('Full Response:', response);
      console.log('Request Headers Sent:', response.config?.headers);
    } catch (error: any) {
      const errorMessage = `❌ API Request Failed\n\nError: ${error.message}\n\nStatus: ${error.response?.status || 'N/A'}\n\nThis could mean:\n• Network connectivity issue\n• The API endpoint is unavailable\n• CORS restrictions\n\n💡 Check browser console (F12) for detailed error information.`;
      setInfoMessage(errorMessage);
      console.error('API Request Error:', error);
      console.error('Error Details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
  };

  const handleLogout = () => {
    if (kc) {
      kc.logout({ redirectUri: window.location.origin + '/' });
    }
    onLogout();
  };

  const config = getKeycloakConfigForDisplay();

  if (!isAuthenticated || !kc) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {/* Modern Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '24px 0',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: '32px', 
                fontWeight: '700',
                letterSpacing: '-0.5px'
              }}>
                🔐 Keycloak Documentation
              </h1>
              <p style={{ 
                margin: '8px 0 0 0', 
                fontSize: '15px', 
                color: 'rgba(255,255,255,0.9)',
                fontWeight: '300'
              }}>
                Interactive guide to Keycloak authentication
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ 
                textAlign: 'right',
                paddingRight: '20px',
                borderRight: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>
                  Logged in as
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                  {tokenInfo?.username || tokenInfo?.email || 'User'}
                </div>
              </div>
              <Button
                label="Logout"
                severity="danger"
                onClick={handleLogout}
                size="small"
                style={{
                  fontWeight: '600',
                  borderRadius: '8px'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Success Banner */}
        <Card style={{
          background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
          border: '2px solid #667eea',
          padding: '24px',
          marginBottom: '32px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(102, 126, 234, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              fontSize: '32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}>
              ✅
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                margin: '0 0 6px 0', 
                color: '#2c3e50',
                fontSize: '20px',
                fontWeight: '600'
              }}>
                Authentication Successful
              </h3>
              <p style={{ 
                margin: 0, 
                color: '#5a6c7d',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                You are authenticated with Keycloak. Your access token is automatically included in all API requests. Explore the documentation and interactive tools below.
              </p>
            </div>
          </div>
        </Card>

        {/* Three Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          {/* Left Column - Documentation */}
          <div>
            <Card style={{
              marginBottom: '24px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e1e8ed'
            }}>
              <div style={{ padding: '24px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    fontSize: '24px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    📚
                  </div>
                  <h2 style={{
                    margin: 0,
                    fontSize: '22px',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>
                    How Keycloak Works
                  </h2>
                </div>

                <div style={{ textAlign: 'left', lineHeight: '1.8', color: '#5a6c7d' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600',
                      color: '#2c3e50',
                      marginBottom: '12px'
                    }}>
                      What is Keycloak?
                    </h3>
                    <p style={{ marginBottom: '12px', fontSize: '14px' }}>
                      Keycloak is an open-source identity and access management solution. It handles:
                    </p>
                    <ul style={{ 
                      margin: 0, 
                      paddingLeft: '20px',
                      fontSize: '14px'
                    }}>
                      <li style={{ marginBottom: '8px' }}>
                        <strong style={{ color: '#2c3e50' }}>Authentication:</strong> Verifying who you are
                      </li>
                      <li style={{ marginBottom: '8px' }}>
                        <strong style={{ color: '#2c3e50' }}>Authorization:</strong> What you can access
                      </li>
                      <li style={{ marginBottom: '8px' }}>
                        <strong style={{ color: '#2c3e50' }}>Single Sign-On (SSO):</strong> Login once, access multiple apps
                      </li>
                    </ul>
                  </div>

                  <Divider />

                  <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600',
                      color: '#2c3e50',
                      marginBottom: '12px'
                    }}>
                      🔄 Authentication Flow
                    </h3>
                    <ol style={{ 
                      margin: 0, 
                      paddingLeft: '20px',
                      fontSize: '14px'
                    }}>
                      <li style={{ marginBottom: '8px' }}>User clicks "Login" → Redirected to Keycloak</li>
                      <li style={{ marginBottom: '8px' }}>User enters credentials on Keycloak</li>
                      <li style={{ marginBottom: '8px' }}>Keycloak validates and issues tokens</li>
                      <li style={{ marginBottom: '8px' }}>User redirected back to app with tokens</li>
                      <li style={{ marginBottom: '8px' }}>App uses tokens for API requests</li>
                    </ol>
                  </div>

                  <Divider />

                  <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600',
                      color: '#2c3e50',
                      marginBottom: '12px'
                    }}>
                      🎫 About Tokens
                    </h3>
                    <div style={{ fontSize: '14px' }}>
                      <p style={{ marginBottom: '10px' }}>
                        <strong style={{ color: '#2c3e50' }}>Access Token:</strong> Short-lived token (usually 5-15 min) used to access APIs
                      </p>
                      <p style={{ marginBottom: '10px' }}>
                        <strong style={{ color: '#2c3e50' }}>Refresh Token:</strong> Used to get new access tokens without re-login
                      </p>
                      <p style={{ marginBottom: '10px' }}>
                        <strong style={{ color: '#2c3e50' }}>ID Token:</strong> Contains user identity information
                      </p>
                    </div>
                  </div>

                  <Divider />

                  {/* API Requests with Tokens documentation - commented out, can be uncommented later if needed
                  <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600',
                      color: '#2c3e50',
                      marginBottom: '12px'
                    }}>
                      🌐 API Requests with Tokens
                    </h3>
                    <div style={{ fontSize: '14px' }}>
                      <p style={{ marginBottom: '12px' }}>
                        <strong style={{ color: '#2c3e50' }}>What are API requests?</strong> API requests are calls to <strong>backend servers</strong> (not other pages/screens). They're used to:
                      </p>
                      <ul style={{ 
                        margin: '0 0 12px 0', 
                        paddingLeft: '20px',
                        fontSize: '13px'
                      }}>
                        <li style={{ marginBottom: '6px' }}>Fetch data from a server (user profile, orders, products)</li>
                        <li style={{ marginBottom: '6px' }}>Create/update/delete resources (save data, update settings)</li>
                        <li style={{ marginBottom: '6px' }}>Access protected endpoints that require authentication</li>
                        <li style={{ marginBottom: '6px' }}>Perform actions on behalf of the logged-in user</li>
                      </ul>

                      <div style={{
                        backgroundColor: '#fff3cd',
                        border: '1px solid #ffc107',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '12px'
                      }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#856404' }}>
                          <strong>⚠️ Important:</strong> This is <strong>NOT</strong> for:
                        </p>
                        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '12px', color: '#856404' }}>
                          <li>Navigating to another page/screen</li>
                          <li>Passing data between React components</li>
                          <li>Sending tokens as URL parameters</li>
                        </ul>
                        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#856404' }}>
                          API requests are for <strong>calling backend services</strong> (like REST APIs, GraphQL, etc.)
                        </p>
                      </div>

                      <p style={{ marginBottom: '10px' }}>
                        <strong style={{ color: '#2c3e50' }}>How tokens are sent:</strong>
                      </p>
                      <p style={{ marginBottom: '10px', fontSize: '13px' }}>
                        The token is sent in the <strong>HTTP header</strong> (not URL parameters):
                      </p>
                      <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '12px',
                        borderRadius: '6px',
                        border: '1px solid #e1e8ed',
                        marginBottom: '12px',
                        fontSize: '12px',
                        fontFamily: 'monospace'
                      }}>
                        <div style={{ color: '#667eea', marginBottom: '4px' }}>GET /api/user/profile</div>
                        <div style={{ color: '#95a5a6' }}>Headers:</div>
                        <div style={{ marginLeft: '12px' }}>
                          Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI...
                        </div>
                      </div>

                      <p style={{ marginBottom: '10px' }}>
                        <strong style={{ color: '#2c3e50' }}>Real-world examples:</strong>
                      </p>
                      <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '12px',
                        borderRadius: '6px',
                        border: '1px solid #e1e8ed',
                        fontSize: '12px'
                      }}>
                        <div style={{ marginBottom: '8px' }}>
                          <strong style={{ color: '#667eea' }}>1. Get User Profile:</strong>
                          <div style={{ marginLeft: '12px', color: '#5a6c7d', fontFamily: 'monospace' }}>
                            GET /api/users/me
                          </div>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <strong style={{ color: '#667eea' }}>2. Fetch Orders:</strong>
                          <div style={{ marginLeft: '12px', color: '#5a6c7d', fontFamily: 'monospace' }}>
                            GET /api/orders
                          </div>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <strong style={{ color: '#667eea' }}>3. Create Post:</strong>
                          <div style={{ marginLeft: '12px', color: '#5a6c7d', fontFamily: 'monospace' }}>
                            POST /api/posts
                          </div>
                        </div>
                        <div>
                          <strong style={{ color: '#667eea' }}>4. Update Settings:</strong>
                          <div style={{ marginLeft: '12px', color: '#5a6c7d', fontFamily: 'monospace' }}>
                            PUT /api/settings
                          </div>
                        </div>
                      </div>

                      <p style={{ marginTop: '12px', marginBottom: 0, fontSize: '13px', fontStyle: 'italic', color: '#667eea' }}>
                        💡 Try the "Send API Request" button to see how your token is sent to a backend API!
                      </p>
                    </div>
                  </div>

                  <Divider />
                  */}

                  <div style={{ marginTop: '24px' }}>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600',
                      color: '#2c3e50',
                      marginBottom: '12px'
                    }}>
                      ⚙️ Configuration
                    </h3>
                    <div style={{
                      backgroundColor: '#f8f9fa',
                      padding: '16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      border: '1px solid #e1e8ed'
                    }}>
                      <div style={{ marginBottom: '8px' }}>
                        <strong style={{ color: '#667eea' }}>URL:</strong> {config.url}
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong style={{ color: '#667eea' }}>Realm:</strong> {config.realm}
                      </div>
                      <div>
                        <strong style={{ color: '#667eea' }}>Client ID:</strong> {config.clientId}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Token Information Panel */}
            {tokenInfo && (
              <Card style={{
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #e1e8ed'
              }}>
                <div style={{ padding: '24px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      fontSize: '24px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      🎫
                    </div>
                    <h2 style={{
                      margin: 0,
                      fontSize: '22px',
                      fontWeight: '600',
                      color: '#2c3e50'
                    }}>
                      Token Information
                    </h2>
                  </div>

                  <div style={{ 
                    textAlign: 'left', 
                    fontSize: '14px',
                    color: '#5a6c7d'
                  }}>
                    <div style={{
                      backgroundColor: '#f8f9fa',
                      padding: '16px',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      border: '1px solid #e1e8ed'
                    }}>
                      <div style={{ marginBottom: '12px' }}>
                        <strong style={{ color: '#2c3e50', display: 'block', marginBottom: '4px' }}>User ID</strong>
                        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{tokenInfo.subject}</span>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <strong style={{ color: '#2c3e50', display: 'block', marginBottom: '4px' }}>Username</strong>
                        <span>{tokenInfo.username || 'N/A'}</span>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <strong style={{ color: '#2c3e50', display: 'block', marginBottom: '4px' }}>Email</strong>
                        <span>{tokenInfo.email || 'N/A'}</span>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <strong style={{ color: '#2c3e50', display: 'block', marginBottom: '4px' }}>Realm</strong>
                        <span>{tokenInfo.realm}</span>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <strong style={{ color: '#2c3e50', display: 'block', marginBottom: '4px' }}>Issued At</strong>
                        <span>{tokenInfo.issuedAt}</span>
                      </div>
                      <div>
                        <strong style={{ color: '#2c3e50', display: 'block', marginBottom: '4px' }}>Expires At</strong>
                        <span>{tokenInfo.expiresAt}</span>
                      </div>
                    </div>
                    {tokenInfo.roles.length > 0 && (
                      <div>
                        <strong style={{ color: '#2c3e50', display: 'block', marginBottom: '8px' }}>Realm Roles</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {tokenInfo.roles.map((role, idx) => (
                            <span
                              key={idx}
                              style={{
                                backgroundColor: '#667eea',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '16px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Middle Column - Interactive Tools */}
          <div>
            <Card style={{
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e1e8ed',
              marginBottom: '24px'
            }}>
              <div style={{ padding: '24px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    fontSize: '24px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    🎮
                  </div>
                  <h2 style={{
                    margin: 0,
                    fontSize: '22px',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>
                    Interactive Tools
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Button
                    onClick={() => setInfoMessage(`✅ Authentication Status: ${kc?.authenticated ? 'TRUE' : 'FALSE'}\n\nYou are currently authenticated and your session is active.`)}
                    label="✓ Check Authentication Status"
                    severity="info"
                    style={{ 
                      width: '100%', 
                      height: '48px',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}
                  />

                  <Button
                    onClick={() => {
                      if (!kc?.token) return;
                      const token = kc.token;
                      setInfoMessage(
                        `🎫 Access Token (first 100 characters):\n\n${token.substring(0, 100)}...\n\n📋 Full token has been logged to browser console`
                      );
                      console.log('Full Access Token:', token);
                    }}
                    label="🎫 View Access Token"
                    severity="info"
                    style={{ 
                      width: '100%', 
                      height: '48px',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}
                  />

                  <Button
                    onClick={() => {
                      if (!kc?.tokenParsed) return;
                      const parsed = kc.tokenParsed;
                      setInfoMessage(`📋 Parsed Token:\n\n${JSON.stringify(parsed, null, 2)}\n\n📝 Full details logged to console.`);
                      console.log('Parsed Token:', parsed);
                    }}
                    label="📋 View Parsed Token"
                    severity="warning"
                    style={{ 
                      width: '100%', 
                      height: '48px',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}
                  />

                  <Button
                    onClick={() => {
                      if (!kc) return;
                      const expired = kc.isTokenExpired(5);
                      setInfoMessage(
                        `⏰ Token Expiration Check:\n\nExpires in 5 seconds: ${expired ? 'YES ⚠️' : 'NO ✅'}\n\nToken expires at: ${tokenInfo?.expiresAt}\n\nYour token is ${expired ? 'about to expire' : 'still valid'}.`
                      );
                    }}
                    label="⏰ Check Token Expiration"
                    severity="info"
                    style={{ 
                      width: '100%', 
                      height: '48px',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}
                  />

                  <Button
                    onClick={() => {
                      if (!kc) return;
                      kc.updateToken(10)
                        .then((refreshed) => {
                          setInfoMessage(
                            `🔄 Token Refresh:\n\nToken refreshed: ${refreshed ? 'YES ✅' : 'NO (still valid)'}\n\nNew token has been logged to console.\n\nYour session has been extended.`
                          );
                          const info = getTokenInfo(kc);
                          setTokenInfo(info);
                          console.log('New token:', kc.token);
                        })
                        .catch((e: any) => {
                          setInfoMessage(`❌ Refresh Error:\n\n${e.message}\n\nPlease try logging in again.`);
                        });
                    }}
                    label="🔄 Refresh Token"
                    severity="secondary"
                    style={{ 
                      width: '100%', 
                      height: '48px',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}
                  />

                  {/* Send API Request button - commented out, can be uncommented later if needed
                  <Button
                    onClick={callBackend}
                    label="🌐 Send API Request (with token)"
                    severity="success"
                    style={{ 
                      width: '100%', 
                      height: '48px',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}
                    title="Demonstrates how your Keycloak token is automatically included in API requests via the Authorization header"
                  />
                  */}

                  <Button
                    onClick={() => {
                      if (!kc) return;
                      const hasAdmin = kc.hasRealmRole('admin');
                      setInfoMessage(
                        `👤 Realm Role Check:\n\nHas realm role "admin": ${hasAdmin ? 'YES ✅' : 'NO ❌'}\n\n💡 To assign this role:\n1. Go to Keycloak Admin Console\n2. Navigate to Users → Your User → Role Mappings\n3. Assign the "admin" realm role`
                      );
                    }}
                    label="👤 Check Realm Role (admin)"
                    severity="info"
                    style={{ 
                      width: '100%', 
                      height: '48px',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}
                  />

                  <Button
                    onClick={() => {
                      if (!kc) return;
                      const hasTest = kc.hasResourceRole('test', 'react-client');
                      setInfoMessage(
                        `🔐 Client Role Check:\n\nHas client role "test": ${hasTest ? 'YES ✅' : 'NO ❌'}\n\n💡 To assign this role:\n1. Go to Keycloak Admin Console\n2. Navigate to Clients → react-client → Roles\n3. Create "test" role if needed\n4. Assign to your user`
                      );
                    }}
                    label="🔐 Check Client Role (test)"
                    severity="info"
                    style={{ 
                      width: '100%', 
                      height: '48px',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Results Panel */}
          <div>
            <Card style={{
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e1e8ed',
              height: '100%'
            }}>
              <div style={{ padding: '24px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    fontSize: '24px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    📊
                  </div>
                  <h2 style={{
                    margin: 0,
                    fontSize: '22px',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>
                    Results & Information
                  </h2>
                </div>

                <div
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '20px',
                    minHeight: '400px',
                    border: '1px solid #e1e8ed'
                  }}
                >
                  <div
                    style={{
                      wordBreak: 'break-all',
                      whiteSpace: 'pre-wrap',
                      textAlign: 'left',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      color: '#2c3e50',
                      lineHeight: '1.6'
                    }}
                  >
                    {infoMessage || (
                      <div style={{ 
                        color: '#95a5a6', 
                        fontStyle: 'italic',
                        textAlign: 'center',
                        paddingTop: '40px'
                      }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>👆</div>
                        <p style={{ fontSize: '16px', marginBottom: '8px' }}>
                          Click any button to see results here
                        </p>
                        <p style={{ fontSize: '14px', marginTop: '24px' }}>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
