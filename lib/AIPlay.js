class AIPlay {
	constructor(board) {
		this.worker = new Worker('./worker.js');
		this.board = board;
		board.on('switchPlayer', () => {
			this.onSwitchPlayer();
		});
		this.worker.onmessage = (evt) => {
			const directions = JSON.parse(evt.data);
			const loop = () => {
				const direction = directions.shift();
				this.board.moveTo(direction);
				if (directions.length === 0) {
					this.onSwitchPlayer();
				} else {
					setTimeout(loop, 600);
				}
			};
			setTimeout(loop, 600);
		};
	}
	onSwitchPlayer() {
		if (!this.board.ended && !this.board.isActive() && this.board.selfNumber !== 2) {
			const data = this.board.moves.reduce((prev, curr) => prev.concat(curr), []);
			this.worker.postMessage(JSON.stringify(data));
		}
	}
}

module.exports = AIPlay;
