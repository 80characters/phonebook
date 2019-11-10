import $ from 'jquery';

export default {
    checkin: function (params) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: '/auth/signin',
                method: 'post',
                type: 'json',
                data: params
            }).done(function (res) {
                resolve(res);
            }).fail(function (err) {
                reject(err);
            });
        });
    },
    checkout: (params) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/auth/signout',
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
