import Backbone from 'backbone';
import Model from './model';

export default Backbone.Collection.extend({
    url: '/phonebooks',
    model: Model
});
