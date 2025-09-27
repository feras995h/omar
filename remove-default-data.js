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

async function removeDefaultData() {
  let connection;
  
  try {
    console.log('🚀 بدء حذف البيانات الافتراضية...');
    console.log('=' .repeat(50));
    
    // الاتصال بقاعدة البيانات
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    
    // حذف المشاريع التجريبية
    console.log('\n🗑️  حذف المشاريع التجريبية...');
    const [projectResult] = await connection.execute(
      "DELETE FROM projects WHERE title LIKE '%تجريبي%' OR title LIKE '%تجربة%' OR title LIKE '%test%'"
    );
    console.log(`✅ تم حذف ${projectResult.affectedRows} مشروع تجريبي`);
    
    // حذف القصص المصورة التجريبية
    console.log('\n🗑️  حذف القصص المصورة التجريبية...');
    const [storyboardResult] = await connection.execute(
      "DELETE FROM storyboards WHERE title LIKE '%تجريبي%' OR title LIKE '%تجربة%' OR title LIKE '%test%'"
    );
    console.log(`✅ تم حذف ${storyboardResult.affectedRows} قصة مصورة تجريبية`);
    
    // حذف الإطارات التجريبية
    console.log('\n🗑️  حذف الإطارات التجريبية...');
    const [frameResult] = await connection.execute(
      "DELETE FROM frames WHERE title LIKE '%تجريبي%' OR title LIKE '%تجربة%' OR title LIKE '%test%'"
    );
    console.log(`✅ تم حذف ${frameResult.affectedRows} إطار تجريبي`);
    
    // حذف التعليقات التجريبية
    console.log('\n🗑️  حذف التعليقات التجريبية...');
    const [commentResult] = await connection.execute(
      "DELETE FROM comments WHERE content LIKE '%تجريبي%' OR content LIKE '%تجربة%' OR content LIKE '%test%'"
    );
    console.log(`✅ تم حذف ${commentResult.affectedRows} تعليق تجريبي`);
    
    // حذف المرفقات التجريبية
    console.log('\n🗑️  حذف المرفقات التجريبية...');
    const [attachmentResult] = await connection.execute(
      "DELETE FROM attachments WHERE filename LIKE '%test%' OR filename LIKE '%تجريبي%'"
    );
    console.log(`✅ تم حذف ${attachmentResult.affectedRows} مرفق تجريبي`);
    
    // عرض الإحصائيات النهائية
    console.log('\n📊 الإحصائيات النهائية:');
    const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [projectCount] = await connection.execute('SELECT COUNT(*) as count FROM projects');
    const [storyboardCount] = await connection.execute('SELECT COUNT(*) as count FROM storyboards');
    const [frameCount] = await connection.execute('SELECT COUNT(*) as count FROM frames');
    
    console.log(`👥 المستخدمون: ${userCount[0].count}`);
    console.log(`📁 المشاريع: ${projectCount[0].count}`);
    console.log(`🎬 القصص المصورة: ${storyboardCount[0].count}`);
    console.log(`🖼️  الإطارات: ${frameCount[0].count}`);
    
    console.log('\n🎉 تم حذف البيانات الافتراضية بنجاح!');
    console.log('قاعدة البيانات الآن نظيفة وجاهزة للاستخدام الفعلي');
    
  } catch (error) {
    console.error('❌ خطأ في حذف البيانات الافتراضية:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 تم إغلاق الاتصال بقاعدة البيانات');
    }
  }
}

// تشغيل السكريبت
removeDefaultData();
