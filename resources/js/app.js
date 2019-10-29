var Ractive = require('ractive').default;
var mustache = require('./template/hello.mustache').default;

new Ractive({
    target: '#target',
    template: mustache.toString(),
    data: {
        name: 'John Doe'
    },
    on: {
        click: function() {
           alert(this.get('name'));
        }
    }
});
