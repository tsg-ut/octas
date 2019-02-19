(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var dx = [0, 1, 1, 1, 0, -1, -1, -1];
var dy = [-1, -1, 0, 1, 1, 1, 0, -1];
var INF = 1000000;
var searchDepth = 4;
var startMs = null;

var detectTriangle = function detectTriangle(edge, nowX, nowY, nowDirection, _ref) {
	var height = _ref.height,
	    width = _ref.width;

	for (var i = 0; i < 8; i++) {
		if (i === nowDirection) {
			continue;
		}
		if (nowDirection !== (i + 1) % 8 && nowDirection !== (i + 2) % 8 && nowDirection !== (i - 1 + 8) % 8 && nowDirection !== (i - 2 + 8) % 8) {
			continue;
		}
		if (edge[nowX][nowY][i] === false) {
			continue;
		}
		var newX = nowX + dx[i];
		var newY = nowY + dy[i];
		if (newX < 0 || newX >= width + 2 || newY < 0 || newY >= height + 2) {
			continue;
		}
		for (var j = 0; j < 8; j++) {
			if (newX + dx[j] === nowX + dx[nowDirection] && newY + dy[j] === nowY + dy[nowDirection]) {
				if (edge[newX][newY][j] === true) {
					return true;
				}
			}
		}
	}
	return false;
};

var updateEdge = function updateEdge(edge, nowX, nowY, nowDirection, _ref2) {
	var height = _ref2.height,
	    width = _ref2.width;

	var ret = [];
	var newX = nowX + dx[nowDirection];
	var newY = nowY + dy[nowDirection];
	ret.push([nowX, nowY, nowDirection]);
	ret.push([newX, newY, (nowDirection + 4) % 8]);
	edge[nowX][nowY][nowDirection] = true;
	edge[newX][newY][(nowDirection + 4) % 8] = true;

	var nowDX = dx[nowDirection];
	var nowDY = dy[nowDirection];
	var preX = newX;
	var preY = newY;

	while (preX === 0 || preX === width + 1 || preY === 0 || preY === height + 1) {
		if (preX === 0 || preX === width + 1) {
			nowDX *= -1;
		} else {
			nowDY *= -1;
		}
		newX = preX + nowDX;
		newY = preY + nowDY;
		for (var i = 0; i < 8; i++) {
			if (dx[i] === nowDX && dy[i] === nowDY) {
				ret.push([preX, preY, i]);
				ret.push([newX, newY, (i + 4) % 8]);
				edge[preX][preY][i] = true;
				edge[newX][newY][(i + 4) % 8] = true;
				break;
			}
		}
		preX = newX;
		preY = newY;
	}
	return ret;
};

var whereToMove = function whereToMove(edge, nowX, nowY, nowDirection, _ref3) {
	var height = _ref3.height,
	    width = _ref3.width;

	var newX = nowX + dx[nowDirection];
	var newY = nowY + dy[nowDirection];
	var centerX = (width + 1) / 2;
	if (newX < 0 || newX >= width + 2 || newY < 0 || newY >= height + 2) {
		return [-1, -1];
	}
	if (edge[nowX][nowY][nowDirection] === true) {
		return [-1, -1];
	}
	if (newX > 0 && newX < width + 1 && newY > 0 && newY < height + 1) {
		return [newX, newY];
	}
	if (newX === 0 && newY === 0 || newX === width + 1 && newY === height + 1) {
		return [-1, -1];
	}
	if (newX === width + 1 && newY === 0 || newX === 0 && newY === height + 1) {
		return [-1, -1];
	}
	if (newX === 0) {
		if (nowDirection === 6) {
			return [-1, -1];
		} else if (nowY + dy[nowDirection] * 2 === 0) {
			return [2, 1];
		} else if (nowY + dy[nowDirection] * 2 === height + 1) {
			return [2, height];
		}
		return [nowX, nowY + dy[nowDirection] * 2];
	}
	if (newX === width + 1) {
		if (nowDirection === 2) {
			return [-1, -1];
		} else if (nowY + dy[nowDirection] * 2 === 0) {
			return [width - 1, 1];
		} else if (nowY + dy[nowDirection] * 2 === height + 1) {
			return [width - 1, height];
		}
		return [nowX, nowY + dy[nowDirection] * 2];
	}
	if (newY === 0) {
		if (newX === centerX) {
			return [centerX, 0];
		} else if (nowDirection === 0) {
			return [-1, -1];
		} else if (nowX + dx[nowDirection] * 2 === 0) {
			return [1, 2];
		} else if (nowX + dx[nowDirection] * 2 === width + 1) {
			return [width, 2];
		}
		return [nowX + dx[nowDirection] * 2, nowY];
	}
	if (newY === height + 1) {
		if (newX === centerX) {
			return [centerX, height + 1];
		} else if (nowDirection === 4) {
			return [-1, -1];
		} else if (nowX + dx[nowDirection] * 2 === 0) {
			return [1, height - 1];
		} else if (nowX + dx[nowDirection] * 2 === width + 1) {
			return [width, height - 1];
		}
		return [nowX + dx[nowDirection] * 2, nowY];
	}
	return [-1, -1];
};

var canNotMove = function canNotMove(edge, nowX, nowY, _ref4) {
	var height = _ref4.height,
	    width = _ref4.width;

	for (var i = 0; i < 8; i++) {
		var _whereToMove = whereToMove(edge, nowX, nowY, i, { height: height, width: width }),
		    _whereToMove2 = _slicedToArray(_whereToMove, 2),
		    toX = _whereToMove2[0],
		    toY = _whereToMove2[1];

		if (toX !== -1 && toY !== -1) {
			return false;
		}
	}
	return true;
};

var movesToEdge = function movesToEdge(moveHistory, _ref5) {
	var height = _ref5.height,
	    width = _ref5.width;

	var edge = new Array(width + 2);
	for (var i = 0; i < width + 2; i++) {
		edge[i] = new Array(height + 2);
		for (var j = 0; j < height + 2; j++) {
			edge[i][j] = new Array(8).fill(false);
		}
	}
	var x = (width + 1) / 2;
	var y = (height + 1) / 2;
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = moveHistory[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var direction = _step.value;

			edge[x][y][direction] = true;
			x += dx[direction];
			y += dy[direction];
			edge[x][y][(direction + 4) % 8] = true;
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return { edge: edge, x: x, y: y };
};

var distanceToGoal = function distanceToGoal(edge, X, Y, _ref6) {
	var height = _ref6.height,
	    width = _ref6.width;

	if (canNotMove(edge, X, Y, { height: height, width: width }) === true) {
		return INF;
	}
	return Y * 20 + Math.abs(X - (width + 1) / 2) * (Y < (height - 1) / 2 ? 1 : -1) + Math.floor(Math.random() * 4) - 2;
};

var depthSearch = function depthSearch(depth, edge, nowX, nowY, _ref7) {
	var height = _ref7.height,
	    width = _ref7.width;

	if (searchDepth === 4 && new Date().getTime() - startMs > 10000) {
		return { directions: [], score: -1 };
	}
	var ret = INF;
	var retIndices = [];
	if (depth === searchDepth) {
		for (var i = 0; i < 8; i++) {
			var _whereToMove3 = whereToMove(edge, nowX, nowY, i, { height: height, width: width }),
			    _whereToMove4 = _slicedToArray(_whereToMove3, 2),
			    toX = _whereToMove4[0],
			    toY = _whereToMove4[1];

			if (toX === -1) {
				continue;
			}
			var repair = updateEdge(edge, nowX, nowY, i, { height: height, width: width });
			var tmpVal = distanceToGoal(edge, toX, toY, { height: height, width: width });
			if (ret > tmpVal) {
				ret = tmpVal;
				retIndices = [i];
			}
			for (var j = 0; j < repair.length; j++) {
				edge[repair[j][0]][repair[j][1]][repair[j][2]] = false;
			}
		}
		return { directions: retIndices, score: ret };
	}
	for (var _i = 0; _i < 8; _i++) {
		var _whereToMove5 = whereToMove(edge, nowX, nowY, _i, { height: height, width: width }),
		    _whereToMove6 = _slicedToArray(_whereToMove5, 2),
		    _toX = _whereToMove6[0],
		    _toY = _whereToMove6[1];

		if (_toX === -1) {
			continue;
		}
		if (_toY === 0) {
			if (depth % 2 === 0) {
				return { directions: [_i], score: -INF };
			}
			continue;
		}
		if (_toY === height + 1) {
			if (depth % 2 === 1) {
				return { directions: [_i], score: -INF };
			}
			continue;
		}
		var _repair = updateEdge(edge, nowX, nowY, _i, { height: height, width: width });
		if (canNotMove(edge, _toX, _toY, { height: height, width: width }) === false) {
			if (detectTriangle(edge, nowX, nowY, _i, { height: height, width: width }) === true) {
				var _depthSearch = depthSearch(depth, edge, _toX, _toY, { height: height, width: width }),
				    directions = _depthSearch.directions,
				    _tmpVal = _depthSearch.score;

				if (ret > _tmpVal) {
					ret = _tmpVal;
					retIndices = [_i].concat(directions);
				}
			} else {
				var _tmpVal2 = depthSearch(depth + 1, edge, _toX, _toY, { height: height, width: width }).score * -1;
				if (ret > _tmpVal2) {
					ret = _tmpVal2;
					retIndices = [_i];
				}
			}
		}
		for (var _j = 0; _j < _repair.length; _j++) {
			edge[_repair[_j][0]][_repair[_j][1]][_repair[_j][2]] = false;
		}
	}
	return { directions: retIndices, score: ret };
};

var onlyOneWay = function onlyOneWay(edge, nowX, nowY, _ref8) {
	var height = _ref8.height,
	    width = _ref8.width;

	var counter = 0;
	for (var i = 0; i < 8; i++) {
		var _whereToMove7 = whereToMove(edge, nowX, nowY, i, { height: height, width: width }),
		    _whereToMove8 = _slicedToArray(_whereToMove7, 2),
		    toX = _whereToMove8[0],
		    toY = _whereToMove8[1];

		if (toX !== -1 && toY !== -1) {
			counter += 1;
		}
	}
	return counter === 1;
};

var aiLogic = function aiLogic(moveHistory, _ref9) {
	var height = _ref9.height,
	    width = _ref9.width;

	startMs = new Date().getTime();

	var _movesToEdge = movesToEdge(moveHistory, { height: height, width: width }),
	    edge = _movesToEdge.edge,
	    nowX = _movesToEdge.x,
	    nowY = _movesToEdge.y;

	if (onlyOneWay(edge, nowX, nowY, { height: height, width: width }) === true) {
		for (var i = 0; i < 8; i++) {
			var _whereToMove9 = whereToMove(edge, nowX, nowY, i, { height: height, width: width }),
			    _whereToMove10 = _slicedToArray(_whereToMove9, 2),
			    toX = _whereToMove10[0],
			    toY = _whereToMove10[1];

			if (toX !== -1 && toY !== -1) {
				return [i];
			}
		}
	}

	var ret = depthSearch(0, edge, nowX, nowY, { height: height, width: width }).directions;
	if (new Date().getTime() - startMs > 10000) {
		searchDepth = 2;
		ret = depthSearch(0, edge, nowX, nowY, { height: height, width: width }).directions;
		searchDepth = 4;
		// Next step may fit in 10 seconds...
		ret = ret.slice(0, 1);
	}

	if (ret.length === 0) {
		for (var _i2 = 0; _i2 < 8; _i2++) {
			var _whereToMove11 = whereToMove(edge, nowX, nowY, _i2, { height: height, width: width }),
			    _whereToMove12 = _slicedToArray(_whereToMove11, 2),
			    _toX2 = _whereToMove12[0],
			    _toY2 = _whereToMove12[1];

			if (_toX2 !== -1 && _toY2 !== -1) {
				return [_i2];
			}
		}
	}

	return ret;
};

module.exports = aiLogic;

},{}],2:[function(require,module,exports){
'use strict';

/* eslint-env worker */
var ai = require('./ai');

onmessage = function onmessage(evt) {
	var _JSON$parse = JSON.parse(evt.data),
	    width = _JSON$parse.width,
	    height = _JSON$parse.height,
	    moves = _JSON$parse.moves;

	var directions = ai(moves, { height: height, width: width });
	postMessage(JSON.stringify(directions));
};

},{"./ai":1}]},{},[2])
//# sourceMappingURL=worker.js.map
