/**
 * Modal Component
 * Handles create/edit modals for systems and requirements
 */

class ModalComponent {
    constructor() {
        this.currentType = null;
        this.currentData = null;
        this.isEditMode = false;
        this.originalData = null; // เก็บข้อมูลเดิมสำหรับเปรียบเทียบ
    }

    /**
     * Show modal for creating/editing system
     */
    async showSystemModal(systemId = null, systemData = null) {
        this.currentType = 'system';
        this.isEditMode = systemId !== null || systemData !== null;

        // Load system data if editing
        if (this.isEditMode) {
            try {
                // ใช้ข้อมูลที่ส่งมาเลย ไม่ต้องเรียก API
                if (systemData) {
                    this.currentData = systemData;
                } else if (systemId) {
                    // Fallback: ถ้ายังส่ง ID มา (backward compatibility)
                    loadingUtil.show('Fetching system data...', 'Please wait a moment');
                    this.currentData = await apiService.getSystemById(systemId);
                    if (!this.currentData) {
                        throw new Error('System not found');
                    }
                }
                
                // เก็บข้อมูลเดิมสำหรับเปรียบเทียบ
                this.originalData = JSON.parse(JSON.stringify(this.currentData));
            } catch (error) {
                console.error('Failed to load system:', error);
                this.showToast('ไม่สามารถโหลดข้อมูลระบบได้', 'error');
                loadingUtil.hide();
                return;
            } finally {
                loadingUtil.hide();
            }
        } else {
            this.currentData = null;
            this.originalData = null;
        }

        // Update modal title
        document.getElementById('modalTitle').textContent = 
            this.isEditMode ? 'Edit System' : 'Add New System';

        // Render form
        const content = this.renderSystemForm();
        document.getElementById('modalContent').innerHTML = content;

        // Show modal
        document.getElementById('modal').classList.remove('hidden');
    }

    /**
     * Show modal for creating/editing requirement
     */
    async showRequirementModal(requirementId = null, requirementData = null) {
        this.currentType = 'requirement';
        this.isEditMode = requirementId !== null || requirementData !== null;

        // Load requirement data if editing
        if (this.isEditMode) {
            try {
                // ใช้ข้อมูลที่ส่งมาเลย ไม่ต้องเรียก API
                if (requirementData) {
                    this.currentData = requirementData;
                } else if (requirementId) {
                    // Fallback: ถ้ายังส่ง ID มา (backward compatibility)
                    loadingUtil.show('Fetching requirement data...', 'Please wait a moment');
                    this.currentData = await apiService.getRequirementById(requirementId);
                    if (!this.currentData) {
                        throw new Error('Requirement not found');
                    }
                }
                
                // เก็บข้อมูลเดิมสำหรับเปรียบเทียบ
                this.originalData = JSON.parse(JSON.stringify(this.currentData));
            } catch (error) {
                console.error('Failed to load requirement:', error);
                this.showToast('Failed to load requirement data', 'error');
                loadingUtil.hide();
                return;
            } finally {
                loadingUtil.hide();
            }
        } else {
            this.currentData = null;
            this.originalData = null;
        }

        // Update modal title
        document.getElementById('modalTitle').textContent = 
            this.isEditMode ? 'Edit Requirement' : 'Add New Requirement';

        // Render form
        const content = await this.renderRequirementForm();
        document.getElementById('modalContent').innerHTML = content;

        // Show modal
        document.getElementById('modal').classList.remove('hidden');
    }

