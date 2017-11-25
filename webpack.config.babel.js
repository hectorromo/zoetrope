const {resolve} = require('path');

module.exports = () => {
	return {
		context: resolve('js'),
		entry: './main.js',
		output: {
			filename: 'bundle.js',
		},
	}
}