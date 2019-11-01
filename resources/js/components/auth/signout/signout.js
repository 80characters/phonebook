const Ractive = require('ractive').default;

module.exports = Ractive.extend({
    template: require('./signout.mustache').default.toString(),
    data: {
    },
    on: {
        confirm: function() {
            alert(1);
        },
        cancel: function() {
            alert(2);
        }
    }
});
