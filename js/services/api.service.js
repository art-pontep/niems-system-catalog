/**
 * API Service
 * Handles all API calls to Google Apps Script backend
 */

class ApiService {
    constructor() {
        this.baseUrl = CONFIG.api.baseUrl;
        this.cache = new Map();
        this.requestQueue = [];
        this.isProcessing = false;
    }

    /**
     * Make API request with authentication
     */
    async request(method, sheet, data = null) {
        try {
            // Get authentication token
            const idToken = authService.getIdToken();
            if (!idToken) {
                throw new Error('Not authenticated');
            }

            // Prepare request body
            const requestBody = {
                method: method.toUpperCase(),
                sheet: sheet,
                idToken: idToken,
            };

            // Add data if provided
            if (data) {
                requestBody.data = data;
            }

            // Make request
            const response = await this.fetch(requestBody);
            
            // Clear cache for this sheet after modifications
            if (['POST', 'PUT', 'DELETE'].includes(method.toUpperCase())) {
                this.clearCache(sheet);
            }

            return response;

        } catch (error) {
            console.error(`API Error [${method} ${sheet}]:`, error);
            throw error;
        }
    }

    /**
     * Fetch with retry logic
     * Use simple POST request to avoid CORS preflight (like Postman)
     */
    async fetch(body, retryCount = 0) {
        try {
            // Use simple request without custom headers to avoid CORS preflight
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                // Don't set Content-Type header - let browser set it automatically
                // This makes it a "simple request" that doesn't trigger OPTIONS preflight
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Check for error in response
            if (data.error) {
                throw new Error(data.error);
            }

            return data;

        } catch (error) {
            // Retry logic
            if (retryCount < CONFIG.api.retryAttempts) {
                console.warn(`Request failed, retrying... (${retryCount + 1}/${CONFIG.api.retryAttempts})`);
                await this.delay(CONFIG.api.retryDelay * (retryCount + 1));
                return this.fetch(body, retryCount + 1);
            }

            throw error;
        }
    }

    /**
     * Health check - Use GET to avoid CORS preflight
     */
    async healthCheck() {
        try {
            // Use GET request (simple request, no preflight)
            const response = await fetch(this.baseUrl + '?action=health', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Health check failed:', error);
            throw error;
        }
    }

    /* ========================================================================
       SYSTEMS CRUD
       ======================================================================== */

    /**
     * Get all systems
     */
    async getSystems(filters = null) {
        const cacheKey = `systems_${JSON.stringify(filters || {})}`;
        
        // Check cache
        if (CONFIG.cache.enabled && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < CONFIG.cache.duration) {
                if (CONFIG.app.debug) {
                    console.log('📦 Returning cached systems');
                }
                return cached.data;
            }
        }

        try {
            const response = await this.request('GET', 'systems', filters);
            
            if (CONFIG.app.debug) {
                console.log('📥 Raw response:', response);
            }
            
            // Handle different response structures
            let data = [];
            
            // Format 1: Direct array
            if (Array.isArray(response)) {
                data = response;
            }
            // Format 2: Nested data (response.data.data)
            else if (response && response.data && Array.isArray(response.data.data)) {
                data = response.data.data;
                if (CONFIG.app.debug) {
                    console.log('📊 Total records:', response.data.total);
                }
            }
            // Format 3: Single level (response.data)
            else if (response && Array.isArray(response.data)) {
                data = response.data;
            }
            // Format 4: Success response (response.status + response.data)
            else if (response && response.status === 'success' && response.data) {
                if (Array.isArray(response.data.data)) {
                    data = response.data.data;
                } else if (Array.isArray(response.data)) {
                    data = response.data;
                }
            }
            // Unknown format
            else {
                console.warn('⚠️ Unexpected response structure:', response);
                data = [];
            }

            if (CONFIG.app.debug) {
                console.log('✅ Systems loaded:', data.length);
            }

            // Cache the result
            if (CONFIG.cache.enabled) {
                this.cache.set(cacheKey, {
                    data: data,
                    timestamp: Date.now(),
                });
            }

            return data;
        } catch (error) {
            console.error('❌ Failed to get systems:', error);
            throw error;
        }
    }

    /**
     * Get system by ID
     */
    async getSystemById(id) {
        const systems = await this.getSystems({ ID: id });
        return systems.length > 0 ? systems[0] : null;
    }

    /**
     * Create new system
     */
    async createSystem(systemData) {
        // Validate required fields
        if (!systemData.Name) {
            throw new Error('System name is required');
        }

        const response = await this.request('POST', 'systems', systemData);
        
        // Handle nested response
        if (response && response.data && response.data.data) {
            return response.data.data;
        } else if (response && response.data) {
            return response.data;
        }
        return response;
    }

