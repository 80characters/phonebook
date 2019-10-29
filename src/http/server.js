'use strict';

exports.name = 'http.server';

exports.requires = [
	'@http',
	'http.app'
];

exports.factory = function(http, app) {
	var server = new http.Server(app);

	server.timeout = 1000 * 60 * 30;

	return server;
};
