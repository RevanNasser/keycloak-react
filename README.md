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

create a `.env` file manually with:
```
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=master
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=react-client
```

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

## 🤖 AI Assistant

This project includes an AI-powered assistant to help you with Keycloak setup and troubleshooting. Click the 🤖 button in the bottom right corner to chat with the AI assistant.

**The AI can help you with:**
- Setting up Keycloak server with Docker
- Creating and configuring clients
- Troubleshooting 401 errors and CORS issues
- Understanding tokens and authentication flow
- Setting up realms, users, and roles
- Environment variables and configuration

## 📚 Additional Documentation

For more detailed troubleshooting, see:
- [KEYCLOAK_SETUP.md](./KEYCLOAK_SETUP.md) - Complete Keycloak setup guide
- [TROUBLESHOOTING_401.md](./TROUBLESHOOTING_401.md) - 401 error fixes
- [CHECKLIST.md](./CHECKLIST.md) - Pre-run checklist
