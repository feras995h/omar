import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.VITE_MYSQL_HOST || 'localhost',
    port: parseInt(process.env.VITE_MYSQL_PORT) || 3306,
    user: process.env.VITE_MYSQL_USER || 'root',
    password: process.env.VITE_MYSQL_PASSWORD || '',
    database: process.env.VITE_MYSQL_DATABASE || 'storyboard_engine',
    multipleStatements: true,
    charset: 'utf8mb4'
};

async function testDatabase() {
    let connection;
    
    try {
        console.log('🔗 الاتصال بقاعدة البيانات...');
        connection = await mysql.createConnection(dbConfig);
        
        console.log('✅ تم الاتصال بنجاح');
        
        // عرض الجداول الموجودة
        console.log('\n📋 الجداول الموجودة:');
        const [tables] = await connection.query('SHOW TABLES');
        console.log(tables);
        
        // إنشاء جدول المستخدمين يدوياً
        console.log('\n🔄 إنشاء جدول المستخدمين...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                full_name VARCHAR(100),
                avatar_url VARCHAR(255),
                role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                last_login TIMESTAMP NULL,
                
                INDEX idx_username (username),
                INDEX idx_email (email),
                INDEX idx_role (role),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        
        console.log('✅ تم إنشاء جدول المستخدمين');
        
        // إنشاء جدول المشاريع
        console.log('\n🔄 إنشاء جدول المشاريع...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                description TEXT,
                thumbnail_url VARCHAR(255),
                status ENUM('draft', 'in_progress', 'completed', 'archived') DEFAULT 'draft',
                priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
                owner_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deadline DATE NULL,
                
                FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_owner_id (owner_id),
                INDEX idx_status (status),
                INDEX idx_priority (priority),
                INDEX idx_created_at (created_at),
                INDEX idx_title (title)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        
        console.log('✅ تم إنشاء جدول المشاريع');
        
        // عرض الجداول بعد الإنشاء
        console.log('\n📋 الجداول بعد الإنشاء:');
        const [newTables] = await connection.query('SHOW TABLES');
        console.log(newTables);
        
    } catch (error) {
        console.error('❌ خطأ:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 تم إغلاق الاتصال');
        }
    }
}

testDatabase();