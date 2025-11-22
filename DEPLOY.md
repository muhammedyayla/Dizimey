# Deployment Guide

## GitHub Pages Deployment

Bu proje GitHub Pages ile deploy edilebilir, ancak **backend server ayrı bir hosting servisinde çalışmalıdır** (çünkü GitHub Pages sadece statik dosyaları host eder).

### Önkoşullar

1. GitHub repository'niz hazır olmalı
2. Backend server için ayrı hosting (Heroku, Railway, Render, vb.)
3. Google OAuth credentials (Google Cloud Console'dan)

### Adımlar

#### 1. Backend Server'ı Deploy Edin

Backend server'ınızı Heroku, Railway veya Render gibi bir servise deploy edin.

**Heroku Örneği:**
```bash
cd server
heroku create dizimey-api
git subtree push --prefix server heroku main
```

**Environment Variables (Heroku/Railway/Render):**
```
DB_SERVER=your-db-server
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=your-password
DB_NAME=DizimeyDB
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-api-url.com/api/auth/google/callback
FRONTEND_URL=https://your-username.github.io/Dizimey
PORT=3001
```

#### 2. GitHub Secrets Ayarlayın

Repository Settings > Secrets and variables > Actions'a gidin ve şu secrets'ları ekleyin:

- `VITE_API_KEY`: TMDB API key'iniz
- `VITE_API_BASE_URL`: Backend API URL'iniz (örn: `https://dizimey-api.herokuapp.com/api`)

#### 3. Frontend'i Build Edin ve Deploy Edin

```bash
# .env dosyasını oluşturun (local için)
VITE_API_KEY=your_tmdb_api_key
VITE_API_BASE_URL=https://your-api-url.com/api

# Build edin
npm run build

# GitHub Pages'e deploy edin
npm run deploy
```

**VEYA** GitHub Actions otomatik deploy için:

1. Repository Settings > Pages > Source: "GitHub Actions" seçin
2. `.github/workflows/deploy.yml` dosyası otomatik olarak çalışacak
3. Her push'ta otomatik deploy olur

#### 4. Google OAuth Setup

1. [Google Cloud Console](https://console.cloud.google.com/)'a gidin
2. Yeni bir proje oluşturun
3. OAuth 2.0 credentials oluşturun
4. Authorized redirect URIs'ye backend callback URL'inizi ekleyin:
   - `https://your-api-url.com/api/auth/google/callback`

#### 5. Database Setup

SQL Server database'inizi cloud'a taşıyın veya Azure SQL Database kullanın.

**Azure SQL Database Örneği:**
- Azure Portal'da SQL Database oluşturun
- Connection string'i backend environment variables'a ekleyin

### Önemli Notlar

⚠️ **Backend API URL'i Production'da mutlaka HTTPS olmalı** (Google OAuth gereksinimi)

⚠️ **CORS ayarları backend'de frontend URL'inizi içermeli**

⚠️ **Environment variables production'da secrets olarak saklanmalı**

### Local Development

Local'de test etmek için:

```bash
# Frontend
npm run dev

# Backend (server klasöründe)
cd server
npm start
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:3001`

