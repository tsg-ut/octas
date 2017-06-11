const $ = require('jquery');
const Snap = require('snapsvg');

class BoardElement {
	constructor(board, boardPaper) {
		this.board = board;
		this.boardPaper = boardPaper;
		boardPaper.attr({
			viewBox: [-3, -25, 206, 250],
		});
		boardPaper.rect(0, 0, 200, 200).addClass('board-edge');
		for (let y = 0; y < 9; y++) {
			for (let x = 0; x < 9; x++) {
				this.boardPaper.circle(20 + 20 * x, 20 + 20 * y, 4).addClass('board-point');
			}
		}
		this.goalCircleA = boardPaper.circle(100, 200, 5).addClass('board-goal player-a');
		this.goalCircleB = boardPaper.circle(100, 0, 5).addClass('board-goal player-b');
		this.traceLine = boardPaper.polyline(100, 100).addClass('trace-line');
		this.currentPointCircle = boardPaper.circle(100, 100, 7).addClass('current-point');
		let isMouseDown = false;
		this.currentPointCircle.mousedown((evt) => {
			isMouseDown = true;
			this.startDrag();
			this.dragTo(evt.clientX, evt.clientY);
			evt.preventDefault();
		});
		this.boardPaper.mousemove((evt) => {
			if (!isMouseDown) {
				return;
			}
			this.dragTo(evt.clientX, evt.clientY);
			evt.preventDefault();
		});
		this.boardPaper.mouseup((evt) => {
			if (!isMouseDown) {
				return;
			}
			this.dragTo(evt.clientX, evt.clientY);
			this.endDrag();
			isMouseDown = false;
			evt.preventDefault();
		});
		let isFingerDown = false;
		this.currentPointCircle.touchstart((evt) => {
			isFingerDown = true;
			this.startDrag();
			const touch = evt.touches[0];
			this.dragTo(touch.clientX, touch.clientY);
			evt.preventDefault();
		});
		this.boardPaper.touchmove((evt) => {
			if (!isFingerDown) {
				return;
			}
			const touch = evt.touches[0];
			this.dragTo(touch.clientX, touch.clientY);
			evt.preventDefault();
		});
		this.boardPaper.touchend((evt) => {
			if (!isFingerDown) {
				return;
			}
			if (evt.touches.length) {
				const touch = evt.touches[0];
				this.dragTo(touch.clientX, touch.clientY);
			} else {
				const touch = evt.changedTouches[0];
				this.dragTo(touch.clientX, touch.clientY);
				this.endDrag();
				isFingerDown = false;
			}
			evt.preventDefault();
		});
		this.arrowMap = new Map();
		this.update();

		board.on('formedTriangle', (oldPoint, newPoint, thirdPoint) => {
			this.visualizeTriangle(oldPoint, newPoint, thirdPoint);
		});
		board.on('undo', () => {
			this.update();
		});
		board.on('win', (/* winner */) => {
			// something
		});
		board.on('switchPlayer', (/* newPlayer */) => {
			// something
		});
	}

	update() {
		const player = ['a', 'b'][this.board.activePlayer];
		const currentPoint = this.board.getCurrentPoint();
		this.traceLine.attr({
			points: this.board.trace.map((path) => path.map(([x, y]) => [20 + 20 * x, 20 + 20 * y])),
		});
		const [x, y] = this.board.currentCoords;
		this.currentPointCircle.attr({
			cx: 20 + 20 * x,
			cy: 20 + 20 * y,
		});
		this.arrowMap.forEach((arrow) => arrow.remove());
		if (currentPoint !== null) {
			this.arrowMap = this.drawArrows(currentPoint);
			this.arrowMap.forEach((arrow, direction) => {
				arrow.click(() => {
					this.board.moveTo(direction);
					this.update();
				});
			});
			$('.container').removeClass('active-a active-b').addClass(`active-${player}`);
		} else {
			this.arrowMap = new Map();
		}
	}

	drawArrows(point) {
		const arrowMap = new Map();
		point.movableDirections.forEach((direction) => arrowMap.set(direction, this.drawArrow(point, direction)));
		return arrowMap;
	}

