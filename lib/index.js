const $ = require('jquery');
const Snap = require('snapsvg');

$(document).ready(() => {
	const boardPaper = Snap('#board');
	boardPaper.attr({
		viewBox: [-3, -25, 206, 250]
	});
	boardPaper.rect(0, 0, 200, 200).addClass('board-edge');
	const pointCircles = [];
	for (let y = 0; y < 9; y++) {
		const row = [];
		pointCircles.push(row);
		for (let x = 0; x < 9; x++) {
			row.push(boardPaper.circle(20 + 20 * x, 20 + 20 * y, 4).addClass('board-point'));
		}
	}
	const goalCircleA = boardPaper.circle(100, 200, 5).addClass('board-goal-a');
	const goalCircleB = boardPaper.circle(100, 0, 5).addClass('board-goal-b');
	const traceLine = boardPaper.polyline(100, 100).addClass('trace-line');
	const currentPointCircle = boardPaper.circle(100, 100, 7).addClass('current-point');
});
