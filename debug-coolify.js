#!/usr/bin/env node

/**
 * Coolify Debug Script
 * يساعد في تشخيص مشاكل النشر في Coolify
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Coolify Debug Script');
console.log('====================\n');

// 1. فحص ملفات المشروع
console.log('📁 1. فحص ملفات المشروع:');
const requiredFiles = [
  'package.json',
  'server.js',
  'vite.config.ts',
  'Dockerfile',
  'dist/index.html'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  
  if (file === 'dist/index.html' && !exists) {
    console.log('      ⚠️  ملف dist/index.html غير موجود - يجب تشغيل npm run build');
  }
});

// 2. فحص package.json
console.log('\n📦 2. فحص package.json:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  console.log(`   ✅ اسم المشروع: ${packageJson.name}`);
  console.log(`   ✅ الإصدار: ${packageJson.version}`);
  console.log(`   ✅ نوع المشروع: ${packageJson.type || 'commonjs'}`);
  
  // فحص الأوامر المطلوبة
  const requiredScripts = ['build', 'start'];
  requiredScripts.forEach(script => {
    const exists = packageJson.scripts && packageJson.scripts[script];
    console.log(`   ${exists ? '✅' : '❌'} أمر ${script}: ${exists || 'غير موجود'}`);
  });
  
  // فحص التبعيات المطلوبة
  const requiredDeps = ['express', 'react', 'react-dom'];
  requiredDeps.forEach(dep => {
    const exists = packageJson.dependencies && packageJson.dependencies[dep];
    console.log(`   ${exists ? '✅' : '❌'} تبعية ${dep}: ${exists || 'غير موجود'}`);
  });
  
} catch (error) {
  console.log(`   ❌ خطأ في قراءة package.json: ${error.message}`);
}

// 3. فحص server.js
console.log('\n🖥️  3. فحص server.js:');
try {
  const serverContent = fs.readFileSync('server.js', 'utf8');
  
  const checks = [
    { name: 'Express import', pattern: /import express from/ },
    { name: 'Static files serving', pattern: /express\.static/ },
    { name: 'API routes', pattern: /app\.get.*\/api/ },
    { name: 'Catch-all route', pattern: /app\.get\('\*'/ },
    { name: 'Port configuration', pattern: /PORT.*process\.env\.PORT/ }
  ];
  
  checks.forEach(check => {
    const exists = check.pattern.test(serverContent);
    console.log(`   ${exists ? '✅' : '❌'} ${check.name}`);
  });
  
} catch (error) {
  console.log(`   ❌ خطأ في قراءة server.js: ${error.message}`);
}

// 4. فحص vite.config.ts
console.log('\n⚙️  4. فحص vite.config.ts:');
try {
  const viteContent = fs.readFileSync('vite.config.ts', 'utf8');
  
  const checks = [
    { name: 'Base path configured', pattern: /base:\s*['"]\.\/['"]/ },
    { name: 'Build output directory', pattern: /outDir:\s*['"]dist['"]/ },
    { name: 'React plugin', pattern: /@vitejs\/plugin-react/ }
  ];
  
  checks.forEach(check => {
    const exists = check.pattern.test(viteContent);
    console.log(`   ${exists ? '✅' : '❌'} ${check.name}`);
  });
  
} catch (error) {
  console.log(`   ❌ خطأ في قراءة vite.config.ts: ${error.message}`);
}

// 5. فحص متغيرات البيئة
console.log('\n🌍 5. فحص متغيرات البيئة:');
const envVars = [
  'NODE_ENV',
  'PORT',
  'VITE_MYSQL_HOST',
  'VITE_MYSQL_PORT',
  'VITE_MYSQL_USER',
  'VITE_MYSQL_PASSWORD',
  'VITE_MYSQL_DATABASE'
];

envVars.forEach(envVar => {
  const value = process.env[envVar];
  console.log(`   ${value ? '✅' : '❌'} ${envVar}: ${value || 'غير محدد'}`);
});

// 6. فحص مجلد dist
console.log('\n📁 6. فحص مجلد dist:');
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  const distFiles = fs.readdirSync(distPath);
  console.log(`   ✅ مجلد dist موجود`);
  console.log(`   📄 الملفات: ${distFiles.join(', ')}`);
  
  // فحص ملف index.html
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const hasReactRoot = indexContent.includes('id="root"');
    const hasScripts = indexContent.includes('<script');
    console.log(`   ${hasReactRoot ? '✅' : '❌'} يحتوي على React root`);
    console.log(`   ${hasScripts ? '✅' : '❌'} يحتوي على scripts`);
  }
} else {
  console.log('   ❌ مجلد dist غير موجود - يجب تشغيل npm run build');
}

// 7. توصيات Coolify
console.log('\n🚀 7. توصيات تكوين Coolify:');
console.log('   📋 تأكد من الإعدادات التالية في Coolify:');
console.log('      • نوع التطبيق: Node.js');
console.log('      • أمر البناء: npm run build');
console.log('      • أمر التشغيل: node server.js');
console.log('      • المنفذ: 3000');
console.log('      • متغيرات البيئة: NODE_ENV=production, PORT=3000');

console.log('\n🔧 8. خطوات التشخيص:');
console.log('   1. تحقق من سجلات النشر في Coolify');
console.log('   2. تحقق من سجلات التطبيق في Coolify');
console.log('   3. اختبر API endpoints:');
console.log('      curl http://your-domain.com/api/health');
console.log('   4. تحقق من أن التطبيق يعمل على المنفذ الصحيح');

console.log('\n✅ انتهى التشخيص');
