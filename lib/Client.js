const url = (process.env.NODE_ENV === 'production')
	? 'https://octas.herokuapp.com/'
	: process.env.OCTAS_API || 'http://localhost:3000/';
const socket = require('socket.io-client')(url);

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
			// if (!this.board.ended && this.board.selfNumber !== data.player) {
			if (!this.board.ended && this.board.selfNumber === 2) {
				this.board.moveTo(data.direction);
			}
		});
		board.on('moving', (direction) => {
			// if (this.board.selfNumber !== -1 && this.board.isActive()) {
			if (this.board.selfNumber !== 2) {
				socket.emit('move', {
					direction,
					player: this.board.activePlayer,
				});
			}
		});
		board.on('win', () => {
			this.board.selfNumber = 2;
		});
	}
}

module.exports = Client;
