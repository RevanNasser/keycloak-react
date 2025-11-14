# Keycloak Next.js TypeScript Example

A Next.js application with TypeScript demonstrating Keycloak authentication integration.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Keycloak Server

**Option A: Using Docker (Recommended - No Manual Download Required)**
```bash
docker run -d \
  -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:26.0.1 \
  start-dev
```

Docker will automatically download the Keycloak image on first run. Make sure Docker is installed (get it from [docker.com](https://www.docker.com/products/docker-desktop)).

**Option B: Manual Download (Alternative)**
Download and install Keycloak from [keycloak.org](https://www.keycloak.org/downloads)

### 3. Configure Keycloak Client

1. Access Keycloak Admin Console at `http://localhost:8080`
2. Login with admin credentials (default: admin/admin)
3. Go to **Clients** → **Create client**
4. Set **Client ID**: `react-client`
5. Set **Client authentication**: OFF (Public client)
6. Add **Valid redirect URIs**: `http://localhost:3000/*`
7. Add **Web origins**: `http://localhost:3000`
8. Add **Valid post logout redirect URIs**: `http://localhost:3000/*`
9. Click **Save**

### 4. Configure Your App (Optional)

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Or create a `.env.local` file manually with:
```
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=master
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=react-client
```

If you don't create a `.env.local` file, the app will use these default values.

📖 **For detailed environment variable documentation, see [ENV_VARIABLES.md](./ENV_VARIABLES.md)**

### 5. Run the App

```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000) and you can login with Keycloak.

## 📋 Configuration

The app uses environment variables for configuration (with defaults):
- `NEXT_PUBLIC_KEYCLOAK_URL` - Keycloak server URL (default: `http://localhost:8080`)
- `NEXT_PUBLIC_KEYCLOAK_REALM` - Realm name (default: `master`)
- `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID` - Client ID (default: `react-client`)

**Note:** In Next.js, environment variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

## 🏗️ Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout with global styles
│   ├── page.tsx        # Main page component (client-side)
│   └── globals.css     # Global styles
├── lib/
│   ├── keycloak.ts     # Keycloak initialization and utilities
│   └── httpClient.ts   # Axios HTTP client configuration
├── next.config.js      # Next.js configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies
```

## ✨ Features

- ✅ **Next.js 14** with App Router
- ✅ **TypeScript** for type safety
- ✅ **Keycloak Integration** with proper client-side handling
- ✅ **PrimeReact UI** components
- ✅ **Educational UI** with documentation and interactive features
- ✅ **Token Management** with automatic refresh
- ✅ **Error Handling** with helpful debugging information

## 🔧 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📚 Important Notes

- ✅ **You MUST register/create a client in Keycloak** - see Step 3 above
- ✅ **Realm info is required** - use `master` for development or create your own realm
- ✅ The Client ID in your app **must exactly match** the Client ID in Keycloak
- ✅ Ensure keycloak-js version (26.0.1) matches your Keycloak server version
- ✅ **Next.js uses `NEXT_PUBLIC_` prefix** for environment variables (not `REACT_APP_`)

## 🔍 Troubleshooting

### CORS Errors
- Make sure `Web origins` is set correctly in Keycloak client settings
- Should include `http://localhost:3000` for development

### 401 Unauthorized
- Check that Client authentication is OFF in Keycloak
- Verify redirect URIs match exactly

### Invalid Redirect URI
- Make sure the redirect URI in Keycloak matches your app URL exactly
- Check that `http://localhost:3000/*` is in the Valid redirect URIs list

For more detailed troubleshooting, see:
- [ENV_VARIABLES.md](./ENV_VARIABLES.md) - Environment variables reference
- [TROUBLESHOOTING_401.md](./TROUBLESHOOTING_401.md) - 401 error fixes
- [VERIFY_KEYCLOAK_CONFIG.md](./VERIFY_KEYCLOAK_CONFIG.md) - Keycloak configuration checklist
- [FIX_CORS_NOW.md](./FIX_CORS_NOW.md) - CORS error fixes

## 📖 Detailed Setup Guide

For more detailed instructions, troubleshooting, and production considerations, see [KEYCLOAK_SETUP.md](./KEYCLOAK_SETUP.md)

## 🆕 Migration from Create React App

This project has been migrated from Create React App to Next.js with TypeScript. Key changes:

- **Framework**: React → Next.js 14 with App Router
- **Language**: JavaScript → TypeScript
- **Environment Variables**: `REACT_APP_*` → `NEXT_PUBLIC_*`
- **File Structure**: `src/` → `app/` and `lib/`
- **Client-side Only**: Keycloak runs only in the browser (client components)

## 🚢 Production Considerations

1. **Don't use `master` realm** - create a dedicated realm for your app
2. **Use HTTPS** - configure SSL/TLS certificates
3. **Set proper token expiration times**
4. **Configure proper redirect URIs** for your production domain
5. **Use environment variables** for all Keycloak configuration
6. **Enable proper logging and monitoring**
