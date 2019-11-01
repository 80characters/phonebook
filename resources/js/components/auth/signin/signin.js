const Ractive = require('ractive').default;
const service = require('../../../services/auth').default;
const swal = require('sweetalert2');

module.exports = Ractive.extend({
    template: require('./signin.mustache').default.toString(),
    data: {
    },
    on: {
        signup: function (ctx) {
            var self = this;
            service.checkin({
                email: self.get('email'),
                password: self.get('password')
            }).then((res) => {
                swal.fire('Good job!', 'Welcome bro', 'success').then(() => {
                    self.parent.set('signed', true);
                    self.parent.set('page', 'HOME');
                });
            }).catch((err) => {
                swal.fire(err.statusText)
            });

            return false;
        }
    }
});