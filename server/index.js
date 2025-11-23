import express from 'express'
import cors from 'cors'
import sql from 'mssql'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

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

// JWT Secret - Generate a random secret if not provided
const JWT_SECRET = process.env.JWT_SECRET || 'dizimey-jwt-secret-key-2024-change-in-production-' + Math.random().toString(36).substring(2, 15)

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
    const checkUser = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM Users WHERE username = @username OR email = @email')

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ success: false, message: 'Kullanıcı adı veya e-posta zaten kullanılıyor' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashedPassword)
      .query(`
        INSERT INTO Users (username, email, password, created_at)
        OUTPUT INSERTED.id, INSERTED.username, INSERTED.email, INSERTED.created_at
        VALUES (@username, @email, @password, GETDATE())
      `)

    const user = result.recordset[0]

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

    // Find user
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE username = @username')

    if (result.recordset.length === 0) {
      return res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı' })
    }

    const user = result.recordset[0]

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

