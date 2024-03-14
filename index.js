const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

const blockSize = 20;
let loopId, fruit;
let score = 0;
let interval = 210;
let direction = "right";
let gameRunning = false;
let snake = [
  { x: 20, y: 20 },
  { x: 40, y: 20 },
];

const handleUserInput = {
  ArrowUp: function () {
    if (direction != "down") {
      direction = "up";
    }
  },
  ArrowRight: function () {
    if (direction != "left") {
      direction = "right";
    }
  },
  ArrowDown: function () {
    if (direction != "up") {
      direction = "down";
    }
  },
  ArrowLeft: function () {
    if (direction != "right") {
      direction = "left";
    }
  },
};

document.addEventListener("keydown", (e) => {
  const func = handleUserInput[e.key];
  if (func) {
    func();
  }
  if (e.key === " " && !gameRunning) {
    startGame();
  }
  if (e.key === "Escape") {
    stopGame();
  }
});

function draw() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  ctx.font = "80px monospace";
  ctx.textAlign = "center";
  ctx.strokeStyle = "#999";
  ctx.strokeText(`${score}`, 40, 570, 200);
  if (fruit) {
    ctx.fillStyle = "#FF3333";
    ctx.fillRect(fruit.x, fruit.y, blockSize, blockSize);
  }

  ctx.fillStyle = "#ddd";

  snake.forEach(function (block, index) {
    if (index === snake.length - 1) {
      ctx.fillStyle = "#888";
    }
    ctx.fillRect(block.x, block.y, blockSize, blockSize);
  });
}

function newFruit() {
  let x = Math.ceil(Math.random() * 29) * 20;
  let y = Math.ceil(Math.random() * 29) * 20;
  fruit = { x: x, y: y };
}

function moveSnake() {
  let head = snake[snake.length - 1];

  if (direction === "up") {
    snake.push({ x: head.x, y: head.y - blockSize });
  }
  if (direction === "right") {
    snake.push({ x: head.x + blockSize, y: head.y });
  }
  if (direction === "down") {
    snake.push({ x: head.x, y: head.y + blockSize });
  }
  if (direction === "left") {
    snake.push({ x: head.x - blockSize, y: head.y });
  }

  snake.shift();
  checkColision();
}

function gameLoop() {
  clearInterval(loopId);
  moveSnake();
  checkFruit();
  draw();

  loopId = setInterval(() => {
    gameLoop();
  }, interval);
}

function startGame() {
  snake = [
    { x: 20, y: 20 },
    { x: 40, y: 20 },
  ];
  direction = "right";
  gameRunning = true;
  newFruit();
  gameLoop();
  instructionElement.style.display = "none";
}

function stopGame() {
  gameRunning = false;
  clearInterval(loopId);
  fruit = undefined;
  draw();
  score = 0;
  interval = 250;
  instructionElement.style.display = "block";
}

function checkFruit() {
  let head = snake[snake.length - 1];

  if (head.x === fruit.x && head.y === fruit.y) {
    score++;
    snake.unshift({ x: -20, y: -20 });
    newFruit();
    interval = interval - interval * 0.07;
  }
}

function checkColision() {
  let head = snake[snake.length - 1];

  for (let i = 0; i < snake.length - 1; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      stopGame();
    }
  }

  if (head.x < 0 || head.x > canvas.clientWidth) {
    stopGame();
  }
  if (head.y < 0 || head.y > canvas.clientHeight) {
    stopGame();
  }
}

function displayInstructions() {
  let instructions = `Press 'space' to start and use the arrow keys to move the snake. Press 'Esc' to stop the game.`;
  instructionElement = document.createElement("div");
  instructionElement.style.width = "400px";
  instructionElement.style.position = "absolute";
  instructionElement.style.top = "50%";
  instructionElement.style.left = "50%";
  instructionElement.style.transform = "translate(-50%, -50%)";
  instructionElement.style.textAlign = "center";
  instructionElement.textContent = instructions;
  document.body.appendChild(instructionElement);
}

draw();
displayInstructions();
