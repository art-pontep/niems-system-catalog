# System Catalog Dashboard

> Single Page Web Application สำหรับจัดการข้อมูลระบบงาน (Systems) และความต้องการ (Requirements) โดยใช้ Google Apps Script เป็น Backend

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🎯 Features

### ✨ Core Features
- ✅ **Google OAuth Authentication** - เข้าสู่ระบบด้วย Google Account
- 📊 **Interactive Dashboard** - แสดงสถิติและกราฟแบบ Real-time
- 🖥️ **Systems Management** - จัดการข้อมูลระบบงาน (CRUD)
- 📋 **Requirements Management** - จัดการความต้องการ (CRUD)
- 🔍 **Advanced Filtering** - ค้นหา, กรอง, และเรียงลำดับข้อมูล
- 📈 **Progress Tracking** - ติดตามความคืบหน้าของแต่ละระบบ
- 🎨 **Responsive Design** - รองรับทุกขนาดหน้าจอ
- 🔒 **Secure API** - ป้องกันด้วย OAuth และ Rate Limiting

### 🎨 UI/UX
- Clean, Professional Interface ตาม Google Design
- Fully Responsive (Mobile, Tablet, Desktop)
- Interactive Charts with Chart.js
- Smooth Animations and Transitions
- Loading States and Error Handling

### 🏗️ Architecture
- **Clean Architecture** - แยก Business Logic จาก UI
- **Service Layer Pattern** - สำหรับ API calls
- **Component-Based** - แยกเป็น Components ที่ Reusable
- **Environment Detection** - แยก Config Local และ Production

## 📁 Project Structure

```
system-catalog/
├── index.html                          # Main HTML file
├── README.md                           # This file
├── CONFIG.md                           # Configuration guide
├── .gitignore                          # Git ignore rules
│
├── js/
│   ├── config.js                       # Configuration (local only, gitignored)
│   ├── config.prod.template.js         # Production template (for deployment)
│   ├── app.js                          # Main application logic
│   │
│   ├── services/
│   │   ├── auth.service.js             # Authentication service
│   │   └── api.service.js              # API service
│   │
│   └── components/
│       ├── charts.component.js         # Chart visualizations
│       ├── table.component.js          # Data tables
│       └── modal.component.js          # Create/Edit modals
│
├── backend/
│   ├── backend.gs                      # Google Apps Script (Backend API)
│   ├── _System Catalog - Systems.csv  # Sample data
│   └── _System Catalog - Requirements.csv
│
└── postman/
    └──System Catalog API.postman_collection.json
```

## 🚀 Quick Start

### Prerequisites
- Google Account
- Google Cloud Project with OAuth credentials
- Google Sheet with tabs: `systems`, `requirements`
- Python 3 (for local development) or any static HTTP server

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/system-catalog.git
cd system-catalog
```

### 2. Setup Google Apps Script Backend

1. Go to [Google Apps Script](https://script.google.com/)
2. Create new project
3. Copy code from `backend/backend.gs`
4. Update configuration:
   ```javascript
   SHEET_ID: "YOUR_GOOGLE_SHEET_ID"
   CLIENT_ID: "YOUR_OAUTH_CLIENT_ID"
   ALLOWED_USERS: ["your-email@gmail.com"]
   ALLOWED_ORIGINS: ["http://localhost:8000", "https://YOUR_DOMAIN"]
   ```
5. Deploy as Web App
6. Copy Web App URL

📖 **Detailed instructions:** See [CONFIG.md](CONFIG.md)

### 3. Setup OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 Client ID
3. Add authorized origins:
   - Local: `http://localhost:8000`
   - Production: `https://YOUR_GITHUB_USERNAME.github.io`
4. Copy Client ID

📖 **Detailed instructions:** See [CONFIG.md](CONFIG.md)

### 4. Configure Frontend

Create and edit `js/config.js`:
```bash
# Create config from template
cp js/config.prod.template.js js/config.js

# Edit the file
nano js/config.js
```

Update the following values:
```javascript
google: {
    clientId: isLocalhost 
        ? 'YOUR_LOCAL_CLIENT_ID.apps.googleusercontent.com'
        : 'YOUR_PRODUCTION_CLIENT_ID.apps.googleusercontent.com',
},

api: {
    baseUrl: isLocalhost
        ? 'YOUR_APPS_SCRIPT_WEB_APP_URL'
        : 'YOUR_APPS_SCRIPT_WEB_APP_URL',
},
```

**Note:** `config.js` is gitignored for security. Never commit it!

### 5. Run Locally (macOS)

```bash
# Method 1: Python
python3 -m http.server 8000

# Method 2: Node.js
npx http-server -p 8000

# Method 3: PHP
php -S localhost:8000

# Open browser
open http://localhost:8000
```

### 6. Deploy to GitHub Pages

```bash
# Initialize git (if not already)
git init

# Commit and push
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/system-catalog.git
git push -u origin main
```

