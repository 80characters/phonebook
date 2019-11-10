import Collection from '../models/phonebook/collection';

export default {
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
