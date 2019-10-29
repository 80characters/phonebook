const path = require('path');
const webpack = require('webpack');
const mix = require('laravel-mix');

const PATHS = {
	src: './resources',
	dist: './public'
};

mix.webpackConfig({
	module: {
		rules: [
			{
				test: /\.mustache$/,
				use: 'raw-loader'
			}
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

mix.js(`${PATHS.src}/js/app.js`, `${PATHS.dist}/js`);
mix.sass(`${PATHS.src}/sass/app.scss`, `${PATHS.dist}/css`);
