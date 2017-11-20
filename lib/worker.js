/* eslint-env worker */
const ai = require('../api/ai');

onmessage = (evt) => {
	const data = JSON.parse(evt.data);
	const directions = ai(data);
	postMessage(JSON.stringify(directions));
};
