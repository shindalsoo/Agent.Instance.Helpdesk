const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');

let currentPlayer = 'X';
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) return;

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer;

    checkResult();
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerText = `플레이어 ${currentPlayer} 승리!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        statusDisplay.innerText = "무승부!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerText = `플레이어 ${currentPlayer}의 차례`;
}

function resetGame() {
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    statusDisplay.innerText = `플레이어 X의 차례`;
    cells.forEach(cell => cell.innerText = "");
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
