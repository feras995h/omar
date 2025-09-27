#!/usr/bin/env node

/**
 * سكريبت إنشاء مستخدم مدير جديد - محسن
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
      'INSERT INTO users (username, email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, password, fullName, role, 1]
    );

    console.log('✅ تم إنشاء مستخدم المدير بنجاح!');
    console.log('📋 بيانات تسجيل الدخول:');
    console.log(`   اسم المستخدم: ${username}`);
    console.log(`   البريد الإلكتروني: ${email}`);
    console.log(`   كلمة السر: ${password}`);
    console.log(`   الاسم الكامل: ${fullName}`);
    console.log(`   الدور: ${role}`);

    // إنشاء مستخدم إضافي للاختبار
    const username2 = 'test';
    const email2 = 'test@storyboard.com';
    const password2 = 'test123';
    const fullName2 = 'مستخدم تجريبي';
    const role2 = 'viewer';

    await connection.execute(
      'INSERT INTO users (username, email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [username2, email2, password2, fullName2, role2, 1]
    );

    console.log('\n✅ تم إنشاء مستخدم تجريبي أيضاً!');
    console.log('📋 بيانات المستخدم التجريبي:');
    console.log(`   اسم المستخدم: ${username2}`);
    console.log(`   البريد الإلكتروني: ${email2}`);
    console.log(`   كلمة السر: ${password2}`);
    console.log(`   الاسم الكامل: ${fullName2}`);
    console.log(`   الدور: ${role2}`);

  } catch (error) {
    console.error('❌ خطأ في إنشاء المستخدم:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 تم إغلاق الاتصال بقاعدة البيانات');
    }
  }
}

// تشغيل السكريبت
createAdminUser();
