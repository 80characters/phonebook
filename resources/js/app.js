'use strict';

import Ractive from 'ractive';
import appPhonebookList from './components/phonebook/list/list';
import appHeader from './components/header/header';
import appFooter from './components/footer/footer';
import appSignInForm from './components/auth/signin/signin';
import appSignOutForm from './components/auth/signout/signout';
import appAddNewForm from './components/phonebook/addnew/addnew';

new Ractive({
    target: '#application',
    template: require('./app.mustache').default.toString(),
    data: {
        signed: SIGNED,
        page: PAGE
    },
    components: {
        'app-header': appHeader,
        'app-footer': appFooter,
        'app-phonebook-list': appPhonebookList,
        'app-signin-form': appSignInForm,
        'app-signout-form': appSignOutForm,
        'app-add-new-form': appAddNewForm
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