    /**
     * Render system form
     */
    renderSystemForm() {
        const data = this.currentData || {};

        return `
            <form id="systemForm" onsubmit="modalComponent.submitSystemForm(event)">
                <div class="space-y-4">
                    <!-- Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Name <span class="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            name="Name" 
                            value="${this.escapeHtml(data.Name || '')}"
                            required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea 
                            name="Description" 
                            rows="3"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >${this.escapeHtml(data.Description || '')}</textarea>
                    </div>

                    <!-- Business Owner & Technical Owner -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Business Owner</label>
                            <input 
                                type="text" 
                                name="Business Owner" 
                                value="${this.escapeHtml(data['Business Owner'] || '')}"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Technical Owner</label>
                            <input 
                                type="text" 
                                name="Technical Owner" 
                                value="${this.escapeHtml(data['Technical Owner'] || '')}"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                        </div>
                    </div>

                    <!-- Status, Category, Type -->
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Overall Status</label>
                            <select 
                                name="Overall Status" 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="active" ${data['Overall Status'] === 'active' ? 'selected' : ''}>Active</option>
                                <option value="in-develop" ${data['Overall Status'] === 'in-develop' ? 'selected' : ''}>In Development</option>
                                <option value="review" ${data['Overall Status'] === 'review' ? 'selected' : ''}>Review</option>
                                <option value="planing" ${data['Overall Status'] === 'planing' ? 'selected' : ''}>Planning</option>
                                <option value="retired" ${data['Overall Status'] === 'retired' ? 'selected' : ''}>Retired</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select 
                                name="Category" 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="core" ${data.Category === 'core' ? 'selected' : ''}>Core</option>
                                <option value="support" ${data.Category === 'support' ? 'selected' : ''}>Support</option>
                                <option value="infrastructure" ${data.Category === 'infrastructure' ? 'selected' : ''}>Infrastructure</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">System Type</label>
                            <select 
                                name="System Type" 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="internal" ${data['System Type'] === 'internal' ? 'selected' : ''}>Internal</option>
                                <option value="external" ${data['System Type'] === 'external' ? 'selected' : ''}>External</option>
                            </select>
                        </div>
                    </div>

                    <!-- Go Live Date & Goal -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Go Live Date</label>
                            <input 
                                type="date" 
                                name="Go Live Date" 
                                value="${this.formatDateForInput(data['Go Live Date'])}"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Goal</label>
                            <input 
                                type="text" 
                                name="Goal" 
                                value="${this.escapeHtml(data.Goal || '')}"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                        </div>
                    </div>

                    <!-- Buttons -->
                    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button 
                            type="button" 
                            onclick="app.closeModal()"
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                        >
                            ${this.isEditMode ? 'Update' : 'Create'} System
                        </button>
                    </div>
                </div>
            </form>
        `;
    }

    /**
     * Render requirement form
     */
    async renderRequirementForm() {
        const data = this.currentData || {};

        // Load systems for dropdown
        let systemsOptions = '<option value="">Select System</option>';
        try {
            loadingUtil.show('Fetching system data...', 'Please wait a moment');
            const systems = await apiService.getSystems();
            systemsOptions += systems.map(system => 
                `<option value="${system.ID}" ${data['System ID'] === system.ID ? 'selected' : ''}>
                    ${this.escapeHtml(system.ID)} - ${this.escapeHtml(system.Name)}
                </option>`
            ).join('');
        } catch (error) {
            console.error('Failed to load systems:', error);
        } finally {
            loadingUtil.hide();
        }

        return `
            <form id="requirementForm" onsubmit="modalComponent.submitRequirementForm(event)">
                <div class="space-y-4">
                    <!-- System ID -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            System <span class="text-red-500">*</span>
                        </label>
                        <select 
                            name="System ID" 
                            required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            ${systemsOptions}
                        </select>
                    </div>

                    <!-- Title -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Title <span class="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            name="Title" 
                            value="${this.escapeHtml(data.Title || '')}"
                            required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                    </div>

                    <!-- Type, Priority, Status -->
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select 
                                name="Type" 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="functional" ${data.Type === 'functional' ? 'selected' : ''}>Functional</option>
                                <option value="non-functional" ${data.Type === 'non-functional' ? 'selected' : ''}>Non-Functional</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select 
                                name="Priority" 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="high" ${data.Priority === 'high' || data.Priority === 'higth' ? 'selected' : ''}>High</option>
                                <option value="medium" ${data.Priority === 'medium' ? 'selected' : ''}>Medium</option>
                                <option value="low" ${data.Priority === 'low' ? 'selected' : ''}>Low</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select 
                                name="Status" 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="done" ${data.Status === 'done' ? 'selected' : ''}>Done</option>
                                <option value="in-develop" ${data.Status === 'in-develop' ? 'selected' : ''}>In Development</option>
                                <option value="pending" ${data.Status === 'pending' ? 'selected' : ''}>Pending</option>
                            </select>
                        </div>
                    </div>

                    <!-- Buttons -->
                    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button 
                            type="button" 
                            onclick="app.closeModal()"
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                        >
                            ${this.isEditMode ? 'Update' : 'Create'} Requirement
                        </button>
                    </div>
                </div>
            </form>
        `;
    }

