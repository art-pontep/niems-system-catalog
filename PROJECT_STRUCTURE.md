# 📁 System Catalog Dashboard - Complete Project Structure

```
system-catalog/
│
├── 📄 index.html                           # Main HTML entry point
├── 📖 README.md                            # Complete documentation
├── 🚀 QUICKSTART.md                        # Quick setup guide (5 min)
├── ⚙️  CONFIG.md                            # Detailed configuration guide
├── 📊 SHEETS_SETUP.md                      # Google Sheets setup guide
├── 🚫 .gitignore                           # Git ignore rules
│
├── 📂 .github/
│   └── workflows/
│       └── deploy.yml                      # GitHub Actions (Auto-deploy)
│
├── 📂 js/
│   ├── config.js                           # Configuration (Environment-aware) - Local only
│   ├── config.prod.template.js             # Production config template (for deployment)
│   ├── app.js                              # Main application logic
│   │
│   ├── 📂 services/
│   │   ├── auth.service.js                 # Google OAuth authentication
│   │   └── api.service.js                  # API calls with retry & cache
│   │
│   └── 📂 components/
│       ├── charts.component.js             # Chart.js visualizations
│       ├── table.component.js              # Data tables with filters
│       └── modal.component.js              # Create/Edit modals
│
├── 📂 backend/
│   ├── backend.gs                          # Google Apps Script (REST API)
│   ├── _System Catalog - Systems.csv       # Sample systems data
│   └── _System Catalog - Requirements.csv  # Sample requirements data
│
├── 📂 postman/
│   ├── System Catalog API.postman_collection.json      # Postman collection
│   └── API_DOCUMENTATION.md                            # Sample requirements data
│
└── 🔧 start-dev.sh                         # Local development server script

```

---

## 📦 File Descriptions

### 🌐 Frontend Files

#### `index.html`
- Main HTML file
- Single Page Application (SPA)
- Includes all CSS (Tailwind CDN) and JS files
- Responsive layout for mobile/tablet/desktop
- Features:
  - Loading screen
  - Login screen with Google OAuth
  - Main dashboard with navigation
  - Dynamic content areas for each view
  - Modal for create/edit forms

#### `js/config.js`
- **Configuration for local development** (gitignored)
- **Auto-detects environment** (local vs production)
- Configurable settings:
  - Google OAuth Client ID (separate for local/production)
  - API Base URL (Google Apps Script)
  - Cache settings
  - Debug mode
  - `validate()` function for config validation
- **Environment detection:**
  - Local: `localhost` or `127.0.0.1`
  - Production: GitHub Pages or custom domain
- **Note:** This file is NOT committed to Git for security

#### `js/config.prod.template.js`
- **Production configuration template**
- Used by GitHub Actions during deployment
- Placeholders are replaced with GitHub Secrets:
  - `YOUR_PRODUCTION_CLIENT_ID` → `GOOGLE_CLIENT_ID`
  - `YOUR_DEPLOYMENT_ID` → `GOOGLE_APPS_SCRIPT_URL`
- Includes `validate()` function
- Generates `config.js` in production build

#### `js/app.js`
- Main application controller
- **Responsibilities:**
  - Initialize application
  - Handle authentication state
  - Manage navigation between views
  - Load and cache data
  - CRUD operations orchestration
  - Error handling
- **Views managed:**
  - Dashboard (statistics & charts)
  - Systems (table with CRUD)
  - Requirements (table with CRUD)

---

### 🔐 Services Layer

#### `js/services/auth.service.js`
- Google Sign-In integration
- **Features:**
  - Initialize Google Identity Services
  - Handle OAuth credential response
  - Parse and validate JWT tokens
  - Session management (sessionStorage)
  - Auto-restore sessions
  - Token expiry detection
  - Logout functionality

#### `js/services/api.service.js`
- RESTful API client for backend
- **Features:**
  - Authenticated requests (includes idToken)
  - Automatic retry on failure (3 attempts)
  - Response caching (5 min)
  - Error handling
  - Health check
