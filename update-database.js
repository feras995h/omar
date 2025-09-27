import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database connection configuration
const dbConfig = {
  host: process.env.VITE_MYSQL_HOST || process.env.DB_HOST || '72.60.92.146',
  port: parseInt(process.env.VITE_MYSQL_PORT || process.env.DB_PORT || '5435'),
  user: process.env.VITE_MYSQL_USER || process.env.DB_USER || 'mysql',
  password: process.env.VITE_MYSQL_PASSWORD || process.env.DB_PASSWORD || '8lvoAx40IhOQQrctuTRHo6OIkLF0jDg2UbDbatW5T1fqcH171OjKtJjXKFL1b6ID',
  database: process.env.VITE_MYSQL_DATABASE || process.env.DB_NAME || 'default',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function updateDatabase() {
  let connection;
  
  try {
    console.log('🚀 بدء تحديث قاعدة البيانات...');
    console.log('=' .repeat(50));
    
    // الاتصال بقاعدة البيانات
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    
    // إنشاء جدول الملفات المرفوعة
    console.log('\n📁 إنشاء جدول الملفات المرفوعة...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS uploaded_files (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_data LONGBLOB NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        file_size INT NOT NULL,
        file_type ENUM('image', 'video', 'audio', 'document', 'other') NOT NULL,
        uploaded_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_uploaded_by (uploaded_by),
        INDEX idx_file_type (file_type),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ تم إنشاء جدول الملفات المرفوعة بنجاح');
    
    // عرض الإحصائيات النهائية
    console.log('\n📊 الإحصائيات النهائية:');
    const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [projectCount] = await connection.execute('SELECT COUNT(*) as count FROM projects');
    const [storyboardCount] = await connection.execute('SELECT COUNT(*) as count FROM storyboards');
    const [frameCount] = await connection.execute('SELECT COUNT(*) as count FROM frames');
    const [fileCount] = await connection.execute('SELECT COUNT(*) as count FROM uploaded_files');
    
    console.log(`👥 المستخدمون: ${userCount[0].count}`);
    console.log(`📁 المشاريع: ${projectCount[0].count}`);
    console.log(`🎬 القصص المصورة: ${storyboardCount[0].count}`);
    console.log(`🖼️  الإطارات: ${frameCount[0].count}`);
    console.log(`📎 الملفات المرفوعة: ${fileCount[0].count}`);
    
    console.log('\n🎉 تم تحديث قاعدة البيانات بنجاح!');
    console.log('النظام الآن يدعم رفع الملفات في قاعدة البيانات');
    
  } catch (error) {
    console.error('❌ خطأ في تحديث قاعدة البيانات:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 تم إغلاق الاتصال بقاعدة البيانات');
    }
  }
}

// تشغيل السكريبت
updateDatabase();
