const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const gameOverElement = document.getElementById('game-over');

context.scale(20, 20);

let arena = createMatrix(10, 20);

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
};

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                   (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        gameOver();
    }
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = COLORS[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function updateScore() {
    scoreElement.innerText = "Score: " + player.score;
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let isPaused = true;

function update(time = 0) {
    if (isPaused) return;
    
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

function gameOver() {
    isPaused = true;
    gameOverElement.style.display = 'block';
    startBtn.innerText = 'Restart';
}

function startGame() {
    if (!isPaused) return;
    
    arena.forEach(row => row.fill(0));
    player.score = 0;
    updateScore();
    playerReset();
    
    isPaused = false;
    gameOverElement.style.display = 'none';
    startBtn.innerText = 'Pause';
    update();
}

startBtn.addEventListener('click', () => {
    if (isPaused) {
        startGame();
    } else {
        isPaused = true;
        startBtn.innerText = 'Resume';
    }
});

document.addEventListener('keydown', event => {
    if (isPaused) return;
    
    if (event.keyCode === 37) { // Left
        playerMove(-1);
    } else if (event.keyCode === 39) { // Right
        playerMove(1);
    } else if (event.keyCode === 40) { // Down
        playerDrop();
    } else if (event.keyCode === 81) { // Q
        playerRotate(-1);
    } else if (event.keyCode === 87) { // W
        playerRotate(1);
    }
});

// Initial draw
draw();
