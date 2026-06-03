class GameEngine {
    constructor() {
        this.size = 4;
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.won = false;
    }

    reset() {
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.won = false;
        this.addTile();
        this.addTile();
    }

    addTile() {
        const emptyCells = [];
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] === 0) emptyCells.push({ r, c });
            }
        }
        if (emptyCells.length > 0) {
            const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    move(direction) {
        if (this.isGameOver()) return false;

        let moved = false;
        const prevGrid = JSON.stringify(this.grid);

        if (direction === 'up' || direction === 'down') {
            for (let c = 0; c < this.size; c++) {
                let column = [];
                for (let r = 0; r < this.size; r++) column.push(this.grid[r][c]);
                if (direction === 'down') column.reverse();
                
                column = this.processLine(column);
                if (direction === 'down') column.reverse();
                
                for (let r = 0; r < this.size; r++) this.grid[r][c] = column[r];
            }
        } else {
            for (let r = 0; r < this.size; r++) {
                let row = [...this.grid[r]];
                if (direction === 'right') row.reverse();
                
                row = this.processLine(row);
                if (direction === 'right') row.reverse();
                
                this.grid[r] = row;
            }
        }

        if (JSON.stringify(this.grid) !== prevGrid) {
            this.addTile();
            moved = true;
        }
        
        // Check for 2048
        for(let r=0; r<this.size; r++) {
            for(let c=0; c<this.size; c++) {
                if(this.grid[r][c] === 2048) this.won = true;
            }
        }
        
        return moved;
    }

    processLine(line) {
        let filtered = line.filter(val => val !== 0);
        for (let i = 0; i < filtered.length - 1; i++) {
            if (filtered[i] === filtered[i + 1]) {
                filtered[i] *= 2;
                this.score += filtered[i];
                filtered.splice(i + 1, 1);
            }
        }
        while (filtered.length < this.size) filtered.push(0);
        return filtered;
    }

    isGameOver() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] === 0) return false;
                if (c < this.size - 1 && this.grid[r][c] === this.grid[r][c + 1]) return false;
                if (r < this.size - 1 && this.grid[r][c] === this.grid[r + 1][c]) return false;
            }
        }
        return true;
    }
}
