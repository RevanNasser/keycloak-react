# Environment Variables Reference

This document explains all environment variables used in the Keycloak Next.js application.

## Quick Start

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the values in `.env.local` with your Keycloak configuration

3. Restart your development server:
   ```bash
   npm run dev
   ```

## Environment Variables

### `NEXT_PUBLIC_KEYCLOAK_URL`

**Description**: The base URL where your Keycloak server is running.

**Type**: String (URL)

**Default**: `http://localhost:8080`

**Example**:
```env
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
```

**Production Example**:
```env
NEXT_PUBLIC_KEYCLOAK_URL=https://keycloak.yourdomain.com
```

**Notes**:
- Do not include a trailing slash (it will be added automatically)
- For production, use HTTPS
- This is the base URL - the app will append `/realms/{realm}` automatically

---

### `NEXT_PUBLIC_KEYCLOAK_REALM`

**Description**: The realm name in Keycloak where your client is configured.

**Type**: String

**Default**: `master`

**Example**:
```env
NEXT_PUBLIC_KEYCLOAK_REALM=master
```

**Production Example**:
```env
NEXT_PUBLIC_KEYCLOAK_REALM=my-production-realm
```

**Notes**:
- The `master` realm is fine for development but **NOT recommended for production**
- Create a dedicated realm for your application in production
- Realm names are case-sensitive
- The realm must exist in your Keycloak server

---

### `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID`

**Description**: The client ID that matches the client you created in Keycloak admin console.

**Type**: String

**Default**: `react-client`

**Example**:
```env
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=react-client
```

**Production Example**:
```env
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=my-app-client
```

**Notes**:
- **Must exactly match** the Client ID in Keycloak admin console
- Case-sensitive
- This is the public client ID (not a secret)
- The client must be configured as a public client (Client authentication: OFF)

---

## Next.js Environment Variable Rules

### `NEXT_PUBLIC_` Prefix

All environment variables that need to be accessible in the browser **must** be prefixed with `NEXT_PUBLIC_`.

- ✅ `NEXT_PUBLIC_KEYCLOAK_URL` - Accessible in browser
- ❌ `KEYCLOAK_URL` - Not accessible in browser (server-side only)

### File Priority

Next.js loads environment variables in this order (later files override earlier ones):

1. `.env` - Default values (committed to git)
2. `.env.local` - Local overrides (not committed to git)
3. `.env.development` - Development-specific (not committed to git)
4. `.env.production` - Production-specific (not committed to git)

**Recommended**: Use `.env.local` for local development.

### Security Notes

⚠️ **Important**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Do not put secrets in these variables.

- ✅ Safe: `NEXT_PUBLIC_KEYCLOAK_URL` (public URL)
- ✅ Safe: `NEXT_PUBLIC_KEYCLOAK_REALM` (realm name)
- ✅ Safe: `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID` (public client ID)
- ❌ **Never**: Client secrets, API keys, passwords

---

## Configuration Examples

### Development (Local)
```env
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=master
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=react-client
```

### Production
```env
NEXT_PUBLIC_KEYCLOAK_URL=https://auth.yourdomain.com
NEXT_PUBLIC_KEYCLOAK_REALM=production-realm
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=production-client
```

### Docker Development
```env
NEXT_PUBLIC_KEYCLOAK_URL=http://keycloak:8080
NEXT_PUBLIC_KEYCLOAK_REALM=master
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=react-client
```

---

## Troubleshooting

### Variables Not Working?

1. **Check the prefix**: Must be `NEXT_PUBLIC_` for browser access
2. **Restart the server**: Environment variables are loaded at startup
3. **Check file name**: Use `.env.local` for local development
4. **No quotes needed**: Don't wrap values in quotes unless necessary
5. **No spaces**: `KEY=value` not `KEY = value`

### Example Issues

❌ **Wrong**:
```env
NEXT_PUBLIC_KEYCLOAK_URL="http://localhost:8080"
KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_URL = http://localhost:8080
```

✅ **Correct**:
```env
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
```

---

## Where Variables Are Used

- **`lib/keycloak.ts`**: Keycloak initialization and configuration
- **`app/page.tsx`**: Display configuration in the UI

---

## Related Documentation

- [README.md](./README.md) - Main setup guide
- [KEYCLOAK_SETUP.md](./KEYCLOAK_SETUP.md) - Keycloak server setup
- [TROUBLESHOOTING_401.md](./TROUBLESHOOTING_401.md) - Common issues

---

## Quick Reference

| Variable | Required | Default | Example |
|----------|----------|---------|---------|
| `NEXT_PUBLIC_KEYCLOAK_URL` | No | `http://localhost:8080` | `http://localhost:8080` |
| `NEXT_PUBLIC_KEYCLOAK_REALM` | No | `master` | `master` |
| `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID` | No | `react-client` | `react-client` |

All variables are optional and will use defaults if not provided.

