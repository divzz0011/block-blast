const grid = document.getElementById("grid");
const piecesContainer = document.getElementById("pieces");
const scoreDisplay = document.getElementById("score");

const gridSize = 10;
let gridCells = [];
let score = 0;

function createGrid() {
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    grid.appendChild(cell);
    gridCells.push(cell);
  }
}

function generatePiece(shape) {
  const piece = document.createElement("div");
  piece.classList.add("piece");

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    if (shape.includes(i)) cell.classList.add("active");
    piece.appendChild(cell);
  }

  piece.draggable = true;

  piece.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("shape", JSON.stringify(shape));
  });

  piecesContainer.appendChild(piece);
}

function createPieces() {
  piecesContainer.innerHTML = "";
  const shapes = [
    [6, 7, 8],
    [1, 6, 11],
    [6, 7, 11, 12],
    [1, 6, 7],
    [1, 6, 11, 12],
    [6],
    [6, 11],
    [6, 11, 16],
    [6, 7],
    [6, 11, 17]
  ];

  for (let i = 0; i < 3; i++) {
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    generatePiece(randomShape);
  }
}

grid.addEventListener("dragover", (e) => e.preventDefault());

grid.addEventListener("drop", (e) => {
  const shape = JSON.parse(e.dataTransfer.getData("shape"));
  const dropTarget = e.target.closest(".cell");
  if (!dropTarget) return;

  const dropIndex = Number(dropTarget.dataset.index);
  const baseRow = Math.floor(dropIndex / gridSize);
  const baseCol = dropIndex % gridSize;

  // Cari offset minimum (kiri-atas dari shape)
  let minRow = Infinity;
  let minCol = Infinity;
  shape.forEach(i => {
    const r = Math.floor(i / 5);
    const c = i % 5;
    if (r < minRow) minRow = r;
    if (c < minCol) minCol = c;
  });

  let valid = true;
  let fillIndices = [];

  shape.forEach(i => {
    const r = Math.floor(i / 5) - minRow;
    const c = i % 5 - minCol;
    const tr = baseRow + r;
    const tc = baseCol + c;
    if (tr >= gridSize || tc >= gridSize) {
      valid = false;
    } else {
      const idx = tr * gridSize + tc;
      if (gridCells[idx].classList.contains("filled")) valid = false;
      fillIndices.push(idx);
    }
  });

  if (valid) {
    fillIndices.forEach(i => gridCells[i].classList.add("filled"));
    checkLines();
    createPieces();
    if (!canPlaceAnyPiece()) {
      alert("Game Over! Skor akhir: " + score);
      location.reload();
    }
  }
});

// Touch events for mobile
if ('ontouchstart' in window) {
  grid.addEventListener('touchstart', handleTouchStart);
  grid.addEventListener('touchmove', handleTouchMove);
  grid.addEventListener('touchend', handleTouchEnd);
} else {
  // Mouse events for desktop
  grid.addEventListener('mousedown', handleMouseStart);
  grid.addEventListener('mousemove', handleMouseMove);
  grid.addEventListener('mouseup', handleMouseEnd);
}

// Handle drag start for mobile
function handleTouchStart(e) {
  const touch = e.touches[0];
  const shape = JSON.parse(e.target.dataset.shape);
  const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
  const dropIndex = Number(dropTarget.dataset.index);
  // Simulate a drop process with touch input
  handleDrop(shape, dropIndex);
}

// Handle drag move for mobile
function handleTouchMove(e) {
  const touch = e.touches[0];
  const targetCell = document.elementFromPoint(touch.clientX, touch.clientY);
  const dropIndex = Number(targetCell.dataset.index);
  // Add logic for touch movement (visual feedback on movement)
}

// Handle drag end for mobile
function handleTouchEnd(e) {
  const touch = e.changedTouches[0];
  const targetCell = document.elementFromPoint(touch.clientX, touch.clientY);
  const dropIndex = Number(targetCell.dataset.index);
  // Simulate drop action on mobile
  const shape = JSON.parse(e.target.dataset.shape);
  handleDrop(shape, dropIndex);
}

