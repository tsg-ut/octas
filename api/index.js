/* eslint-disable no-console */
const express = require('express');
const session = require('express-session');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
require('dotenv').config();

const Board = require('../lib/Board');
const Room = require('./Room');
const Auth = require('./auth');

const app = express();
const server = new http.Server(app);
const io = socketIO(server);

/* session setup for socket.io */
const sessionMiddleware = session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: false,
});

app.use(sessionMiddleware);
app.use(Auth.passport.initialize());
//app.use(Auth.passport.session()); // use session info in web page

/* use session in socket.io */
io.use((socket, next) => sessionMiddleware(socket.request, socket.request.res, next));
io.use((socket, next) => Auth.passport.initialize()(socket.request, socket.request.res, next));
//io.use((socket, next) => Auth.passport.session()(socket.request, socket.request.res, next));

let nextRoomNumber = 1;
const rooms = {};

// const [humanID/* , aiID */] = [0, 1];
// const observerID = 2;

io.on('connection', (client) => {
	if (client.request.session.passport) {
		const userdata = client.request.session.passport.user;
		console.log(`connection by logged in user: ${userdata.username} as ${client.id}`);
		client.emit('hello', userdata.username);
	} else {
		console.log(`connection by anonymous as ${client.id}`);
		client.emit('need-signin');
	}
	client.on('get-rooms', (reqID) => {
		client.emit('response', [
			reqID,
			Object.keys(rooms).map((key) => rooms[key].toData()),
		]);
	});

	client.on('create-room', (reqID, {vstype, name: name_ = null, width = 5, height = 5}) => {
		if (!(
			['AIvsH', 'HvsAI', 'HvsH', 'HvsHlocal'].indexOf(vstype) !== -1 &&
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
			console.log(`${winner} won in ${roomID} (vstype=${room.vstype})`);
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
		room.status = 'playing';
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
	
	app.get('/index-local', (req, res) => {
		res.sendFile(path.join(__dirname, '../index-local.html'));
	});
	app.use(express.static(path.join(__dirname, '..')));
}

app.get('/login/twitter', Auth.passport.authenticate('twitter'));
app.get('/login/twitter/callback', Auth.passport.authenticate('twitter'),
	(req, res) => res.redirect(
		process.env.NODE_ENV !== 'production'
		? '/'
		: 'http://sig.tsg.ne.jp/octas/'
	));

const PORT = process.env.PORT || 3000;
server.listen(PORT);
console.log(`listening on PORT:${PORT}...`);