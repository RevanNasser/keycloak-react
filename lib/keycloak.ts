import Keycloak from 'keycloak-js';

export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

export interface TokenInfo {
  subject: string;
  email?: string;
  username?: string;
  expiresAt: string;
  issuedAt: string;
  realm: string;
  roles: string[];
}

// Initialize Keycloak configuration
const getKeycloakConfig = (): KeycloakConfig => {
  const url = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080';
  const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'master';
  const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'react-client';

  // Ensure URL ends with / for Keycloak
  const normalizedUrl = url.endsWith('/') ? url : `${url}/`;

  return {
    url: normalizedUrl,
    realm,
    clientId,
  };
};

let keycloakInstance: Keycloak | null = null;
let onAuthUpdate: (() => void) | null = null;

export const initKeycloak = (): Keycloak => {
  if (typeof window === 'undefined') {
    // Server-side: return a mock instance
    return {} as Keycloak;
  }

  if (keycloakInstance) {
    return keycloakInstance;
  }

  const config = getKeycloakConfig();
  keycloakInstance = new Keycloak({
    url: config.url,
    realm: config.realm,
    clientId: config.clientId,
  });

  // Initialize Keycloak
  keycloakInstance
    .init({
      onLoad: 'check-sso', // 'check-sso' = check if logged in, 'login-required' = force login
      checkLoginIframe: false, // Set to false if getting 403 errors on login-status-iframe
      pkceMethod: 'S256',
    })
    .then((auth) => {
      if (auth) {
        console.info('Authenticated');
        console.log('auth', auth);
        console.log('Keycloak', keycloakInstance);
        console.log('Access Token', keycloakInstance?.token);

        // Update HTTP client header if available
        if (typeof window !== 'undefined' && keycloakInstance?.token) {
          import('./httpClient').then(({ httpClient }) => {
            httpClient.defaults.headers.common['Authorization'] =
              `Bearer ${keycloakInstance?.token}`;
          });
        }
      } else {
        console.info('Not authenticated - user can view app and login when ready');
      }
      // Notify React component of auth state change
      if (onAuthUpdate) {
        onAuthUpdate();
      }
    })
    .catch((error) => {
      console.error('Authentication Failed', error);
      console.error('Common causes:');
      console.error('1. Client authentication is ON (should be OFF for public clients)');
      console.error('2. Redirect URI mismatch in Keycloak client settings');
      console.error('3. Web origins not configured correctly');
      console.error('4. Client secret exists (should not exist for public clients)');
      console.error('See TROUBLESHOOTING_401.md for detailed fix instructions');
      if (onAuthUpdate) {
        onAuthUpdate();
      }
    });

  // Listen for authentication success/failure
  keycloakInstance.onAuthSuccess = () => {
    console.log('Auth success callback');
    if (keycloakInstance?.token) {
      import('./httpClient').then(({ httpClient }) => {
        httpClient.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
      });
    }
    if (onAuthUpdate) {
      onAuthUpdate();
    }
  };

  keycloakInstance.onAuthError = (error: any) => {
    console.error('Auth error callback', error);

    // Check browser console for CORS errors
    const errorStr = error?.message || error?.toString() || '';
    const isCorsError =
      errorStr.includes('CORS') ||
      errorStr.includes('Access-Control-Allow-Origin') ||
      errorStr.includes('blocked by CORS policy') ||
      (error?.status === 0 && error?.readyState === 4);

    const consoleHasCors =
      typeof window !== 'undefined' &&
      window.console &&
      window.location.href.includes('localhost:3000');

    if (isCorsError || consoleHasCors) {
      console.error('');
      console.error('═══════════════════════════════════════════════════════');
      console.error('⚠️  CORS ERROR DETECTED!');
      console.error('═══════════════════════════════════════════════════════');
      console.error('');
      console.error('The error "Access-Control-Allow-Origin" means Web origins');
      console.error('is not configured correctly in Keycloak.');
      console.error('');
      console.error('🔧 FIX STEPS:');
      console.error('1. Open Keycloak Admin Console: http://localhost:8080');
      console.error('2. Go to: Clients → react-client → Settings tab');
      console.error('3. Find the "Web origins" field');
      console.error('4. Add exactly: http://localhost:3000');
      console.error('   (NO trailing slash, NO wildcard)');
      console.error('5. Click "Save"');
      console.error('6. Refresh your app');
      console.error('');
      console.error('📋 Current Web origins should contain:');
      console.error('   http://localhost:3000');
      console.error('');
      console.error('═══════════════════════════════════════════════════════');
    } else {
      console.error('This usually means a 401 Unauthorized error.');
      console.error('Check your Keycloak client configuration:');
      console.error('- Client authentication must be OFF');
      console.error('- Valid redirect URIs must include: http://localhost:3000/*');
      console.error('- Web origins must include: http://localhost:3000');
    }
    console.error('See TROUBLESHOOTING_401.md for detailed instructions');
    if (onAuthUpdate) {
      onAuthUpdate();
    }
  };

  keycloakInstance.onTokenExpired = () => {
    console.log('Token expired, refreshing...');
    keycloakInstance
      ?.updateToken(30)
      .then((refreshed) => {
        if (refreshed && keycloakInstance?.token) {
          console.log('Token refreshed');
          import('./httpClient').then(({ httpClient }) => {
            httpClient.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
          });
        }
        if (onAuthUpdate) {
          onAuthUpdate();
        }
      })
      .catch(() => {
        console.error('Failed to refresh token');
        if (onAuthUpdate) {
          onAuthUpdate();
        }
      });
  };

  return keycloakInstance;
};

export const getKeycloak = (): Keycloak | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return keycloakInstance || initKeycloak();
};

export const setAuthUpdateCallback = (callback: (() => void) | null) => {
  onAuthUpdate = callback;
};

export const getTokenInfo = (kc: Keycloak | null): TokenInfo | null => {
  if (!kc?.authenticated || !kc.tokenParsed) {
    return null;
  }

  return {
    subject: kc.tokenParsed.sub || '',
    email: kc.tokenParsed.email,
    username: kc.tokenParsed.preferred_username,
    expiresAt: new Date((kc.tokenParsed.exp || 0) * 1000).toLocaleString(),
    issuedAt: new Date((kc.tokenParsed.iat || 0) * 1000).toLocaleString(),
    realm: kc.tokenParsed.iss?.split('/realms/')[1] || '',
    roles: kc.tokenParsed.realm_access?.roles || [],
  };
};

export const getKeycloakConfigForDisplay = (): KeycloakConfig => {
  return getKeycloakConfig();
};

