const Board = require('../lib/Board');
const ai1 = require('./old_ai');
const ai2 = require('./ai');

const board = new Board();

for (;;) {
	const point = board.getCurrentPoint();
	if (!point || point.movableDirections.size === 0) {
		break;
	}
	const ai = [ai1, ai2][board.activePlayer];
	const hist = board.trace.reduce((prev, curr) => prev.concat(curr), []);
	console.log(hist);
	const aiDir = ai(hist);
	console.log(`AI${board.activePlayer + 1} moves in ${aiDir}`);
	if (aiDir === -1) {
		throw new Error('Ω＼ζ°)ﾁｰﾝ');
	}
	board.moveTo(aiDir);
}

console.log('ended: hist=', board.trace);
