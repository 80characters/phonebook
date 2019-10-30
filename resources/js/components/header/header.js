var Ractive = require('ractive').default;

module.exports = Ractive.extend({
    template: require('./header.mustache').default.toString(),
    data: {
    }
});
