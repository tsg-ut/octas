/* eslint-disable no-console */
const Board = require('../lib/Board');
const ai1 = require('./old_ai');
const ai2 = require('./ai');

const board = new Board();

ai1.time = 0;
ai2.time = 0;
ai1.n = 0;
ai2.n = 0;
ai1.ainame = 'AI(old)';
ai2.ainame = 'AI(new)';

const reverse = false;

const ais = reverse ? [ai1, ai2] : [ai2, ai1];

board.on('win', (winner) => {
	console.log(`${ais[winner].ainame} won`);
});

for (;;) {
	const point = board.getCurrentPoint();
	if (!point || point.movableDirections.size === 0) {
		break;
	}
	const ai = ais[board.activePlayer];
	let hist = board.moves.reduce((prev, curr) => prev.concat(curr), []);
	console.log(`${ai.ainame}'s turn: ${JSON.stringify(hist)}`);
	if (board.activePlayer === 0) {
		hist = hist.map((dir) => (dir + 4) % 8);
	}
	const start = new Date();
	let aiDir = ai(hist);
	ai.time += new Date().valueOf() - start.valueOf();
	ai.n++;
	if (aiDir === -1) {
		throw new Error('Ω＼ζ°)ﾁｰﾝ');
	}
	if (board.activePlayer === 0) {
		aiDir = (aiDir + 4) % 8;
	}
	console.log(`${ai.ainame} moves in ${aiDir}`);
	board.moveTo(aiDir);
}

console.log('ended');
console.log('trace=', JSON.stringify(board.trace));
console.log('moves=', JSON.stringify(board.moves));
console.log(`ai1: avgtime=${ai1.time / ai1.n}; ai2: avgtime=${ai2.time / ai2.n}`);
