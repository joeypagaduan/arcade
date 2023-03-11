let score = 0

const snakeBody = "red";
const snakeBorder = "red";

let snake = [
    {x: 300, y: 200},
    {x: 290, y: 200},
    {x: 280, y: 200},
    {x: 270, y: 200},
    {x: 260, y: 200},
    {x: 250, y: 200},
    {x: 240, y: 200},
    {x: 230, y: 200},
    {x: 220, y: 200}
]

let dx = 10;
let dy = 0;

//init. food

let growthX
let growthY



//my gameboard
const board = document.getElementById("gameBoard");
const boardContext = gameBoard.getContext("2d");
//setting the size

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

main();
generateGrowth()
document.addEventListener("keydown", nextDirection);

function main() {  
    timeoutId = setTimeout(function tick() 
    {    
      clearCanvas();    
      slither();  
      drawSnake();
      drawGrowth();
      main();
    }, 75)

    if (gameOver()) {
        boardContext.fillStyle="white";
        boardContext.font="6vw garamond";
        boardContext.fillText("Game Over", gameBoard.clientWidth/11, gameBoard.clientHeight/2);
        
        //// Display game over message
        // const message = document.createElement('div');
        // message.textContent = 'Game Over!';
        // document.body.appendChild(message);
        // Stop the game loop
        clearTimeout(timeoutId);
      }
 }

function drawSnake() {
    snake.forEach(drawSnakePart)
  }
  
  //individual snake parts
  function drawSnakePart(snakePart) {
    boardContext.fillStyle = snakeBody;
    boardContext.strokeStyle = snakeBorder;
    boardContext.fillRect(snakePart.x, snakePart.y, 10, 10);
    boardContext.strokeRect(snakePart.x, snakePart.y, 10, 10);
  }

  //#FOOD BEGINS
  //function to generate random coordinates for food
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
    // boardContext.fillRect(growthX, growthY, 10, 10);
    // boardContext.strokeRect(growthX, growthY, 10, 10);
    boardContext.beginPath();
    boardContext.arc(growthX + 5, growthY + 5, 5, 0, 2 * Math.PI); //had to offset the drawing by 5 pixels on each axis to center the round object on the board
    boardContext.fill();
  }
  //#FOOD ENDS

  //Changing the snake's direction
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

  function slither() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    const eatenGrowth_food = snake[0].x === growthX && snake[0].y === growthY;
    if (eatenGrowth_food) {
      score += 10;
      document.getElementById('score').innerHTML = score;
      generateGrowth();
    } else {
      snake.pop();
    }
  }
 

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

 