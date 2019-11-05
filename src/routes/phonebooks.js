'use strict';

exports.name = 'routes.phonebooks';

exports.requires = [
    '@express',
    'services.contact',
    'mocks.phonebooks'
];

exports.factory = function (express, serviceContact, mock) {
    let router = express.Router();

    router.get('/phonebooks', function (req, res, next) {
        serviceContact.getAll().then((contacts) => {
            res.json(contacts);
        }).catch((err) => {
            res.status(404).json({ message: 'contact not found' });
        });
    });

    router.post('/phonebooks', function (req, res, next) {
        serviceContact.create(req.body)
            .then((data) => {
                res.json({ data: data });
            }).catch((err) => {
                console.error(err);
            });
    });

    return router;
};
