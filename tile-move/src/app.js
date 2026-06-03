import {Board} from './board.js';
const gridEl=document.getElementById('grid');
const restartBtn=document.getElementById('restart-btn');
let board=new Board();
function startGame(){board=new Board();board.init();board.render(gridEl);}
startGame();
restartBtn.addEventListener('click',()=>{startGame();});