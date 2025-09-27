# 🔧 حل مشكلة 404 للملفات الثابتة

## 🚨 المشكلة
```
index-9Bf3YDPG.js:1 Failed to load resource: the server responded with a status of 404 (Not Found)
```

## ✅ الحل المطبق

### 1. إصلاح catch-all route
تم تحديث `server.js` ليتعامل مع ملفات assets بشكل صحيح:

```javascript
// Catch-all handler: send back React's index.html file for client-side routing
// But only for non-asset requests
app.get('*', (req, res) => {
  // Don't serve index.html for asset requests (js, css, images, etc.)
  const assetExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
  const hasAssetExtension = assetExtensions.some(ext => req.path.endsWith(ext));
  
  if (hasAssetExtension) {
    return res.status(404).send('File not found');
  }
  
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
```

### 2. إضافة مسار خاص لـ assets
```javascript
// Serve assets with proper headers
app.use('/assets', express.static(path.join(__dirname, 'dist', 'assets'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
  }
}));
```

### 3. إضافة مسار debug
```javascript
// Debug route to check static files
app.get('/api/debug/files', (req, res) => {
  // ... كود فحص الملفات
});
```

## 🧪 اختبار الحل

### 1. اختبار محلياً:
```bash
# تشغيل الخادم
npm start

# اختبار API
curl http://localhost:3000/api/health

# فحص الملفات
curl http://localhost:3000/api/debug/files

# اختبار ملف JS
curl http://localhost:3000/assets/index-9Bf3YDPG.js
```

### 2. اختبار في Coolify:
```bash
# اختبار API
curl http://your-domain.com/api/health

# فحص الملفات
curl http://your-domain.com/api/debug/files

# اختبار ملف JS
curl http://your-domain.com/assets/index-9Bf3YDPG.js
```

## 🔍 تشخيص المشكلة

### إذا استمرت المشكلة:

1. **تحقق من مسار الملفات:**
   ```bash
   curl http://your-domain.com/api/debug/files
   ```

2. **تحقق من وجود مجلد dist:**
   - يجب أن يحتوي على `index.html`
   - يجب أن يحتوي على مجلد `assets`
   - يجب أن يحتوي على ملفات `.js` و `.css`

3. **تحقق من إعدادات Coolify:**
   - تأكد من أن `npm run build` يعمل بنجاح
   - تأكد من أن مجلد `dist` يتم إنشاؤه

## 📋 قائمة التحقق

- [ ] تم تحديث `server.js`
- [ ] تم إضافة مسار `/assets`
- [ ] تم إصلاح catch-all route
- [ ] تم اختبار الخادم محلياً
- [ ] تم نشر التحديث في Coolify
- [ ] تم اختبار الملفات في Coolify

## 🆘 إذا لم يعمل

1. **تحقق من سجلات Coolify** - ابحث عن أخطاء في البناء
2. **تأكد من أن `npm run build` يعمل** في Coolify
3. **تحقق من مسار الملفات** باستخدام `/api/debug/files`
4. **تأكد من أن مجلد `dist` موجود** في Coolify

## 📞 الدعم

إذا استمرت المشكلة، شارك:
1. نتيجة `curl http://your-domain.com/api/debug/files`
2. سجلات Coolify
3. لقطة شاشة من Network tab في المتصفح
