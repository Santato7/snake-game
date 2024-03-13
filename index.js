const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

const blockSize = 20;
let loopId, fruit;
let interval = 250;
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
  ctx.clearRect(0, 0, 600, 600);

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
}

function gameLoop() {
  clearInterval(loopId);
  moveSnake();
  checkFruit();
  // newFruit();
  draw();

  loopId = setInterval(() => {
    gameLoop();
  }, interval);
}

function startGame() {
  gameRunning = true;
  newFruit();
  gameLoop();
}

function stopGame() {
  gameRunning = false;
  clearInterval(loopId);
  snake = [
    { x: 20, y: 20 },
    { x: 40, y: 20 },
  ];
  fruit = undefined;
  draw();
}

function checkFruit() {
  let head = snake[snake.length - 1];

  if (head.x === fruit.x && head.y === fruit.y) {
    snake.unshift({ x: -20, y: -20 });
    newFruit();
    interval = interval - interval * 0.1;
  }
}

draw();