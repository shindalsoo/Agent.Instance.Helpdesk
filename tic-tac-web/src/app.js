// Game state
const board = Array(9).fill(null);
let currentPlayer = 'X';
const boardDiv = document.getElementById('board');
const turnDiv = document.getElementById('turn');
const resetBtn = document.getElementById('resetBtn');

function initBoard(){
  boardDiv.innerHTML='';
  board.forEach((cell, idx)=>{
    const btn=document.createElement('button');
    btn.dataset.idx=idx;
    btn.addEventListener('click',handleClick);
    boardDiv.appendChild(btn);
  });
}

function handleClick(e){
  const idx=e.target.dataset.idx;
  if(board[idx]) return; // already taken
  board[idx]=currentPlayer;
  e.target.textContent=currentPlayer;
  e.target.classList.add('disabled');
  if(checkWinner()){alert(`${currentPlayer} wins!`); resetGame();return;}
  if(board.every(Boolean)){alert("Draw!");resetGame();return;}
  currentPlayer = currentPlayer==='X'?'O':'X';
  turnDiv.textContent=`Turn: ${currentPlayer}`;
}

function checkWinner(){
  const lines=[
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return lines.some(l=>{
    const [a,b,c]=l;
    return board[a] && board[a]==board[b] && board[a]==board[c];
  });
}

function resetGame(){
  for(let i=0;i<9;i++) board[i]=null;
  currentPlayer='X';
  turnDiv.textContent='Turn: X';
  initBoard();
}
resetBtn.addEventListener('click',resetGame);
initBoard();