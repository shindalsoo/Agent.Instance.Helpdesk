class Game {
    constructor() {
        this.canvas = document.getElementById('tetris');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
        this.grid = this.createGrid();
        this.player = {
            pos: {x: 0, y: 0},
            matrix: null,
        };
        this.score = 0;
        this.level = 1;
        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;
        this.gameOver = false;
        this.paused = false;
    }

    createGrid() {
        return Array.from({length: ROWS}, () => new Array(COLS).fill(0));
    }

    calculateDropInterval() {
        return Math.max(100, 1000 - (this.level - 1) * 100);
    }

    collide(player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0) {
                    const boardY = y + o.y;
                    const boardX = x + o.x;

                    if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
                        return true;
                    }
                    
                    if (boardY >= 0 && this.grid[boardY] && this.grid[boardY][boardX] !== 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    merge(player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.grid[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
        this.arenaSweep();
    }

    arenaSweep() {
        let linesCleared = 0;
        outer: for (let y = this.grid.length - 1; y > 0; --y) {
            for (let x = 0; x < this.grid[y].length; ++x) {
                if (this.grid[y][x] === 0) {
                    continue outer;
                }
            }
            const row = this.grid.splice(y, 1)[0].fill(0);
            this.grid.unshift(row);
            ++y;
            linesCleared++;
        }
        
        // Scoring: 1: 100, 2: 300, 3: 500, 4: 800
        const points = [0, 100, 300, 500, 800];
        if (linesCleared > 0) {
            this.score += points[Math.min(linesCleared, 4)];
        }
        
        const newLevel = Math.floor(this.score / 500) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.dropInterval = this.calculateDropInterval();
        }
        
        updateScore(this.score, this.level);
    }

    playerDrop() {
        if (this.gameOver) return;
        this.player.pos.y++;
        if (this.collide(this.player)) {
            this.player.pos.y--;
            this.merge(this.player);
            playerReset();
        }
        this.dropCounter = 0;
    }

    playerHardDrop() {
        if (this.gameOver) return;
        while (!this.collide(this.player)) {
            this.player.pos.y++;
        }
        this.player.pos.y--;
        this.merge(this.player);
        playerReset();
        this.dropCounter = 0;
    }

    playerMove(dir) {
        if (this.gameOver) return;
        this.player.pos.x += dir;
        if (this.collide(this.player)) {
            this.player.pos.x -= dir;
        }
    }

    playerRotate() {
        if (this.gameOver) return;
        const pos = this.player.pos.x;
        let offset = 1;
        this.player.matrix = rotate(this.player.matrix);
        while (this.collide(this.player)) {
            this.player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.player.matrix[0].length) {
                this.player.matrix = rotate(rotate(rotate(this.player.matrix)));
                this.player.pos.x = pos;
                return;
            }
        }
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawMatrix(this.grid, {x: 0, y: 0});
        this.drawMatrix(this.player.matrix, this.player.pos);
        
        if (this.gameOver) {
            this.drawGameOver();
        }
    }

    drawMatrix(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.ctx.fillStyle = COLORS[value];
                    this.ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
    }

    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, COLS, ROWS);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '1px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', COLS / 2, ROWS / 2 - 0.5);
        this.ctx.font = '0.5px Arial';
        this.ctx.fillText('Press any key to restart', COLS / 2, ROWS / 2 + 0.5);
    }

    update(time = 0) {
        if (!this.gameOver) {
            const deltaTime = time - this.lastTime;
            this.lastTime = time;

            this.dropCounter += deltaTime;
            if (this.dropCounter > this.dropInterval) {
                this.playerDrop();
            }
        }

        this.draw();
        requestAnimationFrame(this.update.bind(this));
    }
    
    reset() {
        this.grid = this.createGrid();
        this.score = 0;
        this.level = 1;
        this.dropInterval = 1000;
        this.gameOver = false;
        updateScore(this.score, this.level);
        playerReset();
    }
}
