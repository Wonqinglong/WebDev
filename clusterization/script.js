function generateCanvas() {
    const canvasSize = parseInt(document.getElementById('canvas-size').value);
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const cellSize = 20; // Adjust as needed for cell size
  
    canvas.width = canvasSize * cellSize;
    canvas.height = canvasSize * cellSize;
  
    for (let x = 0; x < canvasSize; x++) {
      for (let y = 0; y < canvasSize; y++) {
        ctx.fillStyle = '#ffffff'; // Set initial color to white
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
  
const k = Number(prompt('Enter value of K'))
const chart = new Chart(document.querySelector('#chart'), {
    type: 'scatter',
    data: chartData(),
    options: chartOptions()
})
let preventCallBack = false

document.addEventListener('keydown', async () => {
    if (!preventCallBack) {
        preventCallBack = true
        let clusterCentersLocs = ['code']
        let clusterCenterNewLocs = ['tonight']

        while (JSON.stringify(clusterCentersLocs) != JSON.stringify(clusterCenterNewLocs)) {
            clusterCenterNewLocs = []
            for (let i = 0; i < k; i++) {
                clusterCenterNewLocs.push(chart.data.datasets[0].data[i])
            }

            await labelDataPoints()
            recenterClusterCenters()
        }
    }

    alert('Process Complete Open the console to see the results.')
    consoleResults()
})

function consoleResults() {
    const clusters = getClusters()
    for (let i = 0; i < clusters.length; i++) {
        console.log(`Category ${String.fromCharCode(i + 65)} patients:`)
        console.table(clusters[i])
    }
}

async function recenterClusterCenters() {
    return new Promise((resolve, reject) => {
        const clusters = getClusters()

        clusters.forEach((cluster, i) => {
            let sumX = 0
            let sumY = 0
            cluster.forEach((dataPoint, j) => {
                sumX = sumX + dataPoint.x
                sumY = sumY + dataPoint.y
            })
            if (cluster.length) {
                chart.data.datasets[0].data[i] = { x: Number((sumX / cluster.length).toFixed(2)), y: Number((sumY / cluster.length).toFixed(2)) }
            }
        })

        chart.update(3000)
        setTimeout(() => resolve(), 3000)
    })
}

function getClusters() {
    let clusters = []
    for (let i = 0; i < k; i++) {
        clusters.push([])
    }

    const colors = ['red', 'blue', 'green', 'yellow'].slice(0, k)
    for (let i = k; i < chart.data.datasets[0].data.length; i++) {
        for (let j = 0; j < colors.length; j++) {
            if (chart.data.datasets[0].pointBackgroundColor[i] == colors[j]) {
                clusters[j].push(chart.data.datasets[0].data[i])
            }
        }
    }
    return clusters
}

async function labelDataPoints() {
    return new Promise((resolve, reject) => {
        dataSet().forEach((dataPoint, i) => {
            let distances = []
            for (let j = 0; j < k; j++) {
                const clusterCenterX = chart.data.datasets[0].data[j].x
                const clusterCenterY = chart.data.datasets[0].data[j].y
                distances.push(Math.sqrt(((clusterCenterX - dataPoint.WGB) ** 2) + ((clusterCenterY - dataPoint.RGB) ** 2)))
            }
            const minValue = Math.min.apply(Math, distances)
            const index = distances.indexOf(minValue)
            chart.data.datasets[0].pointBackgroundColor[i + k] = chart.data.datasets[0].pointBackgroundColor[index]
        });
        chart.update(2000)
        setTimeout(() => resolve(), 2000)
    })
}
