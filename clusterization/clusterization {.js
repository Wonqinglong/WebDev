function generateCanvas(size) {
    const canvas = document.getElementById('canvas');
    canvas.innerHTML = '';

    const maxSize = Math.min(size, 30); // Maximum size of 30
    for (let i = 0; i < maxSize; i++) {
        for (let j = 0; j < maxSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            canvas.appendChild(cell);
        }
    }

    canvas.style.gridTemplateColumns = `repeat(${maxSize}, 20px)`;
    canvas.style.gridTemplateRows = `repeat(${maxSize}, 20px)`;
}

const canvasSize = 30; // Default size
generateCanvas(canvasSize);
const cells = document.querySelectorAll('.cell');

cells.forEach(cell => {

  cell.addEventListener('click', () => {
    cell.style.backgroundColor = 'black';
  });

});

function clearCanvas() {

  cells.forEach(cell => {
    cell.style.backgroundColor = '';
  });

}
// Define the Canvas class
class Canvas {
    constructor(size) {
      this.size = size;
      this.points = [];
    }
  
    addPoint(x, y) {
      if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
        this.points.push({ x, y });
      }
    }
  
    displayClusters(clusters) {
      const canvas = document.getElementById('canvas');
      canvas.innerHTML = '';
  
      const cellSize = 1;
      canvas.style.width = `${this.size * cellSize}px`;
      canvas.style.height = `${this.size * cellSize}px`;
  
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.style.width = `${cellSize}px`;
          cell.style.height = `${cellSize}px`;
          canvas.appendChild(cell);
        }
      }
  
      clusters.forEach((cluster, index) => {
        const color = getRandomColor();
        cluster.forEach(point => {
          const cellIndex = point.x * this.size + point.y;
          canvas.children[cellIndex].style.backgroundColor = color;
        });
      });
    }
  }
  
  function kMeansClustering(points, k) {
    function kMeansClustering(points, k) {
        // Step 1: Initialize centroids
        let centroids = [];
        for (let i = 0; i < k; i++) {
            centroids.push(points[Math.floor(Math.random() * points.length)]);
        }
        
        let iterations = 0;
        const maxIterations = 100; // Maximum number of iterations
        
        // Iterate until convergence or maximum iterations reached
        while (iterations < maxIterations) {
            // Step 2: Assignment - assign each point to the nearest centroid
            const clusters = assignPointsToCentroids(points, centroids);
            
            // Step 3: Update centroids
            const newCentroids = updateCentroids(clusters);
            
            // Check for convergence by comparing centroids
            let converged = true;
            for (let i = 0; i < k; i++) {
                if (!arePointsEqual(centroids[i], newCentroids[i])) {
                    converged = false;
                    break;
                }
            }
            
            if (converged) {
                break;
            }
            
            centroids = newCentroids;
            iterations++;
        }
        
        return clusters;
    }
    
    function assignPointsToCentroids(points, centroids) {
        const clusters = new Array(centroids.length).fill().map(() => []);
        points.forEach(point => {
            let minDistance = Infinity;
            let closestCentroidIndex = -1;
            centroids.forEach((centroid, index) => {
                const distance = euclideanDistance(point, centroid);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCentroidIndex = index;
                }
            });
            clusters[closestCentroidIndex].push(point);
        });
        return clusters;
    }
    
    function updateCentroids(clusters) {
        return clusters.map(cluster => {
            if (cluster.length === 0) return null; // Handle empty cluster
            let sumX = 0, sumY = 0;
            cluster.forEach(point => {
                sumX += point.x;
                sumY += point.y;
            });
            return { x: sumX / cluster.length, y: sumY / cluster.length };
        });
    }
    
    function euclideanDistance(point1, point2) {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }
    
    function arePointsEqual(point1, point2) {
        return point1.x === point2.x && point1.y === point2.y;
    }
    
    return clusters;
  }
  
  // Function to generate a random color
  function getRandomColor() {
   
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
    
  
  
  const canvas = new Canvas(30);
  
  document.getElementById('canvas').addEventListener('click', event => {
    const cellSize = 1;
    const x = Math.floor(event.offsetX / cellSize);
    const y = Math.floor(event.offsetY / cellSize);
    canvas.addPoint(x, y);
    event.target.style.backgroundColor = 'black';
  });
  
  document.getElementById('start-algorithm').addEventListener('click', () => {
    const k = parseInt(prompt("Enter the number of clusters:"));
    if (!isNaN(k)) {
      const clusters = kMeansClustering(canvas.points, k);
      canvas.displayClusters(clusters);
    } else {
      alert("Invalid input. Please enter a valid number.");
    }
  });
  
  document.getElementById('clear-canvas').addEventListener('click', () => {
    canvas.points = [];
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.style.backgroundColor = '';
    });
  });
