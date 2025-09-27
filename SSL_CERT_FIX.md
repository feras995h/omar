# 🔒 حل مشكلة شهادة SSL

## 🚨 المشكلة
```
ERR_CERT_AUTHORITY_INVALID
Failed to load resource: net::ERR_CERT_AUTHORITY_INVALID
```

## ✅ الحلول المطبقة

### 1. إصلاح إعدادات CORS
تم تحديث إعدادات CORS لتدعم:
- HTTP و HTTPS
- المسارات الصحيحة
- Headers مطلوبة

### 2. إضافة مسارات API مفقودة
تم إضافة المسارات التالية:
- `/api/settings`
- `/api/settings/language`
- `/api/auth/me`

### 3. معالجة Preflight Requests
تم إضافة معالجة لطلبات OPTIONS

## 🔧 حلول إضافية

### الحل 1: استخدام HTTP بدلاً من HTTPS
إذا كان Coolify لا يدعم HTTPS بشكل صحيح:
1. في Coolify، تأكد من أن التطبيق يستخدم HTTP
2. أو استخدم نطاق فرعي مع شهادة SSL صحيحة

### الحل 2: إعداد شهادة SSL صحيحة
1. في Coolify، اذهب إلى إعدادات النطاق
2. أضف شهادة SSL صحيحة
3. أو استخدم Let's Encrypt

### الحل 3: تجاهل تحذيرات SSL (للتطوير فقط)
في المتصفح:
1. اضغط F12 لفتح Developer Tools
2. اذهب إلى Console
3. اكتب: `location.href = location.href.replace('https://', 'http://')`

## 🧪 اختبار الحل

### اختبار محلياً:
```bash
# تشغيل الخادم
npm start

# اختبار API
curl http://localhost:3000/api/settings
curl http://localhost:3000/api/settings/language
curl http://localhost:3000/api/auth/me
```

### اختبار في Coolify:
```bash
# اختبار API
curl http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/api/settings
curl http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/api/settings/language
curl http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/api/auth/me
```

## 🔍 استكشاف الأخطاء

### إذا استمرت المشكلة:

1. **تحقق من نوع البروتوكول:**
   - تأكد من أن Coolify يستخدم HTTP وليس HTTPS
   - أو تأكد من صحة شهادة SSL

2. **تحقق من إعدادات Coolify:**
   - اذهب إلى إعدادات التطبيق
   - تأكد من إعدادات النطاق
   - تحقق من إعدادات SSL

3. **تحقق من سجلات الخادم:**
   - اذهب إلى Logs في Coolify
   - ابحث عن أخطاء CORS أو SSL

## 📋 قائمة التحقق

- [ ] إعدادات CORS محدثة
- [ ] مسارات API مضافة
- [ ] معالجة Preflight requests
- [ ] اختبار API endpoints
- [ ] تحقق من إعدادات Coolify
- [ ] اختبار في المتصفح

## 🆘 إذا لم يعمل

1. **جرب HTTP بدلاً من HTTPS:**
   ```
   http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/
   ```

2. **تحقق من إعدادات Coolify:**
   - تأكد من أن التطبيق يستخدم HTTP
   - أو أضف شهادة SSL صحيحة

3. **اتصل بدعم Coolify:**
   - إذا كانت المشكلة في إعدادات الخادم
   - أو في شهادة SSL

## 🎯 النتيجة المتوقعة

بعد التطبيق:
- ✅ لا توجد أخطاء SSL
- ✅ API endpoints تستجيب
- ✅ تسجيل الدخول يعمل
- ✅ الإعدادات تعمل
- ✅ التطبيق يعمل بشكل كامل
