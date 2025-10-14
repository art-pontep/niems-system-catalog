/**
 * Authentication Service
 * Handles Google Sign-In and token management
 */

class AuthService {
    constructor() {
        this.user = null;
        this.idToken = null;
        this.tokenExpiresAt = null;
        this.initialized = false;
    }

    /**
     * Initialize Google Sign-In
     */
    async init() {
        return new Promise((resolve, reject) => {
            if (this.initialized) {
                resolve(true);
                return;
            }

            // Validate configuration
            if (!CONFIG.validate()) {
                reject(new Error('Invalid configuration. Please update config.js with your credentials.'));
                return;
            }

            // Load Google Identity Services
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                try {
                    // Initialize Google Sign-In
                    google.accounts.id.initialize({
                        client_id: CONFIG.google.clientId,
                        callback: (response) => this.handleCredentialResponse(response),
                        auto_select: false,
                        cancel_on_tap_outside: true,
                    });

                    // Render the sign-in button
                    google.accounts.id.renderButton(
                        document.getElementById('googleSignInButton'),
                        {
                            theme: 'outline',
                            size: 'large',
                            text: 'signin_with',
                            shape: 'rectangular',
                            width: 300,
                        }
                    );

                    // Try auto sign-in
                    google.accounts.id.prompt((notification) => {
                        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                            // User is not signed in or skipped
                            console.log('Auto sign-in skipped');
                        }
                    });

                    this.initialized = true;
                    resolve(true);
                } catch (error) {
                    console.error('Failed to initialize Google Sign-In:', error);
                    reject(error);
                }
            };

            script.onerror = () => {
                reject(new Error('Failed to load Google Sign-In SDK'));
            };

            document.head.appendChild(script);
        });
    }

    /**
     * Handle credential response from Google
     */
    handleCredentialResponse(response) {
        try {
            // Decode JWT token
            const credential = response.credential;
            const payload = this.parseJwt(credential);

            // Store user info
            this.user = {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                emailVerified: payload.email_verified,
            };

            this.idToken = credential;
            
            // Token expires in 1 hour (standard Google ID token)
            this.tokenExpiresAt = Date.now() + (3600 * 1000);

            // Store in sessionStorage
            sessionStorage.setItem('user', JSON.stringify(this.user));
            sessionStorage.setItem('idToken', this.idToken);
            sessionStorage.setItem('tokenExpiresAt', this.tokenExpiresAt);

            // Log success
            if (CONFIG.app.debug) {
                console.log('✅ Signed in successfully:', this.user.email);
            }

            // Trigger login event
            window.dispatchEvent(new CustomEvent('auth:login', { detail: this.user }));

        } catch (error) {
            console.error('Failed to handle credential response:', error);
            this.showError('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
        }
    }

    /**
     * Parse JWT token
     */
    parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Failed to parse JWT:', error);
            throw new Error('Invalid token format');
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        // Check if token exists and is not expired
        if (!this.idToken || !this.tokenExpiresAt) {
            // Try to restore from sessionStorage
            this.restoreSession();
        }

        if (!this.idToken) {
            return false;
        }

        // Check if token is expired
        if (Date.now() >= this.tokenExpiresAt) {
            console.warn('Token expired');
            this.logout();
            return false;
        }

        return true;
    }

    /**
     * Restore session from sessionStorage
     */
    restoreSession() {
        try {
            const storedUser = sessionStorage.getItem('user');
            const storedToken = sessionStorage.getItem('idToken');
            const storedExpiry = sessionStorage.getItem('tokenExpiresAt');

            if (storedUser && storedToken && storedExpiry) {
                this.user = JSON.parse(storedUser);
                this.idToken = storedToken;
                this.tokenExpiresAt = parseInt(storedExpiry);

                // Check if still valid
                if (Date.now() >= this.tokenExpiresAt) {
                    this.logout();
                    return false;
                }

                if (CONFIG.app.debug) {
                    console.log('✅ Session restored:', this.user.email);
                }
                return true;
            }
        } catch (error) {
            console.error('Failed to restore session:', error);
        }
        return false;
    }

    /**
     * Get current user
     */
    getUser() {
        if (!this.isAuthenticated()) {
            return null;
        }
        return this.user;
    }

    /**
     * Get ID token
     */
    getIdToken() {
        if (!this.isAuthenticated()) {
            return null;
        }
        return this.idToken;
    }

    /**
     * Sign out
     */
    logout() {
        // Clear stored data
        this.user = null;
        this.idToken = null;
        this.tokenExpiresAt = null;

        // Clear sessionStorage
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('idToken');
        sessionStorage.removeItem('tokenExpiresAt');

        // Sign out from Google
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
            google.accounts.id.disableAutoSelect();
        }

        if (CONFIG.app.debug) {
            console.log('👋 Signed out successfully');
        }

        // Trigger logout event
        window.dispatchEvent(new CustomEvent('auth:logout'));

        // Reload page to show login screen
        window.location.reload();
    }

    /**
     * Show error message
     */
    showError(message) {
        if (window.toastUtil) {
            toastUtil.error(message, 6000);
        } else {
            alert(message);
        }
    }

    /**
     * Get token expiry time remaining (in seconds)
     */
    getTokenTimeRemaining() {
        if (!this.tokenExpiresAt) {
            return 0;
        }
        return Math.max(0, Math.floor((this.tokenExpiresAt - Date.now()) / 1000));
    }

    /**
     * Check if token will expire soon (within 5 minutes)
     */
    isTokenExpiringSoon() {
        const timeRemaining = this.getTokenTimeRemaining();
        return timeRemaining > 0 && timeRemaining < 300; // 5 minutes
    }
}

// Create singleton instance
window.authService = new AuthService();
