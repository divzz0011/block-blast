const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ukuran canvas
canvas.width = 480;
canvas.height = 320;

let score = 0;
const blocks = [];
const blockWidth = 40;
const blockHeight = 20;
const blockRowCount = 5;
const blockColumnCount = 8;

// Membuat blok
for (let c = 0; c < blockColumnCount; c++) {
  blocks[c] = [];
  for (let r = 0; r < blockRowCount; r++) {
    blocks[c][r] = { x: c * (blockWidth + 10), y: r * (blockHeight + 10), status: 1 };
  }
}

let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 2;
let ballDY = -2;

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

// Fungsi deteksi tabrakan bola dengan blok
function collisionDetection() {
  for (let c = 0; c < blockColumnCount; c++) {
    for (let r = 0; r < blockRowCount; r++) {
      let b = blocks[c][r];
      if (b.status == 1) {
        if (ballX > b.x && ballX < b.x + blockWidth && ballY > b.y && ballY < b.y + blockHeight) {
          ballDY = -ballDY;
          b.status = 0;
          score++;
          if (score == blockRowCount * blockColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

// Fungsi untuk menggambar bola
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Fungsi untuk menggambar paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Fungsi untuk menggambar blok
function drawBlocks() {
  for (let c = 0; c < blockColumnCount; c++) {
    for (let r = 0; r < blockRowCount; r++) {
      if (blocks[c][r].status == 1) {
        let b = blocks[c][r];
        ctx.beginPath();
        ctx.rect(b.x, b.y, blockWidth, blockHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Fungsi untuk menggambar skor
function drawScore() {
  document.getElementById("score").innerText = "Score: " + score;
}

// Fungsi utama game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Bersihkan canvas
  drawBlocks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();

  if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
    ballDX = -ballDX;
  }
  if (ballY + ballDY < ballRadius) {
    ballDY = -ballDY;
  } else if (ballY + ballDY > canvas.height - ballRadius) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      ballDY = -ballDY;
    } else {
      document.location.reload();  // Restart game jika bola jatuh
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  ballX += ballDX;
  ballY += ballDY;

  requestAnimationFrame(draw);  // Gambar ulang frame
}

// Mulai game
draw();
