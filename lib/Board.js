const $ = require('jquery');
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
		this.arrowMap = new Map();

		this.trace = [[4, 4]];
		this.update();
	}

	getCurrentPoint() {
		const [x, y] = this.trace[this.trace.length - 1];
		if (y === 9 || y === -1) {
			return null;
		}
		return this.points[y][x];
	}

	update() {
		const currentPoint = this.getCurrentPoint();
		this.traceLine.attr({
			points: this.trace.map(([x, y]) => [20 + 20 * x, 20 + 20 * y])
		});
		const [x, y] = this.trace[this.trace.length - 1];
		this.currentPointCircle.attr({
			cx: 20 + 20 * x,
			cy: 20 + 20 * y
		});
		this.arrowMap.forEach((arrow) => arrow.remove());
		if (currentPoint !== null) {
			this.arrowMap = currentPoint.drawArrows();
			this.arrowMap.forEach((arrow, direction) => {
				arrow.click(() => {
					this.moveTo(direction);
				});
			});
		} else {
			this.arrowMap = new Map();
		}
	}

	moveTo(direction) {
		const dxdys = [
			[ 0, -1],
			[ 1, -1],
			[ 1,  0],
			[ 1,  1],
			[ 0,  1],
			[-1,  1],
			[-1,  0],
			[-1, -1]
		];

		const oldPoint = this.getCurrentPoint();
		const moves = oldPoint.getMoves(direction);

		let {x, y} = oldPoint;
		moves.forEach((currentDirection) => {
			const [dx, dy] = dxdys[currentDirection];
			x += dx;
			y += dy;
			this.trace.push([x, y]);
		});
		const newPoint = this.getCurrentPoint();

		oldPoint.availableDirections.delete(direction);

		if (newPoint !== null) {
			newPoint.availableDirections.delete((moves[moves.length - 1] + 4) % 8);
		} else {
			// clear
		}
		this.update();
	}
}

module.exports = Board;
