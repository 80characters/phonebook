'use strict';

exports.name = 'models.contact';

exports.requires = [
	'@mongoose'
];

exports.factory = function (mongoose) {
	const collectionName = 'contacts';
	const schema = new mongoose.Schema({
		index: { type: Number },
		picture: { type: String },
		age: { type: Number },
		eyeColor: { type: String },
		name: { type: String },
		gender: { type: String },
		company: { type: String },
		email: { type: String },
		phone: { type: String },
		address: { type: String },
		about: { type: String },
		registered: Date,
		latitude: { type: Number },
		longitude: { type: Number },
		tags: { type: Array },
		greeting: { type: String },
		favoriteFruit: { type: String }
	});

	return mongoose.model(collectionName, schema);
};
