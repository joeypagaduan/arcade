let score = 0;
let hiScore = 0;

const snakeBody = "red";
const snakeBorder = "red";

let snake = [
    {x: 200, y: 200},
    {x: 190, y: 200},
    {x: 180, y: 200},
    {x: 170, y: 200},
    {x: 160, y: 200},
    {x: 150, y: 200},
    {x: 140, y: 200},
    {x: 130, y: 200},
    {x: 120, y: 200}
]

//init. speed
let snakeSpeed = 10;
let dx = 10;
let dy = 0;

//init. food

let growthX;
let growthY;
let speedX;
let speedY;
let slowX;
let slowY;
let snakehole1x;
let snakehole1y;
let snakehole2x;
let snakehole2y;


//my gameboard
const board = document.getElementById("gameBoard");
const boardContext = gameBoard.getContext("2d");

// //#region setting the size
// const canvasSizeBtn = document.getElementById("canvasSizeBtn");
// canvasSizeBtn.addEventListener("click", setCanvasSize);

// function setCanvasSize() {
//   const canvasWidth = document.getElementById("canvasWidth").value;
//   const canvasHeight = document.getElementById("canvasHeight").value;
//   board.width = canvasWidth;
//   board.height = canvasHeight;
//   width = canvasWidth;
//   height = canvasHeight;
//   clearCanvas();
// }
//#endregion
const width = 500;
const height = 500;
const squareSize = 10;
gameBoard.width = width;
gameBoard.height = height;


 // coloring the board
 function clearCanvas() {
  for (let row = 0; row < height / squareSize; row++) {
    for (let col = 0; col < width / squareSize; col++) {
      const x = col * squareSize;
      const y = row * squareSize;
      if ((row + col) % 2 === 0) {
        boardContext.fillStyle = 'teal';
      } else {
        boardContext.fillStyle = 'purple';
      }
      boardContext.fillRect(x, y, squareSize, squareSize);
    }
  }
}

generateSpeed();
generateSlow();
generateGrowth();
snakehole1();
snakehole2();
document.addEventListener("keydown", nextDirection);
document.getElementById('easy_button').addEventListener('click', easyGame);
document.getElementById('medium_button').addEventListener('click', mediumGame);
document.getElementById('hard_button').addEventListener('click', hardGame);
const buttons = document.querySelector('#container');
const bgMusic = document.getElementById('bg_music');
const gameOverFx = new Audio("./fx/game-over-arcade-6435.mp3")

//GameState
function main() {
    timeoutId = setTimeout(function tick() 
    { 
      buttons.style.display = 'none';
      clearCanvas();    
      slither(); 
      hiScoreUpdate(); 
      drawSnake();
      drawGrowth();
      drawSpeed();
      drawSlow();
      drawSnakehole1();
      drawSnakehole2();
      bgMusic.play();
      main();
    }, 750 / snakeSpeed)

    if (gameOver()) {
        buttons.style.display = '';
        boardContext.fillStyle="white";
        boardContext.font="3vw Silkscreen";
        boardContext.fillText("Game Over", gameBoard.clientWidth/5, gameBoard.clientHeight/2.25);
        bgMusic.pause();
        clearTimeout(timeoutId);
        gameOverFx.play();
      }
 }
 
//#region snake speed adjusting
 const increaseSpeed = () => {
  snakeSpeed += 3;
}
const decreaseSpeed = () => {
  snakeSpeed -= 2;
}
//#endregion

//#region draw my snake
function drawSnake() {
    snake.forEach(drawSnakePart)
  }
  

