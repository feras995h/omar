# تعليمات النشر اليدوي عبر cPanel File Manager

## 📋 الخطوات المطلوبة:

### 1. رفع الملفات:
1. اذهب إلى cPanel → File Manager
2. انتقل إلى مجلد `public_html`
3. ارفع جميع الملفات من مجلد `deployment-package`
4. تأكد من رفع:
   - جميع ملفات `assets/`
   - `index.html`
   - `server.js`
   - `package.json`
   - `package-lock.json`
   - `.env`
   - `.htaccess`
   - مجلد `database/` كاملاً

### 2. إعداد قاعدة البيانات:
1. اذهب إلى cPanel → MySQL Databases
2. أنشئ قاعدة بيانات جديدة
3. أنشئ مستخدم قاعدة بيانات
4. اربط المستخدم بقاعدة البيانات
5. استورد ملف `database/init.sql`

### 3. تحديث ملف .env:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Server Configuration
PORT=3000
NODE_ENV=production

# Domain Configuration
FRONTEND_URL=https://goesociety.ly
BACKEND_URL=https://goesociety.ly

# Security
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here
```

### 4. تثبيت Dependencies:
1. اذهب إلى cPanel → Terminal (إذا متوفر)
2. انتقل إلى مجلد `public_html`
3. نفذ الأمر: `npm install --production`

### 5. تشغيل الخادم:
- إذا كان Node.js متوفراً: `node server.js`
- أو استخدم cPanel Node.js App إذا متوفر

## 🔧 إعدادات إضافية:

### صلاحيات الملفات:
- الملفات: 644
- المجلدات: 755
- server.js: 755 (قابل للتنفيذ)

### SSL Certificate:
- فعّل SSL من cPanel
- تأكد من إعادة التوجيه من HTTP إلى HTTPS

## 🚨 ملاحظات مهمة:
- تأكد من تحديث معلومات قاعدة البيانات في ملف `.env`
- احتفظ بنسخة احتياطية من قاعدة البيانات
- راقب logs الخادم للتأكد من عدم وجود أخطاء