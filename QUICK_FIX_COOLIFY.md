# 🚀 حل سريع لمشكلة Coolify

## المشكلة
التطبيق لا يعمل على: http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/

## ✅ الحل السريع (5 دقائق)

### 1. تحقق من إعدادات Coolify
في لوحة تحكم Coolify، تأكد من:

- **نوع التطبيق**: `Node.js` (ليس Static Site)
- **أمر البناء**: `npm ci && npm run build`
- **أمر التشغيل**: `node server.js`
- **المنفذ**: `3000`

### 2. أضف متغيرات البيئة
في تبويب "Environment Variables" أضف:

```
NODE_ENV=production
PORT=3000
VITE_MYSQL_HOST=your_db_host
VITE_MYSQL_PORT=3306
VITE_MYSQL_USER=your_db_user
VITE_MYSQL_PASSWORD=your_db_password
VITE_MYSQL_DATABASE=your_db_name
```

### 3. أعد تشغيل التطبيق
- احفظ التغييرات
- اضغط "Restart" أو "Redeploy"

## 🔍 إذا لم يعمل

### اختبر API مباشرة:
```bash
curl http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/api/health
```

### تحقق من السجلات:
1. اذهب إلى "Logs" في Coolify
2. ابحث عن أخطاء
3. تأكد من أن الخادم يعمل على المنفذ 3000

## 📞 إذا استمرت المشكلة

شارك معي:
1. لقطة شاشة من إعدادات Coolify
2. سجلات الأخطاء من Coolify
3. نتيجة اختبار API

## 🎯 النتيجة المتوقعة

بعد التطبيق الصحيح:
- ✅ الموقع يعمل على الرابط
- ✅ API endpoints تستجيب
- ✅ قاعدة البيانات متصلة
- ✅ لا توجد أخطاء 404/405
