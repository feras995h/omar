# 🔧 حل نهائي لمشكلة SSL - استخدام HTTP

## 🚨 المشكلة
التطبيق يحاول الوصول إلى HTTPS مما يسبب `ERR_CERT_AUTHORITY_INVALID`

## ✅ الحل النهائي

### 1. استخدام HTTP بدلاً من HTTPS
في Coolify، تأكد من أن التطبيق يستخدم HTTP وليس HTTPS

### 2. إعدادات Coolify المطلوبة:
```
نوع التطبيق: Node.js
Build Command: npm run build
Start Command: node server.js
Port: 3000
Protocol: HTTP (ليس HTTPS)
```

### 3. متغيرات البيئة:
```env
NODE_ENV=production
PORT=3000
VITE_MYSQL_HOST=72.60.92.146
VITE_MYSQL_PORT=5435
VITE_MYSQL_USER=mysql
VITE_MYSQL_PASSWORD=8lvoAx40IhOQQrctuTRHo6OIkLF0jDg2UbDbatW5T1fqcH171OjKtJjXKFL1b6ID
VITE_MYSQL_DATABASE=default
```

## 🔧 خطوات الإصلاح في Coolify

### الخطوة 1: تغيير البروتوكول إلى HTTP
1. اذهب إلى لوحة تحكم Coolify
2. اختر تطبيقك
3. اذهب إلى إعدادات النطاق
4. غيّر البروتوكول من HTTPS إلى HTTP

### الخطوة 2: إعادة تشغيل التطبيق
1. اضغط "Restart" أو "Redeploy"
2. انتظر حتى يكتمل النشر

### الخطوة 3: اختبار التطبيق
1. افتح الرابط: `http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/`
2. تأكد من عدم وجود أخطاء SSL

## 🧪 اختبار الحل

### اختبار المسارات:
```bash
# اختبار HTTP (يجب أن يعمل)
curl http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/settings
curl http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/settings/language
curl http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/auth/me

# اختبار HTTPS (قد لا يعمل بسبب شهادة SSL)
curl https://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/settings
```

## 🔐 بيانات تسجيل الدخول

### مدير النظام:
- **اسم المستخدم:** `admin`
- **كلمة السر:** `admin123`

### مستخدم تجريبي:
- **اسم المستخدم:** `test`
- **كلمة السر:** `test123`

## 🎯 النتيجة المتوقعة

بعد التطبيق:
- ✅ لا توجد أخطاء SSL
- ✅ جميع المسارات تعمل
- ✅ تسجيل الدخول يعمل
- ✅ التطبيق يعمل بشكل كامل

## 🔍 إذا لم يعمل

### الحل البديل 1: إضافة شهادة SSL صحيحة
1. في Coolify، اذهب إلى إعدادات SSL
2. أضف شهادة SSL صحيحة
3. أو استخدم Let's Encrypt

### الحل البديل 2: استخدام نطاق مختلف
1. استخدم نطاق فرعي مع شهادة SSL صحيحة
2. أو استخدم نطاق مخصص

### الحل البديل 3: تجاهل تحذيرات SSL (للتطوير فقط)
في المتصفح:
1. اضغط F12
2. اذهب إلى Console
3. اكتب: `location.href = location.href.replace('https://', 'http://')`

## 📋 قائمة التحقق

- [ ] تغيير البروتوكول إلى HTTP في Coolify
- [ ] إعادة تشغيل التطبيق
- [ ] اختبار المسارات
- [ ] اختبار تسجيل الدخول
- [ ] تأكد من عدم وجود أخطاء SSL

## 🎉 ملخص الحل

**المشكلة:** شهادة SSL غير صحيحة
**الحل:** استخدام HTTP بدلاً من HTTPS
**النتيجة:** التطبيق يعمل بدون أخطاء SSL

**هذا هو الحل الأسرع والأكثر فعالية! 🚀**
