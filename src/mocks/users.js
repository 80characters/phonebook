'use strict';

exports.name = 'mocks.users';

exports.requires = [];

exports.factory = function () {
    function getImg() {
        let id = Math.random().toString(36).substring(7);
        return `https://api.adorable.io/avatars/64/${id}.png`;
    }

    return module.exports = [
        {
            "_id": "5dbba28d49cd9419fef3f5a0",
            "email": "guest@loalhost.com",
            "password": "demo"
        },
        {
            "_id": "5dbba28dab9c36c005e8e7a0",
            "email": "admin@loalhost.com",
            "password": "demo"
        }
    ];
};

