import _ from 'lodash';
import Ractive from 'ractive';
import service from '../../../services/phonebooks';
import template from './list.mustache';

export default Ractive.extend({
    template: template,
    data: {
        avatar: (id) => {
            return `https://api.adorable.io/avatars/64/${id}.png`;
        }
    },
    oncomplete: function () {
        let self = this;
        self._getAll();

        self.observe('searchBy', _.debounce((newValue, oldValue) => {
            if (!newValue) {
                if(newValue !== oldValue) {
                    self._getAll();
                }
                return;
            }
            
            let items = self.get('items');

            if (!items) {
                return;
            }

            items.forEach((item) => {              
                item.isHide = !item.name.toLowerCase().includes(newValue);                
            });
            
            self.set('items', items);
        }, 250));
    },
    _getAll: function() {
        let self = this;

        service.getAll().then((items) => {
            self.set('items', items);
        });
    }
});
