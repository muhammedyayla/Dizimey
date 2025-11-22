import express from 'express'
import cors from 'cors'
import sql from 'mssql'
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

// JWT Secret - Generate a random secret if not provided
const JWT_SECRET = process.env.JWT_SECRET || 'dizimey-jwt-secret-key-2024-change-in-production-' + Math.random().toString(36).substring(2, 15)
const SESSION_SECRET = process.env.SESSION_SECRET || JWT_SECRET

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Session middleware
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 days
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Database configuration
const dbConfig = {
  server: process.env.DB_SERVER || 'localhost', // Try localhost first, then MY-PC
  port: parseInt(process.env.DB_PORT) || 1433,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD || 'Ab123456**'
    }
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    database: process.env.DB_NAME || 'DizimeyDB',
    connectionTimeout: 30000,
    requestTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
}

// Database connection pool
let pool = null

const connectDB = async () => {
  try {
    if (!pool) {
      // Try to connect
      pool = await sql.connect(dbConfig)
      console.log(`MSSQL Database connected successfully to ${dbConfig.server}:${dbConfig.port}`)
      
      // Test connection with a simple query
      const result = await pool.request().query('SELECT @@VERSION as version')
      console.log('Database version:', result.recordset[0].version.substring(0, 50) + '...')
    }
    return pool
  } catch (error) {
    console.error('Database connection error:', error.message)
    console.error('Error code:', error.code)
    
    // Provide helpful error messages
    if (error.code === 'ESOCKET') {
      console.error('\n⚠️  Connection failed. Please check:')
      console.error('1. SQL Server is running')
      console.error('2. SQL Server Browser service is running')
      console.error('3. TCP/IP protocol is enabled in SQL Server Configuration Manager')
      console.error('4. Port 1433 is open in firewall')
      console.error('5. Server name is correct (try: localhost, 127.0.0.1, or MY-PC\\SQLEXPRESS)')
    } else if (error.code === 'ELOGIN') {
      console.error('\n⚠️  Authentication failed. Please check:')
      console.error('1. Username and password are correct')
      console.error('2. SQL Server Authentication is enabled')
    }
    
    // Don't throw error on startup, allow server to start
    // Connection will be retried on first request
    pool = null
    return null
  }
}

// Initialize database connection (non-blocking)
connectDB().catch((err) => {
  console.error('Initial database connection failed, will retry on first request')
})

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const pool = await connectDB()
    if (!pool) {
      return done(new Error('Database connection failed'), null)
    }

    const googleId = profile.id
    const email = profile.emails?.[0]?.value
    const displayName = profile.displayName
    const photo = profile.photos?.[0]?.value

    // Check if user exists
    const checkUser = await pool.request()
      .input('googleId', sql.NVarChar, googleId)
      .query('SELECT * FROM Users WHERE google_id = @googleId')

    let user = checkUser.recordset[0]

    if (!user) {
      // Create new user with Google OAuth
      const sessionId = uuidv4()
      const username = `user_${googleId.substring(0, 8)}` // Temporary username
      
      const result = await pool.request()
        .input('googleId', sql.NVarChar, googleId)
        .input('email', sql.NVarChar, email)
        .input('username', sql.NVarChar, username)
        .input('displayName', sql.NVarChar, displayName || null)
        .input('photo', sql.NVarChar, photo || null)
        .input('sessionId', sql.UniqueIdentifier, sessionId)
        .query(`
          INSERT INTO Users (google_id, email, username, display_name, photo, session_id, password, created_at)
          OUTPUT INSERTED.id, INSERTED.username, INSERTED.email, INSERTED.session_id, INSERTED.google_id
          VALUES (@googleId, @email, @username, @displayName, @photo, @sessionId, NULL, GETDATE())
        `)

      user = result.recordset[0]
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

    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT id, username, email, session_id, google_id FROM Users WHERE id = @id')

    done(null, result.recordset[0])
  } catch (error) {
    done(error, null)
  }
})

