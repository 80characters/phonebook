'use strict';

import Ractive from 'ractive';
import swal from 'sweetalert2';
import service from '../../../services/auth';

export default Ractive.extend({
    template: require('./signin.mustache').default.toString(),
    data: {
    },
    on: {
        signup: function (ctx) {
            var self = this;
            service.checkin({
                email: self.get('email'),
                password: self.get('password')
            }).then((res) => {
                swal.fire('Good job!', 'Welcome bro', 'success').then(() => {
                    self.parent.set('signed', true);
                    self.parent.set('page', 'HOME');
                });
            }).catch((err) => {
                swal.fire(err.statusText)
            });

            return false;
        }
    }
});
