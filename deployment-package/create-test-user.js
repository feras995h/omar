import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database connection configuration
const dbConfig = {
  host: process.env.VITE_MYSQL_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.VITE_MYSQL_PORT || process.env.DB_PORT || '3306'),
  user: process.env.VITE_MYSQL_USER || process.env.DB_USER || 'root',
  password: process.env.VITE_MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.VITE_MYSQL_DATABASE || process.env.DB_NAME || 'storyboard',
};

async function createTestUser() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully');

    // Check if admin user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE username = ?',
      ['admin']
    );

    if (existingUsers.length > 0) {
      console.log('ℹ️  Admin user already exists');
      return;
    }

    // Create admin user
    console.log('👤 Creating admin user...');
    await connection.execute(
      'INSERT INTO users (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)',
      ['admin', 'admin@example.com', 'admin123', 'Administrator', 'admin']
    );

    console.log('✅ Admin user created successfully');
    console.log('📋 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('💡 Tip: Make sure to run the database initialization script first');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the function
createTestUser();