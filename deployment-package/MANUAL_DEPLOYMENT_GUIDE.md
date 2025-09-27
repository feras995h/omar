# دليل النشر اليدوي للاستضافة المشتركة (بدون Terminal)

## 🚀 خطوات النشر الكاملة

### المرحلة الأولى: إعداد قاعدة البيانات

1. **إنشاء قاعدة البيانات:**
   - اذهب إلى cPanel → MySQL Databases
   - أنشئ قاعدة بيانات جديدة (مثال: `username_storyboard`)
   - أنشئ مستخدم قاعدة بيانات جديد
   - اربط المستخدم بقاعدة البيانات مع جميع الصلاحيات

2. **استيراد البيانات:**
   - اذهب إلى cPanel → phpMyAdmin
   - اختر قاعدة البيانات التي أنشأتها
   - اذهب إلى تبويب "Import"
   - ارفع ملف `database/init.sql`

### المرحلة الثانية: تحديث إعدادات البيئة

1. **تحديث ملف `.env`:**
   ```env
   # معلومات قاعدة البيانات (استبدل بالمعلومات الحقيقية)
   DB_HOST=localhost
   DB_USER=username_dbuser
   DB_PASSWORD=your_database_password
   DB_NAME=username_storyboard
   
   # معلومات النطاق (استبدل بنطاقك)
   FRONTEND_URL=https://yourdomain.com
   DOMAIN_URL=https://yourdomain.com
   
   # مفاتيح الأمان (أنشئ مفاتيح قوية)
   JWT_SECRET=your_32_character_secret_key_here
   SESSION_SECRET=your_32_character_session_key
   ```

### المرحلة الثالثة: رفع الملفات

1. **اذهب إلى cPanel → File Manager**
2. **انتقل إلى مجلد `public_html`**
3. **احذف أي ملفات موجودة (اختياري)**
4. **ارفع جميع الملفات من مجلد `deployment-package`:**
   - ✅ `index.html`
   - ✅ `server.js`
   - ✅ `package.json`
   - ✅ `package-lock.json`
   - ✅ `.env` (المحدث بمعلوماتك)
   - ✅ `.htaccess`
   - ✅ `placeholder.svg`
   - ✅ `robots.txt`
   - ✅ مجلد `assets/` كاملاً
   - ✅ مجلد `database/` كاملاً

### المرحلة الرابعة: إعداد Node.js (بدون Terminal)

#### الطريقة الأولى: Node.js App في cPanel
1. **اذهب إلى cPanel → Node.js App**
2. **أنشئ تطبيق جديد:**
   - Node.js Version: اختر أحدث إصدار متاح
   - Application Mode: Production
   - Application Root: `public_html`
   - Application URL: اتركه فارغ أو ضع `/`
   - Application Startup File: `server.js`

3. **بعد إنشاء التطبيق:**
   - انقر على "Run NPM Install" لتثبيت التبعيات
   - انقر على "Restart" لإعادة تشغيل التطبيق

#### الطريقة الثانية: إذا لم تكن Node.js App متوفرة
1. **تواصل مع الدعم الفني** لتفعيل Node.js
2. **أو استخدم Git Deployment** إذا كان متوفراً

### المرحلة الخامسة: التحقق من النشر

1. **زيارة الموقع:**
   - اذهب إلى `https://yourdomain.com`
   - يجب أن ترى الصفحة الرئيسية

2. **اختبار قاعدة البيانات:**
   - اذهب إلى `https://yourdomain.com/api/health`
   - يجب أن ترى رسالة نجاح

3. **اختبار API:**
   - اذهب إلى `https://yourdomain.com/api/db-test`
   - يجب أن ترى حالة الاتصال بقاعدة البيانات

## 🔧 حل المشاكل الشائعة

### مشكلة: الموقع لا يعمل
- ✅ تأكد من رفع جميع الملفات
- ✅ تحقق من صحة معلومات قاعدة البيانات في `.env`
- ✅ تأكد من تفعيل Node.js في cPanel

### مشكلة: خطأ في قاعدة البيانات
- ✅ تحقق من اسم المستخدم وكلمة المرور
- ✅ تأكد من ربط المستخدم بقاعدة البيانات
- ✅ تحقق من استيراد ملف `init.sql`

### مشكلة: React Router لا يعمل
- ✅ تأكد من وجود ملف `.htaccess`
- ✅ تحقق من تفعيل mod_rewrite في الاستضافة

## 📞 الدعم
إذا واجهت أي مشاكل:
1. تحقق من Error Logs في cPanel
2. تواصل مع الدعم الفني للاستضافة
3. تأكد من أن الاستضافة تدعم Node.js

## 🔒 نصائح الأمان
- استخدم كلمات مرور قوية لقاعدة البيانات
- فعّل SSL Certificate
- احتفظ بنسخة احتياطية من قاعدة البيانات
- لا تشارك ملف `.env` مع أحد