-- Users Table Creation Script
-- Database: DizimeyDB

USE DizimeyDB;
GO

-- Create Users table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Users] (
        [id] INT IDENTITY(1,1) PRIMARY KEY,
        [username] NVARCHAR(50) NOT NULL UNIQUE,
        [email] NVARCHAR(100) NOT NULL UNIQUE,
        [password] NVARCHAR(255) NOT NULL,
        [created_at] DATETIME NOT NULL DEFAULT GETDATE(),
        [updated_at] DATETIME NULL,
        [last_login] DATETIME NULL,
        [is_active] BIT NOT NULL DEFAULT 1
    );

    -- Create indexes for better performance
    CREATE INDEX IX_Users_Username ON [dbo].[Users]([username]);
    CREATE INDEX IX_Users_Email ON [dbo].[Users]([email]);
    
    PRINT 'Users table created successfully';
END
ELSE
BEGIN
    PRINT 'Users table already exists';
END
GO

