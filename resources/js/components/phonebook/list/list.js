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
            if(!newValue) {
                return;
            }
            
        }, 250));
    },
    _getAll: function() {
        let self = this;

        service.getAll().then((items) => {
            self.set('items', items);
        });
    }
});