// Google OAuth Routes
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.FRONTEND_URL + '/login?error=auth_failed' }),
  async (req, res) => {
    try {
      const user = req.user
      const token = jwt.sign({ id: user.id, username: user.username, sessionId: user.session_id }, JWT_SECRET, { expiresIn: '7d' })
      
      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}&sessionId=${user.session_id}`)
    } catch (error) {
      console.error('OAuth callback error:', error)
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=callback_failed`)
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

    // Check if session exists and user hasn't completed signup
    const checkSession = await pool.request()
      .input('sessionId', sql.UniqueIdentifier, sessionId)
      .query('SELECT * FROM Users WHERE session_id = @sessionId AND password IS NULL')

    if (checkSession.recordset.length === 0) {
      return res.status(400).json({ success: false, message: 'Geçersiz session veya kullanıcı zaten kayıtlı' })
    }

    // Check if username is available
    const checkUsername = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE username = @username')

    if (checkUsername.recordset.length > 0) {
      return res.status(400).json({ success: false, message: 'Kullanıcı adı zaten kullanılıyor' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user with username and password
    const result = await pool.request()
      .input('sessionId', sql.UniqueIdentifier, sessionId)
      .input('username', sql.NVarChar, username)
      .input('password', sql.NVarChar, hashedPassword)
      .query(`
        UPDATE Users
        SET username = @username, password = @password, updated_at = GETDATE()
        OUTPUT INSERTED.id, INSERTED.username, INSERTED.email, INSERTED.session_id
        WHERE session_id = @sessionId
      `)

    const user = result.recordset[0]

    // Generate JWT token
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

    // Find user
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE username = @username AND password IS NOT NULL')

    if (result.recordset.length === 0) {
      return res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı' })
    }

    const user = result.recordset[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı' })
    }

    // Ensure session_id exists
    if (!user.session_id) {
      const sessionId = uuidv4()
      await pool.request()
        .input('id', sql.Int, user.id)
        .input('sessionId', sql.UniqueIdentifier, sessionId)
        .query('UPDATE Users SET session_id = @sessionId WHERE id = @id')
      user.session_id = sessionId
    }

    // Generate JWT token
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

// Logout route
app.post('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout hatası' })
    }
    res.json({ success: true, message: 'Çıkış başarılı' })
  })
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

