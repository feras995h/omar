# 🗄️ إعداد قاعدة البيانات

## 📊 معلومات الاتصال بقاعدة البيانات

### معلومات الخادم:
- **Host:** `72.60.92.146`
- **Port:** `5435`
- **User:** `mysql`
- **Password:** `8lvoAx40IhOQQrctuTRHo6OIkLF0jDg2UbDbatW5T1fqcH171OjKtJjXKFL1b6ID`
- **Database:** `default`

## 🔧 متغيرات البيئة لـ Coolify

أضف هذه المتغيرات في لوحة تحكم Coolify:

```env
NODE_ENV=production
PORT=3000
VITE_MYSQL_HOST=72.60.92.146
VITE_MYSQL_PORT=5435
VITE_MYSQL_USER=mysql
VITE_MYSQL_PASSWORD=8lvoAx40IhOQQrctuTRHo6OIkLF0jDg2UbDbatW5T1fqcH171OjKtJjXKFL1b6ID
VITE_MYSQL_DATABASE=default
```

## 🧪 اختبار الاتصال

### اختبار محلياً:
```bash
# تشغيل الخادم
npm start

# اختبار الاتصال بقاعدة البيانات
curl http://localhost:3000/api/db-test
```

### اختبار في Coolify:
```bash
# اختبار الاتصال بقاعدة البيانات
curl http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/api/db-test
```

## 📋 خطوات الإعداد

1. **أضف متغيرات البيئة في Coolify:**
   - اذهب إلى لوحة تحكم Coolify
   - اختر تطبيقك
   - اذهب إلى تبويب "Environment Variables"
   - أضف جميع المتغيرات المذكورة أعلاه

2. **أعد تشغيل التطبيق:**
   - احفظ التغييرات
   - اضغط "Restart" أو "Redeploy"

3. **اختبر الاتصال:**
   - استخدم الأوامر المذكورة أعلاه
   - تحقق من سجلات Coolify

## ⚠️ ملاحظات مهمة

1. **المنفذ غير عادي:** المنفذ 5435 غير عادي لـ MySQL (عادة 3306)
2. **الأمان:** تأكد من أن قاعدة البيانات محمية بجدار حماية
3. **الأداء:** قد يكون الاتصال أبطأ بسبب المسافة الجغرافية
4. **النسخ الاحتياطي:** تأكد من وجود نسخ احتياطية منتظمة

## 🔍 استكشاف الأخطاء

### إذا فشل الاتصال:

1. **تحقق من صحة البيانات:**
   ```bash
   curl http://your-domain.com/api/debug/files
   ```

2. **تحقق من سجلات Coolify:**
   - ابحث عن أخطاء الاتصال بقاعدة البيانات
   - تحقق من رسائل الخطأ

3. **اختبر الاتصال مباشرة:**
   ```bash
   # إذا كان لديك MySQL client
   mysql -h 72.60.92.146 -P 5435 -u mysql -p
   ```

## 🎯 النتيجة المتوقعة

بعد التطبيق الصحيح:
- ✅ الاتصال بقاعدة البيانات يعمل
- ✅ API endpoints تستجيب
- ✅ لا توجد أخطاء في السجلات
- ✅ التطبيق يعمل بشكل كامل
