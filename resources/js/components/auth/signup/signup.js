const Ractive = require('ractive').default;
const service = require('../../../services/auth').default;
const swal = require('sweetalert2');

module.exports = Ractive.extend({
    template: require('./signup.mustache').default.toString(),
    data: {
    },
    on: {
        signup: function (ctx) {
            var self = this;
            service.isAvaiable({
                email: self.get('email'),
                password: self.get('password')
            }).then((res) => {
                swal.fire('Good job!', 'Welcome bro', 'success').then(() => {
                    self.parent.goto('HOME');
                });
            }).catch((err) => {
                swal.fire(err.statusText)
            });

            return false;
        }
    }
});
