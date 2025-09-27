#!/usr/bin/env node

/**
 * سكريبت فحص بنية جدول المستخدمين
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

async function checkUsersTable() {
  let connection;
  
  try {
    console.log('🔗 الاتصال بقاعدة البيانات...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

    // فحص الجداول الموجودة
    console.log('\n📋 الجداول الموجودة:');
    const [tables] = await connection.execute('SHOW TABLES');
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });

    // فحص بنية جدول المستخدمين إذا كان موجوداً
    if (tables.some(table => Object.values(table)[0] === 'users')) {
      console.log('\n🔍 بنية جدول المستخدمين:');
      const [columns] = await connection.execute('DESCRIBE users');
      columns.forEach(column => {
        console.log(`   - ${column.Field}: ${column.Type} ${column.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${column.Key ? `(${column.Key})` : ''}`);
      });

      // فحص المستخدمين الموجودين
      console.log('\n👥 المستخدمين الموجودين:');
      const [users] = await connection.execute('SELECT id, username, email, full_name, role FROM users LIMIT 10');
      if (users.length > 0) {
        users.forEach(user => {
          console.log(`   - ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Name: ${user.full_name}, Role: ${user.role}`);
        });
      } else {
        console.log('   لا يوجد مستخدمين');
      }
    } else {
      console.log('\n❌ جدول المستخدمين غير موجود');
    }

  } catch (error) {
    console.error('❌ خطأ في فحص الجدول:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 تم إغلاق الاتصال بقاعدة البيانات');
    }
  }
}

// تشغيل السكريبت
checkUsersTable();
