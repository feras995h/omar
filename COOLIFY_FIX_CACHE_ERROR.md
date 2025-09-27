# 🔧 حل مشكلة Cache Error في Coolify

## 🚨 المشكلة
```
npm error code EBUSY
npm error syscall rmdir
npm error path /app/node_modules/.cache
npm error errno -16
npm error EBUSY: resource busy or locked, rmdir '/app/node_modules/.cache'
```

## ✅ الحل

### 1. إعدادات Coolify الجديدة

في لوحة تحكم Coolify، غيّر الإعدادات إلى:

**Build Command:**
```
npm ci
```

**Start Command:**
```
npm run build && node server.js
```

**Port:**
```
3000
```

### 2. متغيرات البيئة المطلوبة

أضف هذه المتغيرات في Coolify:

```
NODE_ENV=production
PORT=3000
VITE_MYSQL_HOST=your_database_host
VITE_MYSQL_PORT=3306
VITE_MYSQL_USER=your_database_user
VITE_MYSQL_PASSWORD=your_database_password
VITE_MYSQL_DATABASE=your_database_name
```

### 3. إذا استمرت المشكلة

#### خيار 1: استخدام Dockerfile مخصص
1. في Coolify، غيّر نوع التطبيق إلى `Docker`
2. استخدم `Dockerfile.coolify` المرفق

#### خيار 2: مسح Cache
1. في Coolify، اذهب إلى Settings
2. ابحث عن "Clear Cache" أو "Reset"
3. امسح جميع الـ cache
4. أعد النشر

#### خيار 3: إعادة إنشاء التطبيق
1. احذف التطبيق الحالي في Coolify
2. أنشئ تطبيق جديد
3. استخدم الإعدادات الجديدة أعلاه

## 🔍 التحقق من الحل

بعد التطبيق، اختبر:

```bash
# اختبار صحة الخادم
curl http://your-domain.com/api/health

# اختبار قاعدة البيانات
curl http://your-domain.com/api/db-test
```

## 📋 قائمة التحقق

- [ ] Build Command: `npm ci`
- [ ] Start Command: `npm run build && node server.js`
- [ ] Port: `3000`
- [ ] متغيرات البيئة مضافة
- [ ] تم مسح cache (إذا لزم الأمر)
- [ ] التطبيق يعمل على الرابط

## 🆘 إذا لم يعمل

1. **تحقق من سجلات Coolify** - ابحث عن أخطاء جديدة
2. **جرب إعادة إنشاء التطبيق** من الصفر
3. **تأكد من صحة متغيرات البيئة**
4. **تحقق من أن قاعدة البيانات متاحة**

## 📞 الدعم

إذا استمرت المشكلة، شارك:
1. لقطة شاشة من إعدادات Coolify
2. سجلات الأخطاء الجديدة
3. نتيجة اختبار API