- **CRUD Methods:**
  - Systems: `getSystems()`, `getSystemById()`, `createSystem()`, `updateSystem()`, `deleteSystem()`
  - Requirements: `getRequirements()`, `getRequirementById()`, `createRequirement()`, `updateRequirement()`, `deleteRequirement()`

---

### 🎨 Components

#### `js/components/charts.component.js`
- Data visualization using Chart.js
- **Charts:**
  - Systems by Status (Doughnut chart)
  - Requirements by Status (Bar chart)
- **Features:**
  - Auto-update on data change
  - Responsive sizing
  - Custom colors per status
  - Percentage calculations
  - Interactive tooltips

#### `js/components/table.component.js`
- Data table rendering
- **Features:**
  - Responsive tables with horizontal scroll
  - Status badges with colors
  - Priority indicators
  - Empty state handling
  - XSS protection (HTML escaping)
- **Tables:**
  - Systems table
  - Requirements table
  - Systems overview with progress bars

#### `js/components/modal.component.js`
- Create/Edit modals
- **Features:**
  - Dynamic form generation
  - Form validation
  - Edit mode detection
  - Async data loading
  - Success/Error notifications
- **Forms:**
  - System form (10 fields)
  - Requirement form (6 fields)

---

### 🖥️ Backend (Google Apps Script)

#### `backend/backend.gs`
- **Google Apps Script REST API** (828 lines)
- **Configuration:**
  - Sheet ID
  - OAuth Client ID
  - Allowed users (whitelist)
  - Allowed origins (CORS)
  - Rate limiting settings
  - Debug mode
- **Endpoints:**
  - `GET /?action=health` - Health check
  - `POST /` with JSON body - CRUD operations
- **Features:**
  - OAuth token validation
  - Rate limiting (30 req/min, 500 req/hour)
  - Input sanitization (XSS prevention)
  - Auto-generate IDs (EXT-0001, INT-0001, REQ-0001)
  - Auto-timestamp (Created Date, Last Updated)
  - Auto-user tracking (Created By, Last Updated By)
  - Error handling with detailed messages
- **Supported Sheets:**
  - `systems`
  - `requirements`
  - `documents` (optional)

---

### 📚 Documentation

#### `README.md`
- **Complete project documentation**
- Sections:
  - Features overview
  - Project structure
  - Quick start guide
  - Configuration instructions
  - Data structure definitions
  - Security features
  - Tech stack
  - Browser support
  - Testing guide
  - Troubleshooting
  - Contributing guidelines

#### `QUICKSTART.md`
- **5-minute setup guide**
- Step-by-step instructions:
  1. Setup Google Apps Script (2 min)
  2. Setup OAuth credentials (2 min)
  3. Configure frontend (1 min)
  4. Run locally
  5. Deploy to GitHub Pages

#### `CONFIG.md`
- **Detailed configuration guide**
- Covers:
  - Google OAuth setup (with screenshots)
  - Apps Script deployment
  - Environment variables
  - Security best practices
  - Troubleshooting CORS/OAuth issues

#### `SHEETS_SETUP.md`
- **Google Sheets setup guide**
- Includes:
  - Sheet structure
  - Column definitions
  - Data validation rules
  - Sample data
  - Import instructions

---

### 🧪 Testing & API

#### `postman/System Catalog API.postman_collection.json`
- **Complete Postman collection** (15+ requests)
- Request groups:
  - Health Check (GET/POST)
  - Systems CRUD (5 requests)
  - Requirements CRUD (4 requests)
- Environment variables:
  - `{{BASE_URL}}`
  - `{{ID_TOKEN}}`

---

### 🚀 Deployment

#### `.github/workflows/deploy.yml`
- **GitHub Actions workflow**
- Auto-deploy to GitHub Pages on push to `main`
- Steps:
  1. Checkout code
  2. Setup Pages
  3. Upload artifact
  4. Deploy to Pages

#### `start-dev.sh`
- **Local development server script** (macOS/Linux)
- Auto-detects available server:
  - Python 3
  - Python 2
  - PHP
  - Node.js (http-server)
