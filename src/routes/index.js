'use strict';

exports.name = 'routes.index';

exports.requires = [
	'@express'
];

exports.factory = function (express) {
	let router = express.Router();

	router.get('/', function (req, res, next) {
		res.render('index', {
			title: 'Welcome to Express ft. DI-Linker'
		});
	});

	return router;
};

