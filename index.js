/***********************
******** Global ********
***********************/

/* Variables */
let canva;
let ctx;
let anim;
let pauseBtn;
let controlDOM;
let pointDom;
let lifeDom;
let control = "keyboard";
let gameStart = false;
let gamePause = true;
let gameOver = false;
let gameFinish = false;
let controlClick = 0;
let points = 0;
let lifes = 3;

/* Game Object */

// Game content
let game = {
    // Properties
    width: 900,
    height: 600,
    color: 'lightgrey',
};

// Ball
let ball = {
    // Properties
    x: 450,
    y: 540, // 540 base
    r: 10,
    color: 'grey',
    speed: 1.5,
    // Direction
    direction: {
        x: -1, // -1 = Left | 0 = Middle | 1 = Right
        y: -1, // 1 = Down | -1 = Up
    },
};

// Plate
let plate = {
    // Properties
    x: 410,
    y: 550,
    width: 80,
    height: 10,
    color: 'black',
    speed: 8,
    // Direction
    Dx: 0, // -1 = Left | 0 = Stop | Right = 1
};

// Bricks
let bricks = [];
let brickCol = 4;
let posX = 10;
let posY = 70;

function createBricks(){
    for (let i = 0; i < 9 * brickCol; i++) {
        if (posX >= game.width - 10) {
            posX = 10;
            posY += 35;
        }
        bricks.push({
            x: posX,
            y: posY,
            width: 90,
            height: 30,
            color: 'red',
            border: 'darkred',
            hit: false,
        });
        posX += 98;
    }
}

// Game Over Text
let gameOverTxt = {
    x: 350,
    y: 300,
    text: 'Game Over !',
    color: 'black',
    font: 'bold 30px Verdana',
};

// Game Finish Text
let gameFinishTxt = {
    x: 350,
    y: 300,
    text: 'You Finished !',
    color: 'black',
    font: 'bold 30px Verdana',
};

/**********************
******** Event ********
**********************/

// Loading DOM
addEventListener('DOMContentLoaded', () => {
    pauseBtn = document.getElementById('startpausebtn');
    controlDOM = document.getElementById('control');
    pointDom = document.getElementById('point');
    lifeDom = document.getElementById('lifes');
    // Canva Initalisation
    canva = document.getElementById('canvas');
    game.width = Number(canva.getAttribute('width'));
    game.height = Number(canva.getAttribute('height'));
    ctx = canva.getContext('2d');
    // Load
    createBricks();
    requestAnimationFrame(playgame);
});

// Start/Pause & Reset
addEventListener('keydown', (e) => {
    if (gameOver === false && gameStart === true && gameFinish === false) {
        // Reversed Both to repair the load
        if (gamePause === false && e.code === "Space") {
            pauseBtn.innerText = 'Started';
            requestAnimationFrame(playgame);
            gamePause = true;
        }
        else if (gamePause === true && e.code === "Space") {
            pauseBtn.innerText = 'Paused';
            cancelAnimationFrame(anim);
            gamePause = false;
        }
    }
    else if (gameOver === false && gameStart === false && gameFinish === false && e.code === "Space") {
        pauseBtn.innerText = 'Started';
        gameStart = true;
    }
    else if (gameOver === true && gameStart === true && e.code === "Space" || gameFinish === true) {
        resetPosition();
    }
});

/* Plate Mouvement Control */

// Control Changer
addEventListener('keydown', (e) => {
    if (controlClick === 0 && e.key === "r") {
        controlDOM.innerText = "Mouse";
        control = "mouse";
        controlClick++;
    }
    else if (controlClick > 0 && e.key === "r") {
        controlDOM.innerText = "Keyboard";
        control = "keyboard";
        controlClick = 0;
    }
});

// Plate Move with keyboard
addEventListener('keydown', (e) => {
    if (gameOver === false && gamePause === true && gameFinish === false && control === "keyboard") {
        if (e.key === "ArrowLeft" && plate.x >= 5) {
            plate.Dx = -1;
        }
        else if (e.key === "ArrowRight" && (plate.x + plate.width) <= game.width - 5) {
            plate.Dx = 1;
        }
        else {
            plate.Dx = 0;
        }
        plate.x += plate.speed * plate.Dx;
    }
});

// Plate Move with mouse
addEventListener('mousemove', (e) => {
    if (gameOver === false && gameFinish === false && control === "mouse") {
        if (e.clientX >= 50 && e.clientX <= game.width - 30) {
            plate.x = e.clientX - 50;
        }
    }
});


/*********************************
******** Creation Section ********
*********************************/

// Canva Clear
function clearCanva() {
    ctx.clearRect(0, 0, game.width, game.height);
    ctx.fillStyle = game.color;
    ctx.fillRect(0, 0, game.width, game.height);
}

// Creation Ball
function dBall(x,y,r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.strokeStyle = ball.color;
    ctx.stroke();
}
// Creation Plate
function dPlate(x,y,width,height) {
    ctx.fillStyle = plate.color;
    ctx.fillRect(x,y,width,height);
}

// Creation Brick
function dBrick(x,y,width,height,color,border) {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,width,height);
    ctx.strokeStyle = border;
    ctx.strokeRect(x,y,width,height);
}

// Game Initalisation
function initGame() {
    clearCanva();
    dBall(ball.x, ball.y, ball.r);
    dPlate(plate.x, plate.y, plate.width, plate.height);
    for (let brick of bricks) {
        if (brick.hit === false) {
            dBrick(brick.x, brick.y, brick.width, brick.height, brick.color, brick.border);
        }
    }
    pointDom.innerText = "Points : " + points;
    lifeDom.innerText = "Lifes : " + lifes;
}

