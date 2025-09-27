#!/usr/bin/env node

/**
 * فحص خدمات MySQL المتاحة على النظام
 * Check Available MySQL Services on System
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

console.log('🔍 فحص خدمات MySQL المتاحة');
console.log('===========================');
console.log('');

async function checkMySQLServices() {
  try {
    console.log('1️⃣ البحث عن خدمات MySQL...');
    
    // البحث عن خدمات MySQL
    try {
      const { stdout } = await execAsync('Get-Service -Name "*mysql*" | Format-Table -AutoSize', { shell: 'powershell' });
      if (stdout.trim()) {
        console.log('✅ خدمات MySQL موجودة:');
        console.log(stdout);
      } else {
        console.log('❌ لم يتم العثور على خدمات MySQL');
      }
    } catch (error) {
      console.log('❌ خطأ في البحث عن خدمات MySQL');
    }

    console.log('');
    console.log('2️⃣ فحص مسارات MySQL الشائعة...');
    
    const commonPaths = [
      'C:\\xampp\\mysql\\bin\\mysql.exe',
      'C:\\wamp64\\bin\\mysql\\mysql8.0.31\\bin\\mysql.exe',
      'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe',
      'C:\\Program Files\\MySQL\\MySQL Server 5.7\\bin\\mysql.exe',
      'C:\\mysql\\bin\\mysql.exe'
    ];

    let foundPath = null;
    
    for (const path of commonPaths) {
      try {
        if (fs.existsSync(path)) {
          console.log(`✅ تم العثور على MySQL في: ${path}`);
          foundPath = path;
          break;
        }
      } catch (error) {
        // تجاهل الأخطاء
      }
    }

    if (!foundPath) {
      console.log('❌ لم يتم العثور على MySQL في المسارات الشائعة');
    }

    console.log('');
    console.log('3️⃣ فحص المنافذ المستخدمة...');
    
    try {
      const { stdout } = await execAsync('netstat -an | findstr :3306', { shell: 'cmd' });
      if (stdout.trim()) {
        console.log('✅ المنفذ 3306 مستخدم:');
        console.log(stdout);
      } else {
        console.log('❌ المنفذ 3306 غير مستخدم');
      }
    } catch (error) {
      console.log('❌ لم يتم العثور على اتصالات على المنفذ 3306');
    }

    console.log('');
    console.log('📋 التوصيات:');
    
    if (!foundPath) {
      console.log('💡 لتثبيت MySQL، يمكنك:');
      console.log('   1. تحميل XAMPP من: https://www.apachefriends.org/');
      console.log('   2. تحميل MySQL Community Server من: https://dev.mysql.com/downloads/');
      console.log('   3. تحميل WAMP من: https://www.wampserver.com/');
    } else {
      console.log('💡 MySQL مثبت، تأكد من:');
      console.log('   1. تشغيل خدمة MySQL');
      console.log('   2. صحة إعدادات الاتصال في ملف .env');
      console.log('   3. إنشاء قاعدة البيانات والمستخدم');
    }

  } catch (error) {
    console.log('❌ خطأ في فحص النظام:', error.message);
  }
}

// تشغيل الفحص
checkMySQLServices();