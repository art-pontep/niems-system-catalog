/**
 * Charts Component
 * Handles all chart visualizations using Chart.js
 */

class ChartsComponent {
    constructor() {
        this.charts = {};
        this.defaultColors = {
            'active': '#10b981',
            'in-develop': '#3b82f6',
            'uat': '#f59e0b',
            'planning': '#8b5cf6',
            'retired': '#6b7280',
            'on-hold': '#ef4444',
            'done': '#10b981',
            'in-progress': '#3b82f6',
            'to-do': '#6b7280',
        };
    }

    /**
     * Create systems by status chart
     */
    createSystemsStatusChart(systems) {
        const ctx = document.getElementById('systemsStatusChart');
        if (!ctx) return;

        // Count systems by status
        const statusCounts = systems.reduce((acc, system) => {
            const status = system['Overall Status'] || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        // Prepare data
        const labels = Object.keys(statusCounts);
        const data = Object.values(statusCounts);
        const total = data.reduce((sum, value) => sum + value, 0);
        const backgroundColors = labels.map(status => this.defaultColors[status] || '#94a3b8');

        // Destroy existing chart
        if (this.charts.systemsStatus) {
            this.charts.systemsStatus.destroy();
        }

        // Create new chart
        this.charts.systemsStatus = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels.map(s => this.formatStatusLabel(s)),
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderWidth: 2,
                    borderColor: '#ffffff',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12,
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Create internal systems by status chart
     */
    createInternalSystemsStatusChart(systems) {
        const ctx = document.getElementById('internalSystemsStatusChart');
        if (!ctx) return;

        // Filter internal systems only
        const internalSystems = systems.filter(s => s['System Type'] === 'internal');

        // Count internal systems by status
        const statusCounts = internalSystems.reduce((acc, system) => {
            const status = system['Overall Status'] || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        // Prepare data
        const labels = Object.keys(statusCounts);
        const data = Object.values(statusCounts);
        const total = data.reduce((sum, value) => sum + value, 0);
        const backgroundColors = labels.map(status => this.defaultColors[status] || '#94a3b8');

        // Destroy existing chart
        if (this.charts.internalSystemsStatus) {
            this.charts.internalSystemsStatus.destroy();
        }

        // Create new chart
        this.charts.internalSystemsStatus = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels.map(s => this.formatStatusLabel(s)),
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderWidth: 2,
                    borderColor: '#ffffff',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12,
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Create external systems by status chart
     */
    createExternalSystemsStatusChart(systems) {
        const ctx = document.getElementById('externalSystemsStatusChart');
        if (!ctx) return;

        // Filter external systems only
        const externalSystems = systems.filter(s => s['System Type'] === 'external');

        // Count external systems by status
        const statusCounts = externalSystems.reduce((acc, system) => {
            const status = system['Overall Status'] || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        // Prepare data
        const labels = Object.keys(statusCounts);
        const data = Object.values(statusCounts);
        const total = data.reduce((sum, value) => sum + value, 0);
        const backgroundColors = labels.map(status => this.defaultColors[status] || '#94a3b8');

        // Destroy existing chart
        if (this.charts.externalSystemsStatus) {
            this.charts.externalSystemsStatus.destroy();
        }

        // Create new chart
        this.charts.externalSystemsStatus = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels.map(s => this.formatStatusLabel(s)),
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderWidth: 2,
                    borderColor: '#ffffff',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12,
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Create requirements by status chart
     */
    createRequirementsStatusChart(requirements) {
        const ctx = document.getElementById('requirementsStatusChart');
        if (!ctx) return;

        // Count requirements by status
        const statusCounts = requirements.reduce((acc, req) => {
            const status = req.Status || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        // Prepare data
        const labels = Object.keys(statusCounts);
        const data = Object.values(statusCounts);
        const backgroundColors = labels.map(status => this.defaultColors[status] || '#94a3b8');

        // Destroy existing chart
        if (this.charts.requirementsStatus) {
            this.charts.requirementsStatus.destroy();
        }

        // Create new chart
        this.charts.requirementsStatus = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels.map(s => this.formatStatusLabel(s)),
                datasets: [{
                    label: 'Requirements',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderWidth: 0,
                    borderRadius: 8,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `Count: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                        },
                        grid: {
                            display: true,
                            color: '#f1f5f9',
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                        }
                    }
                }
            }
        });
    }

    /**
     * Format status label for display
     */
    formatStatusLabel(status) {
        const labels = {
            'active': 'Active',
            'in-develop': 'In Development',
            'uat': 'UAT',
            'planning': 'Planning',
            'retired': 'Retired',
            'on-hold': 'On Hold',
            'done': 'Done',
            'in-progress': 'In Progress',
            'to-do': 'To Do',
            'unknown': 'Unknown',
        };
        return labels[status] || status;
    }

    /**
     * Destroy all charts
     */
    destroyAll() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};
    }

    /**
     * Create systems by type chart (Internal vs External)
     */
    createSystemsTypeChart(systems) {
        const ctx = document.getElementById('systemsTypeChart');
        if (!ctx) return;

        // Count systems by type
        const typeCounts = systems.reduce((acc, system) => {
            const type = system['System Type'] || 'unknown';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        // Prepare data
        const labels = Object.keys(typeCounts);
        const data = Object.values(typeCounts);
        const backgroundColors = labels.map(type => {
            return type === 'internal' ? '#10b981' : 
                   type === 'external' ? '#f59e0b' : '#94a3b8';
        });

        // Destroy existing chart
        if (this.charts.systemsType) {
            this.charts.systemsType.destroy();
        }

        // Create new chart
        this.charts.systemsType = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels.map(s => this.formatTypeLabel(s)),
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderWidth: 2,
                    borderColor: '#ffffff',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12,
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Format type label for display
     */
    formatTypeLabel(type) {
        const labels = {
            'internal': 'Internal',
            'external': 'External',
            'unknown': 'Unknown',
        };
        return labels[type] || type;
    }

    /**
     * Update charts with new data
     */
    updateCharts(systems, requirements) {
        this.createSystemsStatusChart(systems);
        this.createInternalSystemsStatusChart(systems);
        this.createExternalSystemsStatusChart(systems);
        // Remove the old internal vs external systems type chart
        // this.createSystemsTypeChart(systems);
        // Hide requirements chart per requirement
        // this.createRequirementsStatusChart(requirements);
    }
}

// Create singleton instance
window.chartsComponent = new ChartsComponent();
