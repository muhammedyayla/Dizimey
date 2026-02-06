# Google OAuth Setup Guide - Secure Configuration

## 🔒 Security Notice

**IMPORTANT**: This guide has been updated to use environment variables for all sensitive data. Never commit actual credentials to the repository.

## ✅ Setup Steps

### 1. Server Environment Variables

Create `server/.env` file based on `server/.env.example`:

```bash
cd server
cp .env.example .env
```

Then edit `server/.env` and fill in your actual values:

```env
# Database Configuration
DATABASE_URL=your-actual-database-url

# JWT & Session Secrets (generate random strings)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Frontend & CORS
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 2. Frontend Environment Variables

Create `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Then edit `.env` and fill in your actual values:

```env
# TMDB API Configuration
VITE_API_KEY=your-tmdb-api-key

# Backend API URL
VITE_API_BASE_URL=http://localhost:3001/api
```

### 3. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select your project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add **Authorized redirect URIs**:
   - For localhost: `http://localhost:3001/api/auth/google/callback`
   - For production: `https://your-backend-domain.vercel.app/api/auth/google/callback`

### 4. Vercel Deployment (Production)

In Vercel Dashboard → Settings → Environment Variables, add:

```env
# Database
DATABASE_URL=your-production-database-url

# Secrets
JWT_SECRET=your-production-jwt-secret
SESSION_SECRET=your-production-session-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend.vercel.app/api/auth/google/callback

# Frontend
FRONTEND_URL=https://your-frontend-domain.com
CORS_ORIGIN=https://your-frontend-domain.com

# Server
NODE_ENV=production
```

## 🧪 Testing

### Localhost Test:
1. Ensure `.env` files are created and filled
2. Start backend: `cd server && npm start`
3. Start frontend: `npm run dev`
4. Click "Google ile Giriş Yap"
5. Should redirect to: `http://localhost:5173/auth/callback`

### Production Test:
1. Deploy backend to Vercel
2. Set all environment variables in Vercel
3. Deploy frontend
4. Test Google login
5. Should redirect to: `https://your-frontend-domain.com/auth/callback`

## 🐛 Troubleshooting

### "Cannot GET /api/auth/google/callback"
- ✅ Check `GOOGLE_CALLBACK_URL` is set in environment variables
- ✅ Verify URL matches exactly in Google Cloud Console
- ✅ Redeploy after changing environment variables

### CORS Errors
- ✅ Check `FRONTEND_URL` and `CORS_ORIGIN` are set correctly
- ✅ Ensure frontend URL matches exactly (no trailing slash)
- ✅ Verify Vercel environment variables are set

### Environment Variables Not Loading
- ✅ Restart server after changing `.env` file
- ✅ Check `.env` file is in correct directory
- ✅ Verify no syntax errors in `.env` file
- ✅ For Vercel, redeploy after changing environment variables

## 🔐 Security Best Practices

1. **Never commit `.env` files** - They are in `.gitignore`
2. **Use strong secrets** - Generate random strings for JWT_SECRET and SESSION_SECRET
3. **Different secrets for production** - Don't use the same secrets in development and production
4. **Rotate credentials regularly** - Change secrets periodically
5. **Limit OAuth scopes** - Only request necessary Google permissions
