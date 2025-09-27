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

async function createAllTables() {
    let connection;
    
    try {
        console.log('🔗 الاتصال بقاعدة البيانات...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ تم الاتصال بنجاح');
        
        // إنشاء جدول القصص المصورة
        console.log('\n🔄 إنشاء جدول القصص المصورة...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS storyboards (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                description TEXT,
                project_id INT NOT NULL,
                sequence_order INT DEFAULT 1,
                status ENUM('draft', 'in_review', 'approved', 'archived') DEFAULT 'draft',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                INDEX idx_project_id (project_id),
                INDEX idx_status (status),
                INDEX idx_sequence_order (sequence_order),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ تم إنشاء جدول القصص المصورة');
        
        // إنشاء جدول الإطارات
        console.log('\n🔄 إنشاء جدول الإطارات...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS frames (
                id INT AUTO_INCREMENT PRIMARY KEY,
                storyboard_id INT NOT NULL,
                frame_number INT NOT NULL,
                title VARCHAR(200),
                description TEXT,
                image_url VARCHAR(255),
                thumbnail_url VARCHAR(255),
                duration DECIMAL(5,2) DEFAULT 3.00,
                transition_type ENUM('fade', 'slide', 'zoom', 'none') DEFAULT 'none',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                FOREIGN KEY (storyboard_id) REFERENCES storyboards(id) ON DELETE CASCADE,
                UNIQUE KEY unique_frame_per_storyboard (storyboard_id, frame_number),
                INDEX idx_storyboard_id (storyboard_id),
                INDEX idx_frame_number (frame_number),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ تم إنشاء جدول الإطارات');
        
        // إنشاء جدول التعليقات
        console.log('\n🔄 إنشاء جدول التعليقات...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                content TEXT NOT NULL,
                author_id INT NOT NULL,
                target_type ENUM('project', 'storyboard', 'frame') NOT NULL,
                target_id INT NOT NULL,
                parent_id INT NULL,
                is_resolved BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
                INDEX idx_author_id (author_id),
                INDEX idx_target (target_type, target_id),
                INDEX idx_parent_id (parent_id),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ تم إنشاء جدول التعليقات');
        
        // إنشاء جدول العلامات
        console.log('\n🔄 إنشاء جدول العلامات...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tags (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                color VARCHAR(7) DEFAULT '#007bff',
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                INDEX idx_name (name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ تم إنشاء جدول العلامات');
        
        // إنشاء جدول علامات المشاريع
        console.log('\n🔄 إنشاء جدول علامات المشاريع...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS project_tags (
                project_id INT NOT NULL,
                tag_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                PRIMARY KEY (project_id, tag_id),
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ تم إنشاء جدول علامات المشاريع');
        
        // إنشاء جدول أعضاء المشاريع
        console.log('\n🔄 إنشاء جدول أعضاء المشاريع...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS project_members (
                project_id INT NOT NULL,
                user_id INT NOT NULL,
                role ENUM('owner', 'editor', 'viewer') DEFAULT 'viewer',
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                PRIMARY KEY (project_id, user_id),
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_role (role)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ تم إنشاء جدول أعضاء المشاريع');
        
        // إنشاء جدول الإشعارات
        console.log('\n🔄 إنشاء جدول الإشعارات...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(200) NOT NULL,
                message TEXT,
                type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
                is_read BOOLEAN DEFAULT FALSE,
                related_type ENUM('project', 'storyboard', 'frame', 'comment') NULL,
                related_id INT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_is_read (is_read),
                INDEX idx_type (type),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ تم إنشاء جدول الإشعارات');
        
        // إنشاء جدول سجل الأنشطة
        console.log('\n🔄 إنشاء جدول سجل الأنشطة...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS activity_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                action VARCHAR(100) NOT NULL,
                target_type ENUM('project', 'storyboard', 'frame', 'comment', 'user') NOT NULL,
                target_id INT NOT NULL,
                details JSON,
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_action (action),
                INDEX idx_target (target_type, target_id),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ تم إنشاء جدول سجل الأنشطة');
        
        // إنشاء جدول المرفقات
        console.log('\n🔄 إنشاء جدول المرفقات...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS attachments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                filename VARCHAR(255) NOT NULL,
                original_name VARCHAR(255) NOT NULL,
                file_path VARCHAR(500) NOT NULL,
                file_size INT NOT NULL,
                mime_type VARCHAR(100) NOT NULL,
                target_type ENUM('project', 'storyboard', 'frame', 'comment') NOT NULL,
                target_id INT NOT NULL,
                uploaded_by INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_target (target_type, target_id),
                INDEX idx_uploaded_by (uploaded_by),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ تم إنشاء جدول المرفقات');
        
        // عرض جميع الجداول
        console.log('\n📋 جميع الجداول في قاعدة البيانات:');
        const [tables] = await connection.query('SHOW TABLES');
        tables.forEach((table, index) => {
            console.log(`${index + 1}. ${Object.values(table)[0]}`);
        });
        
        console.log('\n🎉 تم إنشاء جميع الجداول بنجاح!');
        
    } catch (error) {
        console.error('❌ خطأ:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 تم إغلاق الاتصال');
        }
    }
}

createAllTables();