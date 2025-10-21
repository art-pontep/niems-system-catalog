/**
 * Main Application
 * Handles app initialization, navigation, and data management
 */

class App {
    constructor() {
        this.systems = [];
        this.requirements = [];
        this.currentView = 'dashboard';
        this.filteredSystems = [];
        this.filteredRequirements = [];
    }

    /**
     * Initialize application
     */
    async init() {
        try {
            // Show loading screen
            this.showLoading();

            // Initialize auth service
            await authService.init();

            // Check if user is authenticated
            if (authService.isAuthenticated()) {
                await this.onLogin();
            } else {
                this.showLoginScreen();
            }

            // Listen for auth events
            window.addEventListener('auth:login', () => this.onLogin());
            window.addEventListener('auth:logout', () => this.onLogout());

        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('เกิดข้อผิดพลาดในการโหลดแอปพลิเคชัน: ' + error.message);
            this.hideLoading();
        }
    }

    /**
     * Handle user login
     */
    async onLogin() {
        try {
            // Update user info in UI
            const user = authService.getUser();
            if (user) {
                document.getElementById('userName').textContent = user.name;
                document.getElementById('userEmail').textContent = user.email;
                document.getElementById('userAvatar').src = user.picture;
            }

            // Load initial data
            await this.loadAllData();

            // Show main app
            this.showMainApp();

            // Navigate to dashboard
            this.navigateTo('dashboard');

            // Hide loading
            this.hideLoading();

        } catch (error) {
            console.error('Login error:', error);
            this.showError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ: ' + error.message);
            this.logout();
        }
    }

    /**
     * Handle user logout
     */
    onLogout() {
        // Clear data
        this.systems = [];
        this.requirements = [];
        
        // Show login screen
        this.showLoginScreen();
    }

    /**
     * Load all data from API
     */
    async loadAllData() {
        try {
            // Show loading with message
            loadingUtil.show('Fetching data...', 'Please wait a moment');

            // Load systems and requirements in parallel
            const [systems, requirements] = await Promise.all([
                apiService.getSystems(),
                apiService.getRequirements(),
            ]);

            this.systems = systems;
            this.requirements = requirements;
            this.filteredSystems = [...systems];
            this.filteredRequirements = [...requirements];

            if (CONFIG.app.debug) {
                console.log('✅ Data loaded:', {
                    systems: this.systems.length,
                    requirements: this.requirements.length,
                });
            }

            // Update current view
            this.updateCurrentView();

        } catch (error) {
            console.error('Failed to load data:', error);
            this.showError('ไม่สามารถโหลดข้อมูลได้: ' + error.message);
        } finally {
            // Always hide loading
            loadingUtil.hide();
        }
    }

