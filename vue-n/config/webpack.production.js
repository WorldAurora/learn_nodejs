const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');


module.exports = {
	mode: "production",
	output: {
		path: path.resolve(__dirname, '../dest'),
		filename: 'bundle.min.js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'index.html',
		})
	]
};
