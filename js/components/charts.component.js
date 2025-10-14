/**
 * Charts Component
 * Handles all chart visualizations using Chart.js
 */

class ChartsComponent {
    constructor() {
        this.charts = {};
        this.defaultColors = {
            active: '#10b981',
            'in-develop': '#3b82f6',
            review: '#f59e0b',
            planing: '#8b5cf6',
            retired: '#6b7280',
            done: '#10b981',
            pending: '#ef4444',
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
            'review': 'Review',
            'planing': 'Planning',
            'retired': 'Retired',
            'done': 'Done',
            'pending': 'Pending',
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
     * Update charts with new data
     */
    updateCharts(systems, requirements) {
        this.createSystemsStatusChart(systems);
        this.createRequirementsStatusChart(requirements);
    }
}

// Create singleton instance
window.chartsComponent = new ChartsComponent();
