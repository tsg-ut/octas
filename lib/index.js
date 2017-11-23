const $ = require('jquery');
const snap = require('snapsvg');
const Board = require('./Board');
const BoardElement = require('./BoardElement');
const Client = require('./Client');
const Game = require('./Game');
const AIPlay = require('./AIPlay');

$(document).ready(() => {
	const board = new Board();
	const boardPaper = snap('#board');
	const boardElement = new BoardElement(board, boardPaper);
	const client = new Client(board, boardElement);
	const aiplay = new AIPlay(board);
	new Game(board, boardElement, client, aiplay);
});
