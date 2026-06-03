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
