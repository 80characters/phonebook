'use strict';

import Backbone from 'backbone';

export default Backbone.Model.extend({
    url: '/phonebooks',
    idAttribute: '_id'
});
