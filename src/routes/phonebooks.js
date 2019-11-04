'use strict';

exports.name = 'routes.phonebooks';

exports.requires = [
    '@express',
    'mocks.phonebooks'
];

exports.factory = function (express, mock) {
    let router = express.Router();

    router.get('/phonebooks', function (req, res, next) {
        res.json(mock);
    });

    router.post('/phonebooks', function (req, res, next) {
        res.json({
            "_id": "5db94fa6ea4829ba33716ef1",
            "index": 0,
            "picture": 'https://api.adorable.io/avatars/64/5db94fa6ea4829ba33716ef1.png',
            "age": 38,
            "eyeColor": "green",
            "name": "Hayes Dennis",
            "gender": "male",
            "company": "ECRAZE",
            "email": "hayesdennis@ecraze.com",
            "phone": "+1 (953) 505-3034",
            "address": "390 Sunnyside Court, Konterra, New Mexico, 7270",
            "about": "Nisi magna mollit ipsum officia proident dolor id. Proident aliqua fugiat pariatur ex reprehenderit laborum exercitation anim reprehenderit occaecat irure qui. Dolor aliquip excepteur adipisicing aliqua.\r\n",
            "registered": "2019-07-18T08:23:16 -07:00",
            "latitude": -32.973155,
            "longitude": -54.299799,
            "tags": [
                "pariatur",
                "cupidatat",
                "nisi",
                "deserunt",
                "adipisicing",
                "dolor",
                "enim"
            ],
            "greeting": "Hello, Hayes Dennis! You have 2 unread messages.",
            "favoriteFruit": "banana"
        });
    });

    return router;
};
