const TETROMINOES = {
    I: [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
    J: [[0, 2, 0], [0, 2, 0], [2, 2, 0]],
    L: [[0, 3, 0], [0, 3, 0], [0, 3, 3]],
    O: [[4, 4], [4, 4]],
    S: [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
    T: [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
    Z: [[7, 7, 0], [0, 7, 7], [0, 0, 0]],
};

function rotate(matrix) {
    // 시계 반대 방향 회전 (Transpose + Reverse Rows)
    return matrix[0].map((_, index) => matrix.map(row => row[index])).reverse();
}
