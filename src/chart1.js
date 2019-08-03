export const planetChartData = {
    type: 'line',
    data: {
        labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"],
        datasets: [{
            label: "Github Commits by Month",
            borderColor: "rgba(116, 235, 213, 1)",
            pointBorderColor: "rgba(116, 235, 213, 1)",
            pointBackgroundColor: "rgba(116, 235, 213, 1)",
            pointHoverBackgroundColor: "rgba(116, 235, 213, 1)",
            pointHoverBorderColor: "rgba(116, 235, 213, 1)",
            pointBorderWidth: 10,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 1,
            pointRadius: .5,
            fill: true,
            backgroundColor: "rgba(116, 235, 213, 0.6)",
            borderWidth: 4,
            data: [12, 17, 3, 5, 2, 3, 6]
        }]
    },
    options: {
        legend: {
            position: "bottom",
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: "rgba(0,0,0,0.5)",
                    fontStyle: "bold",
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    padding: 20
                },
                gridLines: {
                    drawTicks: false,
                    display: false
                }

            }],
            xAxes: [{
                gridLines: {
                    zeroLineColor: "transparent"
                },
                ticks: {
                    padding: 20,
                    fontColor: "rgba(0,0,0,0.5)",
                    fontStyle: "bold"
                }
            }]
        }
    }
}
    export default planetChartData;