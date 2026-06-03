import {addRandomTile} from './utils.js';
export class Board{
    constructor(){this.grid=Array.from({length:4},()=>Array(4).fill(null));}
    init(){addRandomTile(this.grid);addRandomTile(this.grid);} 
    render(container){container.innerHTML='';for(let r=0;r<4;r++){for(let c=0;c<4;c++){const cell=document.createElement('div');cell.className='cell';if(this.grid[r][c]!==null)cell.textContent=this.grid[r][c];container.appendChild(cell);}}}
