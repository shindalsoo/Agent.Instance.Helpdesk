const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const COLS = 10;
const ROWS = 20;
const CELL_SIZE = 20;

ctx.scale(CELL_SIZE, CELL_SIZE);

let board = new Board(COLS, ROWS);
let score = 0;

function playerReset() {
    const pieces = 'ILJOTSZ';
    const type = pieces[pieces.length * Math.random() | 0];
    const p = createPiece(type);
    piece.matrix = p.matrix;
    piece.color = p.color;
    piece.pos.y = 0;
    piece.pos.x = (COLS / 2 | 0) - (piece.matrix[0].length / 2 | 0);
    
    if (collide(board, piece)) {
        board.grid.forEach(row => row.fill(0));
        score = 0;
        updateScore();
    }
}

function updateScore() {
    scoreElement.innerText = `Score: ${score}`;
}

let piece = {
    pos: { x: 0, y: 0 },
    matrix: null,
    color: null
};

function collide(board, piece) {
    const m = piece.matrix;
    const o = piece.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (board.grid[y + o.y] && board.grid[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function merge(board, piece) {
    piece.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                if (board.grid[y + piece.pos.y]) {
                    board.grid[y + piece.pos.y][x + piece.pos.x] = piece.color;
                }
            }
        });
    });
}

function playerMove(offset) {
    piece.pos.x += offset;
    if (collide(board, piece)) {
        piece.pos.x -= offset;
    }
}

function drawMatrix(matrix, offset, color) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = color;
                ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, COLS, ROWS);
    
    board.draw(ctx, 1);
    if (piece.matrix) {
        drawMatrix(piece.matrix, piece.pos, piece.color);
    }
}

function playerDrop() {
    piece.pos.y++;
    if (collide(board, piece)) {
        piece.pos.y--;
        merge(board, piece);
        playerReset();
        const cleared = board.clearLines();
        score += cleared * 10;
        updateScore();
    }
    dropCounter = 0;
}

function playerHardDrop() {
    while (!collide(board, piece)) {
        piece.pos.y++;
    }
    piece.pos.y--;
    merge(board, piece);
    playerReset();
    const cleared = board.clearLines();
    score += cleared * 10;
    updateScore();
    dropCounter = 0;
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    
    draw();
    requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        playerMove(-1);
    } else if (event.key === 'ArrowRight') {
        playerMove(1);
    } else if (event.key === 'ArrowDown') {
        playerDrop();
    } else if (event.key === 'ArrowUp') {
        playerRotate();
    } else if (event.key === 'Enter') {
        playerHardDrop();
    }
});

playerReset();
update();
