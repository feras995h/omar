# إعداد متغيرات البيئة لـ Coolify

## 🔧 متغيرات البيئة المطلوبة

أضف هذه المتغيرات في لوحة تحكم Coolify:

### إعدادات الخادم:
```
NODE_ENV=production
PORT=3000
```

### إعدادات قاعدة البيانات:
```
VITE_MYSQL_HOST=your_database_host
VITE_MYSQL_PORT=3306
VITE_MYSQL_USER=your_database_user
VITE_MYSQL_PASSWORD=your_database_password
VITE_MYSQL_DATABASE=your_database_name
```

### إعدادات إضافية (اختيارية):
```
FRONTEND_URL=https://your-domain.com
DOMAIN_URL=https://your-domain.com
```

## 📋 خطوات الإعداد في Coolify:

1. **اذهب إلى لوحة تحكم Coolify**
2. **اختر تطبيقك**
3. **اذهب إلى تبويب "Environment Variables"**
4. **أضف كل متغير من المتغيرات أعلاه**
5. **احفظ التغييرات**
6. **أعد تشغيل التطبيق**

## ⚠️ ملاحظات مهمة:

- **لا تستخدم ملف .env** في Coolify - استخدم متغيرات البيئة المدمجة
- **تأكد من صحة بيانات قاعدة البيانات**
- **PORT يجب أن يكون 3000** أو أي منفذ آخر محدد في Coolify
- **NODE_ENV يجب أن يكون production**

## 🧪 اختبار الإعداد:

بعد إضافة المتغيرات، اختبر التطبيق:

```bash
# اختبار صحة الخادم
curl http://your-domain.com/api/health

# اختبار قاعدة البيانات
curl http://your-domain.com/api/db-test
```

## 🔍 إذا لم تعمل:

1. تحقق من سجلات التطبيق في Coolify
2. تأكد من أن قاعدة البيانات متاحة من Coolify
3. تحقق من صحة بيانات الاتصال
4. تأكد من أن التطبيق يعيد التشغيل بعد إضافة المتغيرات
