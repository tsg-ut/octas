/* eslint-disable no-console */
const fs = require('fs');
const http = require('http');
const socketIO = require('socket.io');

const Board = require('../lib/Board');
const ai = require('./ai');

const app = http.createServer((req, res) => {
	let filename = null;
	let contentType = null;
	switch (req.url) {
	case '/':
	case '/index.html':
		filename = '../index.html';
		contentType = 'text/html';
		break;
	case '/index.css':
		filename = '../index.css';
		contentType = 'text/css';
		break;
	case '/index.js':
		filename = '../index.js';
		contentType = 'text/javascript';
		break;
	default:
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.end();
		return;
	}
	// eslint-disable-next-line no-sync
	const stat = fs.statSync(filename);
	res.writeHead(200, {
		'Content-Length': stat.size,
		'Content-Type': contentType,
	});
	fs.createReadStream(filename).pipe(res);
});
const io = socketIO(app);

let board = null;
let timer = null;
const [humanID, aiID] = [0, 1];
const observerID = 2;

const move = (direction, player) => {
	if (board.activePlayer !== player) {
		return;
	}
	board.moveTo(direction);
	io.emit('move', {
		direction,
		player,
	});
	if (board && board.activePlayer === aiID) {
		const point = board.getCurrentPoint();
		if (point !== null && point.movableDirections.size !== 0) {
			timer = setTimeout(() => {
				timer = null;
				if (!board) {
					return;
				}
				const data = board.moves.reduce((prev, curr) => prev.concat(curr), []);
				console.log(JSON.stringify(data));
				const aiDirection = ai(data);
				if (aiDirection === -1) {
					throw new Error('no available move!?!!?');
				}
				console.log('AI moves in:', aiDirection);
				move(aiDirection, aiID);
			}, 600);
		}
	}
};

const gameEnd = () => {
	board = null;
	if (timer !== null) {
		clearTimeout(timer);
		timer = null;
	}
};

const onmove = (data) => {
	move(data.direction, humanID);
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

app.listen(process.env.PORT || 3000);
