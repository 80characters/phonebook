var Ractive = require('ractive').default;

module.exports = Ractive.extend({
    template: require('./list.mustache').default.toString(),
    data: {
    }
});
