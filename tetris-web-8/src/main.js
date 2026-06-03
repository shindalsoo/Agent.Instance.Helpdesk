const canvas = document.getElementById('tetris');
const scoreElement = document.getElementById('score');
const board = new Board(12, 20);
const renderer = new Renderer(canvas, board);
let currentTetromino = new Tetromino();
let score = 0;
let lastTime = 0;
let dropInterval = 1000;

function update(time = 0) {
    const deltaTime = time - lastTime;
    if (deltaTime > dropInterval) {
        if (board.isValid(currentTetromino, currentTetromino.x, currentTetromino.y + 1)) {
            currentTetromino.y++;
        } else {
            board.merge(currentTetromino);
            const cleared = board.clearLines();
            score += cleared * 10;
            scoreElement.innerText = score;
            currentTetromino = new Tetromino();
            if (!board.isValid(currentTetromino, currentTetromino.x, currentTetromino.y)) {
                alert('Game Over!');
                board.grid = Array.from({ length: 20 }, () => Array(12).fill(0));
                score = 0;
                scoreElement.innerText = score;
            }
        }
        lastTime = time;
    }
    renderer.draw();
    renderer.drawTetromino(currentTetromino);
    requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && board.isValid(currentTetromino, currentTetromino.x - 1, currentTetromino.y)) {
        currentTetromino.x--;
    } else if (event.key === 'ArrowRight' && board.isValid(currentTetromino, currentTetromino.x + 1, currentTetromino.y)) {
        currentTetromino.x++;
    } else if (event.key === 'ArrowDown' && board.isValid(currentTetromino, currentTetromino.x, currentTetromino.y + 1)) {
        currentTetromino.y++;
    } else if (event.key === 'ArrowUp') {
        const oldShape = currentTetromino.shape;
        currentTetromino.rotate();
        if (!board.isValid(currentTetromino, currentTetromino.x, currentTetromino.y)) {
            currentTetromino.shape = oldShape;
        }
    }
});

update();
