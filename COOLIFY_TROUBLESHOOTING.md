# دليل استكشاف أخطاء Coolify

## 🚨 المشكلة الحالية
التطبيق لا يعمل بشكل صحيح بعد النشر في Coolify على الرابط: http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/

## 🔍 خطوات التشخيص

### 1. تشغيل سكريبت التشخيص
```bash
npm run debug:coolify
```

### 2. فحص إعدادات Coolify
تأكد من الإعدادات التالية في لوحة تحكم Coolify:

#### إعدادات التطبيق:
- **نوع التطبيق**: `Node.js` (ليس Static Site)
- **أمر البناء**: `npm run build`
- **أمر التشغيل**: `node server.js`
- **المنفذ**: `3000`

#### متغيرات البيئة المطلوبة:
```env
NODE_ENV=production
PORT=3000
VITE_MYSQL_HOST=your_database_host
VITE_MYSQL_PORT=3306
VITE_MYSQL_USER=your_database_user
VITE_MYSQL_PASSWORD=your_database_password
VITE_MYSQL_DATABASE=your_database_name
```

### 3. فحص سجلات النشر
1. اذهب إلى لوحة تحكم Coolify
2. اختر تطبيقك
3. اذهب إلى تبويب "Deployments"
4. افحص آخر عملية نشر للأخطاء

### 4. فحص سجلات التطبيق
1. في لوحة تحكم Coolify
2. اذهب إلى تبويب "Logs"
3. ابحث عن أخطاء وقت التشغيل

## 🔧 الحلول الشائعة

### المشكلة 1: خطأ 405 Method Not Allowed
**السبب**: Coolify يعامل التطبيق كموقع ثابت
**الحل**:
1. تأكد من أن نوع التطبيق مضبوط على `Node.js`
2. تأكد من أن أمر التشغيل هو `node server.js`
3. أعد تشغيل التطبيق

### المشكلة 2: خطأ 404 Not Found
**السبب**: ملفات التطبيق غير موجودة أو مسار خاطئ
**الحل**:
1. تأكد من تشغيل `npm run build` بنجاح
2. تحقق من وجود مجلد `dist`
3. تأكد من أن `server.js` يخدم الملفات الثابتة بشكل صحيح

### المشكلة 3: خطأ اتصال قاعدة البيانات
**السبب**: متغيرات البيئة غير صحيحة
**الحل**:
1. أضف جميع متغيرات البيئة المطلوبة
2. تأكد من صحة بيانات الاتصال بقاعدة البيانات
3. اختبر الاتصال بقاعدة البيانات

## 🧪 اختبار التطبيق

### اختبار API محلياً:
```bash
# اختبار صحة الخادم
curl http://localhost:3000/api/health

# اختبار قاعدة البيانات
curl http://localhost:3000/api/db-test

# اختبار تسجيل الدخول
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

### اختبار في Coolify:
1. استخدم Terminal المدمج في Coolify
2. شغل الأوامر أعلاه مع استبدال `localhost` بـ `localhost:3000`

## 📋 قائمة التحقق السريع

- [ ] نوع التطبيق مضبوط على `Node.js`
- [ ] أمر البناء: `npm run build`
- [ ] أمر التشغيل: `node server.js`
- [ ] المنفذ: `3000`
- [ ] متغيرات البيئة مضافة
- [ ] مجلد `dist` موجود
- [ ] `server.js` موجود
- [ ] قاعدة البيانات متصلة

## 🆘 إذا استمرت المشكلة

1. **شارك سجلات الأخطاء** من Coolify
2. **اختبر API endpoints** مباشرة
3. **تحقق من إعدادات النطاق** في Coolify
4. **تأكد من أن قاعدة البيانات متاحة** من Coolify

## 📞 الدعم

إذا كنت بحاجة لمساعدة إضافية:
1. شارك نتائج `npm run debug:coolify`
2. شارك سجلات الأخطاء من Coolify
3. وصف المشكلة بالتفصيل
