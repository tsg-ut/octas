const socket = require('socket.io-client')();

class Client {
	constructor(board, boardElement) {
		this.board = board;
		this.boardElement = boardElement;
		socket.on('login', ({id}) => {
			this.board.selfNumber = id;
			this.boardElement.update();
		});
		socket.on('update', (data) => {
			this.board.fromData(data);
			this.boardElement.update();
		});
		socket.on('move', (data) => {
			if (!this.board.ended && this.board.selfNumber !== data.player) {
				this.board.moveTo(data.direction);
			}
		});
		board.on('moving', (direction) => {
			if (this.board.selfNumber !== -1 && this.board.isActive()) {
				socket.emit('move', {direction});
			}
		});
		board.on('win', () => {
			this.board.selfNumber = 2;
		});
	}
}

module.exports = Client;
