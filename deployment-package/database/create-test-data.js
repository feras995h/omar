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

async function createTestData() {
    let connection;
    
    try {
        console.log('🔗 الاتصال بقاعدة البيانات...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ تم الاتصال بنجاح');
        
        // إنشاء مستخدم تجريبي (بدون تشفير لسهولة الاختبار)
        console.log('\n👤 إنشاء مستخدم تجريبي...');
        
        const [userResult] = await connection.query(`
            INSERT INTO users (username, email, password_hash, full_name, role, is_active) 
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            password_hash = VALUES(password_hash),
            full_name = VALUES(full_name),
            updated_at = CURRENT_TIMESTAMP
        `, ['admin', 'admin@goesociety.ly', 'simple_password_123', 'مدير النظام', 'admin', true]);
        
        console.log('✅ تم إنشاء المستخدم التجريبي');
        console.log('   - اسم المستخدم: admin');
        console.log('   - كلمة المرور: simple_password_123');
        console.log('   - البريد الإلكتروني: admin@goesociety.ly');
        
        // إنشاء علامات تجريبية
        console.log('\n🏷️  إنشاء علامات تجريبية...');
        const tags = [
            ['تصميم', '#ff6b6b', 'علامة للمشاريع التصميمية'],
            ['تطوير', '#4ecdc4', 'علامة لمشاريع التطوير'],
            ['تسويق', '#45b7d1', 'علامة للمشاريع التسويقية'],
            ['عاجل', '#f9ca24', 'علامة للمشاريع العاجلة']
        ];
        
        for (const [name, color, description] of tags) {
            await connection.query(`
                INSERT INTO tags (name, color, description) 
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                color = VALUES(color),
                description = VALUES(description)
            `, [name, color, description]);
        }
        console.log('✅ تم إنشاء العلامات التجريبية');
        
        // إنشاء مشروع تجريبي
        console.log('\n📁 إنشاء مشروع تجريبي...');
        const [projectResult] = await connection.query(`
            INSERT INTO projects (title, description, status, priority, owner_id) 
            VALUES (?, ?, ?, ?, ?)
        `, [
            'مشروع تجريبي - قصة مصورة',
            'هذا مشروع تجريبي لاختبار النظام وإنشاء قصة مصورة تفاعلية',
            'in_progress',
            'high',
            userResult.insertId || 1
        ]);
        
        const projectId = projectResult.insertId;
        console.log(`✅ تم إنشاء المشروع التجريبي (ID: ${projectId})`);
        
        // إنشاء قصة مصورة تجريبية
        console.log('\n📖 إنشاء قصة مصورة تجريبية...');
        const [storyboardResult] = await connection.query(`
            INSERT INTO storyboards (title, description, project_id, sequence_order, status) 
            VALUES (?, ?, ?, ?, ?)
        `, [
            'القصة الأولى',
            'قصة مصورة تجريبية تحتوي على عدة إطارات لاختبار النظام',
            projectId,
            1,
            'draft'
        ]);
        
        const storyboardId = storyboardResult.insertId;
        console.log(`✅ تم إنشاء القصة المصورة (ID: ${storyboardId})`);
        
        // إنشاء إطارات تجريبية
        console.log('\n🖼️  إنشاء إطارات تجريبية...');
        const frames = [
            ['الإطار الأول', 'مقدمة القصة وتعريف الشخصيات الرئيسية', 1, 5.0],
            ['الإطار الثاني', 'تطوير الأحداث وبداية الصراع', 2, 4.5],
            ['الإطار الثالث', 'ذروة الأحداث والتشويق', 3, 6.0],
            ['الإطار الرابع', 'حل الصراع والخاتمة', 4, 4.0]
        ];
        
        for (const [title, description, frameNumber, duration] of frames) {
            await connection.query(`
                INSERT INTO frames (storyboard_id, frame_number, title, description, duration, transition_type) 
                VALUES (?, ?, ?, ?, ?, ?)
            `, [storyboardId, frameNumber, title, description, duration, 'fade']);
        }
        console.log('✅ تم إنشاء الإطارات التجريبية');
        
        // إنشاء تعليق تجريبي
        console.log('\n💬 إنشاء تعليق تجريبي...');
        await connection.query(`
            INSERT INTO comments (content, author_id, target_type, target_id) 
            VALUES (?, ?, ?, ?)
        `, [
            'هذا تعليق تجريبي على المشروع. يمكن استخدام التعليقات للتواصل بين أعضاء الفريق.',
            userResult.insertId || 1,
            'project',
            projectId
        ]);
        console.log('✅ تم إنشاء التعليق التجريبي');
        
        // إنشاء إشعار تجريبي
        console.log('\n🔔 إنشاء إشعار تجريبي...');
        await connection.query(`
            INSERT INTO notifications (user_id, title, message, type, related_type, related_id) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            userResult.insertId || 1,
            'مرحباً بك في النظام',
            'تم إنشاء حسابك بنجاح ويمكنك الآن البدء في استخدام النظام',
            'success',
            'project',
            projectId
        ]);
        console.log('✅ تم إنشاء الإشعار التجريبي');
        
        // عرض إحصائيات البيانات
        console.log('\n📊 إحصائيات البيانات التجريبية:');
        console.log('========================================');
        
        const tables = ['users', 'projects', 'storyboards', 'frames', 'comments', 'tags', 'notifications'];
        for (const table of tables) {
            const [result] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
            console.log(`📋 ${table.padEnd(15)}: ${result[0].count} سجل`);
        }
        
        console.log('========================================');
        console.log('\n🎉 تم إنشاء جميع البيانات التجريبية بنجاح!');
        console.log('\n📝 معلومات تسجيل الدخول:');
        console.log('   - الرابط: http://localhost:3000');
        console.log('   - اسم المستخدم: admin');
        console.log('   - كلمة المرور: 123456');
        
    } catch (error) {
        console.error('❌ خطأ:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 تم إغلاق الاتصال');
        }
    }
}

createTestData();