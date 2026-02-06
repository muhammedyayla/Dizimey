import express from 'express'
import cors from 'cors'
import pg from 'pg'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth20'
import session from 'express-session'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'dizimey-jwt-secret-key-2024-change-in-production-' + Math.random().toString(36).substring(2, 15)
const SESSION_SECRET = process.env.SESSION_SECRET || JWT_SECRET

// CORS Configuration - Support both localhost and production
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL,
  // Fallback for development if env vars not set
  ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:5173'] : [])
].filter(Boolean)

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin) || allowedOrigins.some(allowed => origin?.startsWith(allowed))) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.json())

// Session middleware
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 days
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// PostgreSQL connection pool
const { Pool } = pg
let pool = null

const connectDB = async () => {
  try {
    if (!pool) {
      const connectionString = process.env.DATABASE_URL ||
        `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`

      pool = new Pool({
        connectionString,
        ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 30000
      })

      const client = await pool.connect()
      const result = await client.query('SELECT version()')
      console.log('PostgreSQL Database connected successfully')
      console.log('Database version:', result.rows[0].version.substring(0, 50) + '...')
      client.release()
    }
    return pool
  } catch (error) {
    console.error('Database connection error:', error.message)
    pool = null
    return null
  }
}

connectDB().catch((err) => {
  console.error('Initial database connection failed, will retry on first request')
})

// Google OAuth Strategy
// Determine callback URL based on environment
const getCallbackURL = () => {
  // Always use environment variable if set
  if (process.env.GOOGLE_CALLBACK_URL) {
    return process.env.GOOGLE_CALLBACK_URL
  }

  // Fallback to localhost for development (should set GOOGLE_CALLBACK_URL in .env)
  console.warn('⚠️ GOOGLE_CALLBACK_URL not set in environment variables, using localhost fallback')
  return 'http://localhost:3001/api/auth/google/callback'
}

// Google OAuth Strategy
const googleStrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: getCallbackURL()
}

