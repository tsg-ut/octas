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
				this.board.moveTo(
					(this.board.selfNumber === 0)
						? direction
						: (direction + 4) % 8
				);
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
			const moves = this.board.moves.reduce((prev, curr) => prev.concat(curr), []);
			this.worker.postMessage(JSON.stringify({
				height: this.board.height,
				moves: (this.board.selfNumber === 0)
					? moves
					: moves.map((direction) => (direction + 4) % 8),
				width: this.board.width,
			}));
		}
	}
}

module.exports = AIPlay;
