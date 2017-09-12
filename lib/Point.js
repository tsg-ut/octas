class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.availableDirections = new Set([0, 1, 2, 3, 4, 5, 6, 7]);
		if (y === 0) {
			if (x !== 4) {
				this.availableDirections.delete(0);
			}
			if (x === 8) {
				this.availableDirections.delete(1);
			}
		}
		if (x === 8) {
			this.availableDirections.delete(2);
			if (y === 8) {
				this.availableDirections.delete(3);
			}
		}
		if (y === 8) {
			if (x !== 4) {
				this.availableDirections.delete(4);
			}
			if (x === 0) {
				this.availableDirections.delete(5);
			}
		}
		if (x === 0) {
			this.availableDirections.delete(6);
			if (y === 0) {
				this.availableDirections.delete(7);
			}
		}
		this.usedDirections = new Set();
	}

	get movableDirections() {
		return new Set([...this.availableDirections].filter((direction) => !this.usedDirections.has(direction)));
	}

	getMoves(direction) {
		const {x, y} = this;
		if (
			(direction === 1 && y === 0 && x === 7) ||
			(direction === 3 && x === 8 && y === 7) ||
			(direction === 5 && y === 8 && x === 1) ||
			(direction === 7 && x === 0 && y === 1)
		) {
			return [
				direction,
				(direction + 2) % 8,
				(direction + 4) % 8,
			];
		}
		if (
			(direction === 1 && x === 8 && y === 1) ||
			(direction === 3 && y === 8 && x === 7) ||
			(direction === 5 && x === 0 && y === 7) ||
			(direction === 7 && y === 0 && x === 1)
		) {
			return [
				direction,
				(direction + 6) % 8,
				(direction + 4) % 8,
			];
		}
		if (
			(direction === 1 && y === 0 && x !== 3) ||
			(direction === 3 && x === 8) ||
			(direction === 5 && y === 8 && x !== 5) ||
			(direction === 7 && x === 0)
		) {
			return [
				direction,
				(direction + 2) % 8,
			];
		}
		if (
			(direction === 1 && x === 8) ||
			(direction === 3 && y === 8 && x !== 3) ||
			(direction === 5 && x === 0) ||
			(direction === 7 && y === 0 && x !== 5)
		) {
			return [
				direction,
				(direction + 6) % 8,
			];
		}
		return [direction];
	}
}

module.exports = Point;
