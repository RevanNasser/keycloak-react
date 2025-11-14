# Fixing 401 Unauthorized Error

If you're seeing `POST http://localhost:8080/realms/master/protocol/openid-connect/token 401 (Unauthorized)`, this means your Keycloak client is not configured correctly for a public client with PKCE.

## Note: 403 Error on login-status-iframe

If you're also seeing `GET .../login-status-iframe.html 403 (Forbidden)`, this is a separate issue. The code has been updated to disable `checkLoginIframe` by default, which fixes this. The iframe check is optional and not required for authentication to work.

## Note: CORS Error (Access-Control-Allow-Origin)

If you see a CORS error like:
```
Access to XMLHttpRequest at 'http://localhost:8080/.../token' from origin 'http://localhost:3000' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

This means **Web origins** is not configured correctly in Keycloak:

1. Go to Keycloak Admin Console → Clients → `react-client`
2. On the **Settings** tab, find **Web origins**
3. Add exactly: `http://localhost:3000` (no trailing slash, no wildcard)
4. Click **Save**
5. Refresh your React app and try again

## Step-by-Step Fix

### 1. Access Keycloak Admin Console
- Go to `http://localhost:8080`
- Click **Administration Console**
- Login with admin credentials

### 2. Navigate to Your Client
- Click **Clients** in the left sidebar
- Find and click on `react-client` (or your client ID)

### 3. Check Client Settings

#### Tab: Settings
Make sure these settings are correct:

1. **Client authentication**: Must be **OFF** (toggle should be gray/off)
   - If it's ON, turn it OFF and click **Save**
   - This is critical for browser-based apps

2. **Access type**: Should be **public** (automatically set when Client authentication is OFF)

3. **Standard flow**: Should be **Enabled** ✓

4. **Direct access grants**: Can be Enabled or Disabled (optional)

5. **Valid redirect URIs**: Must include:
   ```
   http://localhost:3000/*
   ```
   - Make sure there's no trailing space
   - The `*` wildcard is important

6. **Web origins**: Must include:
   ```
   http://localhost:3000
   ```
   - No trailing slash
   - No wildcard needed here

7. **Valid post logout redirect URIs**: Should include:
   ```
   http://localhost:3000/*
   ```

#### Tab: Advanced Settings
1. **Proof Key for Code Exchange Code Challenge Method**: Should be **S256** or **Not set**
   - If it's set to something else, change it to **S256** or leave it as **Not set**

2. **Proof Key for Code Exchange Code Challenge**: Should be **Not set** or **S256**

### 4. Save and Test
1. Click **Save** at the bottom
2. Go back to your React app
3. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
4. Try logging in again

## Common Mistakes

❌ **Client authentication is ON** - This requires a client secret, which browser apps can't securely store
✅ **Client authentication is OFF** - Correct for public clients

❌ **Redirect URI is `http://localhost:3000`** (without `/*`)
✅ **Redirect URI is `http://localhost:3000/*`** (with wildcard)

❌ **Web origins is empty or wrong**
✅ **Web origins is `http://localhost:3000`** (exact match, no wildcard)

❌ **Client has a client secret** - Public clients shouldn't have secrets
✅ **No client secret** - Correct for public clients

## Verify Your Configuration

After making changes, verify:
1. Client authentication: **OFF**
2. Valid redirect URIs: Contains `http://localhost:3000/*`
3. Web origins: Contains `http://localhost:3000`
4. No client secret exists (check the **Credentials** tab - should be empty or not applicable)

## Still Getting 401?

1. **Delete and recreate the client**:
   - Delete the existing `react-client`
   - Create a new client with the same ID
   - Follow all steps above carefully

2. **Check Keycloak logs**:
   - If using Docker: `docker logs <container-id>`
   - Look for more detailed error messages

3. **Try without PKCE** (temporary test):
   - In `src/App.js`, remove or comment out `pkceMethod: 'S256'`
   - This is just for testing - PKCE is recommended for security

4. **Check browser console**:
   - Look for CORS errors
   - Check network tab for the exact request/response

## Quick Client Setup Checklist

When creating the client, follow this exact order:

1. ✅ Client ID: `react-client`
2. ✅ Client type: `OpenID Connect`
3. ✅ Click **Next**
4. ✅ Client authentication: **OFF** (toggle OFF)
5. ✅ Click **Next**
6. ✅ Valid redirect URIs: `http://localhost:3000/*`
7. ✅ Web origins: `http://localhost:3000`
8. ✅ Valid post logout redirect URIs: `http://localhost:3000/*`
9. ✅ Click **Save**
10. ✅ Go to **Advanced** tab, verify PKCE settings
11. ✅ Click **Save** again

