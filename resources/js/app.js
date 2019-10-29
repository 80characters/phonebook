var Ractive = require('ractive').default;
var template = require('../views/hello.mustache').default.toString();

new Ractive({
    target: '#target',
    template: template,
    data: {
        name: 'John Doe'
    }
});
  