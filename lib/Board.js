const EventEmitter = require('events');
const Point = require('./Point');

class Board extends EventEmitter {
	constructor() {
		super();

		this.points = [];
		for (let y = 0; y < 9; y++) {
			const row = [];
			this.points.push(row);
			for (let x = 0; x < 9; x++) {
				row.push(new Point(this, x, y));
			}
		}

		this.trace = [[[4, 4]]];
		this.moves = [];
		this.activePlayer = 0;
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

	switchPlayer() {
		this.activePlayer = 1 - this.activePlayer;
		this.emit('switchPlayer', this.activePlayer);
	}

	moveTo(direction) {
		const dxdys = [
			[0, -1],
			[1, -1],
			[1, 0],
			[1, 1],
			[0, 1],
			[-1, 1],
			[-1, 0],
			[-1, -1],
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

		oldPoint.usedDirections.add(direction);

		if (newPoint !== null) {
			newPoint.usedDirections.add((moves[moves.length - 1] + 4) % 8);
			if (newPoint.movableDirections.size === 0) {
				this.emit('win', 1 - this.activePlayer);
				return;
			}
			let otherSidesRelativeDirections = [];
			if (moves.length === 1) {
				if (direction % 2 === 0) {
					otherSidesRelativeDirections = [
						[1, 2],
						[7, 6],
						[2, 3],
						[6, 5],
					];
				} else {
					otherSidesRelativeDirections = [
						[1, 3],
						[7, 5],
					];
				}
			}
			let thirdPoint = null;
			for (const [diff1, diff2] of otherSidesRelativeDirections) {
				const direction1 = (direction + diff1) % 8;
				const direction2 = (direction + diff2) % 8;
				if (oldPoint.usedDirections.has(direction1) && newPoint.usedDirections.has(direction2)) {
					const [dx, dy] = dxdys[direction1];
					thirdPoint = this.points[oldPoint.y + dy][oldPoint.x + dx];
					break;
				}
			}
			if (thirdPoint) {
				this.emit('formedTriangle', oldPoint, newPoint, thirdPoint);
			} else {
				this.switchPlayer();
			}
		} else {
			this.emit('win', y === -1 ? 1 : 0);
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

		oldPoint.usedDirections.delete(moves[0]);
		if (newPoint !== null) {
			newPoint.usedDirections.delete((moves[moves.length - 1] + 4) % 8);
		}

		this.emit('undo');
	}
}

module.exports = Board;
