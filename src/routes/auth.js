'use strict';

exports.name = 'routes.auth';

exports.requires = [
    '@express'
];

exports.factory = function (express, mock) {
    let router = express.Router();

    router.get('/signup', function (req, res, next) {
        res.render('index', {
            title: 'Signup now',
            page: 'SIGNUP'
        });
    });

    return router;
};