function drawSnakePart(snakePart) {
    boardContext.fillStyle = snakeBody;
    boardContext.strokeStyle = snakeBorder;
    boardContext.fillRect(snakePart.x, snakePart.y, 10, 10);
    boardContext.strokeRect(snakePart.x, snakePart.y, 10, 10);
  }
  //#endregion

  //#region food begins
    //randon coordinates for food
  function random_food(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
  }

  function generateGrowth() {
    growthX = random_food(0, gameBoard.width - 10);
    growthY = random_food(0, gameBoard.height - 10);
      ////generate where snake is not/////
    snake.forEach(function has_snake_eaten_food(part) {
      const eatenGrowth = part.x == growthX && part.y == growthY;
      if (eatenGrowth) generateGrowth();
    });
  }

  function drawGrowth() {
    boardContext.fillStyle = 'white';
    boardContext.strokeStyle = 'white';

    //square fruit
    // boardContext.fillRect(growthX, growthY, 10, 10);
    // boardContext.strokeRect(growthX, growthY, 10, 10);

    //circular fruit
    boardContext.beginPath();
    boardContext.arc(growthX + 5, growthY + 5, 5, 0, 2 * Math.PI); //had to offset the drawing by 5 pixels on each axis to center the round object on the board
    boardContext.fill();
  }

  function generateSpeed() {
    speedX = random_food(0, gameBoard.width - 10);
    speedY = random_food(0, gameBoard.height - 10);
      ////generate where snake is not/////
    snake.forEach(function has_snake_eaten_food(part) {
      const eatenSpeed = part.x == speedX && part.y == speedY;
      if (eatenSpeed) generateSpeed();
    });
  }

  function drawSpeed() {
    boardContext.fillStyle = 'yellow';
    boardContext.strokeStyle = 'yellow';
    boardContext.beginPath();
    boardContext.arc(speedX + 5, speedY + 5, 5, 0, 2 * Math.PI); //had to offset the drawing by 5 pixels on each axis to center the round object on the board
    boardContext.fill();
  }

  function generateSlow() {
    slowX = random_food(0, gameBoard.width - 10);
    slowY = random_food(0, gameBoard.height - 10);
      ////generate where snake is not/////
    snake.forEach(function has_snake_eaten_food(part) {
      const eatenSlow = part.x == slowX && part.y == slowY;
      if (eatenSlow) generateSlow();
    });
  }

  function drawSlow() {
    boardContext.fillStyle = 'red';
    boardContext.strokeStyle = 'red';
    boardContext.beginPath();
    boardContext.arc(slowX + 5, slowY + 5, 5, 0, 2 * Math.PI); //had to offset the drawing by 5 pixels on each axis to center the round object on the board
    boardContext.fill();
  }
  //#endregion

  //#region worm(snake)hole
  function snakehole1() {
    snakehole1x = random_food(0, gameBoard.width - 10);
    snakehole1y = random_food(0, gameBoard.height - 10);
      ////generate where snake is not/////
    snake.forEach(function has_snake_eaten_food(part) {
      const teleport1 = part.x == snakehole1x && part.y == snakehole1y;
    });
  }

  function drawSnakehole1() {
    boardContext.fillStyle = 'black';
    boardContext.strokeStyle = 'black';
    boardContext.beginPath();
    boardContext.arc(snakehole1x + 5, snakehole1y + 5, 5, 0, 2 * Math.PI); //had to offset the drawing by 5 pixels on each axis to center the round object on the board
    boardContext.fill();
  }

  function snakehole2() {
    snakehole2x = random_food(0, gameBoard.width - 10);
    snakehole2y = random_food(0, gameBoard.height - 10);
      ////generate where snake is not/////
    snake.forEach(function has_snake_eaten_food(part) {
      const teleport2 = part.x == snakehole2x && part.y == snakehole2y;
    });
  }

  function drawSnakehole2() {
    boardContext.fillStyle = 'black';
    boardContext.strokeStyle = 'black';
    boardContext.beginPath();
    boardContext.arc(snakehole2x + 5, snakehole2y + 5, 5, 0, 2 * Math.PI); //had to offset the drawing by 5 pixels on each axis to center the round object on the board
    boardContext.fill();
  }
  //#endregion

  //#region Changing the snake's direction
  function nextDirection(event) {
    const up = dy === -10;
    const down = dy === 10;
    const left = dx === -10;
    const right = dx === 10;
    //keeping the snake from taking a 180
    if (event.key === "ArrowUp" && !down) {
        dx = 0;
        dy = -10;
    } else if (event.key === "ArrowDown" && !up) {
        dx = 0;
        dy = 10;
    } else if (event.key === "ArrowLeft" && !right) {
        dx = -10;
        dy = 0;
    } else if (event.key === "ArrowRight" && !left) {
        dx = 10;
        dy = 0;
    }
  }
  //#endregion
  
  //#region snake movement and event handling
  function slither() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    const eatenGrowth_food = snake[0].x === growthX && snake[0].y === growthY;
    const eatenSpeed_food = snake[0].x === speedX && snake[0].y === speedY;
    const eatenSlow_food = snake[0].x === slowX && snake[0].y === slowY;
    const teleported1 = snake[0].x === snakehole1x && snake[0].y === snakehole1y;
    const teleported2 = snake[0].x === snakehole2x && snake[0].y === snakehole2y;
    if (eatenGrowth_food) {
      score += 20;
      document.getElementById('score').innerHTML = score;
      generateGrowth();
    } 
    else if (eatenSpeed_food) {
      score += 100;
      document.getElementById('score').innerHTML = score;
      increaseSpeed();
      generateSpeed();
      snake.pop();
    }
    else if (eatenSlow_food) {
      score += 10;
      document.getElementById('score').innerHTML = score;
      decreaseSpeed();
      generateSlow();
    }
    else if (teleported1) {
      score +=50;
      document.getElementById('score').innerHTML = score;
      snake[0].x = snakehole2x;
      snake[0].y = snakehole2y;
      snakehole1();
    }
    else if (teleported2) {
      score +=50;
      document.getElementById('score').innerHTML = score;
      snake[0].x = snakehole1x;
      snake[0].y = snakehole1y;
      snakehole2();
    }
    else {
      snake.pop();
    }
  }
 //#endregion

 //update and keep hi-scores
 function hiScoreUpdate () {
  if (score > hiScore) {
    hiScore = score;
    document.getElementById('hi_score').innerHTML = hiScore;
  }
}

  //gameover conditions
  function gameOver() {
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y)
      return true
    }
    const hitLeft = snake[0].x < 0;
    const hitRight = snake[0].x > gameBoard.width - 10;
    const hitTopt = snake[0].y < 0;
    const hitBottom = snake[0].y > gameBoard.height - 10;
    return hitLeft || hitRight || hitTopt || hitBottom
  }

  //#region Reset Game
  function easyGame() {
    score = 0;
    document.getElementById('score').innerHTML = score;
    snake = [
      {x: 200, y: 200},
      {x: 190, y: 200},
      {x: 180, y: 200},
      {x: 170, y: 200},
      {x: 160, y: 200}
  ]
    snakeSpeed = 5;
    dx = 10;
    dy = 0; 
    main();
  }

  function mediumGame() {
    score = 0;
    document.getElementById('score').innerHTML = score;
    snake = [
      {x: 200, y: 200},
      {x: 190, y: 200},
      {x: 180, y: 200},
      {x: 170, y: 200},
      {x: 160, y: 200},
      {x: 150, y: 200},
      {x: 140, y: 200}
  ]
    snakeSpeed = 10;
    dx = 10;
    dy = 0; 
    main();
  }

  function hardGame() {
    score = 0;
    document.getElementById('score').innerHTML = score;
    snake = [
      {x: 200, y: 200},
      {x: 190, y: 200},
      {x: 180, y: 200},
      {x: 170, y: 200},
      {x: 160, y: 200},
      {x: 150, y: 200},
      {x: 140, y: 200},
      {x: 130, y: 200},
      {x: 120, y: 200}
  ]
    snakeSpeed = 15;
    dx = 10;
    dy = 0; 
    main();
  }
  //#endregion
 