const Collection = require('../models/phonebook/collection').default;

const PhonebookService = {
    getAll: () => {
        return new Collection().fetch();
    }
};

export default PhonebookService;