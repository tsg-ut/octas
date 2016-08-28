const Point = require('./Point');

class Board {
	constructor(boardPaper) {
		this.boardPaper = boardPaper;
		boardPaper.attr({
			viewBox: [-3, -25, 206, 250]
		});
		boardPaper.rect(0, 0, 200, 200).addClass('board-edge');
		this.points = [];
		for (let y = 0; y < 9; y++) {
			const row = [];
			this.points.push(row);
			for (let x = 0; x < 9; x++) {
				row.push(new Point(this, x, y));
			}
		}
		this.goalCircleA = boardPaper.circle(100, 200, 5).addClass('board-goal-a');
		this.goalCircleB = boardPaper.circle(100, 0, 5).addClass('board-goal-b');
		this.traceLine = boardPaper.polyline(100, 100).addClass('trace-line');
		this.currentPointCircle = boardPaper.circle(100, 100, 7).addClass('current-point');


		this.trace = [];
	}
}

module.exports = Board;
