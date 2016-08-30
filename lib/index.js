const $ = require('jquery');
const Snap = require('snapsvg');
const Board = require('./Board');
const BoardElement = require('./BoardElement');

$(document).ready(() => {
	const board = new Board();
	const boardPaper = Snap('#board');
	new BoardElement(board, boardPaper);
});
