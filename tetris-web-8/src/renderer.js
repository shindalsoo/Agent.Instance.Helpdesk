class Renderer {
    constructor(canvas, board) {
        this.ctx = canvas.getContext('2d');
        this.board = board;
        this.blockSize = 20;
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        for (let r = 0; r < this.board.height; r++) {
            for (let c = 0; c < this.board.width; c++) {
                if (this.board.grid[r][c]) {
                    this.ctx.fillStyle = 'white';
                    this.ctx.fillRect(c * this.blockSize, r * this.blockSize, this.blockSize - 1, this.blockSize - 1);
                }
            }
        }
    }

    drawTetromino(tetromino) {
        this.ctx.fillStyle = 'red';
        tetromino.shape.forEach((row, r) => {
            row.forEach((val, c) => {
                if (val) {
                    this.ctx.fillRect((tetromino.x + c) * this.blockSize, (tetromino.y + r) * this.blockSize, this.blockSize - 1, this.blockSize - 1);
                }
            });
        });
    }
}
