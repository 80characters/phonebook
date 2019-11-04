const Ractive = require('ractive').default;

module.exports = Ractive.extend({
    template: require('./addnew.mustache').default.toString(),
    data: {
    },
    on: {
        submit: function (ctx) {
            
        }
    }
});
