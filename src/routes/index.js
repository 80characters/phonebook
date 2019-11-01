'use strict';

exports.name = 'routes.index';

exports.requires = [
	'@express',
	'middlewares.auth'
];

exports.factory = function (express, auth) {
	let router = express.Router();

	router.get('/', auth.checkSignIn, function (req, res, next) {		
		res.render('index',{
			title: 'Phonebook',
			page: 'HOME',
			signed: req.session.user ? true : false
		});
	});

	return router;
};

