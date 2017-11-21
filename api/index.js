/* eslint-disable no-console */
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const Board = require('../lib/Board');

const app = express();
const server = new http.Server(app);
const io = socketIO(server);

let board = null;
let timer = null;
const [humanID/* , aiID */] = [0, 1];
const observerID = 2;

const gameEnd = () => {
	board = null;
	if (timer !== null) {
		clearTimeout(timer);
		timer = null;
	}
};

const onmove = (data) => {
	const {direction, player} = data;
	if (board.activePlayer !== player) {
		return;
	}
	board.moveTo(direction);
	io.emit('move', {direction, player});
};

const ondisconnect = () => {
	console.log('Player disconnected');
	gameEnd();
};

io.on('connection', (client) => {
	let index = null;
	if (board === null) {
		board = new Board();
		board.on('win', (winner) => {
			console.log(`${winner} won`);
			client.removeListener('move', onmove);
			client.removeListener('disconnect', ondisconnect);
			gameEnd();
		});
		client.on('move', onmove);
		client.once('disconnect', ondisconnect);
		index = humanID;
		// Reset all clients
		io.emit('update', {
			activePlayer: board.activePlayer,
			moves: board.moves,
		});
	} else {
		index = observerID;
		client.emit('update', {
			activePlayer: board.activePlayer,
			moves: board.moves,
		});
	}
	client.emit('login', {
		id: index,
	});
});

if (process.env.NODE_ENV !== 'production') {
	app.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, '../index.html'));
	});
	app.use(express.static(path.join(__dirname, '..')));
}

server.listen(process.env.PORT || 3000);
