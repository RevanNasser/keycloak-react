export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIKnowledgeEntry {
  keywords: string[];
  content: string;
  category: 'setup' | 'troubleshooting' | 'configuration' | 'general';
}

export interface QuickReply {
  label: string;
  text: string;
  icon: string;
}

export const quickReplies: QuickReply[] = [
  { label: 'Setup Keycloak', text: 'How do I set up Keycloak with Docker?', icon: '🚀' },
  { label: '401 Error', text: 'I am getting a 401 Unauthorized error', icon: '⚠️' },
  { label: 'Create Client', text: 'How do I create a client in Keycloak?', icon: '⚙️' },
  { label: 'CORS Issues', text: 'I have CORS errors', icon: '🔒' },
];

export const knowledgeBase: AIKnowledgeEntry[] = [
  {
    keywords: ['setup', 'install', 'docker', 'start', 'run', 'server', 'getting started', 'begin'],
    category: 'setup',
    content: `Great choice! Let me walk you through setting up Keycloak. The easiest way is using Docker.

**Quick Start with Docker:**

` + '```bash' + `
docker run -d \\
  -p 8080:8080 \\
  -e KEYCLOAK_ADMIN=admin \\
  -e KEYCLOAK_ADMIN_PASSWORD=admin \\
  quay.io/keycloak/keycloak:26.0.1 \\
  start-dev
` + '```' + `

**What this does:**
1. Downloads and runs Keycloak in development mode
2. Exposes it on port 8080
3. Sets up an admin user (admin/admin)
4. Runs in the background

**Verify it is working:**
- Open http://localhost:8080 in your browser
- Login with admin/admin

**Alternative: Manual Installation**
If you prefer not to use Docker:
1. Download from keycloak.org/downloads
2. Extract the archive
3. Run bin/kc.sh start-dev (Mac/Linux) or bin/kc.bat start-dev (Windows)

Once Keycloak is running, you will need to create a client for your React app. Want me to show you how?`
  },
  {
    keywords: ['client', 'create client', 'register', 'client id', 'react-client', 'new client'],
    category: 'configuration',
    content: `I will guide you through creating a client for your React app. This is crucial for authentication to work.

**Step-by-Step:**

1. **Open Keycloak Admin Console**
   - Go to http://localhost:8080
   - Login with admin credentials

2. **Create the Client**
   - Click "Clients" in the left sidebar
   - Click "Create client"
   - Fill in the form:
     - **Client type:** OpenID Connect
     - **Client ID:** react-client
     - Click "Next"

3. **Configure Authentication**
   - Toggle "Client authentication" to **OFF** (this makes it a public client)
   - Click "Next"

4. **Set Redirect URIs**
   - **Valid redirect URIs:** http://localhost:3000/*
   - **Valid post logout redirect URIs:** http://localhost:3000/*
   - **Web origins:** http://localhost:3000
   - Click "Save"

**⚠️ Important:**
- Client ID must match your app's configuration exactly
- The wildcards (*) are important for redirect URIs
- Web origins should NOT have wildcards or trailing slashes

After saving, your React app should be able to authenticate with Keycloak. Having issues?`
  },
  {
    keywords: ['401', 'unauthorized', 'invalid redirect uri', 'error', 'not working', 'fails', 'failed'],
    category: 'troubleshooting',
    content: `I see you are getting a 401 error. Don't worry - this is the most common issue and it's usually an easy fix!

**Most Common Causes:**

1. **Client Authentication is ON** ❌
   - Go to Clients → react-client → Settings
   - Toggle "Client authentication" to **OFF**
   - This is the #1 cause of 401 errors

2. **Wrong Redirect URI** ❌
   - Should be: http://localhost:3000/*
   - Must include the wildcard (*)
   - Check both "Valid redirect URIs" and "Valid post logout redirect URIs"

3. **Web Origins Missing** ❌
   - Should be: http://localhost:3000
   - NO wildcards here
   - NO trailing slash

4. **Client Secret Exists** ❌
   - Go to Credentials tab
   - If you see a client secret, delete it
   - Public clients should not have secrets

**Quick Checklist:**
- ✅ Client authentication: OFF
- ✅ Valid redirect URIs: http://localhost:3000/*
- ✅ Web origins: http://localhost:3000
- ✅ No client secret

Still having trouble? Try deleting and recreating the client following the steps exactly.`
  },
  {
    keywords: ['cors', 'access-control', 'origin', 'blocked', 'cross-origin', 'preflight'],
    category: 'troubleshooting',
    content: `CORS errors can be frustrating! This happens when your browser blocks requests between different origins. Here is how to fix it:

**The Error:**
Access to XMLHttpRequest at 'http://localhost:8080/...' from origin 'http://localhost:3000' has been blocked by CORS policy

**The Solution:**

1. **Open Keycloak Admin Console**
   - Go to http://localhost:8080

2. **Navigate to Your Client**
   - Clients → react-client → Settings

3. **Configure Web Origins**
   - Find the "Web origins" field
   - Add exactly: http://localhost:3000
   - **Important:** No trailing slash, no wildcards
   - Click "Save"

4. **Refresh Your App**
   - Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
   - Try logging in again

**Why This Happens:**
Your React app runs on port 3000, and Keycloak on port 8080. Browsers see these as different origins and block the communication unless explicitly allowed.

**For Production:**
Add your production domain to Web origins, e.g., https://yourdomain.com

Need help with anything else?`
  },
  {
    keywords: ['realm', 'create realm', 'master', 'my-realm', 'new realm', 'default realm'],
    category: 'configuration',
    content: `Great question! Realms are like separate authentication spaces in Keycloak. Let me explain and show you how to create one.

**What is a Realm?**
A realm is an isolated space where you manage users, clients, and authentication settings. Think of it like a separate Keycloak instance.

**The "master" Realm:**
- This is the default realm for the admin console
- Good for development and testing
- **NOT recommended for production** (security best practice)

**Creating a New Realm:**

1. Click the realm dropdown (top-left, currently shows "master")
2. Click "Create Realm"
3. Enter a name: my-app or your app name
4. Click "Create"

**Update Your App:**
Once you create a new realm, update your React app configuration:

` + '```' + `
# .env file
NEXT_PUBLIC_KEYCLOAK_REALM=my-app
` + '```' + `

Or in your Keycloak initialization:
` + '```javascript' + `
realm: 'my-app'
` + '```' + `

**Best Practices:**
- Use master realm only for admin tasks
- Create separate realms for each application/environment
- Use descriptive names like "myapp-production", "myapp-staging"

Want to know about creating users next?`
  },
  {
    keywords: ['user', 'create user', 'test user', 'credentials', 'password', 'new user', 'add user'],
    category: 'configuration',
    content: `Absolutely! Creating users is essential for testing. Here is how to create a test user:

**Creating a User:**

1. **Navigate to Users**
   - In Keycloak Admin Console, click "Users" (left sidebar)
   - Click "Create new user"

2. **Fill User Details**
   - **Username:** testuser (or any username)
   - **Email:** test@example.com
   - Toggle "Email verified" to ON
   - Click "Create"

3. **Set Password**
   - Go to the "Credentials" tab
   - Click "Set password"
   - Enter your password twice
   - **Important:** Toggle "Temporary" to OFF
   - Click "Save"

4. **Assign Roles (Optional)**
   - Go to "Role Mappings" tab
   - Click "Assign role"
   - Select roles like "admin" or "user"
   - Click "Assign"

**Testing Login:**
Now you can test your React app login with:
- Username: testuser
- Password: (what you set)

**Pro Tips:**
- Create multiple users with different roles for testing
- Use descriptive usernames like "admin-user", "regular-user"
- You can import users in bulk via CSV

Ready to test authentication with your new user?`
  },
  {
    keywords: ['token', 'access token', 'refresh token', 'id token', 'jwt', 'bearer', 'token expired'],
    category: 'general',
    content: `Tokens are the heart of Keycloak authentication! Let me break them down for you:

**Three Types of Tokens:**

1. **Access Token** 🎫
   - Short-lived (typically 5-15 minutes)
   - Used to access protected APIs
   - Sent in HTTP header: Authorization: Bearer <token>
   - Contains user info, roles, and permissions

2. **Refresh Token** 🔄
   - Long-lived (hours to days)
   - Used silently to get new access tokens
   - Prevents users from re-entering credentials
   - Automatically handled by keycloak-js

3. **ID Token** 🆔
   - Contains user identity information
   - Includes name, email, username
   - Used by the client app to display user info

**How They Work Together:**
1. User logs in → Gets all three tokens
2. App uses Access Token for API calls
3. When Access Token expires → Refresh Token gets a new one
4. User stays logged in seamlessly

**Viewing Your Tokens:**
In this documentation app, you can:
- Click "View Access Token" to see the raw JWT
- Click "View Parsed Token" to see decoded contents
- Click "Check Token Expiration" to see when it expires

**Token Structure (JWT):**
A JWT has three parts separated by dots:
header.payload.signature

Want to see how to use tokens in API requests?`
  },
  {
    keywords: ['role', 'realm role', 'client role', 'admin', 'permission', 'authorization', 'access control'],
    category: 'configuration',
    content: `Roles are how you control what users can do in your app. Keycloak has two types:

**Realm Roles (Global)** 🌍
Apply across the entire realm. Common examples:
- admin - Full access
- user - Standard user access
- moderator - Content moderation

**Creating Realm Roles:**
1. Go to Realm Roles (left sidebar)
2. Click "Create role"
3. Enter role name: admin
4. Click "Save"

**Client Roles (App-Specific)** 🎯
Apply only to a specific client. Use these when:
- You have multiple apps in one realm
- Roles are specific to one application

**Creating Client Roles:**
1. Go to Clients → react-client → Roles
2. Click "Create role"
3. Enter name: editor or viewer
4. Click "Save"

**Assigning Roles to Users:**
1. Go to Users → [username] → Role Mappings
2. Click "Assign role"
3. Select the roles to assign
4. For client roles, switch to the "Client Roles" filter

**Checking Roles in Code:**
` + '```javascript' + `
// Check realm role
if (keycloak.hasRealmRole('admin')) {
  console.log('User is an admin!');
}

// Check client role
if (keycloak.hasResourceRole('editor', 'react-client')) {
  console.log('User can edit!');
}
` + '```' + `

**Best Practices:**
- Use realm roles for broad permissions
- Use client roles for app-specific features
- Create roles based on features, not job titles

Need help implementing role-based UI?`
  },
  {
    keywords: ['environment', 'env', 'configuration', 'config', 'url', 'client id', 'variables', 'setup config'],
    category: 'configuration',
    content: `Configuring your app to connect to Keycloak is straightforward. Here are your options:

**Option 1: Environment Variables (Recommended)**

Create a .env file in your project root:

` + '```' + `
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=master
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=react-client
` + '```' + `

**Important:** In Next.js, env vars must start with NEXT_PUBLIC_ to be available in the browser.

**Option 2: Direct Configuration**

` + '```javascript' + `
const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'master',
  clientId: 'react-client'
});
` + '```' + `

**Configuration Options:**

| Option | Description | Example |
|--------|-------------|---------|
| url | Keycloak server URL | http://localhost:8080 |
| realm | Realm name | master, my-app |
| clientId | Client ID from Keycloak | react-client |

**For Different Environments:**
` + '```' + `
# .env.development
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080

# .env.production
NEXT_PUBLIC_KEYCLOAK_URL=https://auth.yourdomain.com
` + '```' + `

**Troubleshooting:**
- Make sure URL matches your Keycloak server
- Client ID must exactly match what is in Keycloak (case-sensitive!)
- Realm name must be correct

Need help with something specific?`
  },
  {
    keywords: ['login', 'logout', 'redirect', 'authenticate', 'sign in', 'sign out', 'flow'],
    category: 'general',
    content: `Great question! Understanding the authentication flow helps you build better apps. Let me explain how it works:

**The Login Flow:**

1. **User Clicks Login**
   - Your app calls keycloak.login()
   - User is redirected to Keycloak login page

2. **User Enters Credentials**
   - Username/password entered on Keycloak
   - Keycloak validates against its database

3. **Keycloak Issues Tokens**
   - Upon successful authentication
   - Access Token, Refresh Token, and ID Token are created

4. **Redirect Back to App**
   - Keycloak redirects to your app with tokens
   - URL contains ?code=...&state=...

5. **App Processes Tokens**
   - keycloak-js extracts tokens from URL
   - User is now authenticated!
   - keycloak.authenticated becomes true

**The Logout Flow:**

1. **App Calls Logout**
   - keycloak.logout() is called

2. **Keycloak Clears Session**
   - Tokens are invalidated on Keycloak server
   - Browser cookies cleared

3. **Redirect to App**
   - User returns to your app
   - keycloak.authenticated is now false

**Visual Flow:**
` + '```' + `
Your App → Keycloak Login → User Enters Credentials
    ↑                                    ↓
    ←←←←←←←←←← Tokens ←←←←←←←←←←←←←←←←←
` + '```' + `

**Keycloak-JS Handles:**
- Token storage (in memory or localStorage)
- Automatic token refresh
- Session monitoring
- Logout on all tabs (optional)

Pretty elegant, right? Want to see how to make API calls with these tokens?`
  },
  {
    keywords: ['checklist', 'before run', 'npm start', 'prerequisites', 'requirements', 'ready'],
    category: 'setup',
    content: `Perfect! Let me give you a complete pre-flight checklist to make sure everything is ready:

**☐ 1. Keycloak Server Running**
- Docker: Run docker ps - you should see Keycloak container
- Manual: Check http://localhost:8080 is accessible
- You should see the Keycloak welcome page

**☐ 2. Client Configured in Keycloak**
- Client ID: react-client (matches your config)
- Valid redirect URIs: http://localhost:3000/*
- Web origins: http://localhost:3000
- Client authentication: **OFF**

**☐ 3. Test User Created (Optional but Recommended)**
- At least one user in Keycloak
- Password set (not temporary)
- Email verified (if using email)

**☐ 4. Dependencies Installed**
` + '```bash' + `
npm install
` + '```' + `

**☐ 5. Environment Configuration (if needed)**
- Create .env file if using custom settings
- Or verify defaults in your code

**Quick Test:**
` + '```bash' + `
# 1. Start Keycloak
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:26.0.1 start-dev

# 2. Configure client (manual step in UI)

# 3. Run your app
npm run dev
` + '```' + `

**Common Gotchas:**
- Keycloak not running on port 8080
- Client authentication left ON (should be OFF)
- Web origins missing or incorrect
- Client ID mismatch between Keycloak and app

Ready to run? All checked? 🚀`
  },
  {
    keywords: ['api', 'request', 'backend', 'authorization', 'bearer', 'header', 'http', 'call api'],
    category: 'general',
    content: `Excellent question! Here is how to use your Keycloak token to call backend APIs:

**How Tokens Are Sent:**

Your access token is automatically included in HTTP requests via the **Authorization header**:

` + '```' + `
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI...
` + '```' + `

**Using Axios:**
` + '```javascript' + `
import axios from 'axios';

// Set the token globally
axios.defaults.headers.common['Authorization'] = 'Bearer ' + keycloak.token;

// Make requests - token is automatically included
const response = await axios.get('/api/user/profile');
` + '```' + `

**Using Fetch:**
` + '```javascript' + `
const response = await fetch('/api/user/profile', {
  headers: {
    'Authorization': 'Bearer ' + keycloak.token
  }
});
` + '```' + `

**What Happens on the Backend:**
1. Receives the request with Bearer token
2. Validates token signature with Keycloak
3. Checks token expiration
4. Extracts user info and roles
5. Returns data if authorized

**Common API Patterns:**
` + '```' + `
GET  /api/users/me       → Get current user profile
GET  /api/orders         → Get user's orders
POST /api/posts          → Create new post
PUT  /api/settings       → Update user settings
` + '```' + `

**Token Auto-Refresh:**
keycloak-js can automatically refresh expired tokens:
` + '```javascript' + `
await keycloak.updateToken(30); // Refresh if expires in 30 seconds
` + '```' + `

**Security Tips:**
- Never send tokens in URL parameters
- Always use HTTPS in production
- Keep tokens out of logs
- Store refresh tokens securely

Want to test this with your app?`
  },
  {
    keywords: ['production', 'deploy', 'security', 'https', 'ssl', 'live', 'server'],
    category: 'configuration',
    content: `Taking your Keycloak setup to production? Here are the essential considerations:

**🔐 Security Must-Haves:**

1. **Use HTTPS Everywhere**
   - Keycloak must run on HTTPS
   - Your app must use HTTPS
   - Never send tokens over HTTP

2. **Don't Use Master Realm**
   - Create a dedicated realm for production
   - Name it after your app (e.g., "myapp-production")

3. **Configure Proper Redirect URIs**
   - Update to your production domain
   - Example: https://app.yourdomain.com/*
   - Remove development URLs

4. **Use Environment Variables**
   - Never hardcode Keycloak URLs
   - Use different configs for dev/staging/prod

**🚀 Performance & Scaling:**

- Run Keycloak in production mode (not start-dev)
- Use a database (PostgreSQL, MySQL) instead of H2
- Consider clustering for high availability
- Set up proper token expiration times

**⚙️ Production Configuration:**
` + '```' + `
# .env.production
NEXT_PUBLIC_KEYCLOAK_URL=https://auth.yourdomain.com
NEXT_PUBLIC_KEYCLOAK_REALM=myapp-production
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=myapp-client
` + '```' + `

**🔒 Additional Security:**
- Enable brute force protection in Keycloak
- Set up proper CORS for production domains
- Use confidential clients for server-side apps
- Enable PKCE for public clients (usually on by default)
- Regular security updates for Keycloak

**📊 Monitoring:**
- Set up logging and monitoring
- Track failed login attempts
- Monitor token refresh rates

**Common Production Issues:**
- CORS errors after domain change
- HTTPS mixed content warnings
- Token expiration too short/long

Need help with any specific production setup?`
  },
  {
    keywords: ['pkce', 'proof key', 'code exchange', 's256', 'security', 'pkce method'],
    category: 'configuration',
    content: `PKCE (Proof Key for Code Exchange) is a security feature that protects your authentication flow. Let me explain:

**What is PKCE?**
PKCE (pronounced "pixy") is an extension to OAuth 2.0 that prevents authorization code interception attacks. It is especially important for public clients like React apps.

**Why You Need It:**
- Prevents attackers from stealing authorization codes
- Required for public clients (browser apps)
- Recommended by OAuth 2.0 best practices
- Already enabled by default in keycloak-js ✅

**How It Works:**
1. Your app generates a secret code verifier
2. Creates a code challenge (hashed version)
3. Sends challenge to Keycloak during login
4. Keycloak stores the challenge
5. When exchanging code for tokens, app sends verifier
6. Keycloak verifies they match

**Configuration in Keycloak:**
1. Go to Clients → react-client → Advanced
2. Find "Proof Key for Code Exchange Code Challenge Method"
3. Set to: S256 (recommended)
4. Click "Save"

**In Your Code:**
keycloak-js handles this automatically! No extra code needed:
` + '```javascript' + `
const keycloak = new Keycloak(config);
keycloak.init({
  pkceMethod: 'S256'  // This is the default
});
` + '```' + `

**Do NOT Disable PKCE!**
For browser-based apps, PKCE should always be enabled. Disabling it makes your app vulnerable to code interception attacks.

**When is PKCE Not Needed?**
- Server-side apps with confidential clients
- Apps using client secrets (but React apps should not use these)

**Bottom Line:**
Keep PKCE enabled - it's protecting your users! 🛡️`
  },
  {
    keywords: ['iframe', 'login-status', '403', 'forbidden', 'checkLoginIframe', 'session', 'sso'],
    category: 'troubleshooting',
    content: `Seeing a 403 error related to login-status-iframe.html? This is a common but harmless issue. Here is what is happening:

**The Error:**
GET http://localhost:8080/realms/master/protocol/openid-connect/login-status-iframe.html 403 (Forbidden)

**What It Is:**
Keycloak uses a hidden iframe to check if the user has an active session in other tabs. This enables Single Sign-On (SSO) features.

**Why It Fails:**
The iframe check is optional and sometimes blocked by:
- CORS restrictions
- Content Security Policy (CSP)
- Third-party cookie blocking
- Keycloak configuration

**The Fix:**
Disable the iframe check in your Keycloak initialization:

` + '```javascript' + `
keycloak.init({
  checkLoginIframe: false
});
` + '```' + `

**What You Lose:**
- Automatic logout across all tabs
- SSO session monitoring

**What Still Works:**
✅ Authentication
✅ Token refresh
✅ Logout (manual)
✅ All Keycloak features

**Should You Disable It?**
For most React apps: **Yes, it is fine to disable.**
The iframe check is mainly useful for enterprise SSO scenarios where users have multiple apps open.

**Alternative Solutions:**
If you want to keep it enabled:
1. Add proper CORS configuration
2. Check Content Security Policy headers
3. Ensure Keycloak iframe is accessible

**Bottom Line:**
The 403 iframe error won't break your app. Disabling checkLoginIframe is a safe and common solution. 👍`
  },
  {
    keywords: ['logout', 'sign out', 'session', 'end session', 'clear', 'token cleanup'],
    category: 'general',
    content: `Logging out properly is just as important as logging in! Here is how to handle logout in Keycloak:

**Basic Logout:**
` + '```javascript' + `
keycloak.logout();
` + '```' + `

**Logout with Redirect:**
` + '```javascript' + `
keycloak.logout({
  redirectUri: window.location.origin
});
` + '```' + `

**What Happens During Logout:**
1. Tokens are cleared from browser storage
2. Keycloak session is invalidated
3. User is redirected to your app
4. keycloak.authenticated becomes false

**Complete Logout Example:**
` + '```javascript' + `
const handleLogout = () => {
  // Clear any app-specific state
  localStorage.removeItem('appData');
  
  // Call Keycloak logout
  keycloak.logout({
    redirectUri: window.location.origin + '/'
  });
};
` + '```' + `

**Logout Options:**
` + '```javascript' + `
keycloak.logout({
  redirectUri: 'http://localhost:3000',  // Where to redirect after
  refreshToken: true,                      // Also revoke refresh token
  idToken: keycloak.idToken               // Include ID token (recommended)
});
` + '```' + `

**Handling Logout in Your App:**
` + '```javascript' + `
keycloak.onAuthLogout = () => {
  console.log('User logged out');
  // Redirect to login or home page
  window.location.href = '/';
};
` + '```' + `

**Important Notes:**
- Logout clears tokens on the browser
- It also invalidates the session on Keycloak server
- Other tabs/windows will also be logged out (if checkLoginIframe is enabled)
- User will need to re-enter credentials on next login

**Testing Logout:**
1. Login to your app
2. Click logout button
3. Verify tokens are cleared
4. Try accessing protected content - should require login

Need help with any other authentication flows?`
  },
  {
    keywords: ['react', 'integration', 'hook', 'component', 'provider', 'context'],
    category: 'configuration',
    content: `Integrating Keycloak with React properly makes your code cleaner and more maintainable. Here is the best approach:

**Option 1: Using Context (Recommended)**

Create a Keycloak provider:
` + '```typescript' + `
// KeycloakContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';

const KeycloakContext = createContext(null);

export const KeycloakProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const kc = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'master',
      clientId: 'react-client'
    });

    kc.init({
      onLoad: 'check-sso',
      checkLoginIframe: false
    }).then((auth) => {
      setKeycloak(kc);
      setAuthenticated(auth);
    });
  }, []);

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated }}>
      {children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = () => useContext(KeycloakContext);
` + '```' + `

**Using the Hook:**
` + '```typescript' + `
const MyComponent = () => {
  const { keycloak, authenticated } = useKeycloak();

  if (!authenticated) {
    return <button onClick={() => keycloak.login()}>Login</button>;
  }

  return <div>Welcome {keycloak.tokenParsed?.preferred_username}</div>;
};
` + '```' + `

**Option 2: Using a Custom Hook**

` + '```typescript' + `
// useAuth.ts
import { useEffect, useState } from 'react';
import { getKeycloak } from '@/lib/keycloak';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const kc = getKeycloak();
    
    if (kc) {
      setIsAuthenticated(kc.authenticated || false);
      setUser(kc.tokenParsed);
      setLoading(false);
    }
  }, []);

  const login = () => getKeycloak()?.login();
  const logout = () => getKeycloak()?.logout();

  return { isAuthenticated, user, loading, login, logout };
};
` + '```' + `

**Best Practices:**
- Initialize Keycloak once at app startup
- Use context to avoid prop drilling
- Handle loading states properly
- Update authentication state reactively

This approach keeps your components clean and makes authentication logic reusable!`
  }
];

