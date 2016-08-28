const $ = require('jquery');
const Snap = require('snapsvg');
const Board = require('./Board');

$(document).ready(() => {
	const boardPaper = Snap('#board');
	new Board(boardPaper);
});
