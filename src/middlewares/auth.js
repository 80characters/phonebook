'use strict';

exports.name = 'middlewares.auth';

exports.factory = function () {
    let self = {};

    self.checkSignIn = function (req, res, next) {        
        if (!req.session.user) {            
            res.render('index', {
                title: 'Here we are!',
                page: 'SIGNIN'
            });
        } else {            
            next();
        }        
    }

    return self;
};
