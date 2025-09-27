# دليل اختبار قاعدة البيانات
# Database Testing Guide

## ملفات الاختبار المتاحة
## Available Test Files

### 1. اختبار الاتصال السريع
### Quick Connection Test
```bash
npm run db:test-connection
# أو
node database/test-connection.js
```

**الوظيفة:** اختبار سريع للاتصال بقاعدة البيانات مع عرض المعلومات الأساسية
**Function:** Quick database connection test with basic information display

### 2. اختبار شامل للاتصال
### Comprehensive Connection Test
```bash
npm run db:test
# أو
node test-db-connection.js
```

**الوظيفة:** اختبار شامل يتضمن اختبارات متعددة للاتصال وتجمع الاتصالات
**Function:** Comprehensive test including multiple connection tests and connection pooling

### 3. فحص خدمات MySQL
### MySQL Services Check
```bash
npm run db:check-services
# أو
node database/test-mysql-services.js
```

**الوظيفة:** فحص النظام للبحث عن خدمات MySQL المثبتة والمسارات الشائعة
**Function:** System scan for installed MySQL services and common paths

## رموز الحالة
## Status Codes

- ✅ **نجح** - العملية تمت بنجاح
- ❌ **فشل** - حدث خطأ في العملية  
- ⚠️ **تحذير** - العملية تمت مع تحذيرات
- 🔄 **جاري المعالجة** - العملية قيد التنفيذ
- 💡 **نصيحة** - اقتراحات للحل

## الأخطاء الشائعة وحلولها
## Common Errors and Solutions

### ECONNREFUSED
**السبب:** خادم MySQL غير مشغل
**الحل:** 
1. تثبيت XAMPP أو MySQL
2. تشغيل خدمة MySQL
3. التأكد من المنفذ 3306

### Access Denied
**السبب:** خطأ في اسم المستخدم أو كلمة المرور
**الحل:**
1. التحقق من ملف `.env`
2. إنشاء مستخدم جديد في MySQL
3. منح الصلاحيات المناسبة

### Database Not Found
**السبب:** قاعدة البيانات غير موجودة
**الحل:**
```bash
npm run db:setup
```

## متطلبات النظام
## System Requirements

- Node.js 16+
- MySQL 5.7+ أو MariaDB 10.3+
- Windows 10/11

## ملفات البيئة المطلوبة
## Required Environment Files

ملف `.env` يجب أن يحتوي على:
```env
VITE_MYSQL_HOST=localhost
VITE_MYSQL_PORT=3306
VITE_MYSQL_USER=your_username
VITE_MYSQL_PASSWORD=your_password
VITE_MYSQL_DATABASE=your_database
```

## الدعم والمساعدة
## Support and Help

إذا واجهت مشاكل:
1. شغل `npm run db:check-services` للتحقق من MySQL
2. شغل `npm run db:test-connection` للاختبار السريع
3. تحقق من ملف `.env`
4. راجع سجلات الأخطاء في Terminal