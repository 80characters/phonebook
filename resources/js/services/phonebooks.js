const Collection = require('../models/phonebook/collection').default;
const Model = require('../models/phonebook/model').default;

const PhonebookService = {
    getAll: () => {
        return new Collection().fetch();
    },
    create: (params) => {
        return new Promise((resolve, reject) => {
            try {                
                let phonebook = new Collection().create(params);
                resolve(phonebook);
            } catch (err) {
                reject(err);
            }
        });
    }
};

export default PhonebookService;