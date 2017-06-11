const $ = require('jquery');
const snap = require('snapsvg');
const Board = require('./Board');
const BoardElement = require('./BoardElement');

$(document).ready(() => {
	const board = new Board();
	const boardPaper = snap('#board');
	new BoardElement(board, boardPaper);
});
