const Snap = require('snapsvg');

class Point {
	constructor(board, x, y) {
		this.board = board;
		this.x = x;
		this.y = y;
		this.circle = board.boardPaper.circle(20 + 20 * x, 20 + 20 * y, 4).addClass('board-point');
	}

	drawArrow(direction) {
		const matrix = Snap.matrix();
		const x = this.x, y = this.y;
		const theta = direction * 45;
		matrix.translate(20 + x * 20, 20 + y * 20).rotate(theta);
		let pathData;
		if (direction % 2 === 0) {
			// N, E, S, W
			pathData = 'm 13.085935,-4 0,2 -4.546875,0 0,4 4.546875,0 0,2 4.375,-4 z';
		} else {
			// NE, SE, SW, NW
			const pathData_upRight = 'm 19.14693,-32.2842712474 0,2 -21.14693,0 0,21.74521 4,0 0,-17.74521 17.14693,0 0,2 4.375,-4 z';
			const pathData_upRightDown = 'm 32.285156,-9.1367188 -2,0 0,-21.1484372 -32.285156,0 0,21.7460935 4,0 0,-17.7460935 24.285156,0 0,17.1484372 -2,0 4,4.375 z';
			if ((
				direction === 1 && y === 0 && x === 8
			) || (
				direction === 3 && x === 9 && y === 8
			) || (
				direction === 5 && y === 9 && x === 1
			) || (
				direction === 7 && x === 0 && y === 1
			)) {
				pathData = pathData_upRightDown;
			} else if ((
				direction === 1 && x === 9 && y === 1
			) || (
				direction === 3 && y === 9 && x === 8
			) || (
				direction === 5 && x === 0 && y === 8
			) || (
				direction === 7 && y === 0 && x === 1
			)) {
				pathData = pathData_upRightDown;
				matrix.scale(-1, 1);
			} else if ((
				direction === 1 && y === 0
			) || (
				direction === 3 && x === 9
			) || (
				direction === 5 && y === 9
			) || (
				direction === 7 && x === 0
			)) {
				pathData = pathData_upRight;
			} else if ((
				direction === 1 && x === 9
			) || (
				direction === 3 && y === 9
			) || (
				direction === 5 && x === 0
			) || (
				direction === 7 && y === 0
			)) {
				pathData = pathData_upRight;
				matrix.scale(-1, 1);
			} else {
				pathData = 'm -4,-19 2,0 0,10.5 4,0 0,-10.5 2,0 -4,-4.4 z';
			}
		}
		return this.board.boardPaper.path(pathData).addClass('arrow').transform(matrix);
	}
}

module.exports = Point;
