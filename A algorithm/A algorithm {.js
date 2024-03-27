function generateCanvas(size) {
        const canvas = document.getElementById('canvas');
        canvas.innerHTML = '';

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                canvas.appendChild(cell);
            }
        }

        canvas.style.gridTemplateColumns = `repeat(${size}, 20px)`;
        canvas.style.gridTemplateRows = `repeat(${size}, 20px)`;
    }

   
    const canvasSize = 20;
    generateCanvas(canvasSize);

 function generatePoints(count) {
  const cells = document.querySelectorAll('.cell');
  const randomCells = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * cells.length);
    randomCells.push(cells[randomIndex]);
  }


  randomCells.forEach(cell => {
    cell.style.backgroundColor = 'black';
  });
}
let wallnumber= prompt("Please enter the number of walls")

generatePoints(wallnumber);
let selectedCell = null;

const setGreenBtn = document.getElementById('set-green');
const cells = document.querySelectorAll('.cell');

setGreenBtn.addEventListener('click', () => {
selectedCell = null;
});

cells.forEach(cell => {
cell.addEventListener('click', () => {
if (!selectedCell) {
selectedCell = cell;
cell.style.backgroundColor = 'green';
}
});
});
const setRedBtn = document.getElementById('set-red');
const gridCells = document.querySelectorAll('.cell');

let isSettingRed = false;

setRedBtn.addEventListener('click', () => {
  isSettingRed = true;
});

let lastClickedGridCell = null;

gridCells.forEach(cell => {
  cell.addEventListener('click', () => {
    if(isSettingRed) {
      lastClickedGridCell = cell;
      cell.style.backgroundColor = 'red';
      isSettingRed = false;
    }
  });
});
// Define grid and nodes
const grid = [];
let openSet = [];
    let closedSet = [];
    let startNode = null;
    let endNode = null;


// Define Node class
class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.g = Infinity;
        this.h = 0;
        this.f = 0;
        this.neighbors = [];
        this.previous = null;
        this.wall = false;
    }

    addNeighbors(grid, lookupRadius) {
        const { x, y } = this;
        for (let i = x - lookupRadius; i <= x + lookupRadius; i++) {
            for (let j = y - lookupRadius; j <= y + lookupRadius; j++) {
                if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
                    this.neighbors.push(grid[i][j]);
                }
            }
        }
    }
}


// Initialize grid and nodes
for (let i = 0; i < canvasSize; i++) {
    grid[i] = [];
    for (let j = 0; j < canvasSize; j++) {
        const cell = cells[i * canvasSize + j];
        const node = new Node(i, j);
        if (cell.style.backgroundColor === 'black') {
            node.wall = true;
        }
        grid[i][j] = node;
    }
}

// Add neighbors to each node with a lookup radius of 1
for (let i = 0; i < canvasSize; i++) {
    for (let j = 0; j < canvasSize; j++) {
        grid[i][j].addNeighbors(grid, 1);
    }
}
document.getElementById('start-algorithm').addEventListener('click', () => {
    // Clear the canvas
    clearCanvas();

    // Reset the algorithm
    openSet = [];
    closedSet = [];
    startNode = null;
    endNode = null;

    // Set start and end points
    if (selectedCell) {
        const index = Array.from(cells).indexOf(selectedCell);
        startNode = grid[Math.floor(index / canvasSize)][index % canvasSize];
    }
    if (lastClickedGridCell) {
        const index = Array.from(cells).indexOf(lastClickedGridCell);
        endNode = grid[Math.floor(index / canvasSize)][index % canvasSize];
    }

    // Execute the algorithm
    if (startNode && endNode) {
        const path = aStar();
        visualizePath(path);
    } else {
        alert("Please set both start and end points before starting the algorithm.");
    }
});

// A* algorithm
function aStar() {
    openSet.push(startNode);

    while (openSet.length > 0) {
        let winner = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }

        const current = openSet[winner];

        if (current === endNode) {
            // Path found
            let path = [];
            let temp = current;
            path.push(temp);
            while (temp.previous) {
                path.push(temp.previous);
                temp = temp.previous;
            }
            return path;
        }

        openSet = openSet.filter(node => node !== current);
        closedSet.push(current);

        for (let neighbor of current.neighbors) {
            if (!closedSet.includes(neighbor) && !neighbor.wall) {
                const tempG = current.g + 1;

                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                    }
                } else {
                    neighbor.g = tempG;
                    openSet.push(neighbor);
                }

                neighbor.h = heuristic(neighbor, endNode);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = current;
            }
        }
    }

    return []; // No path found
}

// Heuristic function (Manhattan distance)
function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// Update cell colors to visualize path
function visualizePath(path) {
    for (let node of path) {
        const cell = cells[node.x * canvasSize + node.y];
        cell.style.backgroundColor = 'blue';
    }
}

// Handle click events to set start and end points
setGreenBtn.addEventListener('click', () => {
    if (selectedCell) {
        const index = Array.from(cells).indexOf(selectedCell);
        startNode = grid[Math.floor(index / canvasSize)][index % canvasSize];
        selectedCell = null;
    }
});

setRedBtn.addEventListener('click', () => {
    if (lastClickedGridCell) {
        const index = Array.from(cells).indexOf(lastClickedGridCell);
        endNode = grid[Math.floor(index / canvasSize)][index % canvasSize];
        lastClickedGridCell = null;
    }
});

document.getElementById('start-algorithm').addEventListener('click', () => {
        openSet = [];
        closedSet = [];
        startNode = null;
        endNode = null;

        if (selectedCell) {
            const index = Array.from(cells).indexOf(selectedCell);
            startNode = grid[Math.floor(index / canvasSize)][index % canvasSize];
        }
        if (lastClickedGridCell) {
            const index = Array.from(cells).indexOf(lastClickedGridCell);
            endNode = grid[Math.floor(index / canvasSize)][index % canvasSize];
        }

        if (startNode && endNode) {
            const path = aStar();
            visualizePath(path);
        } else {
            alert("Please set both start and end points before starting the algorithm.");
        }
    });
    function clearCanvas() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.style.backgroundColor = '';
        });
    }