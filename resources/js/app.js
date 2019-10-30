var Ractive = require('ractive').default;
var header = require('./components/header/header');
var footer = require('./components/footer/footer');

new Ractive({
    target: '#application',
    template: require('./app.mustache').default.toString(),
    data: {
    },
    components: {
        'app-header': header,
        'app-footer': footer,
    }
});
