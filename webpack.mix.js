
const mix = require('laravel-mix');

const PATHS = {
    src: './resources',
    dist: './public'
};

mix.js(`${PATHS.src}/js/app.js`, `${PATHS.dist}/js`)
    .sass(`${PATHS.src}/sass/app.scss`, `${PATHS.dist}/css`);