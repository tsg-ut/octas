const $ = require('jquery');
const snap = require('snapsvg');
const Board = require('./Board');
const BoardElement = require('./BoardElement');
const Client = require('./Client');

$(document).ready(() => {
	const board = new Board();
	const boardPaper = snap('#board');
	const boardElement = new BoardElement(board, boardPaper);
	new Client(board, boardElement);
});
