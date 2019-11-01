const Ractive = require('ractive').default;
const service = require('../../../services/phonebooks').default;
const _ = require('lodash');

module.exports = Ractive.extend({
    template: require('./list.mustache').default.toString(),
    data: {
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
