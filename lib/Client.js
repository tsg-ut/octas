const socket = require('socket.io-client')();

class Client {
	constructor(board) {
		this.board = board;
		socket.on('login', (data) => {
			this.board.player = data.player;
		});
		socket.on('move', (data) => {
			this.board.moveTo(data.direction);
		});
	}
}

module.exports = Client;
