const game = new Game();
let nextPieces = [];

function getRandomPiece() {
    const pieces = 'ILJOTSZ';
    return TETROMINOES[pieces[pieces.length * Math.random() | 0]];
}

function playerReset() {
    if (nextPieces.length === 0) {
        nextPieces.push(getRandomPiece());
        nextPieces.push(getRandomPiece());
    }
    
    game.player.matrix = nextPieces.shift();
    nextPieces.push(getRandomPiece());
    
    game.player.pos.y = 0;
    game.player.pos.x = (COLS / 2 | 0) - (game.player.matrix[0].length / 2 | 0);
    
    if (game.collide(game.player)) {
        game.gameOver = true;
    }
    
    drawNextPieces();
}

function drawNextPiece(canvasId, matrix) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = COLORS[value];
                ctx.fillRect(x * 20 + 5, y * 20 + 5, 18, 18);
            }
        });
    });
}

function drawNextPieces() {
    drawNextPiece('next-piece-1', nextPieces[0]);
    drawNextPiece('next-piece-2', nextPieces[1]);
}

document.addEventListener('keydown', event => {
    if (game.gameOver) {
        game.reset();
        return;
    }
    if (event.keyCode === 37) { // Left
        game.playerMove(-1);
    } else if (event.keyCode === 39) { // Right
        game.playerMove(1);
    } else if (event.keyCode === 40) { // Down
        game.playerDrop();
    } else if (event.keyCode === 38) { // Up
        game.playerRotate();
    } else if (event.keyCode === 13) { // Enter (Hard Drop)
        game.playerHardDrop();
    }
});

playerReset();
game.update();
