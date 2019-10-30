const Ractive = require('ractive').default;
const Collection = require('../../../models/phonebook/collection').default;

module.exports = Ractive.extend({
    template: require('./list.mustache').default.toString(),
    data: {
    },
    oncomplete: () => {
        let obj = new Collection();
        obj.fetch().then((res) => {
            console.log(res);
        });
    }
});
