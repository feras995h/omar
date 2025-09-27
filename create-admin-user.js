#!/usr/bin/env node

/**
 * سكريبت إنشاء مستخدم مدير جديد
 */

import mysql from 'mysql2/promise';

// إعدادات قاعدة البيانات
const dbConfig = {
  host: '72.60.92.146',
  port: 5435,
  user: 'mysql',
  password: '8lvoAx40IhOQQrctuTRHo6OIkLF0jDg2UbDbatW5T1fqcH171OjKtJjXKFL1b6ID',
  database: 'default',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
};

async function createAdminUser() {
  let connection;
  
  try {
    console.log('🔗 الاتصال بقاعدة البيانات...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

    // إنشاء جدول المستخدمين إذا لم يكن موجوداً
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // بيانات المستخدم الجديد
    const username = 'admin';
    const email = 'admin@storyboard.com';
    const password = 'admin123';
    const fullName = 'مدير النظام';
    const role = 'admin';

    // حذف المستخدم إذا كان موجوداً
    await connection.execute('DELETE FROM users WHERE username = ? OR email = ?', [username, email]);

    // إدراج المستخدم الجديد (كلمة السر غير مشفرة للسهولة)
    await connection.execute(
      'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
      [username, email, password, fullName, role]
    );

    console.log('✅ تم إنشاء مستخدم المدير بنجاح!');
    console.log('📋 بيانات تسجيل الدخول:');
    console.log(`   اسم المستخدم: ${username}`);
    console.log(`   البريد الإلكتروني: ${email}`);
    console.log(`   كلمة السر: ${password}`);
    console.log(`   الاسم الكامل: ${fullName}`);
    console.log(`   الدور: ${role}`);

  } catch (error) {
    console.error('❌ خطأ في إنشاء المستخدم:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 تم إغلاق الاتصال بقاعدة البيانات');
    }
  }
}

// تشغيل السكريبت
createAdminUser();
