import Backbone from 'backbone';
const model = require('./model').default;

export default Backbone.Collection.extend({
    url: '/phonebooks',
    model: model
});
