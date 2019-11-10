import Ractive from 'ractive';
import validate from 'validate.js';
import swal from 'sweetalert2';
import config from '../../../config/default';
import service from '../../../services/phonebooks';
import template from './addnew.mustache';
import appError from '../../shared/validate/error/error';

export default Ractive.extend({
    template: template,
    components: {
        'app-error': appError
    },
    data: {
        name: '',
        email: '',
        phone: '',
        address: '',
        about: ''
    },
    on: {
        submit: function (ctx) {
            ctx.event.preventDefault();
            let self = this;
            let params = self._getData();
            let errors = validate(params, config.form.addNew.rules);

            if (errors) {
                self.set('errors', errors);
            } else {
                service.create(params)
                    .then((result) => {
                        swal.fire('Successful', 'A new contact has been created', 'success').then(() => {
                            self.parent.set('signed', true);
                            self.parent.set('page', 'HOME');
                        });
                    }).catch((err) => {
                        swal.fire(err.statusText)
                    });
            }
        }
    },
    _getData: function () {
        let self = this;
        return {
            name: self.get('name').trim(),
            email: self.get('email').trim(),
            phone: self.get('phone').trim(),
            address: self.get('address').trim(),
            about: self.get('about').trim()
        };
    }
});
