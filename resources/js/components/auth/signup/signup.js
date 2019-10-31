var Ractive = require('ractive').default;
var service = require('../../../services/auth').default;

module.exports = Ractive.extend({
    template: require('./signup.mustache').default.toString(),
    data: {
    },
    on: {
        signup: function(ctx) {   
        }
    }
});
