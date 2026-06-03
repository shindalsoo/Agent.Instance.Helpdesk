function createPiece(type) {
    const pieces = 'ILJOTSZ';
    const pieceData = {
        'I': { matrix: [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]], color: 'cyan' },
        'J': { matrix: [[0, 1, 0], [0, 1, 0], [1, 1, 0]], color: 'blue' },
        'L': { matrix: [[0, 1, 0], [0, 1, 0], [0, 1, 1]], color: 'orange' },
        'O': { matrix: [[1, 1], [1, 1]], color: 'yellow' },
        'T': { matrix: [[0, 0, 0], [1, 1, 1], [0, 1, 0]], color: 'purple' },
        'S': { matrix: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], color: 'green' },
        'Z': { matrix: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], color: 'red' },
    };
    return pieceData[type];
}
