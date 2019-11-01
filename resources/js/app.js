'use strict';

const Ractive = require('ractive').default;
const phonebookList = require('./components/phonebook/list/list');
const signInForm = require('./components/auth/signin/signin');
const signOutForm = require('./components/auth/signout/signout');

new Ractive({
    target: '#application',
    template: require('./app.mustache').default.toString(),
    data: {
        signed: SIGNED,
        page: PAGE
    },
    components: {
        'app-header': require('./components/header/header'),
        'app-footer': require('./components/footer/footer'),
        'app-phonebook-list': phonebookList,
        'app-signin-form': signInForm,
        'app-signout-form': signOutForm
    },
    on: {
        goto: function (ctx, page) {            
            if (!page) {
                return;
            }        
            this.set('page', page);

            return false;
        }
    }
});
