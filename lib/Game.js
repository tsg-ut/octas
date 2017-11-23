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
			this.vstype = vstype;
			this.start({
				vstype,
			});
		});
		$('#reloadbutton').click(() => {
			location.reload();
		});
		board.on('win', (winner) => {
			const winnerName = {
				AIvsH: ['赤（AI）', '青（あなた）'],
				HvsAI: ['赤（あなた）', '青（AI）'],
				HvsHlocal: ['赤', '青'],
			}[this.vstype][winner];
			const classNames = ['player-a-text', 'player-b-text'];
			$('#winnername').text(winnerName).removeClass(classNames.join(' ')).addClass(classNames[winner]);
			$('.result-prompt').show();
		});
		$('.result-prompt').hide();
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
