const engine = new GameEngine();
const ui = new UIManager(engine);

engine.reset();
ui.render();

document.addEventListener('keydown', (e) => {
    let moved = false;
    switch(e.key) {
        case 'ArrowUp': moved = engine.move('up'); break;
        case 'ArrowDown': moved = engine.move('down'); break;
        case 'ArrowLeft': moved = engine.move('left'); break;
        case 'ArrowRight': moved = engine.move('right'); break;
    }
    if (moved) {
        ui.render();
    }
});
