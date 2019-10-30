const Ractive = require('ractive').default;
const config = require('./config/default');

new Ractive({
    target: '#application',
    template: require('./app.mustache').default.toString(),
    data: {        
    },
    components: {
        'app-header': require('./components/header/header'),
        'app-footer': require('./components/footer/footer'),
        'app-phonebook-list': require('./components/phonebook/list/list'),
    }
});
