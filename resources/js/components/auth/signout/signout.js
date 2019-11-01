const Ractive = require('ractive').default;
const service = require('../../../services/auth').default;

module.exports = Ractive.extend({
    template: require('./signout.mustache').default.toString(),
    data: {
    },
    on: {
        confirm: function() {
            var self = this;

            service.checkout({}).then(() => {
                self.parent.set('page', 'SIGNIN');
                self.parent.set('signed', false);
            });
        },
        cancel: function() {
            this.parent.set('page', 'HOME');
        }
    }
});