    /**
     * Update current view with latest data
     */
    updateCurrentView() {
        switch (this.currentView) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'systems':
                this.renderSystems();
                break;
            case 'requirements':
                this.renderRequirements();
                break;
        }
    }

    /**
     * Navigate to different views
     */
    navigateTo(view, event = null) {
        this.currentView = view;

        // Update navigation tabs
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked tab if event provided
        if (event && event.target) {
            event.target.classList.add('active');
        } else {
            // Find and activate the tab by view name
            const targetTab = document.querySelector(`[onclick*="${view}"]`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        }

        // Hide all views
        document.querySelectorAll('.view-container').forEach(container => {
            container.classList.add('hidden');
        });

        // Show selected view
        const viewMap = {
            'dashboard': 'dashboardView',
            'systems': 'systemsView',
            'requirements': 'requirementsView',
        };

        const viewId = viewMap[view];
        if (viewId) {
            document.getElementById(viewId).classList.remove('hidden');
            this.updateCurrentView();
        }
    }

    /**
     * Render dashboard
     */
    renderDashboard() {
        // Calculate various stats
        const totalSystems = this.systems.length;
        const activeSystems = this.systems.filter(s => s['Overall Status'] === 'active').length;
        const developSystems = this.systems.filter(s => s['Overall Status'] === 'in-develop').length;
        const reviewSystems = this.systems.filter(s => s['Overall Status'] === 'review').length;
        const planningSystems = this.systems.filter(s => s['Overall Status'] === 'planning').length;
        
        const internalSystems = this.systems.filter(s => s['System Type'] === 'internal').length;
        const externalSystems = this.systems.filter(s => s['System Type'] === 'external').length;
        
        // Internal systems by status
        const internalActiveSystems = this.systems.filter(s => s['System Type'] === 'internal' && s['Overall Status'] === 'active').length;
        const internalDevelopSystems = this.systems.filter(s => s['System Type'] === 'internal' && s['Overall Status'] === 'in-develop').length;
        const internalReviewSystems = this.systems.filter(s => s['System Type'] === 'internal' && s['Overall Status'] === 'review').length;
        const internalPlanningSystems = this.systems.filter(s => s['System Type'] === 'internal' && s['Overall Status'] === 'planning').length;
        
        // External systems by status
        const externalActiveSystems = this.systems.filter(s => s['System Type'] === 'external' && s['Overall Status'] === 'active').length;
        const externalDevelopSystems = this.systems.filter(s => s['System Type'] === 'external' && s['Overall Status'] === 'in-develop').length;
        const externalReviewSystems = this.systems.filter(s => s['System Type'] === 'external' && s['Overall Status'] === 'review').length;
        const externalPlanningSystems = this.systems.filter(s => s['System Type'] === 'external' && s['Overall Status'] === 'planning').length;

        // Update main stats
        document.getElementById('totalSystems').textContent = totalSystems;
        document.getElementById('activeSystems').textContent = activeSystems;
        document.getElementById('developSystems').textContent = developSystems;
        document.getElementById('reviewSystems').textContent = reviewSystems;
        document.getElementById('planningSystems').textContent = planningSystems;
        
        document.getElementById('internalSystems').textContent = internalSystems;
        document.getElementById('externalSystems').textContent = externalSystems;
        
        // Update internal systems by status
        document.getElementById('internalActiveSystems').textContent = internalActiveSystems;
        document.getElementById('internalDevelopSystems').textContent = internalDevelopSystems;
        document.getElementById('internalReviewSystems').textContent = internalReviewSystems;
        document.getElementById('internalPlanningSystems').textContent = internalPlanningSystems;
        
        // Update external systems by status
        document.getElementById('externalActiveSystems').textContent = externalActiveSystems;
        document.getElementById('externalDevelopSystems').textContent = externalDevelopSystems;
        document.getElementById('externalReviewSystems').textContent = externalReviewSystems;
        document.getElementById('externalPlanningSystems').textContent = externalPlanningSystems;

        // Update charts with new layout
        chartsComponent.updateCharts(this.systems, this.requirements);

        // Update systems overview tables
        tableComponent.renderInternalSystemsOverviewTable(this.systems.filter(s => s['System Type'] === 'internal'), this.requirements);
        tableComponent.renderExternalSystemsOverviewTable(this.systems.filter(s => s['System Type'] === 'external'), this.requirements);
    }

    /**
     * Render systems view
     */
    renderSystems() {
        tableComponent.renderSystemsTable(this.filteredSystems);
    }

    /**
     * Render requirements view
     */
    renderRequirements() {
        tableComponent.renderRequirementsTable(this.filteredRequirements);
    }

    /**
     * Add new system to list and update UI
     */
    addSystemToList(system) {
        this.systems.push(system);
        this.filterSystems(); // จะทำการ render ใหม่อัตโนมัติ
        this.renderDashboard(); // อัพเดท dashboard ด้วย
    }

    /**
     * Update existing system in list and update UI
     */
    updateSystemInList(id, updatedData) {
        const index = this.systems.findIndex(s => s.ID === id);
        if (index !== -1) {
            this.systems[index] = updatedData;
            this.filterSystems(); // จะทำการ render ใหม่อัตโนมัติ
            this.renderDashboard(); // อัพเดท dashboard ด้วย
        }
    }

    /**
     * Add new requirement to list and update UI
     */
    addRequirementToList(requirement) {
        this.requirements.push(requirement);
        this.filterRequirements(); // จะทำการ render ใหม่อัตโนมัติ
        this.renderDashboard(); // อัพเดท dashboard ด้วย
    }

    /**
     * Update existing requirement in list and update UI
     */
    updateRequirementInList(id, updatedData) {
        const index = this.requirements.findIndex(r => r.ID === id);
        if (index !== -1) {
            this.requirements[index] = updatedData;
            this.filterRequirements(); // จะทำการ render ใหม่อัตโนมัติ
            this.renderDashboard(); // อัพเดท dashboard ด้วย
        }
    }

    /**
     * Filter systems based on search and filters
     */
    filterSystems() {
        const search = document.getElementById('systemsSearch').value.toLowerCase();
        const statusFilter = document.getElementById('systemsStatusFilter').value;
        const typeFilter = document.getElementById('systemsTypeFilter').value;

        this.filteredSystems = this.systems.filter(system => {
            // Search filter
            const matchesSearch = !search || 
                (system.Name || '').toLowerCase().includes(search) ||
                (system.ID || '').toLowerCase().includes(search) ||
                (system.Description || '').toLowerCase().includes(search) ||
                (system['Business Owner'] || '').toLowerCase().includes(search) ||
                (system['Technical Owner'] || '').toLowerCase().includes(search);

            // Status filter
            const matchesStatus = !statusFilter || system['Overall Status'] === statusFilter;

            // Type filter (Internal/External)
            const matchesType = !typeFilter || system['System Type'] === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });

        this.renderSystems();
    }

    /**
     * Filter requirements based on search and filters
     */
    filterRequirements() {
        const search = document.getElementById('requirementsSearch').value.toLowerCase();
        const statusFilter = document.getElementById('requirementsStatusFilter').value;
        const priorityFilter = document.getElementById('requirementsPriorityFilter').value;

        this.filteredRequirements = this.requirements.filter(req => {
            // Search filter
            const matchesSearch = !search || 
                (req.Title || '').toLowerCase().includes(search) ||
                (req.ID || '').toLowerCase().includes(search) ||
                (req['System ID'] || '').toLowerCase().includes(search);

            // Status filter
            const matchesStatus = !statusFilter || req.Status === statusFilter;
            
            // Priority filter
            const matchesPriority = !priorityFilter || req.Priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        });

        this.renderRequirements();
    }

    /* ========================================================================
       MODAL OPERATIONS
       ======================================================================== */

    /**
     * Open modal
     */
    openModal(type, id = null) {
        if (type === 'system') {
            modalComponent.showSystemModal(id);
        } else if (type === 'requirement') {
            modalComponent.showRequirementModal(id);
        }
    }

    /**
     * Close modal
     */
    closeModal() {
        modalComponent.closeModal();
    }

    /* ========================================================================
       CRUD OPERATIONS
       ======================================================================== */

    /**
     * Edit system
     */
    async editSystem(id) {
        // ใช้ข้อมูลจากตารางแทนการเรียก API
        const system = this.systems.find(s => s.ID === id);
        if (system) {
            await modalComponent.showSystemModal(null, system);
        }
    }

    /**
     * Delete system
     */
    async deleteSystem(id) {
        const confirmed = await this.showConfirmDialog(
            'Delete System',
            'Are you sure you want to delete this system? This action cannot be undone.',
            'Delete',
            'Cancel'
        );
        
        if (!confirmed) {
            return;
        }

        try {
            await loadingUtil.withLoading(
                async () => {
                    await apiService.deleteSystem(id);
                    
                    // Remove from local array
                    this.systems = this.systems.filter(s => s.ID !== id);
                    this.filterSystems();
                    this.renderDashboard();
                    // Also remove related requirements
                    this.requirements = this.requirements.filter(r => r['System ID'] !== id);
                    this.filterRequirements();
                    this.renderRequirements();
                    
                    this.showToast('System deleted successfully', 'success');
                },
                {
                    message: 'Deleting system...',
                    subMessage: 'Please wait a moment'
                }
            );
        } catch (error) {
            console.error('Failed to delete system:', error);
            this.showToast(error.message || 'Failed to delete system', 'error');
        }
    }

    /**
     * Edit requirement
     */
    async editRequirement(id) {
        // ใช้ข้อมูลจากตารางแทนการเรียก API
        const requirement = this.requirements.find(r => r.ID === id);
        if (requirement) {
            await modalComponent.showRequirementModal(null, requirement);
        }
    }

    /**
     * Delete requirement
     */
    async deleteRequirement(id) {
        const confirmed = await this.showConfirmDialog(
            'Delete Requirement',
            'Are you sure you want to delete this requirement? This action cannot be undone.',
            'Delete',
            'Cancel'
        );
        
        if (!confirmed) {
            return;
        }

        try {
            await loadingUtil.withLoading(
                async () => {
                    await apiService.deleteRequirement(id);
                    
                    // Remove from local array
                    this.requirements = this.requirements.filter(r => r.ID !== id);
                    this.filterRequirements();
                    this.renderDashboard();
                    
                    this.showToast('Requirement deleted successfully', 'success');
                },
                {
                    message: 'Deleting requirement...',
                    subMessage: 'Please wait a moment'
                }
            );
        } catch (error) {
            console.error('Failed to delete requirement:', error);
            this.showToast(error.message || 'Failed to delete requirement', 'error');
        }
    }

    /* ========================================================================
       UI HELPERS
       ======================================================================== */

    /**
     * Show confirmation dialog using custom modal
     */
    async showConfirmDialog(title, message, confirmText = 'Confirm', cancelText = 'Cancel') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
                            </div>
                        </div>
                        <p class="text-gray-600 mb-6">${message}</p>
                        <div class="flex justify-end gap-3">
                            <button id="cancelBtn" class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                ${cancelText}
                            </button>
                            <button id="confirmBtn" class="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                                ${confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            const confirmBtn = modal.querySelector('#confirmBtn');
            const cancelBtn = modal.querySelector('#cancelBtn');
            
            const cleanup = () => {
                modal.remove();
            };
            
            confirmBtn.onclick = () => {
                cleanup();
                resolve(true);
            };
            
            cancelBtn.onclick = () => {
                cleanup();
                resolve(false);
            };
            
            // Close on backdrop click
            modal.onclick = (e) => {
                if (e.target === modal) {
                    cleanup();
                    resolve(false);
                }
            };
        });
    }

    /**
     * Show loading screen
     */
    showLoading() {
        document.getElementById('loadingScreen').classList.remove('hidden');
    }

    /**
     * Hide loading screen
     */
    hideLoading() {
        document.getElementById('loadingScreen').classList.add('hidden');
    }

    /**
     * Show login screen
     */
    showLoginScreen() {
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }

    /**
     * Show main app
     */
    showMainApp() {
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
    }

    /**
     * Show data loading indicator
     */
    showDataLoading() {
        // You can add a loading indicator in the UI
        if (CONFIG.app.debug) {
            console.log('⏳ Loading data...');
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        toastUtil.error(message, 6000);
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        toastUtil.show(message, type);
    }

    /**
     * Logout
     */
    logout() {
        authService.logout();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    app.init();
});
