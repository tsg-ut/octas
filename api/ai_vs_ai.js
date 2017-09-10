/* eslint-disable no-console */
const Board = require('../lib/Board');
const ai1 = require('./old_ai');
const ai2 = require('./ai');

const board = new Board();

board.on('win', (winner) => {
	console.log(`AI${winner + 1} won`);
});

for (;;) {
	const point = board.getCurrentPoint();
	if (!point || point.movableDirections.size === 0) {
		break;
	}
	const ai = [ai1, ai2][board.activePlayer];
	let hist = board.trace.reduce((prev, curr) => prev.concat(curr), []);
	console.log(JSON.stringify(hist));
	if (board.activePlayer === 1) {
		hist = hist.map(([x, y]) => [8 - x, 8 - y]);
	}
	let aiDir = ai(hist);
	if (aiDir === -1) {
		throw new Error('Ω＼ζ°)ﾁｰﾝ');
	}
	aiDir = (aiDir + board.activePlayer * 4) % 8;
	console.log(`AI${board.activePlayer + 1} moves in ${aiDir}`);
	board.moveTo(aiDir);
}

console.log('ended: hist=', JSON.stringify(board.trace));
