# Production Security Configuration

## Cookie Security Settings

The application uses different cookie security settings based on environment:

### Development (NODE_ENV=development)
```javascript
{
  httpOnly: false,     // Allows debugging in browser dev tools
  secure: false,       // Works with HTTP for local development
  sameSite: "Lax",     // Prevents CSRF while allowing same-site requests
  domain: undefined    // No domain restriction for localhost/IP access
}
```

### Production (NODE_ENV=production)
```javascript
{
  httpOnly: true,      // Prevents XSS attacks
  secure: true,        // HTTPS only
  sameSite: "Strict",  // Maximum CSRF protection
  domain: process.env.COOKIE_DOMAIN  // Restrict to your domain
}
```

## Production Deployment Checklist

### 1. Environment Variables
```bash
# Required for production
NODE_ENV=production
JWT_SECRET=your-actual-secret-min-32-chars
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
COOKIE_DOMAIN=.yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 2. HTTPS Setup
- ✅ SSL certificate configured
- ✅ Redirect HTTP to HTTPS
- ✅ HSTS headers enabled

### 3. Domain Configuration
- ✅ Set `COOKIE_DOMAIN` to your domain (e.g., `.yourdomain.com`)
- ✅ Configure `ALLOWED_ORIGINS` with your production URLs
- ✅ Update CORS settings in nginx if needed

### 4. Security Headers (nginx)
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

## GCP Cloud Run Production

### Dockerfile Updates for Production
```dockerfile
# Add production environment
ENV NODE_ENV=production
ENV PORT=8080
```

### Cloud Run Environment Variables
```bash
gcloud run deploy --set-env-vars \
  NODE_ENV=production,\
  JWT_SECRET=your-secret,\
  MONGODB_URI=your-mongodb-uri,\
  COOKIE_DOMAIN=.yourdomain.com,\
  ALLOWED_ORIGINS=https://yourdomain.com
```

## Security Best Practices Applied

1. **XSS Prevention**: `httpOnly: true` in production
2. **CSRF Prevention**: `sameSite: "Strict"` in production  
3. **HTTPS Enforcement**: `secure: true` in production
4. **Domain Restriction**: Proper domain configuration
5. **Secret Management**: Environment-based JWT secrets
6. **CORS Policy**: Explicit allowed origins list

## Development vs Production Trade-offs

| Feature | Development | Production | Reason |
|---------|------------|------------|---------|
| httpOnly | `false` | `true` | Dev debugging vs XSS security |
| secure | `false` | `true` | HTTP support vs HTTPS requirement |
| sameSite | `"Lax"` | `"Strict"` | Flexibility vs maximum CSRF protection |
| domain | `undefined` | `".domain.com"` | IP access vs domain security |

This configuration ensures maximum security in production while maintaining development flexibility.