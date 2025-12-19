const apiKey = 'd52i17hr01qqu01v6af0d52i17hr01qqu01v6afg'; // Your Key
let stockChart;

async function fetchStockData(ticker, months) {
    const end = Math.floor(Date.now() / 1000);
    const start = end - (months * 30 * 24 * 60 * 60);
    
    // Using 'D' for daily resolution to ensure consistency
    const url = `https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=D&from=${start}&to=${end}&token=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.s === "no_data") throw new Error("No data found for this ticker.");
        return data;
    } catch (err) {
        alert(err.message);
        return null;
    }
}

async function updateChart() {
    const ticker = document.getElementById('tickerInput').value.toUpperCase();
    const timeframe = document.getElementById('timeframe').value;
    const data = await fetchStockData(ticker, timeframe);

    if (!data) return;

    const labels = data.t.map(timestamp => new Date(timestamp * 1000).toLocaleDateString());
    const prices = data.c;

    if (stockChart) stockChart.destroy();

    const ctx = document.getElementById('stockChart').getContext('2d');
    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${ticker} Price`,
                data: prices,
                borderColor: '#ff8c42',
                backgroundColor: 'rgba(255, 140, 66, 0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } },
                y: { grid: { color: '#f0f0f0' } }
            }
        }
    });
}

// Initial load
window.onload = updateChart;
