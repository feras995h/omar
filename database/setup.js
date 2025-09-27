// ملف إعداد قاعدة البيانات التلقائي
// يقوم بقراءة ملف init.sql وتنفيذه على قاعدة البيانات

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// إعدادات الاتصال بقاعدة البيانات
const dbConfig = {
    host: process.env.VITE_MYSQL_HOST || 'localhost',
    port: parseInt(process.env.VITE_MYSQL_PORT) || 3306,
    user: process.env.VITE_MYSQL_USER || 'root',
    password: process.env.VITE_MYSQL_PASSWORD || '',
    database: process.env.VITE_MYSQL_DATABASE || 'storyboard_engine',
    multipleStatements: true, // للسماح بتنفيذ عدة استعلامات
    charset: 'utf8mb4'
};

// إعدادات الاتصال بدون تحديد قاعدة البيانات (لإنشائها إذا لم تكن موجودة)
const dbConfigWithoutDB = {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    multipleStatements: true,
    charset: 'utf8mb4'
};

/**
 * قراءة ملف SQL
 */
function readSQLFile(filename) {
    const filePath = path.join(__dirname, filename);
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`❌ خطأ في قراءة ملف ${filename}:`, error.message);
        throw error;
    }
}

/**
 * تنفيذ استعلامات SQL متعددة
 */
async function executeSQL(connection, sql, description) {
    try {
        console.log(`🔄 ${description}...`);
        
        // تقسيم الاستعلامات وتنفيذها واحداً تلو الآخر
        const statements = sql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        let successCount = 0;
        let skipCount = 0;

        for (const statement of statements) {
            if (statement.toLowerCase().includes('delimiter') || 
                statement.toLowerCase().includes('//')) {
                skipCount++;
                continue;
            }

            try {
                await connection.execute(statement);
                successCount++;
            } catch (error) {
                // تجاهل أخطاء "already exists" 
                if (error.code === 'ER_TABLE_EXISTS_ERROR' || 
                    error.code === 'ER_DUP_KEYNAME' ||
                    error.message.includes('already exists')) {
                    skipCount++;
                    continue;
                }
                console.warn(`⚠️  تحذير في تنفيذ الاستعلام: ${error.message}`);
            }
        }

        console.log(`✅ ${description} - تم تنفيذ ${successCount} استعلام، تم تخطي ${skipCount}`);
        return true;
    } catch (error) {
        console.error(`❌ خطأ في ${description}:`, error.message);
        return false;
    }
}

/**
 * التحقق من وجود قاعدة البيانات
 */
async function checkDatabaseExists(connection, dbName) {
    try {
        const [rows] = await connection.execute(
            'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
            [dbName]
        );
        return rows.length > 0;
    } catch (error) {
        console.error('❌ خطأ في التحقق من وجود قاعدة البيانات:', error.message);
        return false;
    }
}

/**
 * إنشاء قاعدة البيانات إذا لم تكن موجودة
 */
