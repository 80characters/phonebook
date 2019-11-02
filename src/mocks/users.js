'use strict';

exports.name = 'mocks.users';

exports.requires = [];

exports.factory = function () {
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

