const $ = require('jquery');

class Game {
	constructor(board, boardElement, client, aiplay) {
		this.board = board;
		this.boardElement = boardElement;
		this.client = client;
		this.aiplay = aiplay;

		const startButton = $('#startgame');
		startButton.click(() => {
			startButton.attr({disabled: true});
			this.start({
				vstype: 'HvsAI',
			});
		});
	}
	start(gameOptions) {
		this.client.createRoom(gameOptions).then(() => {
			this.board.selfNumber = 0;
			$('.main-menu').hide();
		});
	}
}

module.exports = Game;
