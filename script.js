const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let isGameStarted = false;

const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 150; 
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

let score = 0;
let isGameRunning = false;
let highestScore = localStorage.getItem("highestScore") || 0;

let balls = [
    { x: canvas.width / 2, y: canvas.height - 30, dx: 2, dy: -2 }
];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
canvas.addEventListener("click", restartGame, false); 

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight - 5, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    
    const scoreTextWidth = ctx.measureText("Score: " + score).width;
    const highestScoreTextWidth = ctx.measureText("Highest Score: " + highestScore).width;

    ctx.fillText("Score: " + score, 8, 20);
    ctx.fillText("Highest Score: " + highestScore, canvas.width - highestScoreTextWidth - scoreTextWidth - 8, 20);
}



function drawBorders() {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0); 
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvas.height); 
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height); 
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(canvas.width, canvas.height); 
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBorders();
    balls.forEach(drawBall);
    drawPaddle();
    drawScore();

    balls.forEach((ball) => {
        if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) {
            ball.dx = -ball.dx;
        }
        if (ball.y + ball.dy < ballRadius) {
            ball.dy = -ball.dy;
        } else if (ball.y + ball.dy > canvas.height - ballRadius - paddleHeight - 5) {
            if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
                ball.dy = -ball.dy;
                score++;
                if (score > highestScore) {
                    highestScore = score;
                    localStorage.setItem("highestScore", highestScore); 
                }
                if (score > 10 && balls.length === 1) {
                    balls.push({ x: canvas.width / 2, y: canvas.height - 30, dx: 2, dy: -2 });
                }
            } else {
                endGame();
            }
        }

        ball.x += ball.dx;
        ball.y += ball.dy;
    });

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    if (isGameRunning) {
        requestAnimationFrame(draw);
    }
}

function startGame() {
    isGameRunning = true;
    score = 0;
    balls = [
        { x: canvas.width / 2, y: canvas.height - 30, dx: 2, dy: -2 }
    ];
    draw();
}

function endGame() {
    isGameRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText("Click anywhere to restart", canvas.width / 2 - 120, canvas.height / 2 + 20);
}

function restartGame() {
    if (!isGameRunning) {
        startGame();
    }
}

startGame();
