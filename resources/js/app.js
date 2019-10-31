const Ractive = require('ractive').default;

new Ractive({
    target: '#application',
    template: require('./app.mustache').default.toString(),
    data: {
    },
    components: {
        'app-header': require('./components/header/header'),
        'app-footer': require('./components/footer/footer'),
        'app-content': function() {
            if ('SIGNUP' === PAGE) {
                return require('./components/auth/signup/signup');
            } else {
                return require('./components/phonebook/list/list');
            }
        }
    }
});
