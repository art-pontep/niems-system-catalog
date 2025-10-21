/**
 * Table Component
 * Handles rendering and interactions for data tables with pagination
 */

class TableComponent {
    constructor() {
        this.currentSort = { column: null, direction: 'asc' };
        this.pagination = {
            systems: { currentPage: 1, itemsPerPage: 10 },
            requirements: { currentPage: 1, itemsPerPage: 10 }
        };
    }

    /**
     * Render internal systems overview table
     */
    renderInternalSystemsOverviewTable(internalSystems, requirements) {
        const container = document.getElementById('internalSystemsOverviewTable');
        if (!container) return;

        if (!internalSystems || internalSystems.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <p class="text-gray-500 text-sm">No internal systems found</p>
                </div>
            `;
            return;
        }

        const html = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-green-50">
                    <tr>
                        <th class="px-3 py-2 text-left text-xs font-medium text-green-700 uppercase tracking-wider">System</th>
                        <th class="px-3 py-2 text-center text-xs font-medium text-green-700 uppercase tracking-wider">Status</th>
                        <th class="px-3 py-2 text-center text-xs font-medium text-green-700 uppercase tracking-wider">Requirements</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${internalSystems.map(system => this.renderSystemOverviewRow(system, requirements)).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = html;
    }

    /**
     * Render external systems overview table
     */
    renderExternalSystemsOverviewTable(externalSystems, requirements) {
        const container = document.getElementById('externalSystemsOverviewTable');
        if (!container) return;

        if (!externalSystems || externalSystems.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                    </svg>
                    <p class="text-gray-500 text-sm">No external systems found</p>
                </div>
            `;
            return;
        }

        const html = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-orange-50">
                    <tr>
                        <th class="px-3 py-2 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">System</th>
                        <th class="px-3 py-2 text-center text-xs font-medium text-orange-700 uppercase tracking-wider">Status</th>
                        <th class="px-3 py-2 text-center text-xs font-medium text-orange-700 uppercase tracking-wider">Requirements</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${externalSystems.map(system => this.renderSystemOverviewRow(system, requirements)).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = html;
    }

    /**
     * Render system overview row
     */
    renderSystemOverviewRow(system, requirements) {
        const systemRequirements = requirements.filter(req => req['System ID'] === system.ID);
        const totalRequirements = systemRequirements.length;
        const completedRequirements = systemRequirements.filter(req => req.Status === 'done').length;
        const completionPercentage = totalRequirements > 0 ? Math.round((completedRequirements / totalRequirements) * 100) : 0;

        return `
            <tr class="hover:bg-gray-50 transition">
                <td class="px-3 py-3">
                    <div>
                        <div class="text-sm font-medium text-gray-900">${this.escapeHtml(system.Name || '-')}</div>
                        <div class="text-xs text-gray-500">${this.escapeHtml(system.ID || '-')}</div>
                    </div>
                </td>
                <td class="px-3 py-3 text-center">
                    ${this.renderStatusBadge(system['Overall Status'])}
                </td>
                <td class="px-3 py-3 text-center">
                    <div class="flex items-center justify-center">
                        <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div class="bg-blue-500 h-2 rounded-full" style="width: ${completionPercentage}%"></div>
                        </div>
                        <span class="text-xs font-medium text-gray-600">${completedRequirements}/${totalRequirements}</span>
                    </div>
                    <div class="text-xs text-gray-500 mt-1">${completionPercentage}%</div>
                </td>
            </tr>
        `;
    }

    /**
     * Render systems table with pagination
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

        // Pagination calculations
        const { currentPage, itemsPerPage } = this.pagination.systems;
        const totalItems = systems.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedSystems = systems.slice(startIndex, endIndex);

        const html = `
            <div class="table-responsive">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50 sticky top-0">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden-mobile">Goal</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden-mobile">Technical Owner</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden-mobile">Go Live</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${paginatedSystems.map(system => this.renderSystemRow(system)).join('')}
                    </tbody>
                </table>
            </div>
            
            ${this.renderPagination('systems', currentPage, totalPages, totalItems, itemsPerPage)}
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
                <td class="px-4 py-4 whitespace-nowrap">
                    ${this.renderSystemTypeBadge(system['System Type'])}
                </td>
                <td class="px-4 py-4 text-sm text-gray-900">
                    <div class="font-medium">${this.escapeHtml(system.Name || '-')}</div>
                    <div class="text-gray-500 text-xs">${this.escapeHtml(system.Description || '').substring(0, 50)}${(system.Description || '').length > 50 ? '...' : ''}</div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden-mobile">
                    ${this.escapeHtml(system['Goal'] || '-')}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden-mobile">
                    ${this.escapeHtml(system['Technical Owner'] || '-')}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden-mobile">
                    ${this.formatDate(system['Go Live Date'])}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                    ${this.renderStatusBadge(system['Overall Status'])}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end gap-2">
                        <button 
                            onclick="app.editSystem('${this.escapeHtml(system.ID)}')" 
                            class="inline-flex items-center px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                            title="Edit system"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            <span class="hidden sm:ml-1 sm:inline">Edit</span>
                        </button>
                        <button 
                            onclick="app.deleteSystem('${this.escapeHtml(system.ID)}')" 
                            class="inline-flex items-center px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                            title="Delete system"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            <span class="hidden sm:ml-1 sm:inline">Delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    /**
     * Render requirements table with pagination
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

        // Pagination calculations
        const { currentPage, itemsPerPage } = this.pagination.requirements;
        const totalItems = requirements.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedRequirements = requirements.slice(startIndex, endIndex);

        const html = `
            <div class="table-responsive">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50 sticky top-0">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden-mobile">System ID</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden-mobile">Type</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${paginatedRequirements.map(req => this.renderRequirementRow(req)).join('')}
                    </tbody>
                </table>
            </div>
            
            ${this.renderPagination('requirements', currentPage, totalPages, totalItems, itemsPerPage)}
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
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden-mobile">
                    ${this.escapeHtml(requirement['System ID'] || '-')}
                </td>
                <td class="px-4 py-4 text-sm text-gray-900">
                    <div class="font-medium">${this.escapeHtml(requirement.Title || '-')}</div>
                    <div class="text-gray-500 text-xs sm:hidden">${this.escapeHtml(requirement['System ID'] || '-')}</div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden-mobile">
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
                            class="inline-flex items-center px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                            title="Edit requirement"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            <span class="hidden sm:ml-1 sm:inline">Edit</span>
                        </button>
                        <button 
                            onclick="app.deleteRequirement('${this.escapeHtml(requirement.ID)}')" 
                            class="inline-flex items-center px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                            title="Delete requirement"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            <span class="hidden sm:ml-1 sm:inline">Delete</span>
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
     * Render system type badge
     */
    renderSystemTypeBadge(type) {
        const typeClass = `type-${(type || 'unknown').toLowerCase()}`;
        const displayText = type === 'internal' ? 'Internal' : 
                           type === 'external' ? 'External' : 
                           (type || 'Unknown');
        return `<span class="${typeClass}">${this.escapeHtml(displayText)}</span>`;
    }

    /**
     * Render pagination controls
     */
    renderPagination(tableType, currentPage, totalPages, totalItems, itemsPerPage) {
        if (totalItems <= itemsPerPage) {
            return ''; // No pagination needed
        }

        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);

        let paginationHtml = `
            <div class="pagination bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 text-sm text-gray-700">
                        <span>Showing ${startItem} to ${endItem} of ${totalItems} results</span>
                        <select onchange="tableComponent.changeItemsPerPage('${tableType}', this.value)" class="ml-2">
                            <option value="10" ${itemsPerPage === 10 ? 'selected' : ''}>10 per page</option>
                            <option value="25" ${itemsPerPage === 25 ? 'selected' : ''}>25 per page</option>
                            <option value="50" ${itemsPerPage === 50 ? 'selected' : ''}>50 per page</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-1">
        `;

        // Previous button
        paginationHtml += `
            <button 
                onclick="tableComponent.changePage('${tableType}', ${currentPage - 1})"
                ${currentPage <= 1 ? 'disabled' : ''}
                class="px-3 py-1 text-sm border rounded"
            >
                Previous
            </button>
        `;

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            paginationHtml += `<button onclick="tableComponent.changePage('${tableType}', 1)" class="px-3 py-1 text-sm border rounded">1</button>`;
            if (startPage > 2) {
                paginationHtml += `<span class="px-2">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `
                <button 
                    onclick="tableComponent.changePage('${tableType}', ${i})"
                    class="px-3 py-1 text-sm border rounded ${i === currentPage ? 'active' : ''}"
                >
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHtml += `<span class="px-2">...</span>`;
            }
            paginationHtml += `<button onclick="tableComponent.changePage('${tableType}', ${totalPages})" class="px-3 py-1 text-sm border rounded">${totalPages}</button>`;
        }

        // Next button
        paginationHtml += `
            <button 
                onclick="tableComponent.changePage('${tableType}', ${currentPage + 1})"
                ${currentPage >= totalPages ? 'disabled' : ''}
                class="px-3 py-1 text-sm border rounded"
            >
                Next
            </button>
        `;

        paginationHtml += `
                    </div>
                </div>
            </div>
        `;

        return paginationHtml;
    }

    /**
     * Change page
     */
    changePage(tableType, newPage) {
        this.pagination[tableType].currentPage = newPage;
        if (tableType === 'systems') {
            app.renderSystems();
        } else if (tableType === 'requirements') {
            app.renderRequirements();
        }
    }

    /**
     * Change items per page
     */
    changeItemsPerPage(tableType, newItemsPerPage) {
        this.pagination[tableType].itemsPerPage = parseInt(newItemsPerPage);
        this.pagination[tableType].currentPage = 1; // Reset to first page
        if (tableType === 'systems') {
            app.renderSystems();
        } else if (tableType === 'requirements') {
            app.renderRequirements();
        }
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
