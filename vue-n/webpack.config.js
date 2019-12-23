module.exports = function(env, argv){
	return {
		entry: './src/vm.js',
		...env.development?require('./config/webpack.development'):require('./config/webpack.production'),
		module: {
			rules: [
				{test: /\.css$/i, use: ['vue-style-loader', 'css-loader']},
				{test: /\.vue$/i, use: 'vue-loader'}
			],
		},
		resolve: {
			alias: {
				'vue': 'vue/dist/vue.esm',
			},
		},
	}
};
