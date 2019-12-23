const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin=require('vue-loader/lib/plugin');
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
		}),
		new VueLoaderPlugin(),
	]
};
