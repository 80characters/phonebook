'use strict';

exports.name = 'middlewares.auth';

exports.factory = function () {
    let self = {};

    self.checkSignIn = function (req, res, next) {
        if (!req.session.user) {            
            res.redirect('/auth/signup');
        }

        next();
    }

    return self;
};
