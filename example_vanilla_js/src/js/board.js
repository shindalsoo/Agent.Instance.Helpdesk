class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = Array.from({ length: height }, () => Array(width).fill(0));
    }

    draw(ctx, cellSize) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x]) {
                    ctx.fillStyle = this.grid[y][x];
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
    }

    clearLines() {
        let linesCleared = 0;
        this.grid = this.grid.filter(row => row.some(cell => cell === 0));
        while (this.grid.length < this.height) {
            this.grid.unshift(Array(this.width).fill(0));
            linesCleared++;
        }
        return linesCleared;
    }
}
