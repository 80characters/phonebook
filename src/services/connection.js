'use strict';

exports.name = 'services.connection';

exports.requires = [
    '@dotenv',
    '@mongoose'
];

exports.factory = function (env, mongoose) {
    return {
        connect: () => {
            env.config();

            var db = mongoose.connection;
            var _fn = () => {
                mongoose.connect(process.env.MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    autoReconnect: true
                });
            }    

            db.on('connecting', function () {
                console.log('connecting to MongoDB...');
            });
        
            db.on('error', function (error) {
                console.error('Error in MongoDb connection: ' + error);
                mongoose.disconnect();
            });
            
            db.on('connected', function () {
                console.log('MongoDB connected!');
            });
            
            db.once('open', function () {
                console.log('MongoDB connection opened!');
            });
            
            db.on('reconnected', function () {
                console.log('MongoDB reconnected!');
            });
            
            db.on('disconnected', function () {
                console.log('MongoDB disconnected!');
                _fn();
            });
            
            _fn(); 
        },
    }
};
