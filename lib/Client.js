const url = (process.env.NODE_ENV === 'production')
	? 'https://octas.herokuapp.com/'
	: process.env.OCTAS_API || 'http://localhost:3000/';
const socketIO = require('socket.io-client');

class Client {
	constructor(board, boardElement) {
		this.board = board;
		this.boardElement = boardElement;
		this.requestID = 0;
		this.resolves = {};
		this.rejects = {};
		this.socket = socketIO(url);
		this.socket.on('login', ({id}) => {
			this.board.selfNumber = id;
			this.boardElement.update();
		});
		this.socket.on('update', (data) => {
			this.board.fromData(data);
			this.boardElement.update();
		});
		this.socket.on('move', (data) => {
			// if (!this.board.ended && this.board.selfNumber !== data.player) {
			if (!this.board.ended && this.board.selfNumber === 2) {
				this.board.moveTo(data.direction);
			}
		});
		board.on('moving', (direction) => {
			// if (this.board.selfNumber !== -1 && this.board.isActive()) {
			if (this.board.selfNumber !== 2) {
				this.socket.emit('move', {
					direction,
					player: this.board.activePlayer,
				});
			}
		});
		board.on('win', () => {
			this.board.selfNumber = 2;
		});
		this.socket.on('response', ([reqID, obj]) => {
			if ('error' in obj) {
				this.rejects[reqID](obj);
			} else {
				this.resolves[reqID](obj);
			}
			delete this.resolves[reqID];
			delete this.rejects[reqID];
		});
	}
	getRooms() {
		return this.request('get-rooms');
	}
	createRoom(opts) {
		return this.request('create-room', opts);
	}

	request(eventName, ...args) {
		const requestID = this.requestID++;
		this.socket.emit(eventName, requestID, ...args);
		return new Promise((resolve, reject) => {
			this.resolves[requestID] = resolve;
			this.rejects[requestID] = reject;
		});
	}
}

module.exports = Client;
