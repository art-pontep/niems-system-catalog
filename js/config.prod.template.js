/**
 * Configuration Template
 * Copy this file to config.js and fill in your values
 * 
 * INSTRUCTIONS:
 * 1. Copy this file: cp config.prod.template.js config.js
 * 2. Fill in your Google OAuth Client ID
 * 3. Fill in your Google Apps Script URL
 * 4. Never commit config.js to git!
 */

// Detect environment
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname.includes('local');

const CONFIG = {
    // Environment
    environment: isLocalhost ? 'development' : 'production',
    
    // Google OAuth Configuration
    google: {
        // Get this from: https://console.cloud.google.com/apis/credentials
        clientId: isLocalhost 
            ? 'YOUR_LOCAL_CLIENT_ID.apps.googleusercontent.com'  // For local development
            : 'YOUR_PRODUCTION_CLIENT_ID.apps.googleusercontent.com', // For production (GitHub Pages)
    },
    
    // API Configuration
    api: {
        // Your deployed Google Apps Script Web App URL
        // Get this from: Apps Script > Deploy > New deployment
        baseUrl: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
        timeout: 30000, // 30 seconds
        retryAttempts: 3,
        retryDelay: 1000, // 1 second
    },
    
    // Application Settings
    app: {
        name: 'System Catalog Dashboard',
        version: '1.0.0',
        debug: isLocalhost, // Enable debug logging in development
    },
    
    // UI Settings
    ui: {
        itemsPerPage: 10,
        animationDuration: 300,
        toastDuration: 3000,
    },
    
    // Cache Settings
    cache: {
        enabled: true,
        duration: 5 * 60 * 1000, // 5 minutes
        maxSize: 100, // Maximum number of cached items
    },
    
    // Feature Flags
    features: {
        enableCharts: true,
        enableExport: true,
        enableSearch: true,
        enableFilters: true,
    },
};

// Validation helper
CONFIG.validate = function() {
    const errors = [];
    
    if (this.google.clientId.includes('YOUR_')) {
        errors.push('Google Client ID not configured');
    }
    
    if (this.api.baseUrl.includes('YOUR_')) {
        errors.push('API Base URL not configured');
    }
    
    if (errors.length > 0) {
        console.error('⚠️ Configuration Errors:', errors);
        return false;
    }
    
    return true;
};

// Log current configuration (development only)
if (CONFIG.app.debug) {
    console.log('🔧 Current Configuration:', {
        environment: CONFIG.environment,
        apiUrl: CONFIG.api.baseUrl,
        debug: CONFIG.app.debug
    });
}

// Export for use in other modules
window.CONFIG = CONFIG;

// Freeze config to prevent modifications (after adding methods)
Object.freeze(CONFIG.google);
Object.freeze(CONFIG.api);
Object.freeze(CONFIG.app);
Object.freeze(CONFIG.ui);
Object.freeze(CONFIG.cache);
Object.freeze(CONFIG.features);
