'use strict';

exports.name = 'services.contact';

exports.requires = [
    'models.contact'
];

exports.factory = function (model) {
    return {
        create: (data) => {
            let contact = new model(data);
            return contact.save();
        },
        getAll: () => {
            let query = model.find({}, null, {});
            return query.exec();
        }
    }
};
