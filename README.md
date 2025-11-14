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

For more detailed troubleshooting, see:
- [ENV_VARIABLES.md](./ENV_VARIABLES.md) - Environment variables reference
- [TROUBLESHOOTING_401.md](./TROUBLESHOOTING_401.md) - 401 error fixes
- [VERIFY_KEYCLOAK_CONFIG.md](./VERIFY_KEYCLOAK_CONFIG.md) - Keycloak configuration checklist
