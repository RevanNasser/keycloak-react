# Quick Verification Checklist

Use this to quickly verify your Keycloak client is configured correctly.

## Step 1: Access Keycloak Admin Console

1. Open `http://localhost:8080` in your browser
2. Click **Administration Console**
3. Login with admin credentials (default: admin/admin)

## Step 2: Find Your Client

1. Click **Clients** in the left sidebar
2. Click on **react-client** (or your client ID)

## Step 3: Verify Settings Tab

Check each of these settings:

### ✅ Client authentication
- **MUST BE OFF** (toggle should be gray/off, not blue/on)
- If it's ON, turn it OFF and click **Save**

### ✅ Valid redirect URIs
- Must contain exactly: `http://localhost:3000/*`
- Check for:
  - ✅ Has `http://localhost:3000/*` (with wildcard)
  - ❌ No trailing spaces
  - ❌ No `http://localhost:3000` without the `/*`

### ✅ Web origins
- Must contain exactly: `http://localhost:3000`
- Check for:
  - ✅ Has `http://localhost:3000` (exact match)
  - ❌ No trailing slash (`http://localhost:3000/` is wrong)
  - ❌ No wildcard (`http://localhost:3000/*` is wrong)

### ✅ Valid post logout redirect URIs
- Should contain: `http://localhost:3000/*`

## Step 4: Check Advanced Settings (Optional)

1. Click the **Advanced** tab
2. Verify:
   - **Proof Key for Code Exchange Code Challenge Method**: Should be `S256` or empty
   - **Proof Key for Code Exchange Code Challenge**: Should be empty or `S256`

## Step 5: Verify No Client Secret

1. Click the **Credentials** tab
2. There should be **NO client secret** shown
3. If a secret exists, this is wrong for a public client

## Common Mistakes

### ❌ Client authentication is ON
**Symptom**: 401 Unauthorized error
**Fix**: Turn it OFF in Settings tab

### ❌ Redirect URI is wrong
**Symptom**: "Invalid redirect URI" error or 401
**Fix**: Must be exactly `http://localhost:3000/*` (with wildcard)

### ❌ Web origins is wrong
**Symptom**: CORS errors or 401
**Fix**: Must be exactly `http://localhost:3000` (no wildcard, no trailing slash)

### ❌ Client secret exists
**Symptom**: 401 Unauthorized
**Fix**: Public clients should not have secrets. Delete the client and recreate it if needed.

## Quick Test

After fixing the settings:

1. Click **Save** in Keycloak
2. Go back to your React app
3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. Click "🔄 Refresh Auth Status & Debug" button
5. Check the debug output - it will show what's wrong

## Still Not Working?

1. **Delete and recreate the client**:
   - In Keycloak, delete `react-client`
   - Create a new client following the exact steps in README.md
   - Make sure Client authentication is OFF from the start

2. **Check browser console**:
   - Look for specific error messages
   - Check the Network tab for failed requests
   - Look at the response details

3. **Verify Keycloak is running**:
   - Make sure Keycloak is accessible at `http://localhost:8080`
   - Try accessing the admin console

