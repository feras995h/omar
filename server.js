import express from 'express';
import path from 'path';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for shared hosting
app.set('trust proxy', true);

// Middleware
app.use(cors({
  origin: [
    'http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io',
    'https://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io',
    'http://localhost:3000',
    'https://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Configure MIME types for static files
app.use(express.static(__dirname, {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    } else if (filePath.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    } else if (filePath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
  }
}));

// Database connection configuration
const dbConfig = {
  host: process.env.VITE_MYSQL_HOST || process.env.DB_HOST || '72.60.92.146',
  port: parseInt(process.env.VITE_MYSQL_PORT || process.env.DB_PORT || '5435'),
  user: process.env.VITE_MYSQL_USER || process.env.DB_USER || 'mysql',
  password: process.env.VITE_MYSQL_PASSWORD || process.env.DB_PASSWORD || '8lvoAx40IhOQQrctuTRHo6OIkLF0jDg2UbDbatW5T1fqcH171OjKtJjXKFL1b6ID',
  database: process.env.VITE_MYSQL_DATABASE || process.env.DB_NAME || 'default',
  waitForConnections: true,
  connectionLimit: process.env.NODE_ENV === 'production' ? 5 : 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Database connection test
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('🔧 Please ensure MySQL is running and credentials are correct');
    return false; // Return false instead of exiting
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Story Board Engine Server is running',
    timestamp: new Date().toISOString()
  });
});

// Additional API routes for frontend
app.get('/api/settings', (req, res) => {
  res.json({ 
    status: 'OK', 
    settings: {
      theme: 'light',
      language: 'ar',
      notifications: true
    }
  });
});

app.get('/api/settings/language', (req, res) => {
  res.json({ 
    status: 'OK', 
    language: 'ar',
    availableLanguages: ['ar', 'en']
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ 
    status: 'OK', 
    user: null,
    message: 'Not authenticated'
  });
});

// Routes without /api/ prefix for frontend compatibility
app.get('/settings', (req, res) => {
  res.json({ 
    status: 'OK', 
    settings: {
      theme: 'light',
      language: 'ar',
      notifications: true
    }
  });
});

app.get('/settings/language', (req, res) => {
  res.json({ 
    status: 'OK', 
    language: 'ar',
    availableLanguages: ['ar', 'en']
  });
});

app.get('/auth/me', (req, res) => {
  res.json({ 
    status: 'OK', 
    user: null,
    message: 'Not authenticated'
  });
});

// Login route without /api/ prefix
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        status: 'ERROR', 
        message: 'Username and password are required' 
      });
    }
    
    // Query user from database
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ 
        status: 'ERROR', 
        message: 'Invalid username or password' 
      });
    }
    
    const user = users[0];
    
    // Simple password comparison (in production, use bcrypt)
    if (user.password_hash !== password) {
      return res.status(401).json({ 
        status: 'ERROR', 
        message: 'Invalid username or password' 
      });
    }
    
    // Return user data (excluding password)
    const { password_hash: _, ...userWithoutPassword } = user;
    
    res.json({ 
      status: 'OK', 
      message: 'Login successful',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Debug route to check static files
app.get('/api/debug/files', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Debug endpoint working',
    rootPath: __dirname,
    assetsPath: path.join(__dirname, 'assets'),
    indexPath: path.join(__dirname, 'index.html')
  });
});

// Database test endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1 as test');
    res.json({ 
      status: 'OK', 
      message: 'Database connection successful',
      data: rows 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// API endpoint for story board data (example)
app.get('/api/storyboards', async (req, res) => {
  try {
    // This is a placeholder - you can implement your actual database queries here
    const [rows] = await pool.execute('SELECT * FROM storyboards LIMIT 10');
    res.json({ 
      status: 'OK', 
      data: rows 
    });
  } catch (error) {
    // If table doesn't exist, return empty array
    res.json({ 
      status: 'OK', 
      data: [],
      message: 'No storyboards table found - this is normal for initial setup'
    });
  }
});

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        status: 'ERROR', 
        message: 'Username and password are required' 
      });
    }
    
    // Query user from database
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ 
        status: 'ERROR', 
        message: 'Invalid username or password' 
      });
    }
    
    const user = users[0];
    
    // Simple password comparison (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ 
        status: 'ERROR', 
        message: 'Invalid username or password' 
      });
    }
    
    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ 
      status: 'OK', 
      message: 'Login successful',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, full_name } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ 
        status: 'ERROR', 
        message: 'Username, email, and password are required' 
      });
    }
    
    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        status: 'ERROR', 
        message: 'Username or email already exists' 
      });
    }
    
    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
      [username, email, password, full_name || username, 'user']
    );
    
    // Return success (excluding password)
    res.status(201).json({ 
      status: 'OK', 
      message: 'User registered successfully',
      user: {
        id: result.insertId,
        username,
        email,
        full_name: full_name || username,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Create storyboard endpoint (example)
app.post('/api/storyboards', async (req, res) => {
  try {
    const { title, description, content } = req.body;
    
    // Create table if it doesn't exist
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS storyboards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    const [result] = await pool.execute(
      'INSERT INTO storyboards (title, description, content) VALUES (?, ?, ?)',
      [title, description, JSON.stringify(content)]
    );
    
    res.json({ 
      status: 'OK', 
      message: 'Storyboard created successfully',
      id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Failed to create storyboard',
      error: error.message 
    });
  }
});

// Catch-all handler: send back React's index.html file for client-side routing
// But only for non-asset requests
app.get('*', (req, res) => {
  // Don't serve index.html for asset requests (js, css, images, etc.)
  const assetExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
  const hasAssetExtension = assetExtensions.some(ext => req.path.endsWith(ext));
  
  if (hasAssetExtension) {
    return res.status(404).send('File not found');
  }
  
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const isDevelopment = process.env.NODE_ENV !== 'production';
  res.status(500).json({ 
    error: 'Internal server error',
    ...(isDevelopment && { details: err.message, stack: err.stack })
  });
});

// Graceful shutdown
let server;

const gracefulShutdown = () => {
  console.log('🔄 Received shutdown signal, closing server gracefully...');
  if (server) {
    server.close(() => {
      console.log('✅ Server closed successfully');
      if (pool) {
        pool.end(() => {
          console.log('✅ Database pool closed');
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });
  } else {
    process.exit(0);
  }
};

async function startServer() {
  try {
    // Test database connection before starting server
    const isDbConnected = await testConnection();
    
    if (!isDbConnected) {
      console.warn('⚠️  Database connection failed, but starting server anyway for static files');
      console.warn('📝 Note: Database-dependent features will not work until connection is established');
    }
    
    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📁 Serving static files from: ${__dirname}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      if (isDbConnected) {
        console.log('✅ Database connected and ready');
      } else {
        console.log('⚠️  Server running without database connection');
      }
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
      }
    });

    // Graceful shutdown handlers
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
export default app;