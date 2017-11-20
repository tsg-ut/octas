class AIPlay {
	constructor(board) {
		this.worker = new Worker('./worker.js');
		this.board = board;
		board.on('switchPlayer', () => {
			if (!board.ended && !board.isActive() && board.selfNumber !== 2) {
				const data = this.board.moves.reduce((prev, curr) => prev.concat(curr), []);
				this.worker.postMessage(JSON.stringify(data));
			}
		});
		this.worker.onmessage = (evt) => {
			const directions = JSON.parse(evt.data);
			const loop = () => {
				const direction = directions.shift();
				this.board.moveTo(direction);
				if (directions.length > 0) {
					setTimeout(loop, 600);
				}
			};
			setTimeout(loop, 600);
		};
	}
}

module.exports = AIPlay;
