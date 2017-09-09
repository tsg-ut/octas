const dx = [0, 1, 1, 1, 0, -1, -1, -1];
const dy = [1, 1, 0, -1, -1, -1, 0, 1];
const goalX = 5;
const goalY = 0;

const distanceToGoal = function(X, Y) {
	return Math.abs(goalX - X) + Math.abs(goalY - Y);
};

const whereToMove = function(edge, nowX, nowY, nowDirection) {
	const newX = nowX + dx[nowDirection];
	const newY = nowY + dy[nowDirection];
	if (newX < 0 || newX >= 11 || newY < 0 || newY >= 11) {
		return [-1, -1];
	}
	if (edge[nowX][nowY][nowDirection] === true) {
		return [-1, -1];
	}
	if (newX > 0 && newX < 10 && newY > 0 && newY < 10) {
		return [newX, newY];
	}
	if ((newX === 0 && newY === 0) || (newX === 10 && newY === 10)) {
		return [-1, -1];
	}
	if ((newX === 10 && newY === 0) || (newX === 0 && newY === 10)) {
		return [-1, -1];
	}
	if (newX === 0) {
		if (nowY + dy[nowDirection] * 2 === 0) {
			return [2, 1];
		} else if (nowY + dy[nowDirection] * 2 === 10) {
			return [2, 9];
		}
		return [nowX, nowY + dy[nowDirection] * 2];
	}
	if (newX === 10) {
		if (nowY + dy[nowDirection] * 2 === 0) {
			return [8, 1];
		} else if (nowY + dy[nowDirection] * 2 === 10) {
			return [8, 9];
		}
		return [nowX, nowY + dy[nowDirection] * 2];
	}
	if (newY === 0) {
		if (nowX + dx[nowDirection] * 2 === 0) {
			return [1, 2];
		} else if (nowX + dx[nowDirection] * 2 === 10) {
			return [9, 2];
		}
		return [nowX + dx[nowDirection] * 2, nowY];
	}
	if (newY === 10) {
		if (nowX + dx[nowDirection] * 2 === 0) {
			return [1, 8];
		} else if (nowX + dx[nowDirection] * 2 === 10) {
			return [9, 8];
		}
		return [nowX + dx[nowDirection] * 2, nowY];
	}
	return [-1, -1];
};

const aiLogic = function(vertexHistory) {
	const arrayLength = vertexHistory.length;
	for (let i = 0; i < arrayLength; i++) {
		vertexHistory[i] = [vertexHistory[i][0] + 1, vertexHistory[i][1] + 1];
	}
	// let edge = new Array(11);
	const edge = new Array(11);
	for (let i = 0; i < 11; i++) {
		edge[i] = new Array(11);
		for (let j = 0; j < 8; j++) {
			edge[i][j] = new Array(8).fill(false);
		}
	}
	for (let i = 1; i < arrayLength; i++) {
		const [preX, preY] = vertexHistory[i - 1];
		const [nowX, nowY] = vertexHistory[i];
		for (let j = 1; j < 8; j++) {
			if (preX + dx[j] === nowX && preY + dy[j] === nowY) {
				edge[preX][preY][j] = true;
				edge[nowX][nowY][(j + 4) % 8] = true;
			}
		}
	}
	const [nowX, nowY] = vertexHistory[arrayLength - 1];

	let minDistance = 1000000;
	let bestDirection = -1;
	for (let i = 0; i < 8; i++) {
		const [toX, toY] = whereToMove(edge, nowX, nowY, i);
		if (toX === -1) {
			continue;
		}
		const nowDistance = distanceToGoal(toX, toY);
		if (minDistance > nowDistance) {
			minDistance = nowDistance;
			bestDirection = i;
		}
	}
	return bestDirection;
};

/*
const canNotMove = function(edge, nowX, nowY) {
	//uso
	for (let i = 0; i < 8; i++) {
		if (edge[nowX][nowY][i] === false) {
			return false;
		}
	}
	return true;
}

const detectTriangle = function(edge, nowX, nowY, nowDirection) {
	for (let i = 0; i < 8; i++) {
		if (i === nowDirection) {
			continue;
		}
		if (nowDirection !== (i + 1) % 8 && nowDirection !== (i + 2) % 8 && nowDirection !== (i - 1) % 8 && nowDirection !== (i - 2) % 8) {
			continue;
		}
		if (edge[nowX][nowY][i] === false) {
			continue;
		}
		const newX = nowX + dx[i];
		const newY = nowY + dy[i];
		if (newX < 0 || newX >= 11 || newY < 0 || newY >= 11) {
			continue;
		}
		for (let j = 0; j < 8; j++) {
			if (newX + dx[j] === nowX && newY + dy[j] === nowY) {
				if (edge[newX][newY][j] === true) {
					return true;
				}
			}
		}
	}
	return false;
};
*/

module.exports = aiLogic;
