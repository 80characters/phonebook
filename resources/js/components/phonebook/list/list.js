const Ractive = require('ractive').default;
const service = require('../../../services/phonebooks').default;

module.exports = Ractive.extend({
    template: require('./list.mustache').default.toString(),
    data: {
    },
    oncomplete: function() {
        let self = this;

        service.getAll().then((items) => {
            self.set('items', items);
        });
    }
});
