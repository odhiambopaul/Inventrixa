const ctx = document.getElementById('salesChart');

new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Sales (KSh)',
            data: [12000, 19000, 15000, 22000, 28000, 24000, 32000],
            borderWidth: 3,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true
            }
        }
    }
});

// Top Products Chart

const topProductsCtx = document.getElementById('topProductsChart');

new Chart(topProductsCtx, {
    type: 'bar',
    data: {
        labels: ['Sugar', 'Milk', 'Rice', 'Flour', 'Cooking Oil'],
        datasets: [{
            label: 'Sales (KSh)',
            data: [85000, 72000, 65000, 54000, 48000],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Inventory by Category Chart

const inventoryCtx = document.getElementById('inventoryChart');

new Chart(inventoryCtx, {
    type: 'pie',
    data: {
        labels: ['Food', 'Beverages', 'Cleaning', 'Personal Care'],
        datasets: [{
            label: 'Inventory',
            data: [40, 25, 20, 15],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'right'
            }
        }
    }
});