export function findRelevantKnowledge(query: string): AIKnowledgeEntry[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  const scored = knowledgeBase.map(entry => {
    let score = 0;
    
    // Check for keyword matches
    entry.keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      
      // Exact match
      if (queryLower.includes(keywordLower)) {
        score += 5;
      }
      
      // Partial word matches
      queryWords.forEach(word => {
        if (keywordLower.includes(word)) {
          score += 2;
        }
        if (word.includes(keywordLower)) {
          score += 1;
        }
      });
    });
    
    return { entry, score };
  });
  
  // Return matches above threshold
  const matches = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
  
  // If we have good matches, return top 2
  if (matches.length > 0 && matches[0].score >= 5) {
    return matches.slice(0, 2).map(item => item.entry);
  }
  
  // Return any matches
  return matches.slice(0, 1).map(item => item.entry);
}

export function generateAIResponse(query: string): string {
  const relevantEntries = findRelevantKnowledge(query);
  
  // Check for greetings
  const greetings = ['hi', 'hello', 'hey', 'greetings', 'howdy'];
  if (greetings.some(g => query.toLowerCase().includes(g))) {
    return `Hi there! 👋 Welcome to your Keycloak Assistant.

I can help you with:
• Setting up Keycloak (Docker or manual)
• Creating clients and configuring authentication
• Troubleshooting 401 errors and CORS issues
• Managing users, roles, and realms
• Understanding tokens and security
• Production deployment best practices

What would you like to know? Feel free to ask in natural language - I am here to help!`;
  }
  
  // Check for thanks
  const thanks = ['thanks', 'thank you', 'helpful', 'appreciate'];
  if (thanks.some(t => query.toLowerCase().includes(t))) {
    const responses = [
      "You're very welcome! 😊 Happy to help. Let me know if you have any other questions about Keycloak!",
      "No problem at all! Glad I could assist. Feel free to ask if anything else comes up!",
      "My pleasure! Keycloak can be tricky at first, but you'll get the hang of it. Anything else you'd like to know?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Check for goodbye
  const goodbyes = ['bye', 'goodbye', 'see you', 'exit', 'quit'];
  if (goodbyes.some(g => query.toLowerCase().includes(g))) {
    return `Goodbye! 👋 Feel free to come back anytime you have Keycloak questions. Good luck with your project!`;
  }
  
  if (relevantEntries.length === 0) {
    return `I don't have specific information about that topic yet. Let me suggest some things I can help you with:

**Setup & Installation:**
• How do I set up Keycloak with Docker?
• What are the prerequisites before running my app?

**Configuration:**
• How do I create a client for my React app?
• How do I create a new realm?
• How do I set up environment variables?

**Troubleshooting:**
• I am getting a 401 error - help!
• How do I fix CORS issues?
• What does "invalid redirect URI" mean?

**User Management:**
• How do I create users?
• How do roles and permissions work?

Try asking about any of these topics, or describe your issue in your own words and I will do my best to help!`;
  }
  
  // Build response from relevant knowledge
  let response = '';
  
  relevantEntries.forEach((entry, index) => {
    if (index === 0) {
      response = entry.content;
    } else {
      response += '\n\n---\n\n**Also relevant:**\n\n' + entry.content;
    }
  });
  
  return response;
}
