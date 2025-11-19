# Dizimey Setup Guide

## Environment Variables

1. Create a `.env` file in the root directory with the following content:

```env
# TMDB API Key
VITE_API_KEY=8b0df767335a475bf7c6262444c31d24

# Backend API URL
VITE_API_BASE_URL=http://localhost:3001/api

# Database Configuration
DB_SERVER=MY-PC
DB_USER=sa
DB_PASSWORD=Ab123456**
DB_NAME=DizimeyDB

# JWT Secret
JWT_SECRET=your-secret-key-change-in-production
```

## Database Setup

1. Open SQL Server Management Studio (SSMS)
2. Connect to your SQL Server instance (MY-PC)
3. Run the SQL script located at `database/create_users_table.sql`
4. This will create the `DizimeyDB` database and `Users` table

## Backend Server Setup

1. Navigate to the `server` directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3001`

## Frontend Setup

1. Install dependencies (if not already installed):
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Features

- User authentication (Login/Signup)
- OAuth support (Google - coming soon)
- MSSQL database integration
- JWT token-based authentication