    /**
     * ตรวจสอบว่าข้อมูลมีการเปลี่ยนแปลงหรือไม่
     */
    hasDataChanged(newData) {
        if (!this.isEditMode || !this.originalData) {
            return true; // Create mode หรือไม่มีข้อมูลเดิม = มีการเปลี่ยนแปลง
        }

        // เปรียบเทียบแต่ละ field
        for (const key in newData) {
            const oldValue = String(this.originalData[key] || '').trim();
            const newValue = String(newData[key] || '').trim();
            
            if (oldValue !== newValue) {
                return true; // มีการเปลี่ยนแปลง
            }
        }

        return false; // ไม่มีการเปลี่ยนแปลง
    }

    /**
     * Submit system form
     */
    async submitSystemForm(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const submitBtn = form.querySelector('button[type="submit"]');
        const modal = document.getElementById('modal');

        // ตรวจสอบว่ามีการเปลี่ยนแปลงหรือไม่ (Edit mode)
        if (this.isEditMode && !this.hasDataChanged(data)) {
            this.showToast('No changes detected', 'info');
            this.closeModal();
            return;
        }

        try {
            // Disable modal close and show global loading
            modal.dataset.submitting = 'true';
            
            // Show global loading overlay to prevent all interactions
            loadingUtil.show(
                this.isEditMode ? 'Updating system...' : 'Creating system...', 
                'Please wait a moment'
            );

            let result;
            if (this.isEditMode) {
                // รอ API response ก่อน
                result = await apiService.updateSystem(this.currentData.ID, data);
                
                // สร้างข้อมูลที่อัพเดทแล้วจากข้อมูลเดิมและข้อมูลใหม่จาก form
                const updatedSystem = {
                    ...this.currentData,  // ข้อมูลเดิม
                    ...data,              // ข้อมูลที่แก้ไขจาก form
                    // รวมข้อมูลจาก API response ถ้ามี
                    ...(result?.data ? result.data : {})
                };
                
                // อัพเดทตาราง
                app.updateSystemInList(this.currentData.ID, updatedSystem);
                
                // แสดง success message สำหรับ Update
                this.showToast('System updated successfully', 'success');
            } else {
                // รอ API response ก่อน
                result = await apiService.createSystem(data);
                
                // ดึง ID จาก API response
                const newId = result?.data?.id || result?.id;
                
                if (!newId) {
                    console.error('No ID returned from API:', result);
                    throw new Error('Failed to get ID from server');
                }
                
                // สร้างข้อมูลใหม่โดยรวม ID จาก API กับข้อมูลจาก form
                const newSystem = {
                    ID: newId,           // ID จาก API
                    ...data,             // ข้อมูลจาก form
                    // รวมข้อมูลเพิ่มเติมจาก API response ถ้ามี
                    ...(result?.data ? result.data : {})
                };
                
                // เพิ่มในตาราง
                app.addSystemToList(newSystem);
                
                // แสดง success message สำหรับ Create
                this.showToast('System created successfully', 'success');
            }

            // Close modal after success
            this.closeModal(true); // skipWarning = true

        } catch (error) {
            console.error('Failed to save system:', error);
            this.showToast(error.message || 'Failed to save system', 'error');
        } finally {
            // Hide loading and re-enable modal close
            loadingUtil.hide();
            modal.dataset.submitting = 'false';
        }
    }

