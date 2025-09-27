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
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, process.env.DOMAIN_URL].filter(Boolean)
    : true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the dist directory with proper headers
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true
}));

// Database connection configuration
const dbConfig = {
  host: process.env.VITE_MYSQL_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.VITE_MYSQL_PORT || process.env.DB_PORT || '3306'),
  user: process.env.VITE_MYSQL_USER || process.env.DB_USER || 'root',
  password: process.env.VITE_MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.VITE_MYSQL_DATABASE || process.env.DB_NAME || 'storyboard',
  waitForConnections: true,
  connectionLimit: process.env.NODE_ENV === 'production' ? 5 : 10,
  queueLimit: 0
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

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
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
const gracefulShutdown = () => {
  console.log('🔄 Received shutdown signal, closing server gracefully...');
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
};

async function startServer() {
  try {
    // Test database connection before starting server
    const isDbConnected = await testConnection();
    
    if (!isDbConnected) {
      console.warn('⚠️  Database connection failed, but starting server anyway for static files');
      console.warn('📝 Note: Database-dependent features will not work until connection is established');
    }
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📁 Serving static files from: ${path.join(__dirname, 'dist')}`);
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