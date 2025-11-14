# Keycloak Setup Guide

## Overview
This React app uses Keycloak for authentication. You need to set up a Keycloak server and configure a client before the app will work.

## Step 1: Set Up Keycloak Server

You have two options:

### Option A: Use Docker (Recommended for Development)
**No download required!** Docker will automatically pull the Keycloak image when you run this command:

```bash
docker run -d \
  -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:26.0.1 \
  start-dev
```

**Prerequisites:** Make sure Docker is installed on your system. If not, download Docker Desktop from https://www.docker.com/products/docker-desktop

This will:
- Automatically download the Keycloak 26.0.1 image (first time only)
- Start Keycloak at `http://localhost:8080`
- Admin username: `admin`
- Admin password: `admin`

### Option B: Download and Run Locally (Alternative)
If you prefer not to use Docker:
1. Download Keycloak from https://www.keycloak.org/downloads
2. Extract the archive
3. Run: `bin/kc.sh start-dev` (Linux/Mac) or `bin/kc.bat start-dev` (Windows)
4. Access admin console at `http://localhost:8080`

## Step 2: Access Keycloak Admin Console

1. Open your browser and go to: `http://localhost:8080`
2. Click on **Administration Console**
3. Login with admin credentials:
   - Username: `admin`
   - Password: `admin` (or your custom password)

## Step 3: Create or Use a Realm

### Option A: Use the Default 'master' Realm
The app is currently configured to use the `master` realm. This works for development but is **NOT recommended for production**.

### Option B: Create a New Realm (Recommended)
1. In the Admin Console, click the realm dropdown (top left, shows "master")
2. Click **Create Realm**
3. Enter realm name: `my-realm` (or any name you prefer)
4. Click **Create**
5. **Update your app's configuration** to use this new realm name

## Step 4: Register/Create a Client

1. In the left sidebar, click **Clients**
2. Click **Create client** button
3. Fill in the form:
   - **Client type**: `OpenID Connect`
   - **Client ID**: `react-client` (must match the clientId in your app)
   - Click **Next**

4. **Client authentication**: Toggle **OFF** (Public client)
   - This is required for browser-based apps
   - Click **Next**

5. **Login settings**:
   - **Valid redirect URIs**: 
     - `http://localhost:3000/*` (for development)
     - Add your production URL when deploying
   - **Web origins**: 
     - `http://localhost:3000` (for development)
     - Add your production URL when deploying
   - **Valid post logout redirect URIs**:
     - `http://localhost:3000/*`
   - Click **Save**

## Step 5: Configure Your App

Update the configuration in your app to match your Keycloak setup:

### Using Environment Variables (Recommended)
Create a `.env` file in the project root:
```
REACT_APP_KEYCLOAK_URL=http://localhost:8080
REACT_APP_KEYCLOAK_REALM=master
REACT_APP_KEYCLOAK_CLIENT_ID=react-client
```

### Or Update App.js Directly
Edit `src/App.js` and update the `initOptions`:
```javascript
let initOptions = {
  url: 'http://localhost:8080/',      // Your Keycloak server URL
  realm: 'master',                     // Your realm name
  clientId: 'react-client',           // Must match the Client ID in Keycloak
}
```

## Step 6: Create a Test User (Optional)

To test login functionality:

1. In Keycloak Admin Console, go to **Users** (left sidebar)
2. Click **Create new user**
3. Fill in:
   - **Username**: `testuser` (or any username)
   - **Email**: `test@example.com`
   - Toggle **Email verified** to ON
   - Click **Create**

4. Go to **Credentials** tab
5. Click **Set password**
6. Enter password and confirm
7. Toggle **Temporary** to OFF (so user doesn't need to change password on first login)
8. Click **Save**

## Step 7: Run Your App

```bash
npm start
```

The app should now:
1. Redirect to Keycloak login page
2. After login, redirect back to your app
3. Display authentication status and tokens

## Configuration Summary

### Required Information:
- **Keycloak Server URL**: `http://localhost:8080` (default)
- **Realm Name**: `master` (default) or your custom realm
- **Client ID**: `react-client` (must match what you created in Keycloak)

### Important Notes:
- ✅ **You DO need to register/create a client in Keycloak** - this is Step 4 above
- ✅ **Realm info is required** - either use `master` or create your own realm
- ✅ The Client ID in your app **must exactly match** the Client ID in Keycloak
- ✅ Redirect URIs must be configured in Keycloak to match your app's URL
- ✅ For production, use a custom realm (not `master`) and proper security settings

## Troubleshooting

### "Invalid redirect URI" error
- Make sure the redirect URI in Keycloak matches your app URL exactly
- Check that `http://localhost:3000/*` is in the Valid redirect URIs list

### "Client not found" error
- Verify the Client ID in your app matches the Client ID in Keycloak
- Make sure the client is in the correct realm

### "Realm not found" error
- Check that the realm name in your app matches an existing realm in Keycloak
- Default realm is `master`

### CORS errors
- Make sure `Web origins` is set correctly in Keycloak client settings
- Should include `http://localhost:3000` for development

## Production Considerations

1. **Don't use `master` realm** - create a dedicated realm for your app
2. **Use HTTPS** - configure SSL/TLS certificates
3. **Set proper token expiration times**
4. **Configure proper redirect URIs** for your production domain
5. **Use environment variables** for all Keycloak configuration
6. **Enable proper logging and monitoring**

