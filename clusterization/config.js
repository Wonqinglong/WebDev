function chartData() {
    return {
      datasets: [
        {
          label: 'Patient data chart',
          data: dataSet().map((dataPoint) => {
            return { x: dataPoint.WGB, y: dataPoint.RGB }
          }),
          pointStyle: dataSet().map(() => 'circle'),
          pointRadius: dataSet().map(() => 5.5),
          pointBackgroundColor: [],
          showLine: false,
          backgroundColor: 'aqua'
        }
      ]
    }
  }
  
  function chartOptions() {
    return {
      maintainAspectRatio: false,
      legend: {
        labels: {
          fontSize: 20
        }
      },
      responsive: true,
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'WGB level',
              fontSize: 20
            },
            ticks: {
              fontSize: 20,
              max: 10,
              min: 0
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'RGB Level',
              fontSize: 20
            },
            ticks: {
              fontSize: 20,
              max: 10,
              min: 0
            }
          }
        ]
      }
    }
  }
  