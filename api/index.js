const io = require('socket-io')();

const Board = require('../lib/Board');
const ai = require('./ai');

const clients = [];
const board = new Board();

const move = (direction, user) => {
	board.moveTo(direction);
	io.emit('move', {
		direction,
		user,
	});
	if (board.activePlayer === 1) {
		const point = board.getCurrentPoint();
		if (point !== null && point.movableDirections.size !== 0) {
			setTimeout(() => {
				const aiDirection = ai(board.trace);
				if (aiDirection === -1) {
					throw new Error('no available move!?!!?');
				}
				move(aiDirection, 1);
			}, 1000);
		}
	}
};

io.on('connection', (client) => {
	const index = clients.push(client) - 1;
	if (index === 0) {
		client.on('move', (data) => {
			move(data.direction, index);
		});
	}
	client.emit('login', {player: index});
});
io.listen(3000);
