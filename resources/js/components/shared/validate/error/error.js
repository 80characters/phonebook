const Ractive = require('ractive').default;

module.exports = Ractive.extend({
    template: require('./error.mustache').default.toString(),
    data: {
    }
});
