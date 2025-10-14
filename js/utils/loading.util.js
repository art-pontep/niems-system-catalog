/**
 * Loading Utility
 * Provides loading overlays, spinners, and skeleton screens
 */

class LoadingUtil {
    constructor() {
        this.overlayId = 'globalLoadingOverlay';
        this.isGlobalLoading = false;
    }

    /**
     * Show global loading overlay
     */
    show(message = 'กำลังโหลด...', subMessage = 'กรุณารอสักครู่') {
        this.isGlobalLoading = true;
        
        // Remove existing overlay if any
        this.hide();

        const overlay = document.createElement('div');
        overlay.id = this.overlayId;
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl p-8 max-w-sm mx-4 transform transition-all">
                <div class="flex flex-col items-center">
                    <!-- Spinner -->
                    <div class="relative w-16 h-16 mb-4">
                        <div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                        <div class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    
                    <!-- Message -->
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">${this.escapeHtml(message)}</h3>
                    <p class="text-sm text-gray-500">${this.escapeHtml(subMessage)}</p>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    /**
     * Hide global loading overlay
     */
    hide() {
        const overlay = document.getElementById(this.overlayId);
        if (overlay) {
            overlay.remove();
        }
        this.isGlobalLoading = false;
    }

    /**
     * Show loading on specific element
     * Returns cleanup function
     */
    showElement(element, message = 'กำลังโหลด...') {
        if (!element) return () => {};

        // Store original content
        const originalContent = element.innerHTML;
        const originalDisabled = element.disabled;

        // Disable element
        element.disabled = true;

        // Add loading spinner
        element.innerHTML = `
            <span class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ${this.escapeHtml(message)}
            </span>
        `;

        // Return cleanup function
        return () => {
            element.innerHTML = originalContent;
            element.disabled = originalDisabled;
        };
    }

    /**
     * Show skeleton loading for tables
     */
    showSkeleton(containerId, rows = 5) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const skeletonRows = Array(rows).fill(0).map(() => `
            <tr class="animate-pulse">
                <td class="px-4 py-4"><div class="h-4 bg-gray-200 rounded w-20"></div></td>
                <td class="px-4 py-4"><div class="h-4 bg-gray-200 rounded w-40"></div></td>
                <td class="px-4 py-4"><div class="h-4 bg-gray-200 rounded w-32"></div></td>
                <td class="px-4 py-4"><div class="h-4 bg-gray-200 rounded w-32"></div></td>
                <td class="px-4 py-4"><div class="h-4 bg-gray-200 rounded w-24"></div></td>
                <td class="px-4 py-4"><div class="h-4 bg-gray-200 rounded w-24"></div></td>
                <td class="px-4 py-4"><div class="h-4 bg-gray-200 rounded w-20"></div></td>
            </tr>
        `).join('');

        container.innerHTML = `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left"><div class="h-4 bg-gray-300 rounded w-16 animate-pulse"></div></th>
                            <th class="px-4 py-3 text-left"><div class="h-4 bg-gray-300 rounded w-20 animate-pulse"></div></th>
                            <th class="px-4 py-3 text-left"><div class="h-4 bg-gray-300 rounded w-24 animate-pulse"></div></th>
                            <th class="px-4 py-3 text-left"><div class="h-4 bg-gray-300 rounded w-24 animate-pulse"></div></th>
                            <th class="px-4 py-3 text-left"><div class="h-4 bg-gray-300 rounded w-16 animate-pulse"></div></th>
                            <th class="px-4 py-3 text-left"><div class="h-4 bg-gray-300 rounded w-20 animate-pulse"></div></th>
                            <th class="px-4 py-3 text-left"><div class="h-4 bg-gray-300 rounded w-16 animate-pulse"></div></th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${skeletonRows}
                    </tbody>
                </table>
            </div>
        `;
    }

    /**
     * Execute async function with loading overlay
     */
    async withLoading(asyncFn, options = {}) {
        const {
            message = 'กำลังโหลด...',
            subMessage = 'Please wait',
            showToastOnError = true
        } = options;

        try {
            this.show(message, subMessage);
            const result = await asyncFn();
            return result;
        } catch (error) {
            console.error('Error in withLoading:', error);
            
            if (showToastOnError && window.toastUtil) {
                toastUtil.error(error.message || 'An error occurred');
            }
            
            throw error;
        } finally {
            this.hide();
        }
    }

    /**
     * Execute async function with element loading
     */
    async withElementLoading(element, asyncFn, message = 'Loading...') {
        const cleanup = this.showElement(element, message);
        
        try {
            const result = await asyncFn();
            return result;
        } finally {
            cleanup();
        }
    }

    /**
     * Show loading bar at top of page
     */
    showProgressBar() {
        // Remove existing bar
        this.hideProgressBar();

        const bar = document.createElement('div');
        bar.id = 'loadingProgressBar';
        bar.className = 'fixed top-0 left-0 right-0 h-1 bg-blue-600 z-50 animate-pulse';
        bar.style.animation = 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite';
        
        document.body.appendChild(bar);
    }

    /**
     * Hide loading bar
     */
    hideProgressBar() {
        const bar = document.getElementById('loadingProgressBar');
        if (bar) {
            bar.remove();
        }
    }

    /**
     * Show inline spinner
     */
    createInlineSpinner(size = 'md') {
        const sizes = {
            sm: 'w-4 h-4',
            md: 'w-6 h-6',
            lg: 'w-8 h-8'
        };

        return `
            <svg class="animate-spin ${sizes[size] || sizes.md} text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        `;
    }

    /**
     * Show loading card placeholder
     */
    showCardSkeleton(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div class="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div class="space-y-3">
                    <div class="h-4 bg-gray-200 rounded"></div>
                    <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div class="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
            </div>
        `;
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Check if global loading is active
     */
    isLoading() {
        return this.isGlobalLoading;
    }
}

// Create singleton instance
window.loadingUtil = new LoadingUtil();
