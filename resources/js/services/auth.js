const $ = require('jquery');

const AuthService = {
    isAvaiable: function (params) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: '/auth//signup',
                method: 'post',
                type: 'json',
                data: params
            }).done(function (res) {
                resolve(res);
            }).fail(function (err) {
                reject(err);
            });
        });
    }
};

export default AuthService;
