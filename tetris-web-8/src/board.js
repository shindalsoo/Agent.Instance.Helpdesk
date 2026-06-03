class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = Array.from({ length: height }, () => Array(width).fill(0));
    }

    isValid(tetromino, x, y) {
        for (let r = 0; r < tetromino.shape.length; r++) {
            for (let c = 0; c < tetromino.shape[r].length; c++) {
                if (tetromino.shape[r][c]) {
                    let newX = x + c;
                    let newY = y + r;
                    if (newX < 0 || newX >= this.width || newY >= this.height || (newY >= 0 && this.grid[newY][newX])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    merge(tetromino) {
        tetromino.shape.forEach((row, r) => {
            row.forEach((val, c) => {
                if (val) {
                    this.grid[tetromino.y + r][tetromino.x + c] = 1;
                }
            });
        });
    }

    clearLines() {
        let linesCleared = 0;
        for (let r = this.height - 1; r >= 0; r--) {
            if (this.grid[r].every(cell => cell !== 0)) {
                this.grid.splice(r, 1);
                this.grid.unshift(Array(this.width).fill(0));
                linesCleared++;
                r++;
            }
        }
        return linesCleared;
    }
}