// Handle drag start for desktop
function handleMouseStart(e) {
  const shape = JSON.parse(e.target.dataset.shape);
  const dropTarget = e.target.closest(".cell");
  const dropIndex = Number(dropTarget.dataset.index);
  handleDrop(shape, dropIndex);
}

// Handle mouse move for desktop
function handleMouseMove(e) {
  const targetCell = document.elementFromPoint(e.clientX, e.clientY);
  const dropIndex = Number(targetCell.dataset.index);
  // Add logic for mouse movement (visual feedback on movement)
}

// Handle mouse end for desktop
function handleMouseEnd(e) {
  const targetCell = document.elementFromPoint(e.clientX, e.clientY);
  const dropIndex = Number(targetCell.dataset.index);
  const shape = JSON.parse(e.target.dataset.shape);
  handleDrop(shape, dropIndex);
}

// Handle the drop logic for both touch and mouse
function handleDrop(shape, dropIndex) {
  const baseRow = Math.floor(dropIndex / gridSize);
  const baseCol = dropIndex % gridSize;

  let minRow = Infinity;
  let minCol = Infinity;
  shape.forEach(i => {
    const r = Math.floor(i / 5);
    const c = i % 5;
    if (r < minRow) minRow = r;
    if (c < minCol) minCol = c;
  });

  let valid = true;
  let fillIndices = [];

  shape.forEach(i => {
    const r = Math.floor(i / 5) - minRow;
    const c = i % 5 - minCol;
    const tr = baseRow + r;
    const tc = baseCol + c;
    if (tr >= gridSize || tc >= gridSize) {
      valid = false;
    } else {
      const idx = tr * gridSize + tc;
      if (gridCells[idx].classList.contains("filled")) valid = false;
      fillIndices.push(idx);
    }
  });

  if (valid) {
    fillIndices.forEach(i => gridCells[i].classList.add("filled"));
    checkLines();
    createPieces();
    if (!canPlaceAnyPiece()) {
      alert("Game Over! Skor akhir: " + score);
      location.reload();
    }
  }
}

function checkLines() {
  for (let r = 0; r < gridSize; r++) {
    let fullRow = true;
    for (let c = 0; c < gridSize; c++) {
      if (!gridCells[r * gridSize + c].classList.contains("filled")) {
        fullRow = false;
        break;
      }
    }
    if (fullRow) {
      for (let c = 0; c < gridSize; c++) {
        gridCells[r * gridSize + c].classList.remove("filled");
      }
      score += 10;
    }
  }

  for (let c = 0; c < gridSize; c++) {
    let fullCol = true;
    for (let r = 0; r < gridSize; r++) {
      if (!gridCells[r * gridSize + c].classList.contains("filled")) {
        fullCol = false;
        break;
      }
    }
    if (fullCol) {
      for (let r = 0; r < gridSize; r++) {
        gridCells[r * gridSize + c].classList.remove("filled");
      }
      score += 10;
    }
  }

  scoreDisplay.textContent = score;
}

function canPlaceAnyPiece() {
  const allPieces = piecesContainer.querySelectorAll(".piece");
  if (allPieces.length === 0) return true;

  for (const piece of allPieces) {
    const shape = [];
    piece.querySelectorAll("div").forEach((el, i) => {
      if (el.classList.contains("active")) shape.push(i);
    });

    for (let i = 0; i < gridCells.length; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;

      let valid = true;
      for (let j = 0; j < shape.length; j++) {
        const r = Math.floor(shape[j] / 5);
        const c = shape[j] % 5;
        const tr = row + r;
        const tc = col + c;
        if (tr >= gridSize || tc >= gridSize) {
          valid = false;
          break;
        }
        const idx = tr * gridSize + tc;
        if (gridCells[idx].classList.contains("filled")) {
          valid = false;
          break;
        }
      }

      if (valid) return true;
    }
  }

  return false;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

createGrid();
createPieces();