// Only initialize strategy if credentials are provided to prevent startup crash
if (googleStrategyOptions.clientID && googleStrategyOptions.clientSecret) {
  passport.use(new GoogleStrategy(googleStrategyOptions, async (accessToken, refreshToken, profile, done) => {
    try {
      const pool = await connectDB()
      if (!pool) {
        return done(new Error('Database connection failed'), null)
      }

      const googleId = profile.id
      const email = profile.emails?.[0]?.value
      const displayName = profile.displayName
      const photo = profile.photos?.[0]?.value

      // Check if user exists (PostgreSQL)
      const checkUser = await pool.query(
        'SELECT * FROM users WHERE google_id = $1',
        [googleId]
      )

      let user = checkUser.rows[0]

      if (!user) {
        // Create new user with Google OAuth
        const sessionId = uuidv4()
        const username = `user_${googleId.substring(0, 8)}`

        const result = await pool.query(
          `INSERT INTO users (google_id, email, username, display_name, photo, session_id, password, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NULL, NOW())
         RETURNING id, username, email, session_id, google_id`,
          [googleId, email, username, displayName || null, photo || null, sessionId]
        )

        user = result.rows[0]
      }

      return done(null, user)
    } catch (error) {
      console.error('Google OAuth error:', error)
      return done(error, null)
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const pool = await connectDB()
      if (!pool) {
        return done(new Error('Database connection failed'), null)
      }

      const result = await pool.query(
        'SELECT id, username, email, session_id, google_id, display_name, photo FROM users WHERE id = $1',
        [id]
      )

      done(null, result.rows[0])
    } catch (error) {
      done(error, null)
    }
  })

  // Middleware to verify JWT token
  const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token bulunamadı' })
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = decoded
      next()
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Geçersiz token' })
    }
  }

  // Health check endpoint
  app.get('/api/health', async (req, res) => {
    try {
      const pool = await connectDB()
      if (!pool) {
        return res.status(503).json({ status: 'error', message: 'Database not connected' })
      }
      await pool.query('SELECT 1')
      res.json({ status: 'ok', message: 'Server and database are running' })
    } catch (error) {
      res.status(503).json({ status: 'error', message: error.message })
    }
  })

  // Auth Routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { username, email, password } = req.body

      if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'Tüm alanlar zorunludur' })
      }

      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Şifre en az 6 karakter olmalıdır' })
      }

      const pool = await connectDB()
      if (!pool) {
        return res.status(503).json({ success: false, message: 'Veritabanı bağlantısı kurulamadı. Lütfen daha sonra tekrar deneyin.' })
      }

      const checkUser = await pool.query(
        'SELECT * FROM users WHERE username = $1 OR email = $2',
        [username, email]
      )

      if (checkUser.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Kullanıcı adı veya e-posta zaten kullanılıyor' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const sessionId = uuidv4()

      const result = await pool.query(
        `INSERT INTO users (username, email, password, session_id, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, username, email, session_id, created_at`,
        [username, email, hashedPassword, sessionId]
      )

      const user = result.rows[0]
      const token = jwt.sign({ id: user.id, username: user.username, sessionId: user.session_id }, JWT_SECRET, { expiresIn: '7d' })

      res.json({
        success: true,
        message: 'Kayıt başarılı',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          sessionId: user.session_id
        },
        token
      })
    } catch (error) {
      console.error('Signup error:', error)
      res.status(500).json({ success: false, message: 'Sunucu hatası' })
    }
  })

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body

      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Kullanıcı adı ve şifre zorunludur' })
      }

      const pool = await connectDB()
      if (!pool) {
        return res.status(503).json({ success: false, message: 'Veritabanı bağlantısı kurulamadı. Lütfen daha sonra tekrar deneyin.' })
      }

      const result = await pool.query(
        'SELECT * FROM users WHERE username = $1 AND password IS NOT NULL',
        [username]
      )

      if (result.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı' })
      }

      const user = result.rows[0]
      const isValidPassword = await bcrypt.compare(password, user.password)

      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı' })
      }

      // Ensure session_id exists
      if (!user.session_id) {
        const sessionId = uuidv4()
        await pool.query('UPDATE users SET session_id = $1 WHERE id = $2', [sessionId, user.id])
        user.session_id = sessionId
      }

      const token = jwt.sign({ id: user.id, username: user.username, sessionId: user.session_id }, JWT_SECRET, { expiresIn: '7d' })

      res.json({
        success: true,
        message: 'Giriş başarılı',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          sessionId: user.session_id
        },
        token
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ success: false, message: 'Sunucu hatası' })
    }
  })

  // Google OAuth Routes
  app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

  app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: (process.env.FRONTEND_URL || process.env.CORS_ORIGIN || 'http://localhost:5173') + '/?error=auth_failed' }),
    async (req, res) => {
      try {
        const user = req.user
        const token = jwt.sign({ id: user.id, username: user.username, sessionId: user.session_id }, JWT_SECRET, { expiresIn: '7d' })

        const frontendUrl = process.env.FRONTEND_URL || process.env.CORS_ORIGIN || 'http://localhost:5173'
        res.redirect(`${frontendUrl}/auth/callback?token=${token}&sessionId=${user.session_id}`)
      } catch (error) {
        console.error('OAuth callback error:', error)
        const frontendUrl = process.env.FRONTEND_URL || process.env.CORS_ORIGIN || 'http://localhost:5173'
        res.redirect(`${frontendUrl}/?error=callback_failed`)
      }
    }
  )

  // Complete signup - set username and password after Google OAuth
  app.post('/api/auth/complete-signup', async (req, res) => {
    try {
      const { sessionId, username, password } = req.body

      if (!sessionId || !username || !password) {
        return res.status(400).json({ success: false, message: 'Session ID, kullanıcı adı ve şifre zorunludur' })
      }

      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Şifre en az 6 karakter olmalıdır' })
      }

      const pool = await connectDB()
      if (!pool) {
        return res.status(503).json({ success: false, message: 'Veritabanı bağlantısı kurulamadı. Lütfen daha sonra tekrar deneyin.' })
      }

      const checkSession = await pool.query(
        'SELECT * FROM users WHERE session_id = $1 AND password IS NULL',
        [sessionId]
      )

      if (checkSession.rows.length === 0) {
        return res.status(400).json({ success: false, message: 'Geçersiz session veya kullanıcı zaten kayıtlı' })
      }

      const checkUsername = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      )

      if (checkUsername.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Kullanıcı adı zaten kullanılıyor' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const result = await pool.query(
        `UPDATE users
       SET username = $1, password = $2, updated_at = NOW()
       WHERE session_id = $3
       RETURNING id, username, email, session_id`,
        [username, hashedPassword, sessionId]
      )

      const user = result.rows[0]
      const token = jwt.sign({ id: user.id, username: user.username, sessionId: user.session_id }, JWT_SECRET, { expiresIn: '7d' })

      res.json({
        success: true,
        message: 'Kayıt tamamlandı',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          sessionId: user.session_id
        },
        token
      })
    } catch (error) {
      console.error('Complete signup error:', error)
      res.status(500).json({ success: false, message: 'Sunucu hatası' })
    }
  })

  // Logout route
  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Logout hatası' })
      }
      res.json({ success: true, message: 'Çıkış başarılı' })
    })
  })

  // Get current user info
  app.get('/api/auth/me', verifyToken, async (req, res) => {
    try {
      const pool = await connectDB()
      if (!pool) {
        return res.status(503).json({ success: false, message: 'Veritabanı bağlantısı kurulamadı' })
      }

      const result = await pool.query(
        'SELECT id, username, email, session_id, display_name, photo FROM users WHERE session_id = $1',
        [req.user.sessionId]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' })
      }

      res.json({ success: true, user: result.rows[0] })
    } catch (error) {
      console.error('Get user error:', error)
      res.status(500).json({ success: false, message: 'Sunucu hatası' })
    }
  })

  // Watchlist Routes
  app.get('/api/watchlist', verifyToken, async (req, res) => {
    try {
      const pool = await connectDB()
      if (!pool) {
        return res.status(503).json({ success: false, message: 'Veritabanı bağlantısı kurulamadı' })
      }

      const result = await pool.query(
        'SELECT * FROM watchlist WHERE session_id = $1 ORDER BY added_at DESC',
        [req.user.sessionId]
      )

      res.json({ success: true, watchlist: result.rows })
    } catch (error) {
      console.error('Get watchlist error:', error)
      res.status(500).json({ success: false, message: 'Sunucu hatası' })
    }
  })

  app.post('/api/watchlist', verifyToken, async (req, res) => {
    try {
      const { tmdb_id, media_type, title, poster_path, vote_average } = req.body

      if (!tmdb_id || !media_type || !title) {
        return res.status(400).json({ success: false, message: 'Eksik bilgi' })
      }

      const pool = await connectDB()
      if (!pool) {
        return res.status(503).json({ success: false, message: 'Veritabanı bağlantısı kurulamadı' })
      }

      const check = await pool.query(
        'SELECT * FROM watchlist WHERE session_id = $1 AND tmdb_id = $2 AND media_type = $3',
        [req.user.sessionId, tmdb_id, media_type]
      )

      if (check.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Zaten listede' })
      }

      const result = await pool.query(
        `INSERT INTO watchlist (session_id, tmdb_id, media_type, title, poster_path, vote_average, added_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
        [req.user.sessionId, tmdb_id, media_type, title, poster_path || null, vote_average || null]
      )

      res.json({ success: true, item: result.rows[0] })
    } catch (error) {
      console.error('Add watchlist error:', error)
      res.status(500).json({ success: false, message: 'Sunucu hatası' })
    }
  })

  app.delete('/api/watchlist/:tmdbId/:mediaType', verifyToken, async (req, res) => {
    try {
      const { tmdbId, mediaType } = req.params

      const pool = await connectDB()
      if (!pool) {
        return res.status(503).json({ success: false, message: 'Veritabanı bağlantısı kurulamadı' })
      }

      await pool.query(
        'DELETE FROM watchlist WHERE session_id = $1 AND tmdb_id = $2 AND media_type = $3',
        [req.user.sessionId, tmdbId, mediaType]
      )

      res.json({ success: true, message: 'Listeden çıkarıldı' })
    } catch (error) {
      console.error('Remove watchlist error:', error)
      res.status(500).json({ success: false, message: 'Sunucu hatası' })
    }
  })

  // Watch Progress Routes
  app.get('/api/watch-progress', verifyToken, async (req, res) => {
    try {
      const pool = await connectDB()
      if (!pool) {
        return res.status(503).json({ success: false, message: 'Veritabanı bağlantısı kurulamadı' })
      }

      const result = await pool.query(
        `SELECT * FROM watch_progress 
       WHERE session_id = $1 
       ORDER BY last_watched DESC`,
        [req.user.sessionId]
      )

      res.json({ success: true, progress: result.rows })
    } catch (error) {
      console.error('Get watch progress error:', error)
      res.status(500).json({ success: false, message: 'Sunucu hatası' })
    }
  })

  app.post('/api/watch-progress', verifyToken, async (req, res) => {
    try {
      const {
        tmdb_id,
        media_type,
        title,
        poster_path,
        backdrop_path,
        progress_percent,
        current_time,
        total_duration,
        season_number,
        episode_number
      } = req.body

      if (!tmdb_id || !media_type || !title) {
        return res.status(400).json({ success: false, message: 'Eksik bilgi' })
      }

      const pool = await connectDB()
      if (!pool) {
        return res.status(503).json({ success: false, message: 'Veritabanı bağlantısı kurulamadı' })
      }

      // Upsert using PostgreSQL ON CONFLICT
      const result = await pool.query(
        `INSERT INTO watch_progress 
       (session_id, tmdb_id, media_type, title, poster_path, backdrop_path, progress_percent, current_time, total_duration, season_number, episode_number, last_watched, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
       ON CONFLICT (session_id, tmdb_id, media_type, season_number, episode_number)
       DO UPDATE SET 
         progress_percent = EXCLUDED.progress_percent,
         current_time = EXCLUDED.current_time,
         total_duration = EXCLUDED.total_duration,
         last_watched = NOW(),
         updated_at = NOW()
       RETURNING *`,
        [
          req.user.sessionId, tmdb_id, media_type, title,
          poster_path || null, backdrop_path || null,
          progress_percent || 0, current_time || 0, total_duration || 0,
          season_number || -1, episode_number || -1
        ]
      )

      res.json({ success: true, progress: result.rows[0] })
    } catch (error) {
      console.error('Update watch progress error:', error)
      res.status(500).json({ success: false, message: 'Sunucu hatası' })
    }
  })

  app.delete('/api/watch-progress/:tmdbId/:mediaType', verifyToken, async (req, res) => {
    try {
      const { tmdbId, mediaType } = req.params
      const seasonNumber = req.query.season ? parseInt(req.query.season) : null
      const episodeNumber = req.query.episode ? parseInt(req.query.episode) : null

      const pool = await connectDB()
      if (!pool) {
        return res.status(503).json({ success: false, message: 'Veritabanı bağlantısı kurulamadı' })
      }

      let query = 'DELETE FROM watch_progress WHERE session_id = $1 AND tmdb_id = $2 AND media_type = $3'
      const params = [req.user.sessionId, tmdbId, mediaType]

      if (seasonNumber !== null && seasonNumber !== -1) {
        query += ' AND season_number = $4'
        params.push(seasonNumber)
        if (episodeNumber !== null && episodeNumber !== -1) {
          query += ' AND episode_number = $5'
          params.push(episodeNumber)
        } else {
          query += ' AND episode_number = -1'
        }
      } else if (episodeNumber !== null && episodeNumber !== -1) {
        query += ' AND season_number = -1 AND episode_number = $4'
        params.push(episodeNumber)
      } else {
        query += ' AND season_number = -1 AND episode_number = -1'
      }

      await pool.query(query, params)

      res.json({ success: true, message: 'İlerleme silindi' })
    } catch (error) {
      console.error('Delete watch progress error:', error)
      res.status(500).json({ success: false, message: 'Sunucu hatası' })
    }
  })

  // Vercel serverless function compatibility
  export default app

  // For local development
  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  }