// Get current user info
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const pool = await connectDB()
    if (!pool) {
      return res.status(503).json({ success: false, message: 'Veritabanı bağlantısı kurulamadı' })
    }

    const result = await pool.request()
      .input('sessionId', sql.UniqueIdentifier, req.user.sessionId)
      .query('SELECT id, username, email, session_id, display_name, photo FROM Users WHERE session_id = @sessionId')

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' })
    }

    res.json({ success: true, user: result.recordset[0] })
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

    const result = await pool.request()
      .input('sessionId', sql.UniqueIdentifier, req.user.sessionId)
      .query('SELECT * FROM Watchlist WHERE session_id = @sessionId ORDER BY added_at DESC')

    res.json({ success: true, watchlist: result.recordset })
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

    // Check if already exists
    const check = await pool.request()
      .input('sessionId', sql.UniqueIdentifier, req.user.sessionId)
      .input('tmdbId', sql.Int, tmdb_id)
      .input('mediaType', sql.NVarChar, media_type)
      .query('SELECT * FROM Watchlist WHERE session_id = @sessionId AND tmdb_id = @tmdbId AND media_type = @mediaType')

    if (check.recordset.length > 0) {
      return res.status(400).json({ success: false, message: 'Zaten listede' })
    }

    const result = await pool.request()
      .input('sessionId', sql.UniqueIdentifier, req.user.sessionId)
      .input('tmdbId', sql.Int, tmdb_id)
      .input('mediaType', sql.NVarChar, media_type)
      .input('title', sql.NVarChar, title)
      .input('posterPath', sql.NVarChar, poster_path || null)
      .input('voteAverage', sql.Float, vote_average || null)
      .query(`
        INSERT INTO Watchlist (session_id, tmdb_id, media_type, title, poster_path, vote_average, added_at)
        OUTPUT INSERTED.*
        VALUES (@sessionId, @tmdbId, @mediaType, @title, @posterPath, @voteAverage, GETDATE())
      `)

    res.json({ success: true, item: result.recordset[0] })
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

    await pool.request()
      .input('sessionId', sql.UniqueIdentifier, req.user.sessionId)
      .input('tmdbId', sql.Int, tmdbId)
      .input('mediaType', sql.NVarChar, mediaType)
      .query('DELETE FROM Watchlist WHERE session_id = @sessionId AND tmdb_id = @tmdbId AND media_type = @mediaType')

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

    const result = await pool.request()
      .input('sessionId', sql.UniqueIdentifier, req.user.sessionId)
      .query(`
        SELECT * FROM [dbo].[WatchProgress] 
        WHERE [session_id] = @sessionId 
        ORDER BY [last_watched] DESC
      `)

    res.json({ success: true, progress: result.recordset })
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

    const result = await pool.request()
      .input('sessionId', sql.UniqueIdentifier, req.user.sessionId)
      .input('tmdbId', sql.Int, tmdb_id)
      .input('mediaType', sql.NVarChar, media_type)
      .input('title', sql.NVarChar, title)
      .input('posterPath', sql.NVarChar, poster_path || null)
      .input('backdropPath', sql.NVarChar, backdrop_path || null)
      .input('progressPercent', sql.Float, progress_percent || 0)
      .input('currentTime', sql.Int, current_time || 0)
      .input('totalDuration', sql.Int, total_duration || 0)
      .input('seasonNumber', sql.Int, season_number || null)
      .input('episodeNumber', sql.Int, episode_number || null)
      .query(`
        MERGE [dbo].[WatchProgress] AS target
        USING (SELECT @sessionId AS session_id, @tmdbId AS tmdb_id, @mediaType AS media_type, @seasonNumber AS season_number, @episodeNumber AS episode_number) AS source
        ON target.[session_id] = source.session_id 
          AND target.[tmdb_id] = source.tmdb_id 
          AND target.[media_type] = source.media_type
          AND (target.[season_number] = source.season_number OR (target.[season_number] IS NULL AND source.season_number IS NULL))
          AND (target.[episode_number] = source.episode_number OR (target.[episode_number] IS NULL AND source.episode_number IS NULL))
        WHEN MATCHED THEN
          UPDATE SET 
            [progress_percent] = @progressPercent,
            [current_time] = @currentTime,
            [total_duration] = @totalDuration,
            [last_watched] = GETDATE(),
            [updated_at] = GETDATE()
        WHEN NOT MATCHED THEN
          INSERT ([session_id], [tmdb_id], [media_type], [title], [poster_path], [backdrop_path], [progress_percent], [current_time], [total_duration], [season_number], [episode_number], [last_watched], [updated_at])
          VALUES (@sessionId, @tmdbId, @mediaType, @title, @posterPath, @backdropPath, @progressPercent, @currentTime, @totalDuration, @seasonNumber, @episodeNumber, GETDATE(), GETDATE());
        
        SELECT * FROM [dbo].[WatchProgress] 
        WHERE [session_id] = @sessionId 
          AND [tmdb_id] = @tmdbId 
          AND [media_type] = @mediaType
          AND ([season_number] = @seasonNumber OR ([season_number] IS NULL AND @seasonNumber IS NULL))
          AND ([episode_number] = @episodeNumber OR ([episode_number] IS NULL AND @episodeNumber IS NULL))
      `)

    res.json({ success: true, progress: result.recordset[0] })
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

    let query = 'DELETE FROM [dbo].[WatchProgress] WHERE [session_id] = @sessionId AND [tmdb_id] = @tmdbId AND [media_type] = @mediaType'
    const request = pool.request()
      .input('sessionId', sql.UniqueIdentifier, req.user.sessionId)
      .input('tmdbId', sql.Int, tmdbId)
      .input('mediaType', sql.NVarChar, mediaType)

    if (seasonNumber !== null) {
      query += ' AND [season_number] = @seasonNumber'
      request.input('seasonNumber', sql.Int, seasonNumber)
    }
    if (episodeNumber !== null) {
      query += ' AND [episode_number] = @episodeNumber'
      request.input('episodeNumber', sql.Int, episodeNumber)
    }

    await request.query(query)

    res.json({ success: true, message: 'İlerleme silindi' })
  } catch (error) {
    console.error('Delete watch progress error:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

