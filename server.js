import express from 'express';
import path from 'path';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import fs from 'fs';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads (in memory for database storage)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images, videos, and documents
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('نوع الملف غير مدعوم'));
    }
  }
});

// Trust proxy for shared hosting
app.set('trust proxy', true);

// Redirect HTTPS to HTTP to avoid SSL issues
app.use((req, res, next) => {
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    const httpUrl = `http://${req.headers.host}${req.url}`;
    return res.redirect(301, httpUrl);
  }
  next();
});

// Force HTTP in all responses
app.use((req, res, next) => {
  // Set headers to force HTTP
  res.setHeader('Strict-Transport-Security', 'max-age=0; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Override any HTTPS redirects
  res.redirect = function(url) {
    if (typeof url === 'string' && url.startsWith('https:')) {
      url = url.replace('https:', 'http:');
    }
    return res.redirect.call(this, url);
  };
  
  next();
});

// Middleware
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
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

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File upload routes
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        status: 'ERROR', 
        message: 'لم يتم رفع أي ملف' 
      });
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'file-' + uniqueSuffix + path.extname(req.file.originalname);
    
    // Determine file type
    let fileType = 'other';
    if (req.file.mimetype.startsWith('image/')) fileType = 'image';
    else if (req.file.mimetype.startsWith('video/')) fileType = 'video';
    else if (req.file.mimetype.startsWith('audio/')) fileType = 'audio';
    else if (req.file.mimetype.includes('pdf') || req.file.mimetype.includes('document')) fileType = 'document';

    // Save to database
    const [result] = await pool.execute(`
      INSERT INTO uploaded_files (filename, original_name, file_data, mime_type, file_size, file_type, uploaded_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [filename, req.file.originalname, req.file.buffer, req.file.mimetype, req.file.size, fileType, 1]);

    const fileInfo = {
      id: result.insertId,
      filename: filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      fileType: fileType,
      url: `/api/files/${result.insertId}`
    };

    res.json({
      status: 'OK',
      message: 'تم رفع الملف بنجاح',
      file: fileInfo
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'خطأ في رفع الملف',
      error: error.message
    });
  }
});

// Upload multiple files
app.post('/api/upload-multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        status: 'ERROR', 
        message: 'لم يتم رفع أي ملفات' 
      });
    }

    const files = [];
    
    for (const file of req.files) {
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = 'file-' + uniqueSuffix + path.extname(file.originalname);
      
      // Determine file type
      let fileType = 'other';
      if (file.mimetype.startsWith('image/')) fileType = 'image';
      else if (file.mimetype.startsWith('video/')) fileType = 'video';
      else if (file.mimetype.startsWith('audio/')) fileType = 'audio';
      else if (file.mimetype.includes('pdf') || file.mimetype.includes('document')) fileType = 'document';

      // Save to database
      const [result] = await pool.execute(`
        INSERT INTO uploaded_files (filename, original_name, file_data, mime_type, file_size, file_type, uploaded_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [filename, file.originalname, file.buffer, file.mimetype, file.size, fileType, 1]);

      files.push({
        id: result.insertId,
        filename: filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        fileType: fileType,
        url: `/api/files/${result.insertId}`
      });
    }

    res.json({
      status: 'OK',
      message: `تم رفع ${files.length} ملف بنجاح`,
      files: files
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'خطأ في رفع الملفات',
      error: error.message
    });
  }
});

// Get uploaded file from database
app.get('/api/files/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT filename, original_name, file_data, mime_type, file_size 
      FROM uploaded_files 
      WHERE id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'الملف غير موجود'
      });
    }
    
    const file = rows[0];
    
    // Set appropriate headers
    res.setHeader('Content-Type', file.mime_type);
    res.setHeader('Content-Length', file.file_size);
    res.setHeader('Content-Disposition', `inline; filename="${file.original_name}"`);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    
    // Send file data
    res.send(file.file_data);
  } catch (error) {
    console.error('File retrieval error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'خطأ في استرجاع الملف',
      error: error.message
    });
  }
});

// List uploaded files
app.get('/api/files', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, filename, original_name, mime_type, file_size, file_type, created_at 
      FROM uploaded_files 
      ORDER BY created_at DESC
    `);
    
    const files = rows.map(file => ({
      id: file.id,
      filename: file.filename,
      originalName: file.original_name,
      mimeType: file.mime_type,
      fileSize: file.file_size,
      fileType: file.file_type,
      url: `/api/files/${file.id}`,
      createdAt: file.created_at
    }));
    
    res.json({
      status: 'OK',
      data: files
    });
  } catch (error) {
    console.error('Files list error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'خطأ في عرض الملفات',
      error: error.message
    });
  }
});

// Delete uploaded file
app.delete('/api/files/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM uploaded_files WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'الملف غير موجود'
      });
    }
    
    res.json({
      status: 'OK',
      message: 'تم حذف الملف بنجاح'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'خطأ في حذف الملف',
      error: error.message
    });
  }
});

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

// Settings update endpoints
app.put('/api/settings/social-links', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Social links updated successfully'
  });
});

app.put('/api/settings/basic-data', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Basic data updated successfully'
  });
});

app.put('/api/settings/image-settings', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Image settings updated successfully'
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

// Settings update endpoints without /api/ prefix
app.put('/settings/social-links', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Social links updated successfully'
  });
});

app.put('/settings/basic-data', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Basic data updated successfully'
  });
});

app.put('/settings/image-settings', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Image settings updated successfully'
  });
});

// Logout route
app.post('/auth/logout', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'تم تسجيل الخروج بنجاح'
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

// Test page for debugging
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-app.html'));
});

// Upload test page
app.get('/upload-test', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-upload.html'));
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

// ===================================
// Projects API Endpoints
// ===================================

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, u.full_name as owner_name 
      FROM projects p 
      LEFT JOIN users u ON p.owner_id = u.id 
      ORDER BY p.created_at DESC
    `);
    res.json({ status: 'OK', data: rows });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// Get project by ID
