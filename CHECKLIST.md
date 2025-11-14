# Pre-Run Checklist

Before running `npm start`, make sure:

## ✅ Required Steps

1. **Keycloak Server is Running**
   - Docker: `docker ps` should show Keycloak container running
   - Or verify Keycloak is accessible at `http://localhost:8080`

2. **Keycloak Client is Configured**
   - Client ID: `react-client` (or match your `.env` file)
   - Valid redirect URIs: `http://localhost:3000/*`
   - Web origins: `http://localhost:3000`
   - Client authentication: OFF (Public client)

3. **Dependencies Installed**
   - Run `npm install` if you haven't already
   - ✅ Already installed (node_modules exists)

4. **Configuration (Optional)**
   - If using custom Keycloak URL/realm/client, create `.env` file
   - Otherwise, app uses defaults:
     - URL: `http://localhost:8080`
     - Realm: `master`
     - Client ID: `react-client`

## 🚀 Ready to Run

Once all above are checked, simply run:
```bash
npm start
```

The app will:
- Start on `http://localhost:3000`
- Automatically redirect to Keycloak login
- After login, redirect back to your app

## 🔍 Troubleshooting

If you see errors:
- **"Invalid redirect URI"**: Check Keycloak client settings
- **"Client not found"**: Verify Client ID matches
- **"Realm not found"**: Check realm name
- **Connection errors**: Make sure Keycloak is running on port 8080

