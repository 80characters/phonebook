'use strict';

exports.name = 'routes.auth';

exports.requires = [
    '@express'
];

exports.factory = function (express, mock) {
    let router = express.Router();

    router.post('/signup', function (req, res, next) {
        res.json({user: 1});
    });

    return router;
};
