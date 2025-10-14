/**
 * Toast Notification Utility
 * Modern toast notifications for success, error, warning, info
 */

class ToastUtil {
    constructor() {
        this.container = null;
        this.init();
    }

    /**
     * Initialize toast container
     */
    init() {
        // Create toast container if not exists
        if (!document.getElementById('toastContainer')) {
            const container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none';
            container.style.maxWidth = '400px';
            document.body.appendChild(container);
            this.container = container;
        } else {
            this.container = document.getElementById('toastContainer');
        }
    }

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Type: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duration in ms (0 = no auto-close)
     */
    show(message, type = 'info', duration = 4000) {
        if (!this.container) this.init();

        const toast = this.createToast(message, type);
        this.container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
            toast.classList.add('translate-x-0', 'opacity-100');
        });

        // Auto close
        if (duration > 0) {
            setTimeout(() => {
                this.closeToast(toast);
            }, duration);
        }

        return toast;
    }

    /**
     * Create toast element
     */
    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `
            toast-item pointer-events-auto
            flex items-start gap-3 p-4 rounded-lg shadow-lg
            transform transition-all duration-300 ease-out
            translate-x-full opacity-0
            ${this.getTypeClasses(type)}
        `.trim().replace(/\s+/g, ' ');

        const icon = this.getIcon(type);
        const bgColor = this.getBackgroundColor(type);

        toast.innerHTML = `
            <div class="flex-shrink-0 w-6 h-6">
                ${icon}
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white break-words">
                    ${this.escapeHtml(message)}
                </p>
            </div>
            <button 
                onclick="toastUtil.closeToast(this.closest('.toast-item'))" 
                class="flex-shrink-0 text-white/80 hover:text-white transition-colors"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;

        return toast;
    }

    /**
     * Close toast
     */
    closeToast(toast) {
        if (!toast) return;

        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-full', 'opacity-0');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    /**
     * Get type-specific classes
     */
    getTypeClasses(type) {
        const classes = {
            'success': 'bg-gradient-to-r from-green-500 to-green-600',
            'error': 'bg-gradient-to-r from-red-500 to-red-600',
            'warning': 'bg-gradient-to-r from-orange-500 to-orange-600',
            'info': 'bg-gradient-to-r from-blue-500 to-blue-600',
        };
        return classes[type] || classes.info;
    }

    /**
     * Get background color (for backdrop)
     */
    getBackgroundColor(type) {
        const colors = {
            'success': 'bg-green-500',
            'error': 'bg-red-500',
            'warning': 'bg-orange-500',
            'info': 'bg-blue-500',
        };
        return colors[type] || colors.info;
    }

    /**
     * Get icon SVG
     */
    getIcon(type) {
        const icons = {
            'success': `
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `,
            'error': `
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `,
            'warning': `
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            `,
            'info': `
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `,
        };
        return icons[type] || icons.info;
    }

    /**
     * Shorthand methods
     */
    success(message, duration = 4000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 4000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 4000) {
        return this.show(message, 'info', duration);
    }

    /**
     * Show promise toast (loading -> success/error)
     */
    async promise(promise, messages = {}) {
        const {
            loading = 'กำลังดำเนินการ...',
            success = 'สำเร็จ!',
            error = 'เกิดข้อผิดพลาด'
        } = messages;

        const loadingToast = this.show(loading, 'info', 0);

        try {
            const result = await promise;
            this.closeToast(loadingToast);
            this.success(success);
            return result;
        } catch (err) {
            this.closeToast(loadingToast);
            this.error(error);
            throw err;
        }
    }

    /**
     * Clear all toasts
     */
    clearAll() {
        if (this.container) {
            const toasts = this.container.querySelectorAll('.toast-item');
            toasts.forEach(toast => this.closeToast(toast));
        }
    }

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Create global instance
window.toastUtil = new ToastUtil();

// Auto initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.toastUtil.init();
    });
} else {
    window.toastUtil.init();
}