// Game Over Screen
function gameOverScreen() {
    ctx.font = gameOverTxt.font;
    ctx.fillStyle = gameOverTxt.color;
    ctx.fillText(gameOverTxt.text, gameOverTxt.x, gameOverTxt.y - 10);
    ctx.font = 'bold 20px Verdana';
    ctx.fillText('Press "Space" to Restart', gameOverTxt.x - 40 , gameOverTxt.y + 15);
}

// Finish Screen
function gameFinishedScreen() {
    ctx.font = gameFinishTxt.font;
    ctx.fillStyle = gameFinishTxt.color;
    ctx.fillText(gameFinishTxt.text, gameFinishTxt.x, gameFinishTxt.y);
}


/******************************
******** Game Function ********
******************************/

// Start
function playgame() {
    anim = requestAnimationFrame(playgame);
    initGame();
    if (gameStart === true && gameFinish === false) {
        brickCollision();
        detectCollisionX();
        detectCollisionY();
        finished();
    }
    else if (gameStart === false && gameFinish === true) {
        finished();
    }
    else if (gameStart === false && gameFinish === false) {
        pauseBtn.innerText = 'Start';
        ball.x = plate.x + 40;
    }
}

/* Collision */

// Collision Y
function detectCollisionY() {
    if (ball.y - ball.r <= 0) {
        ball.direction.y = 1;
    }
    else if ((ball.y + ball.r) >= plate.y && ball.x >= plate.x && ball.x <= (plate.x + plate.width)) {
         initPosition();
    }
    else if (ball.y + ball.r > game.height && ball.x <= game.width && ball.x >= 0) {
        if (lifes > 1) {
            lifes--;
            gameStart = false;
            resetPosition();
        }
        else if (lifes <= 1) {
            lifes = 0;
            gameOver = true;
            return gameOverScreen();
        }
    }
    ball.y += ball.speed * ball.direction.y;
}

// Collision X
function detectCollisionX() {
    if (gameOver === false) {
        if (ball.x - ball.r <= 0) {
            ball.direction.x = 1;
        }
        else if (ball.x + ball.r >= game.width) {
            ball.direction.x = -1;
        }
        ball.x += ball.speed * ball.direction.x;
    }
}

// Plate Collision
function initPosition() {
    if (ball.x >= plate.x && ball.x <= plate.x + plate.width / 3) {
        ball.direction.x = -1;
    }
    else if (ball.x >= plate.x + plate.width /3 && ball.x <= (plate.x + plate.width - plate.width / 3)) {
        ball.direction.x = 0;
    }
    else if (ball.x >= (plate.x + plate.width - plate.width / 3) && ball.x <= (plate.x + plate.width)) {
        ball.direction.x = 1;
    }
    ball.direction.y = -1;
    ball.speed += 0.1;
}

// Brick Collision
function brickCollision() {
    for (let brick of bricks) {
        if (ball.y - ball.r <= brick.y + brick.height && ball.y >= brick.y + brick.height && ball.x + ball.r <= brick.x + brick.width + 10 && ball.x >= brick.x - 10) {
            ball.direction.y = 1;
            hidebrick(brick);
        }
        else if (ball.y + ball.r >= brick.y && ball.y <= brick.y && ball.x + ball.r <= brick.x + brick.width + 10 && ball.x >= brick.x - 10) {
            ball.direction.y = -1;
            hidebrick(brick);
        }
        else if (ball.x - ball.r <= brick.x + brick.width && ball.x >= brick.x + brick.width && ball.y - ball.r <= brick.y + brick.height && ball.y + ball.r >= brick.y) {
            ball.direction.x = 1;
            hidebrick(brick);
        }
       else if (ball.x + ball.r >= brick.x && ball.x <= brick.x  && ball.y <= brick.y + brick.height && ball.y + ball.r >= brick.y) {
            ball.direction.x = -1;
            hidebrick(brick);
        }
    }
}

function hidebrick(brick) {
    brick.hit = true;
    brick.x = 0;
    brick.y = 0;
    brick.width = 0;
    brick.height = 0;
    points++;
}

/* Reset Game */
function resetPosition() {
    if (gameOver === false && gameFinish === false) {
        // Plate Reset
        plate.x = 410;
        plate.y = 550;
        
        // Ball Reset
        ball.x = 450;
        ball.y = 540;
        ball.speed = 1.5;
        ball.direction.x = 0;
        ball.direction.y = -1;
        
        // Reset Game
        gameStart = false;
        initGame();
    }
    else if (gameOver === true || gameFinish === true) {
        // Plate Reset
        plate.x = 410;
        plate.y = 550;
        
        // Ball Reset
        ball.x = 450;
        ball.y = 540;
        ball.speed = 1.5;
        ball.direction.x = 0;
        ball.direction.y = -1;
        
        // Bricks Reset
        bricks = [];
        posX = 10;
        posY = 70;
        createBricks();
        
        // Reset Game
        gameStart = false;
        gameOver = false;
        gameFinish = false;
        points = 0;
        lifes = 3;
        initGame();
    }
}

/* End Game */
function finished() {
    let point = 0;
    for (let brick of bricks) {
        if (brick.hit === true) {
            point++;
        }
    }
    if (point === bricks.length) {
        gameFinish = true;
        gameOver = false;
        gameStart = false;
        return gameFinishedScreen();
    }
}