// Game state
let board = Array(9).fill('');
let isXTurn = true;
let gameOver = false;
const statusEl = document.getElementById('status');
const boardEl = document.getElementById('board');
const resetBtn = document.getElementById('resetBtn');

// Create 9 buttons for cells
for (let i=0;i<9;i++){
  const btn=document.createElement('button');
  btn.dataset.index=i;
  btn.addEventListener('click',handleCellClick);
  boardEl.appendChild(btn);
}
resetBtn.addEventListener('click',resetGame);

function handleCellClick(e){
  const idx=e.target.dataset.index;
  if(gameOver||board[idx]) return;
  board[idx]=isXTurn?'X':'O';
  e.target.textContent=board[idx];
  if(checkWinner()){
    statusEl.textContent=`Player ${board[idx]} wins!`;
    gameOver=true;
  }else if(board.every(v=>v)){
    statusEl.textContent='Draw!';
    gameOver=true;
  }else{
    isXTurn=!isXTurn;
    statusEl.textContent=`Player ${isXTurn?'X':'O'}'s turn`;
  }
}

function checkWinner(){
  const lines=[[0,1,2],[3,4,5],[6,7,8], [0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(const l of lines){
    const [a,b,c]=l;
    if(board[a] && board[a]==board[b]&&board[a]==board[c]){
      highlightLine(l);
      return true;
    }
  }
  return false;
}

function highlightLine(line){
  line.forEach(i=>{boardEl.children[i].classList.add('win');});
}

function resetGame(){
  board=Array(9).fill('');
  isXTurn=true;gameOver=false;
  statusEl.textContent="Player X's turn";
  for(let i=0;i<9;i++){
    const btn=boardEl.children[i];btn.textContent='';btn.classList.remove('win');
  }
}
