export const barChartData = {
    type: 'horizontalBar',
    data: {
        labels: ['HTML5', 'CSS3', 'JavaScript', 'Vue', 'Node', 'Electron'],
        datasets: [{
            label: 'Value in %',
            borderColor: '#5969FF',
            fill: true,
            backgroundColor: 'rgba(89, 105, 255, 0.6)',
            borderWidth: 4,
            data: [70, 75, 60, 45, 50, 80]
        }]
    },
    options: {
        scales: {
            xAxes: [{
                ticks: {
                    min: 0,
                    max: 100,
                    stepSize: 10
                }
            }]
        }
    }
}

export default barChartData