'use strict';

exports.name = 'routes.auth';

exports.requires = [
    '@express',
    '@lodash',
    'mocks.users'
];

exports.factory = function (express, _, mocks) {
    let router = express.Router();

    router.post('/signup', function (req, res, next) {
        let email = _.get(req, 'body.email', '').trim();
        let password = _.get(req, 'body.password', '').trim();

        let signedUser = _.find(mocks, (user) => {
            return (user.email === email) || (user.password === password);
        });

        if (signedUser) {
            req.session.user = signedUser;
            res.json({message: 'signed'});
        } else {
            res.status(401).json({ message: 'unauthorized error' });
        }
    });

    return router;
};
