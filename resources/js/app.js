var Ractive = require('ractive').default;
var header = require('./components/header');

new Ractive({
    target: '#target',
    template: require('./app.mustache').default.toString(),
    data: {
    },
    components: {
        'app-header': header
    }
});
