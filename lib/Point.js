class Point {
	constructor(board, x, y) {
		this.circle = board.boardPaper.circle(20 + 20 * x, 20 + 20 * y, 4).addClass('board-point');
	}
}

module.exports = Point;
