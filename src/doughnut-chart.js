export const doughnutChartData = {
    type: 'doughnut',
    data: {
        labels: ["Item 1", "Item 2", "Item 3"],
        datasets: [{
            label: "Population (millions)",
            backgroundColor: ["#5969FF", "#f83e70","#ffaa2c"],
            data: [2478,5267,734]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: 'Test chart'
        }
    }
}

export default doughnutChartData
