'use strict';

exports.name = 'routes.api.phonebooks';

exports.requires = [
    '@express'
];

exports.factory = function (express) {
    let router = express.Router();

    router.get('/phonebooks', function (req, res, next) {
        res.json({

        });
    });

    return router;
};

