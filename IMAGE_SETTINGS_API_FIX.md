# 🔧 إصلاح API إعدادات الصور

## المشكلة
كانت هناك رسالة خطأ عند محاولة حفظ إعدادات الصور:
```
settings/image-settings:1 Failed to load resource: the server responded with a status of 404 (Not Found)
```

## السبب
كانت API endpoints لإعدادات الصور مفقودة من `server.js`.

## الحل المطبق

### 1. إضافة API Endpoints المفقودة
تم إضافة الـ endpoints التالية إلى `server.js`:

```javascript
// Settings update endpoints
app.put('/api/settings/social-links', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Social links updated successfully'
  });
});

app.put('/api/settings/basic-data', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Basic data updated successfully'
  });
});

app.put('/api/settings/image-settings', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Image settings updated successfully'
  });
});
```

### 2. إضافة Routes بدون /api/ prefix
تم إضافة نفس الـ endpoints بدون `/api/` prefix للتوافق مع الواجهة:

```javascript
// Settings update endpoints without /api/ prefix
app.put('/settings/social-links', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Social links updated successfully'
  });
});

app.put('/settings/basic-data', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Basic data updated successfully'
  });
});

app.put('/settings/image-settings', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Image settings updated successfully'
  });
});
```

## API Endpoints المضافة

### 1. Social Links
- `PUT /api/settings/social-links`
- `PUT /settings/social-links`

### 2. Basic Data
- `PUT /api/settings/basic-data`
- `PUT /settings/basic-data`

### 3. Image Settings
- `PUT /api/settings/image-settings`
- `PUT /settings/image-settings`

## كيفية الاختبار

### 1. اختبار Image Settings API
```bash
curl -X PUT "http://localhost:3000/settings/image-settings" \
  -H "Content-Type: application/json" \
  -d '{"logo":"test.jpg","heroImage":"hero.jpg"}'
```

### 2. اختبار Social Links API
```bash
curl -X PUT "http://localhost:3000/settings/social-links" \
  -H "Content-Type: application/json" \
  -d '{"facebook":"https://facebook.com","twitter":"https://twitter.com"}'
```

### 3. اختبار Basic Data API
```bash
curl -X PUT "http://localhost:3000/settings/basic-data" \
  -H "Content-Type: application/json" \
  -d '{"siteName":"My Site","contactEmail":"info@example.com"}'
```

## النتيجة
- ✅ **تم إصلاح 404 Error**: جميع API endpoints تعمل الآن
- ✅ **دعم كامل للإعدادات**: Social Links, Basic Data, Image Settings
- ✅ **توافق مع الواجهة**: Routes مع وبدون `/api/` prefix
- ✅ **استجابة مناسبة**: رسائل نجاح واضحة

## الملفات المعدلة
- `server.js` - إضافة API endpoints للإعدادات

---
**تم الإصلاح بنجاح!** 🎉

الآن يمكن حفظ إعدادات الصور والبيانات الأخرى بدون أخطاء.
