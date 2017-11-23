class Room {
	constructor({
		board,
		id,
		name,
		status,
		vstype,
	}) {
		this.board = board;
		this.id = id;
		this.name = name;
		this.status = status;
		this.vstype = vstype;
	}
	toData() {
		return {
			boardHeight: this.board.height,
			boardWidth: this.board.width,
			id: this.id,
			name: this.name,
			status: this.status,
			vstype: this.vstype,
		};
	}
	close() {
		this.status = 'closed';
	}
}

module.exports = Room;
