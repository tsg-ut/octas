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
			const vstype = $('input[name="vstype"]:checked').val();
			this.start({
				vstype,
			});
		});
	}
	start(gameOptions) {
		this.client.createRoom(gameOptions).then(() => {
			this.board.selfNumber = {
				AIvsH: 1,
				HvsAI: 0,
				HvsHlocal: -1,
			}[gameOptions.vstype];
			$('.main-menu').hide();
			this.aiplay.onSwitchPlayer();
		});
	}
}

module.exports = Game;