app.get('/api/projects/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, u.full_name as owner_name 
      FROM projects p 
      LEFT JOIN users u ON p.owner_id = u.id 
      WHERE p.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ status: 'ERROR', message: 'المشروع غير موجود' });
    }
    
    res.json({ status: 'OK', data: rows[0] });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// Create new project
app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, thumbnail_url, status, priority, owner_id, deadline } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO projects (title, description, thumbnail_url, status, priority, owner_id, deadline) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [title, description, thumbnail_url, status || 'draft', priority || 'medium', owner_id, deadline]);
    
    res.json({ 
      status: 'OK', 
      message: 'تم إنشاء المشروع بنجاح',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// Create project without /api/ prefix
app.post('/projects', async (req, res) => {
  try {
    const { title, description, thumbnail_url, status, priority, owner_id, deadline } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO projects (title, description, thumbnail_url, status, priority, owner_id, deadline) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [title, description, thumbnail_url, status || 'draft', priority || 'medium', owner_id, deadline]);
    
    res.json({ 
      status: 'OK', 
      message: 'تم إنشاء المشروع بنجاح',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// Update project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { title, description, thumbnail_url, status, priority, deadline } = req.body;
    
    const [result] = await pool.execute(`
      UPDATE projects 
      SET title = ?, description = ?, thumbnail_url = ?, status = ?, priority = ?, deadline = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, description, thumbnail_url, status, priority, deadline, req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'ERROR', message: 'المشروع غير موجود' });
    }
    
    res.json({ status: 'OK', message: 'تم تحديث المشروع بنجاح' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// Delete project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM projects WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'ERROR', message: 'المشروع غير موجود' });
    }
    
    res.json({ status: 'OK', message: 'تم حذف المشروع بنجاح' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// Get project images
app.get('/api/projects/:id/images', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, filename, original_name, mime_type, file_size
      FROM uploaded_files 
      WHERE file_type = 'image' AND filename LIKE ?
      ORDER BY created_at DESC
    `, [`%project-${req.params.id}%`]);
    
    res.json({
      status: 'OK',
      data: rows.map(file => ({
        id: file.id,
        url: `/api/files/${file.id}`,
        filename: file.original_name,
        size: file.file_size
      }))
    });
  } catch (error) {
    console.error('Error fetching project images:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'خطأ في جلب صور المشروع'
    });
  }
});

// ===================================
// Storyboards API Endpoints
// ===================================

// Get storyboards for a project
app.get('/api/projects/:projectId/storyboards', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT s.*, u.full_name as created_by_name 
      FROM storyboards s 
      LEFT JOIN users u ON s.created_by = u.id 
      WHERE s.project_id = ? 
      ORDER BY s.scene_number ASC
    `, [req.params.projectId]);
    
    res.json({ status: 'OK', data: rows });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// Create new storyboard
app.post('/api/storyboards', async (req, res) => {
  try {
    const { project_id, title, description, scene_number, duration_seconds, aspect_ratio, frame_rate, resolution, created_by } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO storyboards (project_id, title, description, scene_number, duration_seconds, aspect_ratio, frame_rate, resolution, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [project_id, title, description, scene_number || 1, duration_seconds || 30, aspect_ratio || '16:9', frame_rate || 24, resolution || '1920x1080', created_by]);
    
    res.json({ 
      status: 'OK', 
      message: 'تم إنشاء القصة المصورة بنجاح',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// ===================================
// Frames API Endpoints
// ===================================

// Get frames for a storyboard
app.get('/api/storyboards/:storyboardId/frames', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM frames 
      WHERE storyboard_id = ? 
      ORDER BY frame_number ASC
    `, [req.params.storyboardId]);
    
    res.json({ status: 'OK', data: rows });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// Create new frame
app.post('/api/frames', async (req, res) => {
  try {
    const { storyboard_id, frame_number, title, description, image_url, thumbnail_url, duration_seconds, transition_type, camera_angle, camera_movement, lighting_notes, audio_notes, dialogue, action_notes } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO frames (storyboard_id, frame_number, title, description, image_url, thumbnail_url, duration_seconds, transition_type, camera_angle, camera_movement, lighting_notes, audio_notes, dialogue, action_notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [storyboard_id, frame_number, title, description, image_url, thumbnail_url, duration_seconds || 3.0, transition_type || 'cut', camera_angle, camera_movement, lighting_notes, audio_notes, dialogue, action_notes]);
    
    res.json({ 
      status: 'OK', 
      message: 'تم إنشاء الإطار بنجاح',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// ===================================
// Dashboard Statistics
// ===================================

// Get dashboard statistics
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [projectCount] = await pool.execute('SELECT COUNT(*) as count FROM projects');
    const [storyboardCount] = await pool.execute('SELECT COUNT(*) as count FROM storyboards');
    const [frameCount] = await pool.execute('SELECT COUNT(*) as count FROM frames');
    
    res.json({
      status: 'OK',
      data: {
        users: userCount[0].count,
        projects: projectCount[0].count,
        storyboards: storyboardCount[0].count,
        frames: frameCount[0].count
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// Catch-all handler: send back React's index.html file for client-side routing
// But only for non-asset and non-API requests
app.get('*', (req, res) => {
  // Don't serve index.html for API requests
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ status: 'ERROR', message: 'API endpoint not found' });
  }
  
  // Don't serve index.html for test pages
  if (req.path === '/test' || req.path === '/upload-test') {
    return res.status(404).send('Test page not found');
  }
  
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