	drawArrow(point, direction) {
		const matrix = Snap.matrix();
		const x = point.x, y = point.y;
		const theta = direction * 45;
		matrix.translate(20 + x * 20, 20 + y * 20).rotate(theta);
		let pathData;
		if (direction % 2 === 0) {
			// N, E, S, W
			pathData = 'm -4,-13.085935 2,0 0,4.546875 4,0 0,-4.546875 2,0 -4,-4.375 z';
		} else {
			// NE, SE, SW, NW
			const pathData_upRight = 'm 19.14693,-32.2842712474 0,2 -21.14693,0 0,21.74521 4,0 0,-17.74521 17.14693,0 0,2 4.375,-4 z';
			const pathData_upRightDown = 'm 32.285156,-9.1367188 -2,0 0,-21.1484372 -32.285156,0 0,21.7460935 4,0 0,-17.7460935 24.285156,0 0,17.1484372 -2,0 4,4.375 z';
			if ((
				direction === 1 && y === 0 && x === 7
			) || (
				direction === 3 && x === 8 && y === 7
			) || (
				direction === 5 && y === 8 && x === 1
			) || (
				direction === 7 && x === 0 && y === 1
			)) {
				pathData = pathData_upRightDown;
			} else if ((
				direction === 1 && x === 8 && y === 1
			) || (
				direction === 3 && y === 8 && x === 7
			) || (
				direction === 5 && x === 0 && y === 7
			) || (
				direction === 7 && y === 0 && x === 1
			)) {
				pathData = pathData_upRightDown;
				matrix.scale(-1, 1);
			} else if ((
				direction === 1 && y === 0 && x !== 3
			) || (
				direction === 3 && x === 8
			) || (
				direction === 5 && y === 8 && x !== 5
			) || (
				direction === 7 && x === 0
			)) {
				pathData = pathData_upRight;
			} else if ((
				direction === 1 && x === 8
			) || (
				direction === 3 && y === 8 && x !== 3
			) || (
				direction === 5 && x === 0
			) || (
				direction === 7 && y === 0 && x !== 5
			)) {
				pathData = pathData_upRight;
				matrix.scale(-1, 1);
			} else {
				pathData = 'm -4,-19 2,0 0,10.5 4,0 0,-10.5 2,0 -4,-4.4 z';
			}
		}
		return this.boardPaper.path(pathData).addClass('arrow').transform(matrix);
	}

	visualizeTriangle(point1, point2, point3) {
		$('.triangle').remove();
		this.boardPaper.polygon([point1.x, point1.y, point2.x, point2.y, point3.x, point3.y].map((v) => 20 + 20 * v)).addClass('triangle');
	}

	startDrag() {
		this.selectedDirection = null;
		this.boardPaper.addClass('dragging');

		// Bring to front
		this.boardPaper.append(this.currentPointCircle);
	}

	dragTo(clientX, clientY) {
		const inverse = Snap.matrix(this.boardPaper.node.getScreenCTM().inverse());
		const svgX = inverse.x(clientX, clientY);
		const svgY = inverse.y(clientX, clientY);
		this.currentPointCircle.attr({
			cx: svgX,
			cy: svgY,
		});
		const [origX, origY] = this.board.currentCoords;
		const dx = svgX - (20 + 20 * origX);
		const dy = svgY - (20 + 20 * origY);
		this.arrowMap.forEach((arrow) => {
			arrow.removeClass('selected');
		});
		this.selectedDirection = null;
		if (dx * dx + dy * dy > 100) {
			// -PI <= theta <= PI
			const theta = Math.atan2(dy, dx);
			const selectedDirection = (Math.round(theta / (Math.PI / 4)) + 10) % 8;
			const arrow = this.arrowMap.get(selectedDirection);
			if (arrow) {
				arrow.addClass('selected');
				this.selectedDirection = selectedDirection;
			}
		}
	}

	endDrag() {
		this.boardPaper.removeClass('dragging');
		if (this.selectedDirection !== null) {
			this.board.moveTo(this.selectedDirection);
		}
		this.update();
	}
}

module.exports = BoardElement;