    /**
     * Update system
     */
    async updateSystem(id, systemData) {
        if (!id) {
            throw new Error('System ID is required');
        }

        const updateData = {
            ID: id,
            ...systemData,
        };

        const response = await this.request('PUT', 'systems', updateData);
        
        // Handle nested response
        if (response && response.data && response.data.data) {
            return response.data.data;
        } else if (response && response.data) {
            return response.data;
        }
        return response;
    }

    /**
     * Delete system
     */
    async deleteSystem(id) {
        if (!id) {
            throw new Error('System ID is required');
        }

        const response = await this.request('DELETE', 'systems', { ID: id });
        
        // Handle nested response
        if (response && response.data && response.data.data) {
            return response.data.data;
        } else if (response && response.data) {
            return response.data;
        }
        return response;
    }

    /* ========================================================================
       REQUIREMENTS CRUD
       ======================================================================== */

    /**
     * Get all requirements
     */
    async getRequirements(filters = null) {
        const cacheKey = `requirements_${JSON.stringify(filters || {})}`;
        
        // Check cache
        if (CONFIG.cache.enabled && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < CONFIG.cache.duration) {
                if (CONFIG.app.debug) {
                    console.log('📦 Returning cached requirements');
                }
                return cached.data;
            }
        }

        try {
            const response = await this.request('GET', 'requirements', filters);
            
            if (CONFIG.app.debug) {
                console.log('📥 Raw response:', response);
            }
            
            // Handle different response structures
            let data = [];
            
            // Format 1: Direct array
            if (Array.isArray(response)) {
                data = response;
            }
            // Format 2: Nested data (response.data.data)
            else if (response && response.data && Array.isArray(response.data.data)) {
                data = response.data.data;
                if (CONFIG.app.debug) {
                    console.log('📊 Total records:', response.data.total);
                }
            }
            // Format 3: Single level (response.data)
            else if (response && Array.isArray(response.data)) {
                data = response.data;
            }
            // Format 4: Success response (response.status + response.data)
            else if (response && response.status === 'success' && response.data) {
                if (Array.isArray(response.data.data)) {
                    data = response.data.data;
                } else if (Array.isArray(response.data)) {
                    data = response.data;
                }
            }
            // Unknown format
            else {
                console.warn('⚠️ Unexpected response structure:', response);
                data = [];
            }

            if (CONFIG.app.debug) {
                console.log('✅ Requirements loaded:', data.length);
            }

            // Cache the result
            if (CONFIG.cache.enabled) {
                this.cache.set(cacheKey, {
                    data: data,
                    timestamp: Date.now(),
                });
            }

            return data;
        } catch (error) {
            console.error('❌ Failed to get requirements:', error);
            throw error;
        }
    }

    /**
     * Get requirement by ID
     */
    async getRequirementById(id) {
        const requirements = await this.getRequirements({ ID: id });
        return requirements.length > 0 ? requirements[0] : null;
    }

    /**
     * Get requirements by System ID
     */
    async getRequirementsBySystemId(systemId) {
        return await this.getRequirements({ 'System ID': systemId });
    }

    /**
     * Create new requirement
     */
    async createRequirement(requirementData) {
        // Validate required fields
        if (!requirementData.Title) {
            throw new Error('Requirement title is required');
        }

        const response = await this.request('POST', 'requirements', requirementData);
        
        // Handle nested response
        if (response && response.data && response.data.data) {
            return response.data.data;
        } else if (response && response.data) {
            return response.data;
        }
        return response;
    }

    /**
     * Update requirement
     */
    async updateRequirement(id, requirementData) {
        if (!id) {
            throw new Error('Requirement ID is required');
        }

        const updateData = {
            ID: id,
            ...requirementData,
        };

        const response = await this.request('PUT', 'requirements', updateData);
        
        // Handle nested response
        if (response && response.data && response.data.data) {
            return response.data.data;
        } else if (response && response.data) {
            return response.data;
        }
        return response;
    }

    /**
     * Delete requirement
     */
    async deleteRequirement(id) {
        if (!id) {
            throw new Error('Requirement ID is required');
        }

        const response = await this.request('DELETE', 'requirements', { ID: id });
        
        // Handle nested response
        if (response && response.data && response.data.data) {
            return response.data.data;
        } else if (response && response.data) {
            return response.data;
        }
        return response;
    }

    /* ========================================================================
       UTILITY METHODS
       ======================================================================== */

    /**
     * Clear cache
     */
    clearCache(sheet = null) {
        if (sheet) {
            // Clear cache for specific sheet
            for (const [key] of this.cache.entries()) {
                if (key.startsWith(sheet)) {
                    this.cache.delete(key);
                }
            }
        } else {
            // Clear all cache
            this.cache.clear();
        }

        if (CONFIG.app.debug) {
            console.log(`🗑️ Cache cleared${sheet ? ` for ${sheet}` : ''}`);
        }
    }

    /**
     * Delay helper
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
}

// Create singleton instance
window.apiService = new ApiService();
