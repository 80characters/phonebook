'use strict';

exports.name = 'routes.index';

exports.requires = [
	'@express',
	'middlewares.auth'
];

exports.factory = function (express, mongoose, auth) {
	let router = express.Router();

	router.get('/', auth.checkSignIn, async function (req, res, next) {
		await res.render('index', {
			title: 'Phonebook',
			page: 'HOME',
			signed: req.session.user ? true : false
		});
	});

	return router;
};

