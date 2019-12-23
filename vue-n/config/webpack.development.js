const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
	mode: 'development',
	output: {
		filename: 'bundle.js'
	},
	devtool: "source-map",
	plugins: [
		new HtmlWebpackPlugin({
			template: 'index.html',
		})
	]
};
