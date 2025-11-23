import express from 'express'
import cors from 'cors'
import pg from 'pg'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.json())

// PostgreSQL connection pool
const { Pool } = pg
let pool = null

const connectDB = async () => {
  try {
    if (!pool) {
      // Use DATABASE_URL from environment (Neon connection string)
      // or construct from individual variables
      const connectionString = process.env.DATABASE_URL || 
        `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`
      
      pool = new Pool({
        connectionString,
        ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 30000
      })

      // Test connection
      const client = await pool.connect()
      const result = await client.query('SELECT version()')
      console.log('PostgreSQL Database connected successfully')
      console.log('Database version:', result.rows[0].version.substring(0, 50) + '...')
      client.release()
    }
    return pool
  } catch (error) {
    console.error('Database connection error:', error.message)
    console.error('Error code:', error.code)
    
    // Provide helpful error messages
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Connection refused. Please check:')
      console.error('1. Database server is running')
      console.error('2. Connection string is correct')
      console.error('3. Network connectivity')
    } else if (error.code === '28P01') {
      console.error('\n⚠️  Authentication failed. Please check:')
      console.error('1. Username and password are correct')
      console.error('2. Database credentials in connection string')
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

// JWT Secret - Generate a random secret if not provided
const JWT_SECRET = process.env.JWT_SECRET || 'dizimey-jwt-secret-key-2024-change-in-production-' + Math.random().toString(36).substring(2, 15)

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

    // Check if user exists
    const checkUser = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    )

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Kullanıcı adı veya e-posta zaten kullanılıyor' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user (PostgreSQL syntax)
    const result = await pool.query(
      `INSERT INTO users (username, email, password, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, username, email, created_at`,
      [username, email, hashedPassword]
    )

    const user = result.rows[0]

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })

    res.json({
      success: true,
      message: 'Kayıt başarılı',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
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

    // Find user (PostgreSQL syntax)
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı' })
    }

    const user = result.rows[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı' })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })

    res.json({
      success: true,
      message: 'Giriş başarılı',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
})

// OAuth routes (placeholder)
app.get('/api/auth/google', (req, res) => {
  // OAuth implementation
  res.json({ message: 'OAuth Google - Coming soon' })
})

// Vercel serverless function compatibility
export default app

// For local development
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}
