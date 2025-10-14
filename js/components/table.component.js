/**
 * Table Component
 * Handles rendering and interactions for data tables
 */

class TableComponent {
    constructor() {
        this.currentSort = { column: null, direction: 'asc' };
    }

    /**
     * Render systems table
     */
    renderSystemsTable(systems, containerId = 'systemsTable') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!systems || systems.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                    <p class="text-gray-500">ไม่พบข้อมูลระบบงาน</p>
                </div>
            `;
            return;
        }

        const html = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50 sticky top-0">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Owner</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technical Owner</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Go Live</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${systems.map(system => this.renderSystemRow(system)).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = html;
    }

    /**
     * Render single system row
     */
    renderSystemRow(system) {
        return `
            <tr class="hover:bg-gray-50 transition">
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${this.escapeHtml(system.ID || '-')}
                </td>
                <td class="px-4 py-4 text-sm text-gray-900">
                    <div class="font-medium">${this.escapeHtml(system.Name || '-')}</div>
                    <div class="text-gray-500 text-xs">${this.escapeHtml(system.Description || '').substring(0, 50)}${(system.Description || '').length > 50 ? '...' : ''}</div>
                </td>
                <td class="px-4 py-4 text-sm text-gray-500">
                    ${this.escapeHtml(system['Goal'] || '-')}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${this.escapeHtml(system['Business Owner'] || '-')}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${this.escapeHtml(system['Technical Owner'] || '-')}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${this.formatDate(system['Go Live Date'])}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${this.escapeHtml(system.Category || '-')}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                    ${this.renderStatusBadge(system['Overall Status'])}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end gap-2">
                        <button 
                            onclick="app.editSystem('${this.escapeHtml(system.ID)}')" 
                            class="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                            title="Edit system"
                        >
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            Edit
                        </button>
                        <button 
                            onclick="app.deleteSystem('${this.escapeHtml(system.ID)}')" 
                            class="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                            title="Delete system"
                        >
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    /**
     * Render requirements table
     */
    renderRequirementsTable(requirements, containerId = 'requirementsTable') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!requirements || requirements.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p class="text-gray-500">ไม่พบข้อมูล Requirements</p>
                </div>
            `;
            return;
        }

        const html = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50 sticky top-0">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">System ID</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${requirements.map(req => this.renderRequirementRow(req)).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = html;
    }

    /**
     * Render single requirement row
     */
    renderRequirementRow(requirement) {
        return `
            <tr class="hover:bg-gray-50 transition">
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${this.escapeHtml(requirement.ID || '-')}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${this.escapeHtml(requirement['System ID'] || '-')}
                </td>
                <td class="px-4 py-4 text-sm text-gray-900">
                    ${this.escapeHtml(requirement.Title || '-')}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${this.renderTypeBadge(requirement.Type)}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                    ${this.renderPriorityBadge(requirement.Priority)}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                    ${this.renderStatusBadge(requirement.Status)}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end gap-2">
                        <button 
                            onclick="app.editRequirement('${this.escapeHtml(requirement.ID)}')" 
                            class="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                            title="Edit requirement"
                        >
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            Edit
                        </button>
                        <button 
                            onclick="app.deleteRequirement('${this.escapeHtml(requirement.ID)}')" 
                            class="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                            title="Delete requirement"
                        >
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    /**
     * Render systems overview table with requirements progress
     */
    renderSystemsOverviewTable(systems, requirements) {
        const container = document.getElementById('systemsOverviewTable');
        if (!container) return;

        // Calculate requirements stats for each system
        const systemsWithStats = systems.map(system => {
            const systemReqs = requirements.filter(req => req['System ID'] === system.ID);
            const doneReqs = systemReqs.filter(req => req.Status === 'done');
            const totalReqs = systemReqs.length;
            const completionRate = totalReqs > 0 ? Math.round((doneReqs.length / totalReqs) * 100) : 0;

            return {
                ...system,
                totalRequirements: totalReqs,
                doneRequirements: doneReqs.length,
                completionRate: completionRate,
            };
        });

        const html = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">System</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirements</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${systemsWithStats.map(system => `
                        <tr class="hover:bg-gray-50 transition">
                            <td class="px-4 py-4">
                                <div class="text-sm font-medium text-gray-900">${this.escapeHtml(system.Name)}</div>
                                <div class="text-xs text-gray-500">${this.escapeHtml(system.ID)}</div>
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap">
                                ${this.renderStatusBadge(system['Overall Status'])}
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${system.doneRequirements} / ${system.totalRequirements}
                            </td>
                            <td class="px-4 py-4">
                                <div class="flex items-center">
                                    <div class="flex-1 mr-4">
                                        <div class="bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div class="bg-blue-600 h-2 rounded-full transition-all" style="width: ${system.completionRate}%"></div>
                                        </div>
                                    </div>
                                    <span class="text-sm font-medium text-gray-900 w-12 text-right">${system.completionRate}%</span>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = html;
    }

    /**
     * Render status badge
     */
    renderStatusBadge(status) {
        const statusClass = `status-${(status || 'unknown').toLowerCase()}`;
        return `<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">${this.escapeHtml(status || 'Unknown')}</span>`;
    }

    /**
     * Render type badge
     */
    renderTypeBadge(type) {
        const bgColor = type === 'functional' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
        return `<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}">${this.escapeHtml(type || '-')}</span>`;
    }

    /**
     * Render priority badge
     */
    renderPriorityBadge(priority) {
        const priorityClass = `priority-${(priority || 'low').toLowerCase()}`;
        return `<span class="${priorityClass}">${this.escapeHtml(priority || 'Low')}</span>`;
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
     * Format date for display
     */
    formatDate(dateString) {
        if (!dateString) return '-';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '-';
            
            // Format as DD/MM/YYYY
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            
            return `${day}/${month}/${year}`;
        } catch (error) {
            return '-';
        }
    }
}

// Create singleton instance
window.tableComponent = new TableComponent();
