const Ractive = require('ractive').default;
const validate = require('validate.js');
const config = require('../../../config/default');
const service = require('../../../services/phonebooks').default;
const swal = require('sweetalert2');

module.exports = Ractive.extend({
    template: require('./addnew.mustache').default.toString(),
    components: {
        'app-error': require('../../shared/validate/error/error')
    },
    data: {
        name: '',
        email: '',
        phone: '',
        address: '',
        about: ''
    },
    on: {
        submit: function (ctx) {
            ctx.event.preventDefault();
            let self = this;
            let params = self._getData();
            let errors = validate(params, config.form.addNew.rules);

            if (errors) {
                self.set('errors', errors);
            } else {
                service.create(params)
                    .then((result) => {
                        swal.fire('Successful', 'A new contact has been created', 'success').then(() => {
                            self.parent.set('signed', true);
                            self.parent.set('page', 'HOME');
                        });
                    }).catch((err) => {
                        swal.fire(err.statusText)
                    });
            }
        }
    },
    _getData: function () {
        let self = this;
        return {
            name: self.get('name').trim(),
            email: self.get('email').trim(),
            phone: self.get('phone').trim(),
            address: self.get('address').trim(),
            about: self.get('about').trim()
        };
    }
});
