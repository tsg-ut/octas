/* eslint-env worker */
const ai = require('./ai');

onmessage = (evt) => {
	const {width, height, moves} = JSON.parse(evt.data);
	const directions = ai(moves, {height, width});
	postMessage(JSON.stringify(directions));
};
