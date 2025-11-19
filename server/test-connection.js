import sql from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

const testConfigs = [
  {
    name: 'localhost',
    config: {
      server: 'localhost',
      port: 1433,
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
        enableArithAbort: true
      }
    }
  },
  {
    name: '127.0.0.1',
    config: {
      server: '127.0.0.1',
      port: 1433,
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
        enableArithAbort: true
      }
    }
  },
  {
    name: 'MY-PC',
    config: {
      server: 'MY-PC',
      port: 1433,
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
        enableArithAbort: true
      }
    }
  },
  {
    name: 'MY-PC\\SQLEXPRESS',
    config: {
      server: 'MY-PC\\SQLEXPRESS',
      port: 1433,
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
        enableArithAbort: true
      }
    }
  }
]

async function testConnection(config) {
  try {
    console.log(`\n🔍 Testing connection to: ${config.name}...`)
    const pool = await sql.connect(config.config)
    const result = await pool.request().query('SELECT @@VERSION as version')
    console.log(`✅ SUCCESS! Connected to ${config.name}`)
    console.log(`   Database version: ${result.recordset[0].version.substring(0, 60)}...`)
    await pool.close()
    return true
  } catch (error) {
    console.log(`❌ FAILED: ${config.name}`)
    console.log(`   Error: ${error.message}`)
    return false
  }
}

async function runTests() {
  console.log('🚀 Testing SQL Server connections...\n')
  console.log(`Using credentials: ${process.env.DB_USER || 'sa'} / ${'*'.repeat((process.env.DB_PASSWORD || 'Ab123456**').length)}`)
  
  for (const testConfig of testConfigs) {
    const success = await testConnection(testConfig)
    if (success) {
      console.log(`\n✨ Use this server name in your .env file: ${testConfig.name}`)
      break
    }
  }
  
  console.log('\n📝 If all connections failed, check:')
  console.log('   1. SQL Server is running (services.msc)')
  console.log('   2. TCP/IP is enabled in SQL Server Configuration Manager')
  console.log('   3. Port 1433 is open in firewall')
  console.log('   4. SQL Server Authentication is enabled')
}

runTests().catch(console.error)