    /**
     * Submit requirement form
     */
    async submitRequirementForm(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const submitBtn = form.querySelector('button[type="submit"]');
        const modal = document.getElementById('modal');

        // ตรวจสอบว่ามีการเปลี่ยนแปลงหรือไม่ (Edit mode)
        if (this.isEditMode && !this.hasDataChanged(data)) {
            this.showToast('No changes detected', 'info');
            this.closeModal();
            return;
        }

        try {
            // Disable modal close and show global loading
            modal.dataset.submitting = 'true';
            
            // Show global loading overlay to prevent all interactions
            loadingUtil.show(
                this.isEditMode ? 'Updating requirement...' : 'Creating requirement...', 
                'Please wait a moment'
            );

            let result;
            if (this.isEditMode) {
                // รอ API response ก่อน
                result = await apiService.updateRequirement(this.currentData.ID, data);
                
                // สร้างข้อมูลที่อัพเดทแล้วจากข้อมูลเดิมและข้อมูลใหม่จาก form
                const updatedRequirement = {
                    ...this.currentData,  // ข้อมูลเดิม
                    ...data,              // ข้อมูลที่แก้ไขจาก form
                    // รวมข้อมูลจาก API response ถ้ามี
                    ...(result?.data ? result.data : {})
                };
                
                // อัพเดทตาราง
                app.updateRequirementInList(this.currentData.ID, updatedRequirement);
                
                // แสดง success message สำหรับ Update
                this.showToast('Requirement updated successfully', 'success');
            } else {
                // รอ API response ก่อน
                result = await apiService.createRequirement(data);
                
                // ดึง ID จาก API response
                const newId = result?.data?.id || result?.id;
                
                if (!newId) {
                    console.error('No ID returned from API:', result);
                    throw new Error('Failed to get ID from server');
                }
                
                // สร้างข้อมูลใหม่โดยรวม ID จาก API กับข้อมูลจาก form
                const newRequirement = {
                    ID: newId,           // ID จาก API
                    ...data,             // ข้อมูลจาก form
                    // รวมข้อมูลเพิ่มเติมจาก API response ถ้ามี
                    ...(result?.data ? result.data : {})
                };
                
                // เพิ่มในตาราง
                app.addRequirementToList(newRequirement);
                
                // แสดง success message สำหรับ Create
                this.showToast('Requirement created successfully', 'success');
            }

            // Close modal after success
            this.closeModal(true); // skipWarning = true

        } catch (error) {
            console.error('Failed to save requirement:', error);
            this.showToast(error.message || 'Failed to save requirement', 'error');
        } finally {
            // Hide loading and re-enable modal close
            loadingUtil.hide();
            modal.dataset.submitting = 'false';
        }
    }

    /**
     * Close modal
     */
    closeModal(skipWarning = false) {
        const modal = document.getElementById('modal');
        
        // ป้องกันการปิด modal ระหว่าง submit (ยกเว้นถ้า skipWarning = true)
        if (!skipWarning && modal.dataset.submitting === 'true') {
            this.showToast('Please wait for the save operation to complete', 'warning');
            return;
        }
        
        modal.classList.add('hidden');
        this.currentType = null;
        this.currentData = null;
        this.isEditMode = false;
        this.originalData = null;
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        toastUtil.show(message, type);
    }

    /**
     * Format date for input field (yyyy-MM-dd)
     */
    formatDateForInput(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            
            // Format as yyyy-MM-dd for input[type="date"]
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            return `${year}-${month}-${day}`;
        } catch (error) {
            return '';
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

// Create singleton instance
window.modalComponent = new ModalComponent();
