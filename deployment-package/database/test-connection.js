#!/usr/bin/env node

/**
 * اختبار سريع للاتصال بقاعدة البيانات
 * Quick Database Connection Test
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

// إعدادات قاعدة البيانات
const dbConfig = {
  host: process.env.VITE_MYSQL_HOST || 'localhost',
  port: parseInt(process.env.VITE_MYSQL_PORT) || 3306,
  user: process.env.VITE_MYSQL_USER || 'root',
  password: process.env.VITE_MYSQL_PASSWORD || '',
  database: process.env.VITE_MYSQL_DATABASE || 'storyboard_engine',
  connectTimeout: 5000
};

console.log('🔍 اختبار سريع للاتصال بقاعدة البيانات');
console.log('========================================');
console.log('');

async function quickTest() {
  console.log('📋 إعدادات الاتصال:');
  console.log(`   المضيف: ${dbConfig.host}:${dbConfig.port}`);
  console.log(`   المستخدم: ${dbConfig.user}`);
  console.log(`   قاعدة البيانات: ${dbConfig.database}`);
  console.log('');

  try {
    console.log('🔄 محاولة الاتصال...');
    
    // اختبار الاتصال الأساسي
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      connectTimeout: dbConfig.connectTimeout
    });

    console.log('✅ نجح الاتصال بخادم MySQL');

    // اختبار الإصدار
    const [versionResult] = await connection.execute('SELECT VERSION() as version');
    console.log(`   إصدار MySQL: ${versionResult[0].version}`);

    // اختبار قاعدة البيانات
    try {
      await connection.changeUser({ database: dbConfig.database });
      console.log('✅ نجح الاتصال بقاعدة البيانات');
      
      // عرض الجداول
      const [tables] = await connection.execute('SHOW TABLES');
      console.log(`   عدد الجداول: ${tables.length}`);
      
    } catch (dbError) {
      console.log('⚠️  قاعدة البيانات غير موجودة');
      console.log('   يمكن إنشاؤها باستخدام: npm run db:setup');
    }

    await connection.end();
    
    console.log('');
    console.log('🎉 الاختبار مكتمل بنجاح!');
    process.exit(0);

  } catch (error) {
    console.log('❌ فشل الاتصال');
    console.log(`   الخطأ: ${error.message}`);
    console.log(`   الكود: ${error.code || 'غير محدد'}`);
    console.log('');
    console.log('💡 الحلول المقترحة:');
    console.log('   1. تأكد من تشغيل خادم MySQL');
    console.log('   2. تحقق من إعدادات ملف .env');
    console.log('   3. تأكد من صحة اسم المستخدم وكلمة المرور');
    
    process.exit(1);
  }
}

// تشغيل الاختبار
quickTest();