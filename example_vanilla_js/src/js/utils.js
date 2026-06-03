function rotate(matrix) {
    const N = matrix.length;
    return matrix.map((row, i) =>
        row.map((val, j) => matrix[N - 1 - j][i])
    );
}

function playerRotate() {
    const prevMatrix = piece.matrix;
    piece.matrix = rotate(piece.matrix);
    if (collide(board, piece)) {
        piece.matrix = prevMatrix;
    }
}
