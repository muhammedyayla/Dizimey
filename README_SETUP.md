# Dizimey Setup Guide

## Environment Variables

### Frontend (.env in root)
```env
VITE_API_KEY=8b0df767335a475bf7c6262444c31d24
VITE_API_BASE_URL=http://localhost:3001/api
```

### Backend (.env in server folder)
```env
# Database
DB_SERVER=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=Ab123456**
DB_NAME=DizimeyDB

# JWT & Session
JWT_SECRET=dizimey-secret-key-2024
SESSION_SECRET=dizimey-session-secret-2024

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Server Port
PORT=3001
```

## Database Setup

1. Run SQL script: `database/add_session_id_column.sql`
   - This adds `session_id`, `google_id`, `display_name`, and `photo` columns to Users table

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3001/api/auth/google/callback`
6. Copy Client ID and Client Secret to backend `.env`

## Features

- ✅ Signup only via Google OAuth
- ✅ After Google OAuth, user sets username and password
- ✅ Login with username + password
- ✅ Unique session_id for each user
- ✅ GitHub Pages deployment ready
