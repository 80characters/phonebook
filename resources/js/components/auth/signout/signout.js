import Ractive from 'ractive';
import service from '../../../services/auth';
import template from './signout.mustache';

export default Ractive.extend({
    template: template,    
    on: {
        confirm: function() {
            var self = this;

            service.checkout({}).then(() => {
                self.parent.set('page', 'SIGNIN');
                self.parent.set('signed', false);
            });
        },
        cancel: function() {
            this.parent.set('page', 'HOME');
        }
    }
});
