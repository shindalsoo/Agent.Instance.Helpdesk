const gridContainer = document.getElementById('grid-container');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('best-score');
const gameMessage = document.getElementById('game-message');
const restartBtn = document.getElementById('restart-btn');
const undoBtn = document.getElementById('undo-btn'); // 새로운 버튼

let grid = [];
let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;
let history = []; // 상태 저장용 스택

bestScoreElement.textContent = `Best: ${bestScore}`;

function initGame() {
    grid = Array(4).fill(null).map(() => Array(4).fill(0));
    score = 0;
    history = [];
    scoreElement.textContent = `Score: ${score}`;
    gameMessage.classList.add('hidden');
    gameMessage.textContent = 'Game Over!';
    addTile();
    addTile();
    updateBoard();
}

function saveState() {
    history.push({
        grid: grid.map(row => [...row]),
        score: score
    });
    if (history.length > 20) history.shift(); // 최근 20개 상태만 유지
}

function undo() {
    if (history.length > 0) {
        let previousState = history.pop();
        grid = previousState.grid;
        score = previousState.score;
        scoreElement.textContent = `Score: ${score}`;
        gameMessage.classList.add('hidden');
        updateBoard();
    }
}

function addTile() {
    let emptyCells = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (grid[r][c] === 0) emptyCells.push({ r, c });
        }
    }
    if (emptyCells.length > 0) {
        let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateBoard() {
    gridContainer.innerHTML = '';
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (grid[r][c] !== 0) {
                let tile = document.createElement('div');
                tile.className = `tile tile-${grid[r][c]}`;
                tile.textContent = grid[r][c];
                tile.style.left = `${c * 95 + 10}px`;
                tile.style.top = `${r * 95 + 10}px`;
                gridContainer.appendChild(tile);
            }
        }
    }
}

function checkGameOver() {
    // 빈 칸이 있는지 확인
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (grid[r][c] === 0) return false;
        }
    }
    // 인접한 타일끼리 합칠 수 있는지 확인
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (c < 3 && grid[r][c] === grid[r][c + 1]) return false;
            if (r < 3 && grid[r][c] === grid[r + 1][c]) return false;
        }
    }
    return true;
}

function move(direction) {
    let moved = false;
    let newGrid = grid.map(row => [...row]);

    const rotate = (matrix) => {
        let n = matrix.length;
        let res = Array(n).fill(null).map(() => Array(n).fill(0));
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                res[c][n - 1 - r] = matrix[r][c];
            }
        }
        return res;
    };

    let rotations = 0;
    if (direction === 'ArrowRight') rotations = 0;
    else if (direction === 'ArrowDown') rotations = 1;
    else if (direction === 'ArrowLeft') rotations = 2;
    else if (direction === 'ArrowUp') rotations = 3;

    for (let i = 0; i < rotations; i++) newGrid = rotate(newGrid);

    let currentScore = score;
    for (let r = 0; r < 4; r++) {
        let row = newGrid[r].filter(val => val);
        let newRow = [];
        for (let i = 0; i < row.length; i++) {
            if (row[i] === row[i + 1]) {
                let merged = row[i] * 2;
                newRow.push(merged);
                currentScore += merged;
                i++;
            } else {
                newRow.push(row[i]);
            }
        }
        while (newRow.length < 4) newRow.unshift(0);
        if (JSON.stringify(newGrid[r]) !== JSON.stringify(newRow)) moved = true;
        newGrid[r] = newRow;
    }

    for (let i = 0; i < (4 - rotations) % 4; i++) newGrid = rotate(newGrid);

    if (moved) {
        saveState();
        grid = newGrid;
        score = currentScore;
        addTile();
        updateBoard();
        scoreElement.textContent = `Score: ${score}`;
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
            bestScoreElement.textContent = `Best: ${bestScore}`;
        }
    }

    if (checkGameOver()) {
        gameMessage.classList.remove('hidden');
    }
}

document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        move(e.key);
    }
});

restartBtn.addEventListener('click', initGame);
if (undoBtn) undoBtn.addEventListener('click', undo);

initGame();
