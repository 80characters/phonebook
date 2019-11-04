const Ractive = require('ractive').default;
const validate = require("validate.js");
const config = require('../../../config/default');

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
            let frmData = {
                name: self.get('name').trim(),
                email: self.get('email').trim(),
                phone: self.get('phone').trim(),
                address: self.get('address').trim(),
                about: self.get('about').trim()
            };

            let errors = self._isValid(frmData);

            if (errors) {
                self.set('errors', errors);
            } else {
                // TODO: save new contact.
            }
        }
    },
    _isValid: function (frmData) {        
        return validate(frmData, config.form.addNew.rules);
    }
});
