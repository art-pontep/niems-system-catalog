# 🚀 Quick Start Guide

## ⚡ ติดตั้งและรันภายใน 5 นาที

### 1️⃣ Setup Google Apps Script Backend (2 นาที)

```bash
# 1. เปิด Google Apps Script
open https://script.google.com/

# 2. Create New Project → คัดลอกโค้ดจาก backend/backend.gs

# 3. แก้ไข CONFIG ในบรรทัดที่ 13-30:
SHEET_ID: "YOUR_SHEET_ID"              # จาก Google Sheet URL
CLIENT_ID: "YOUR_CLIENT_ID"            # จาก Google Cloud Console
ALLOWED_USERS: ["your-email@gmail.com"]

# 4. Deploy → New deployment → Web app → Deploy
# 5. คัดลอก Web App URL
```

### 2️⃣ Setup OAuth Credentials (2 นาที)

```bash
# 1. เปิด Google Cloud Console
open https://console.cloud.google.com/

# 2. Create Project → Enable APIs → Google Identity

# 3. Credentials → Create OAuth Client ID:
Application Type: Web application
Authorized JavaScript origins:
  - http://localhost:8000
  - https://YOUR_USERNAME.github.io

# 4. คัดลอก Client ID
```

### 3️⃣ Configure Frontend (1 นาที)

```bash
# สร้าง config.js จาก template:
cp js/config.prod.template.js js/config.js

# แก้ไขไฟล์ js/config.js:
nano js/config.js

# อัปเดตค่าต่อไปนี้:
clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com'  # Local + Production
baseUrl: 'YOUR_APPS_SCRIPT_WEB_APP_URL'
```

### 4️⃣ Run Locally (macOS)

```bash
# Option 1: ใช้ script (แนะนำ)
./start-dev.sh

# Option 2: Python
python3 -m http.server 8000

# Option 3: Node.js
npx http-server -p 8000

# เปิด Browser
open http://localhost:8000
```

---

## 📋 Checklist ก่อนใช้งาน

- [ ] สร้าง Google Sheet พร้อม tabs: `systems`, `requirements`
- [ ] Deploy Google Apps Script เป็น Web App
- [ ] สร้าง OAuth Client ID (Local + Production)
- [ ] อัปเดต `js/config.js` ด้วย Client ID และ API URL
- [ ] เพิ่มอีเมลของคุณใน `ALLOWED_USERS` ใน backend.gs
- [ ] ทดสอบเปิดหน้าเว็บใน Browser

---

## 🎯 Deploy to GitHub Pages (5 นาที)

```bash
# 1. Create repository on GitHub
# https://github.com/new

# 2. Setup GitHub Secrets (REQUIRED!)
# Repository Settings → Secrets and variables → Actions
# Add secrets:
#   - GOOGLE_CLIENT_ID: Your production OAuth Client ID
#   - GOOGLE_APPS_SCRIPT_URL: Your Apps Script Web App URL

# 3. Push code
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/system-catalog.git
git push -u origin main

# 4. Enable GitHub Pages
# Settings → Pages → Source: GitHub Actions

# 5. Update OAuth Client (Google Cloud Console)
# Add to Authorized origins: https://YOUR_USERNAME.github.io

# 6. Check deployment
# Actions tab → Deploy to GitHub Pages
# Wait 2-3 minutes
# Visit: https://YOUR_USERNAME.github.io/system-catalog/
```

---

## 🐛 แก้ปัญหาเบื้องต้น

### ❌ CORS Error
```bash
# เพิ่ม URL ของคุณใน backend.gs
ALLOWED_ORIGINS: [
  "http://localhost:8000",
  "https://YOUR_USERNAME.github.io"
]
# จากนั้น Deploy ใหม่
```

### ❌ OAuth Error
```bash
# เช็ค Authorized JavaScript origins ใน Google Cloud Console
# ต้องตรงกับ URL ที่คุณใช้
```

### ❌ API Error
```bash
# เช็ค Apps Script Execution Log
# ดูว่า email ของคุณอยู่ใน ALLOWED_USERS หรือไม่
```

---

## 📱 ทดสอบการทำงาน

1. ✅ เปิดหน้าเว็บ → Login ด้วย Google
2. ✅ Dashboard แสดงสถิติและกราฟ
3. ✅ สร้าง System ใหม่
4. ✅ แก้ไข System
5. ✅ สร้าง Requirement
6. ✅ ดูความคืบหน้า Requirements

---

## 🎉 เสร็จแล้ว!

ตอนนี้คุณมี System Catalog Dashboard ที่พร้อมใช้งานแล้ว

**Next Steps:**
- ปรับแต่ง UI/UX ตามความต้องการ
- เพิ่มฟีเจอร์ใหม่
- Invite ทีมมาใช้งาน

**Documentation:**
- [README.md](README.md) - Full documentation
- [CONFIG.md](CONFIG.md) - Detailed configuration
- [API_DOCUMENTATION.md](postman/API_DOCUMENTATION.md) - API reference

---

**Need Help?** Check [README.md](README.md) Troubleshooting section
