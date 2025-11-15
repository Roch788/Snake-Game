const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const restartButton = document.querySelector('.btn-over');

const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const modal = document.querySelector('.modal');

const blockHeight = 50;
const blockWidth = 50;

const scoreEl = document.querySelector('#score');
let hiScoreEl = document.querySelector('#high-score');
let timeEl = document.querySelector('#time');
let hiScore = localStorage.getItem("hiScore")||0;
let score = 0;
let time = "00:00"
const cols = Math.floor((board.clientWidth) / blockWidth);
const rows = Math.floor((board.clientHeight) / blockHeight);
const blocks = [];
let snake = [{ x: 1, y: 3 }]
let intervalId = null;
let timeIntervalId=null;
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
// for (let i = 0; i < rows * cols; i++) {
//     const block = document.createElement('div');
//     block.classList.add("block");
//     board.appendChild(block);
// }   
let direction = 'right'
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        // block.innerText = `(${i},${j})`;
        blocks[`(${i},${j})`] = block;
    }
}

function render() {
    let head = null;
    blocks[`(${food.x},${food.y})`].classList.add("food");
    if (direction === "right") head = { x: snake[0].x, y: snake[0].y + 1 };
    else if (direction === "left") head = { x: snake[0].x, y: snake[0].y - 1 };
    else if (direction === "down") head = { x: snake[0].x + 1, y: snake[0].y };
    else if (direction === "up") head = { x: snake[0].x - 1, y: snake[0].y };
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        // alert("Game over");

        clearInterval(intervalId);
        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";
        // restartGame();
        return;
    }
    if (head.x === food.x && head.y === food.y) {
        blocks[`(${food.x},${food.y})`].classList.remove("food");
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
        blocks[`(${food.x},${food.y})`].classList.add("food");
        snake.unshift(head);
        score++;
        scoreEl.innerText = score;
        if (score > hiScore) {
            hiScore = score;
            // hiScoreEl.innerText=hiScore;
            localStorage.setItem("hiScore", hiScore.toString())
        }
    }
    snake.forEach(segment => {
        blocks[`(${segment.x},${segment.y})`].classList.remove("fill")

    })
    snake.unshift(head);
    snake.pop();
    snake.forEach(segment => {
        blocks[`(${segment.x},${segment.y})`].classList.add("fill")
    })


}
// intervalId = setInterval(() => {
//     render();
// }, 300)

startButton.addEventListener("click", () => {
    modal.style.display = "none";
    intervalId = setInterval(() => {
        render();
    }, 200)
    timeIntervalId=setInterval(()=>{
        let [min,sec]=time.split(":").map(Number);
        if(sec==59){
            min+=1;
            sec=0;
        }
        else{
            sec++;
        }
        time=`${min}:${sec}`;
        timeEl.innerText=time;
    },1000)
})
restartButton.addEventListener("click", restartGame)

function restartGame() {
    blocks[`(${food.x},${food.y})`].classList.remove("food")
    snake.forEach(segment=>{
        blocks[`(${segment.x},${segment.y})`].classList.remove("fill");
    })
    score=0;
    time="00:00";
    scoreEl.innerText=score;
    timeEl.innerText=time;
    hiScoreEl.innerText=hiScore;
    modal.style.display = "none";
    snake = [{ x: 1, y: 3 }];
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
    intervalId = setInterval(() => {
        render();
    }, 200)
}
addEventListener("keydown", (event) => {
    console.log(event.key);
    if (event.key == "ArrowUp") direction = "up";
    else if (event.key == "ArrowRight") direction = "right";
    else if (event.key == "ArrowLeft") direction = "left";
    else if (event.key == "ArrowDown") direction = "down";
})