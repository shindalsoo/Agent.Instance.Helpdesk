class UIManager {
    constructor(engine) {
        this.engine = engine;
        this.gridContainer = document.getElementById('grid-container');
        this.messageContainer = document.getElementById('game-message');
        this.messageText = this.messageContainer.querySelector('p');
        this.restartBtn = document.getElementById('restart-btn');
        
        this.restartBtn.addEventListener('click', () => {
            this.engine.reset();
            this.hideMessage();
            this.render();
        });
    }

    render() {
        this.gridContainer.innerHTML = '';
        for (let r = 0; r < this.engine.size; r++) {
            for (let c = 0; c < this.engine.size; c++) {
                const val = this.engine.grid[r][c];
                const tile = document.createElement('div');
                tile.className = `tile ${val ? 'tile-' + val : ''}`;
                tile.textContent = val || '';
                this.gridContainer.appendChild(tile);
            }
        }
        document.getElementById('score').textContent = this.engine.score;

        if (this.engine.won) {
            this.showMessage('승리했습니다!');
        } else if (this.engine.isGameOver()) {
            this.showMessage('게임 오버!');
        }
    }

    showMessage(text) {
        this.messageText.textContent = text;
        this.messageContainer.style.display = 'flex';
    }

    hideMessage() {
        this.messageContainer.style.display = 'none';
    }
}
