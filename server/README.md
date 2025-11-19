# Dizimey Server Setup

## Database Connection Troubleshooting

If you're getting connection errors, try these solutions:

### 1. Check SQL Server is Running
- Open Services (services.msc)
- Find "SQL Server (MSSQLSERVER)" or "SQL Server (SQLEXPRESS)"
- Make sure it's running

### 2. Enable TCP/IP Protocol
1. Open SQL Server Configuration Manager
2. Go to "SQL Server Network Configuration" > "Protocols for MSSQLSERVER"
3. Right-click "TCP/IP" and select "Enable"
4. Restart SQL Server service

### 3. Check SQL Server Port
- Default port is 1433
- You can check in SQL Server Configuration Manager > TCP/IP > Properties > IP Addresses

### 4. Try Different Server Names
In your `.env` file, try these server names:
- `localhost`
- `127.0.0.1`
- `MY-PC`
- `MY-PC\\SQLEXPRESS` (if using Express edition)
- `(local)`
- `.` (dot)

### 5. Enable SQL Server Authentication
1. Open SQL Server Management Studio
2. Right-click server > Properties > Security
3. Select "SQL Server and Windows Authentication mode"
4. Restart SQL Server service

### 6. Check Firewall
- Allow port 1433 in Windows Firewall
- Or temporarily disable firewall to test

### 7. Test Connection
You can test the connection using SQL Server Management Studio first with the same credentials.

## Environment Variables

Create a `.env` file in the `server` directory:

```env
# Database Configuration
DB_SERVER=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=Ab123456**
DB_NAME=DizimeyDB

# JWT Secret (generate a random string)
JWT_SECRET=your-random-secret-key-here

# Server Port
PORT=3001
```

## Starting the Server

```bash
cd server
npm install
npm start
```

The server will start on port 3001.