async function createDatabaseIfNotExists(connection, dbName) {
    try {
        const exists = await checkDatabaseExists(connection, dbName);
        
        if (!exists) {
            console.log(`🔄 إنشاء قاعدة البيانات: ${dbName}...`);
            await connection.execute(
                `CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
            );
            console.log(`✅ تم إنشاء قاعدة البيانات: ${dbName}`);
        } else {
            console.log(`ℹ️  قاعدة البيانات موجودة مسبقاً: ${dbName}`);
        }
        
        // التبديل إلى قاعدة البيانات
        await connection.execute(`USE \`${dbName}\``);
        return true;
    } catch (error) {
        console.error('❌ خطأ في إنشاء قاعدة البيانات:', error.message);
        return false;
    }
}

/**
 * التحقق من اتصال قاعدة البيانات
 */
async function testConnection() {
    let connection;
    try {
        console.log('🔄 اختبار الاتصال بقاعدة البيانات...');
        connection = await mysql.createConnection(dbConfigWithoutDB);
        
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
        
        return connection;
    } catch (error) {
        console.error('❌ فشل الاتصال بقاعدة البيانات:', error.message);
        console.error('تأكد من:');
        console.error('- تشغيل خادم MySQL');
        console.error('- صحة معلومات الاتصال في ملف .env');
        console.error('- صلاحيات المستخدم');
        
        if (connection) {
            await connection.end();
        }
        throw error;
    }
}

/**
 * عرض إحصائيات قاعدة البيانات
 */
async function showDatabaseStats(connection) {
    try {
        console.log('\n📊 إحصائيات قاعدة البيانات:');
        console.log('=' .repeat(40));
        
        const tables = [
            'users', 'projects', 'storyboards', 'frames', 
            'comments', 'tags', 'project_tags', 'project_members',
            'notifications', 'activity_logs', 'attachments'
        ];
        
        for (const table of tables) {
            try {
                const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
                const count = rows[0].count;
                console.log(`📋 ${table.padEnd(20)} : ${count} سجل`);
            } catch (error) {
                console.log(`📋 ${table.padEnd(20)} : غير موجود`);
            }
        }
        
        console.log('=' .repeat(40));
    } catch (error) {
        console.error('❌ خطأ في عرض الإحصائيات:', error.message);
    }
}

/**
 * الدالة الرئيسية لإعداد قاعدة البيانات
 */
async function setupDatabase() {
    let connection;
    
    try {
        console.log('🚀 بدء إعداد قاعدة البيانات...');
        console.log('=' .repeat(50));
        
        // اختبار الاتصال
        connection = await testConnection();
        
        // إنشاء قاعدة البيانات إذا لم تكن موجودة
        const dbCreated = await createDatabaseIfNotExists(connection, dbConfig.database);
        if (!dbCreated) {
            throw new Error('فشل في إنشاء أو الوصول إلى قاعدة البيانات');
        }
        
        // قراءة وتنفيذ ملف init.sql
        console.log('\n🔄 قراءة ملف إعداد قاعدة البيانات...');
        const initSQL = readSQLFile('init.sql');
        
        // تنفيذ الاستعلامات
        const success = await executeSQL(connection, initSQL, 'إنشاء الجداول والبيانات الأولية');
        
        if (success) {
            console.log('\n✅ تم إعداد قاعدة البيانات بنجاح!');
            
            // عرض الإحصائيات
            await showDatabaseStats(connection);
            
            console.log('\n🎉 قاعدة البيانات جاهزة للاستخدام!');
            console.log('\nيمكنك الآن:');
            console.log('- تشغيل التطبيق: npm start');
            console.log('- اختبار API: GET /api/db-test');
            console.log('- الوصول للتطبيق: http://localhost:3000');
            
        } else {
            throw new Error('فشل في إعداد قاعدة البيانات');
        }
        
    } catch (error) {
        console.error('\n❌ فشل إعداد قاعدة البيانات:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 تم إغلاق الاتصال بقاعدة البيانات');
        }
    }
}

/**
 * إعادة تعيين قاعدة البيانات (حذف وإعادة إنشاء)
 */
async function resetDatabase() {
    let connection;
    
    try {
        console.log('⚠️  إعادة تعيين قاعدة البيانات...');
        console.log('سيتم حذف جميع البيانات الموجودة!');
        
        connection = await testConnection();
        
        // حذف قاعدة البيانات إذا كانت موجودة
        console.log(`🔄 حذف قاعدة البيانات: ${dbConfig.database}...`);
        await connection.execute(`DROP DATABASE IF EXISTS \`${dbConfig.database}\``);
        console.log('✅ تم حذف قاعدة البيانات');
        
        // إعادة إنشاء قاعدة البيانات
        await setupDatabase();
        
    } catch (error) {
        console.error('❌ فشل في إعادة تعيين قاعدة البيانات:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// تشغيل الإعداد حسب المعامل المرسل
const command = process.argv[2];

switch (command) {
    case 'reset':
        resetDatabase();
        break;
    case 'setup':
    default:
        setupDatabase();
        break;
}

export { setupDatabase, resetDatabase };