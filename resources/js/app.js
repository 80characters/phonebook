'use strict';

const Ractive = require('ractive').default;
const phonebookList = require('./components/phonebook/list/list');
const signupForm = require('./components/auth/signup/signup');

new Ractive({
    target: '#application',
    template: require('./app.mustache').default.toString(),
    data: {
        page: PAGE
    },
    components: {
        'app-header': require('./components/header/header'),
        'app-footer': require('./components/footer/footer'),
        'app-phonebook-list': phonebookList,
        'app-signup-form': signupForm
    },
    goto: function(page) {
        if (!page) {
            return;
        }

        this.set('page', page);
    }
});
