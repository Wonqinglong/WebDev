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

const canvasSize = 20; // Default size
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
