/**
 * Configuration File
 * Separate config for local development and production deployment
 */

// Detect environment
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname.includes('local');

const CONFIG = {
    // Environment
    environment: isLocalhost ? 'development' : 'production',
    
    // Google OAuth Configuration
    // ⚠️ IMPORTANT: Replace these with your actual values
    google: {
        // Get this from Google Cloud Console
        clientId: isLocalhost 
            ? 'YOUR_LOCAL_CLIENT_ID.apps.googleusercontent.com'  // For local development
            : 'YOUR_PRODUCTION_CLIENT_ID.apps.googleusercontent.com', // For GitHub Pages
    },
    
    // API Configuration
    api: {
        // Your deployed Google Apps Script URL
        baseUrl: isLocalhost
            ? 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec'  // Same URL for both environments
            : 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec', // Apps Script URL doesn't change
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