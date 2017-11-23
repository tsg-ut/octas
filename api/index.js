/* eslint-disable no-console */
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const Board = require('../lib/Board');
const Room = require('./Room');

const app = express();
const server = new http.Server(app);
const io = socketIO(server);

let nextRoomNumber = 1;
const rooms = {};

// const [humanID/* , aiID */] = [0, 1];
// const observerID = 2;

io.on('connection', (client) => {
	client.on('get-rooms', (reqID) => {
		client.emit('response', [
			reqID,
			Object.keys(rooms).map((key) => rooms[key].toData()),
		]);
	});

	client.on('create-room', (reqID, {vstype, name: name_ = null, width = 9, height = 9}) => {
		if (!(
			['AIvsH', 'HvsAI', 'HvsH'].indexOf(vstype) !== -1 &&
			(name_ === null || typeof name_ === 'string') &&
			(typeof width === 'number') &&
			(typeof height === 'number')
		)) {
			client.emit('response', [
				reqID,
				{error: 'invalid data'},
			]);
			return;
		}

		const roomNumber = nextRoomNumber++;
		const name = (name_ === null) ? `Room #${roomNumber}` : name_;
		const roomID = `room${roomNumber}`;
		const board = new Board({height, width});
		const room = new Room({
			board,
			id: roomID,
			name,
			status: 'waiting',
			vstype,
		});
		client.on('move', (data) => {
			const {direction, player} = data;
			if (rooms[roomID].board.activePlayer !== player) {
				return;
			}
			rooms[roomID].board.moveTo(direction);
			io.of(roomID).emit('move', {direction, player});
		});
		board.on('win', (winner) => {
			console.log(`${winner} won in ${roomID}`);
			room.close();
			delete rooms[room.id];
		});
		client.once('disconnect', () => {
			if (roomID in rooms) {
				rooms[roomID].close();
				delete rooms[roomID];
			}
		});
		rooms[roomID] = room;
		client.emit('response', [
			reqID,
			room.toData(),
		]);
		client.join(roomID);
		client.emit('update', {
			activePlayer: board.activePlayer,
			height: board.height,
			moves: board.moves,
			width: board.width,
		});
	});
	//  else {
	// 	index = observerID;
	// 	client.emit('update', {
	// 		activePlayer: board.activePlayer,
	// 		height: board.height,
	// 		moves: board.moves,
	// 		width: board.width,
	// 	});
	// }
	// client.emit('login', {
	// 	id: index,
	// });
});

if (process.env.NODE_ENV !== 'production') {
	app.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, '../index.html'));
	});
	app.use(express.static(path.join(__dirname, '..')));
}

server.listen(process.env.PORT || 3000);
