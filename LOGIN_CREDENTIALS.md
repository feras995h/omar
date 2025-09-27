# 🔐 بيانات تسجيل الدخول

## 👤 المستخدمين المتاحين

### 1. مدير النظام (Admin)
- **اسم المستخدم:** `admin`
- **البريد الإلكتروني:** `admin@storyboard.com`
- **كلمة السر:** `admin123`
- **الاسم الكامل:** مدير النظام
- **الدور:** admin
- **الصلاحيات:** كامل (إنشاء، تعديل، حذف، عرض)

### 2. مستخدم تجريبي (Viewer)
- **اسم المستخدم:** `test`
- **البريد الإلكتروني:** `test@storyboard.com`
- **كلمة السر:** `test123`
- **الاسم الكامل:** مستخدم تجريبي
- **الدور:** viewer
- **الصلاحيات:** عرض فقط

## 🚀 كيفية تسجيل الدخول

### 1. عبر واجهة الويب:
1. افتح الرابط: http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/
2. اذهب إلى صفحة تسجيل الدخول
3. استخدم أي من البيانات أعلاه

### 2. عبر API:
```bash
# تسجيل الدخول كمدير
curl -X POST http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# تسجيل الدخول كمستخدم تجريبي
curl -X POST http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

## 🔧 إنشاء مستخدمين جدد

### عبر API:
```bash
curl -X POST http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_user",
    "email": "new@example.com",
    "password": "new_password",
    "full_name": "اسم المستخدم الجديد"
  }'
```

### عبر قاعدة البيانات مباشرة:
```sql
INSERT INTO users (username, email, password_hash, full_name, role, is_active) 
VALUES ('new_user', 'new@example.com', 'password123', 'اسم المستخدم', 'viewer', 1);
```

## 🛡️ الأمان

### ملاحظات مهمة:
1. **كلمات السر غير مشفرة** - للسهولة في التطوير
2. **في الإنتاج** - يجب تشفير كلمات السر باستخدام bcrypt
3. **تغيير كلمات السر** - يمكن تغييرها من خلال واجهة المستخدم
4. **حذف المستخدمين** - يمكن حذفهم من قاعدة البيانات

### تشفير كلمات السر (اختياري):
```javascript
import bcrypt from 'bcrypt';

const saltRounds = 10;
const hashedPassword = await bcrypt.hash('password123', saltRounds);
```

## 🔍 استكشاف الأخطاء

### إذا فشل تسجيل الدخول:

1. **تحقق من صحة البيانات:**
   - تأكد من كتابة اسم المستخدم وكلمة السر بشكل صحيح
   - تحقق من عدم وجود مسافات إضافية

2. **تحقق من حالة الخادم:**
   ```bash
   curl http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/api/health
   ```

3. **تحقق من قاعدة البيانات:**
   ```bash
   curl http://c4wwggwsg8oo0s4ksgsw88ss.72.60.92.146.sslip.io/api/db-test
   ```

4. **تحقق من سجلات الخادم:**
   - اذهب إلى Coolify
   - تحقق من سجلات التطبيق

## 📋 قائمة المستخدمين الحاليين

| اسم المستخدم | البريد الإلكتروني | كلمة السر | الدور | الصلاحيات |
|--------------|-------------------|-----------|-------|-----------|
| admin | admin@storyboard.com | admin123 | admin | كامل |
| test | test@storyboard.com | test123 | viewer | عرض فقط |

## 🎯 الخطوات التالية

1. **سجل الدخول** باستخدام البيانات أعلاه
2. **استكشف النظام** وتعلم كيفية استخدامه
3. **أنشئ مستخدمين جدد** حسب الحاجة
4. **غيّر كلمات السر** للأمان
5. **أضف مشاريع وقصص مصورة** للاختبار

**النظام جاهز للاستخدام! 🚀**
