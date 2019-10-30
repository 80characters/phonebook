var Ractive = require('ractive').default;

module.exports = Ractive.extend({
    template: require('./footer.mustache').default.toString(),
    data: {
    }
});
