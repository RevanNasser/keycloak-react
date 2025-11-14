# ⚠️ URGENT: Fix CORS Error

You're seeing a CORS error which means **Web origins is missing or incorrect** in Keycloak.

## Quick Fix (2 minutes)

### Step 1: Open Keycloak
1. Go to `http://localhost:8080`
2. Click **Administration Console**
3. Login (admin/admin)

### Step 2: Fix Web Origins
1. Click **Clients** (left sidebar)
2. Click **react-client**
3. Make sure you're on the **Settings** tab
4. Scroll down to find **Web origins** field
5. **Type exactly**: `http://localhost:3000`
   - ✅ Correct: `http://localhost:3000`
   - ❌ Wrong: `http://localhost:3000/` (has trailing slash)
   - ❌ Wrong: `http://localhost:3000/*` (has wildcard)
   - ❌ Wrong: `localhost:3000` (missing http://)
6. Click **Save** button at the bottom

### Step 3: Test
1. Go back to your React app
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Try logging in again

## Visual Guide

In Keycloak client settings, you should see:

```
┌─────────────────────────────────────┐
│ Web origins                        │
│ ┌───────────────────────────────┐ │
│ │ http://localhost:3000         │ │  ← Type this exactly
│ └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Still Not Working?

1. **Check the field is saved**:
   - After clicking Save, refresh the page
   - Go back to Clients → react-client → Settings
   - Verify "Web origins" still shows `http://localhost:3000`

2. **Check for typos**:
   - Must be exactly: `http://localhost:3000`
   - No spaces before or after
   - Case sensitive (lowercase)

3. **Try deleting and re-adding**:
   - Clear the Web origins field
   - Click Save
   - Add `http://localhost:3000` again
   - Click Save

4. **Verify other settings**:
   - Client authentication: **OFF**
   - Valid redirect URIs: `http://localhost:3000/*`
   - Web origins: `http://localhost:3000`

## Why This Happens

CORS (Cross-Origin Resource Sharing) is a browser security feature. When your React app (running on `http://localhost:3000`) tries to make a request to Keycloak (`http://localhost:8080`), the browser checks if Keycloak allows requests from your origin.

The "Web origins" setting in Keycloak tells it to send the `Access-Control-Allow-Origin` header, which allows your browser to read the response.

Without this setting, the browser blocks the request even if Keycloak processes it successfully.

