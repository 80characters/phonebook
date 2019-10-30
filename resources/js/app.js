var Ractive = require('ractive').default;
var header = require('./components/header');
var footer = require('./components/footer');

Ractive.DEBUG = true;

new Ractive({
    target: '#app',
    template: require('./app.mustache').default.toString(),
    data: {
    },
    components: {
        'app-header': header,
        'app-footer': footer,
    }
});
