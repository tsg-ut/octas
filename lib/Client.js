const socket = require('socket.io-client')();

class Client {
	constructor(board) {
		this.board = board;
		socket.on('login', (data) => {
			this.board.player = data.player;
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
