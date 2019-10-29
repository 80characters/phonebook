'use strict';

var di = require('di-linker');
var sources = [
  'src/**/*.js'
];

di.walk(sources, require).then(function (context) {
  context.bootstrap(['bootstrap']);
}).catch(console.error.bind(console));
