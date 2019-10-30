const mix = require('laravel-mix');

const PATHS = {
	src: './resources',
	dist: './public'
};

mix.js(`${PATHS.src}/js/app.js`, `${PATHS.dist}/js`).webpackConfig({
	module: {
		rules: [
			{
				test: /\.mustache$/,
				use: 'raw-loader'
			},
		]
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /node_modules/,
					chunks: 'initial',
					name: `${PATHS.dist}/js/vendor`,
					enforce: true
				},
			}
		}
	}
});

mix.sass(`${PATHS.src}/css/app.sass`, `${PATHS.dist}/css`);
