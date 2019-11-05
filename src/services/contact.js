'use strict';

exports.name = 'services.contact';

exports.requires = [
    'models.contact'
];

exports.factory = function (modelContact) {
    return {
        create: (data) => {
            let contact = new modelContact(data);
            return contact.save();
        }
    }
};
