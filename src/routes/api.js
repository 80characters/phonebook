'use strict';

exports.name = 'routes.api';

exports.requires = [
    '@express'
];

exports.factory = function (express) {
    let router = express.Router();

    router.get('/oops', function (req, res, next) {
        res.json({});
    });

    return router;
};

