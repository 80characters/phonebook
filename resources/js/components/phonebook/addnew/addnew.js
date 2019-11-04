const Ractive = require('ractive').default;
const validate = require("validate.js");

module.exports = Ractive.extend({
    template: require('./addnew.mustache').default.toString(),
    data: {
        name: '',
        email: '',
        phone: '',
        address: '',
        about: ''
    },
    on: {
        submit: function (ctx) {
            let self = this;
            let data = {
                name: self.get('name').trim(),
                email: self.get('email').trim(),
                phone: self.get('phone').trim(),
                address: self.get('address').trim(),
                about: self.get('about').trim()
            };

            let errors = self._isValid(data);

            if (errors.length) {
                self.set('errors', errors);
            } else {
                // TODO: save new contact.
            }

            return false;
        }
    },
    _isValid: function (data) {
        let self = this;

        return validate(data, self._getRules());
    },
    _getRules: function () {
        return {
            name: {
                presence: true,
                length: {
                    minimum: 6
                }
            },
            email: {
                presence: true,
                email: true,
            },
            phone: {
                presence: true,
                length: {
                    minimum: 8,
                    maximum: 13
                },
                format: {
                    pattern: "^[0-9\+\s-]{8,13}",
                    flags: "i",
                    message: "is invalid format"
                }
            },
            address: {
                presence: true,
                length: {
                    minimum: 6
                }
            }
        };
    }
});
