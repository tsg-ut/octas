const socket = require('socket.io-client')();

class Client {
	constructor(board, boardElement) {
		this.board = board;
		this.boardElement = boardElement;
		socket.on('login', (data) => {
			this.board.selfNumber = data.player;
			this.boardElement.update();
		});
		socket.on('move', (data) => {
			if (this.board.selfNumber !== data.player) {
				this.board.moveTo(data.direction);
			}
		});
		board.on('moving', (direction) => {
			if (this.board.isActive()) {
				socket.emit('move', {direction});
			}
		});
	}
}

module.exports = Client;
