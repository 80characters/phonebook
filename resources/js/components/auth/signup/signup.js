var Ractive = require('ractive').default;

module.exports = Ractive.extend({
    template: require('./signup.mustache').default.toString(),
    data: {
    },
    on: {
        signup: function(ctx) {
            ctx.event.preventDefault();
        }
    }
});