**Setup GitHub Secrets (REQUIRED):**
1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:
   - Name: `GOOGLE_CLIENT_ID`
     - Value: Your production OAuth Client ID
   - Name: `GOOGLE_APPS_SCRIPT_URL`
     - Value: Your deployed Apps Script Web App URL

**Enable GitHub Pages:**
1. Go to repository **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Save

**Deploy:**
- GitHub Actions will automatically build and deploy on push to `main`
- Check **Actions** tab to monitor deployment
- Your app will be live at: `https://YOUR_USERNAME.github.io/system-catalog/`

**Security Note:**
- `js/config.js` is gitignored (local development only)
- Production uses `config.prod.template.js` with GitHub Secrets
- Never commit credentials to repository

## 🔧 Configuration

### Environment Detection

The app automatically detects environment:
- **Local:** `localhost` or `127.0.0.1`
- **Production:** Any other domain (e.g., GitHub Pages)

### Config File Structure

```javascript
const CONFIG = {
    environment: 'development' | 'production',  // Auto-detected
    
    google: {
        clientId: '...',  // Different for local/production
    },
    
    api: {
        baseUrl: '...',   // Google Apps Script URL
        timeout: 30000,
        retryAttempts: 3,
    },
    
    app: {
        debug: true,      // Enabled in development
    },
    
    cache: {
        enabled: true,
        duration: 300000, // 5 minutes
    },
};
```

## 📊 Data Structure

### Systems Sheet

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ID | String | Auto | Unique identifier (e.g., EXT-0001) |
| Name | String | ✅ | System name |
| Description | String | ❌ | System description |
| Business Owner | String | ❌ | Department/owner |
| Technical Owner | String | ❌ | Technical team |
| Overall Status | Enum | ❌ | active, in-develop, review, planing, retired |
| Category | Enum | ❌ | core, support, infrastructure |
| System Type | Enum | ❌ | internal, external |
| Go Live Date | Date | ❌ | Launch date |
| Goal | String | ❌ | System objective |

### Requirements Sheet

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ID | String | Auto | Unique identifier (e.g., REQ-0001) |
| System ID | String | ✅ | Related system ID |
| Title | String | ✅ | Requirement title |
| Type | Enum | ❌ | functional, non-functional |
| Priority | Enum | ❌ | high, medium, low |
| Status | Enum | ❌ | done, in-develop, pending |

## 🔒 Security Features

- ✅ Google OAuth 2.0 Authentication
- ✅ ID Token Validation on Backend
- ✅ CORS Protection with Whitelist
- ✅ Rate Limiting (30 requests/minute)
- ✅ Input Sanitization (XSS Prevention)
- ✅ Authorized Users Whitelist
- ✅ HTTPS Only in Production
- ✅ No Sensitive Data in Repository

## 🎨 Tech Stack

### Frontend
- HTML5
- JavaScript (ES6+)
- Tailwind CSS
- Chart.js
- Google Identity Services

### Backend
- Google Apps Script
- Google Sheets (Database)

### Deployment
- GitHub Pages (Frontend)
- Google Apps Script (Backend)

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 🧪 Testing

### Test with Postman

Import the Postman collection:
```
postman/System Catalog API.postman_collection.json
```

See [API Documentation](postman/API_DOCUMENTATION.md) for details.

### Manual Testing Checklist

- [ ] Login with Google Account
- [ ] View Dashboard statistics
- [ ] View charts (systems & requirements)
- [ ] Create new system
- [ ] Edit existing system
- [ ] Delete system
- [ ] Search/filter systems
- [ ] Create new requirement
- [ ] Edit existing requirement
- [ ] Delete requirement
- [ ] Search/filter requirements
- [ ] Logout

## 🐛 Troubleshooting

### CORS Errors

**Problem:** `No 'Access-Control-Allow-Origin' header`

**Solution:**
1. Check `ALLOWED_ORIGINS` in `backend.gs`
2. Add your domain (e.g., `https://your-username.github.io`)
3. Redeploy Apps Script
4. Clear browser cache

### OAuth Errors

**Problem:** `redirect_uri_mismatch`

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Edit OAuth Client ID
3. Add your domain to **Authorized JavaScript origins**
4. Wait 5 minutes and try again

### API Not Working

**Problem:** API calls return errors

**Solution:**
1. Check Apps Script execution log
2. Verify email in `ALLOWED_USERS`
3. Check `SHEET_ID` is correct
4. Verify sheet tabs exist: `systems`, `requirements`

### Data Not Loading

**Problem:** Empty tables or "No data" messages

**Solution:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Verify API URL in `config.js`
5. Test API with Postman

## 📖 Documentation

- [Configuration Guide](CONFIG.md)
- [API Documentation](postman/API_DOCUMENTATION.md)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 👨‍💻 Author

**Pontep Presha**

## 🙏 Acknowledgments

- Google Identity Services
- Tailwind CSS
- Chart.js
- Google Apps Script Community

## 📞 Support

For issues or questions:
1. Check [CONFIG.md](CONFIG.md) for setup issues
2. Check [API Documentation](postman/API_DOCUMENTATION.md)
3. Open an issue on GitHub

---

**Made with ❤️ for NIEMS**