- Port check (prevents conflicts)
- Usage: `./start-dev.sh`

#### `.gitignore`
- Prevents committing:
  - Sensitive config (`js/config.js`, `.env`)
  - OS files (`.DS_Store`, `Thumbs.db`)
  - IDE files (`.vscode/`, `.idea/`)
  - Logs and temp files
  - Node modules and dependencies

---

## 🔑 Key Features Summary

### Authentication & Security
- ✅ Google OAuth 2.0
- ✅ JWT token validation
- ✅ Session management
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Input sanitization
- ✅ User whitelist

### Data Management
- ✅ Real-time CRUD operations
- ✅ Auto-generated IDs
- ✅ Auto-timestamps
- ✅ Data validation
- ✅ Response caching
- ✅ Error handling

### User Interface
- ✅ Responsive design (Mobile/Tablet/Desktop)
- ✅ Dashboard with statistics
- ✅ Interactive charts
- ✅ Searchable tables
- ✅ Filterable data
- ✅ Modal forms
- ✅ Loading states
- ✅ Error messages

### Developer Experience
- ✅ Clean Architecture
- ✅ Component-based
- ✅ Service layer pattern
- ✅ Environment detection
- ✅ Debug mode
- ✅ Complete documentation
- ✅ Postman collection
- ✅ One-command deployment

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │              index.html (SPA)                     │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │  │
│  │  │Dashboard │  │ Systems  │  │Requirements│       │  │
│  │  └──────────┘  └──────────┘  └──────────┘         │  │
│  └────────┬──────────────────────────────────────────┘  │
│           │                                             │
│  ┌────────▼──────────────────────────────────────────┐  │
│  │         Services Layer                            │  │
│  │  ┌────────────┐       ┌────────────┐              │  │
│  │  │   Auth     │       │    API     │              │  │
│  │  │  Service   │       │  Service   │              │  │
│  │  └────────────┘       └────────────┘              │  │
│  └────────┬──────────────────┬───────────────────────┘  │
└───────────┼──────────────────┼──────────────────────────┘
            │                  │
            │ OAuth            │ REST API
            │                  │
┌───────────▼──────────────────▼─────────────────────────┐
│         Google Cloud Platform                          │
│  ┌──────────────┐      ┌──────────────────────────┐    │
│  │   Identity   │      │   Google Apps Script     │    │
│  │   Services   │      │   (backend.gs)           │    │
│  └──────────────┘      └──────────┬───────────────┘    │
│                                   │                    │
│                        ┌──────────▼───────────────┐    │
│                        │   Google Sheets          │    │
│                        │   (Database)             │    │
│                        └──────────────────────────┘    │
└────────────────────────────────────────────────────────┘
```

---

## 🎯 Use Cases

### 1. View Dashboard
```
User → Login → Dashboard → See statistics & charts
```

### 2. Create System
```
User → Systems → Add System → Fill form → Save → API → Sheet → Success
```

### 3. Track Progress
```
User → Dashboard → View system → See requirements completion %
```

### 4. Filter Data
```
User → Requirements → Search/Filter → See filtered results
```

---

## 💡 Best Practices Implemented

1. **Separation of Concerns**
   - UI logic separated from business logic
   - Service layer for API communication
   - Components are reusable

2. **Security First**
   - No sensitive data in repository
   - Environment-based configuration
   - OAuth authentication
   - Input validation and sanitization

3. **User Experience**
   - Loading states
   - Error handling
   - Responsive design
   - Smooth animations

4. **Developer Experience**
   - Clear documentation
   - Quick start guide
   - Debug mode
   - Development scripts

5. **Code Quality**
   - Consistent naming conventions
   - Comments and JSDoc
   - Error handling
   - Code reusability

---

## 📝 Next Steps After Setup

1. ✅ Test all CRUD operations
2. ✅ Import sample data
3. ✅ Customize branding/colors
4. ✅ Add more fields if needed
5. ✅ Invite team members
6. ✅ Setup monitoring
7. ✅ Create backup strategy

---

**Created with ❤️ for NIEMS**
