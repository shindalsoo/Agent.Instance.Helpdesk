const SHAPES = {
    I: [[1, 1, 1, 1]],
    J: [[1, 0, 0], [1, 1, 1]],
    L: [[0, 0, 1], [1, 1, 1]],
    O: [[1, 1], [1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    T: [[0, 1, 0], [1, 1, 1]],
    Z: [[1, 1, 0], [0, 1, 1]]
};

class Tetromino {
    constructor() {
        const keys = Object.keys(SHAPES);
        const type = keys[Math.floor(Math.random() * keys.length)];
        this.shape = SHAPES[type];
        this.x = 3;
        this.y = 0;
    }

    rotate() {
        this.shape = this.shape[0].map((_, i) => this.shape.map(row => row[i]).reverse());
    }
}
