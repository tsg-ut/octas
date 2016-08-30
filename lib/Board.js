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
		this.goalCircleA = boardPaper.circle(100, 200, 5).addClass('board-goal player-a');
		this.goalCircleB = boardPaper.circle(100, 0, 5).addClass('board-goal player-b');
		this.traceLine = boardPaper.polyline(100, 100).addClass('trace-line');
		this.currentPointCircle = boardPaper.circle(100, 100, 7).addClass('current-point');
		this.arrowMap = new Map();

		this.trace = [[[4, 4]]];
		this.moves = [];
		this.activePlayer = 0;
		this.update();
	}

	get currentCoords() {
		const lastPath = this.trace[this.trace.length - 1];
		return lastPath[lastPath.length - 1];
	}

	getCurrentPoint() {
		const [x, y] = this.currentCoords;
		if (y === 9 || y === -1) {
			return null;
		}
		return this.points[y][x];
	}

	update() {
		const player = ['a', 'b'][this.activePlayer];
		const currentPoint = this.getCurrentPoint();
		this.traceLine.attr({
			points: this.trace.map((path) => path.map(([x, y]) => [20 + 20 * x, 20 + 20 * y]))
		});
		const [x, y] = this.currentCoords;
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
					this.update();
				});
			});
			$('.active-player').removeClass('active-player');
			$('.player-' + player).addClass('active-player');
		} else {
			this.arrowMap = new Map();
		}
	}

	switchPlayer() {
		this.activePlayer = 1 - this.activePlayer;
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
		this.trace.push(moves.map((currentDirection) => {
			const [dx, dy] = dxdys[currentDirection];
			x += dx;
			y += dy;
			return [x, y];
		}));
		this.moves.push(moves);
		const newPoint = this.getCurrentPoint();

		oldPoint.availableDirections.delete(direction);

		if (newPoint !== null) {
			newPoint.availableDirections.delete((moves[moves.length - 1] + 4) % 8);
			let isTriangleFormed = false;
			if (moves.length === 1) {
				if (direction % 2 === 0) {
					isTriangleFormed = (
						!oldPoint.availableDirections.has((direction + 1) % 8) && !newPoint.availableDirections.has((direction + 2) % 8)
					) || (
						!oldPoint.availableDirections.has((direction + 7) % 8) && !newPoint.availableDirections.has((direction + 6) % 8)
					) || (
						!oldPoint.availableDirections.has((direction + 2) % 8) && !newPoint.availableDirections.has((direction + 3) % 8)
					) || (
						!oldPoint.availableDirections.has((direction + 6) % 8) && !newPoint.availableDirections.has((direction + 5) % 8)
					);
				} else {
					isTriangleFormed = (
						!oldPoint.availableDirections.has((direction + 1) % 8) && !newPoint.availableDirections.has((direction + 3) % 8)
					) || (
						!oldPoint.availableDirections.has((direction + 7) % 8) && !newPoint.availableDirections.has((direction + 5) % 8)
					);
				}
			}
			if (!isTriangleFormed) {
				// TODO: visualize triangle
				this.switchPlayer();
			}
		} else {
			// clear
		}
	}

	undo() {
		const newPoint = this.getCurrentPoint();
		this.trace.pop();
		const moves = this.moves.pop();
		const oldPoint = this.getCurrentPoint();

		if (!moves) {
			// Not moved yet
			return;
		}

		oldPoint.availableDirections.add(moves[0]);
		if (newPoint !== null) {
			newPoint.availableDirections.add((moves[moves.length - 1] + 4) % 8);
		}

		this.update();
	}
}

module.exports = Board;
