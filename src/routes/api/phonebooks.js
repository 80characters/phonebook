'use strict';

exports.name = 'routes.api.phonebooks';

exports.requires = [
    '@express',
    'mocks.phonebooks'
];

exports.factory = function (express, mock) {
    let router = express.Router();

    router.get('/phonebooks', function (req, res, next) {
        res.json(mock);
    });

    return router;
};
