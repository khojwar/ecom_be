## `src/config/mongodb.config.js`

    const mongoose = require('mongoose');
    const { DBConfig } = require('./config');

    (async () => {
        try {
            await mongoose.connect(DBConfig.mongoDBUrl, {
                dbName: DBConfig.mongoDBName,
                autoCreate: true,               // it will create the database if it does not exist
                autoIndex: true,           
            });
            console.log("MongoDB connection successful");
            
        } catch (exception) {
            console.log("MongoDB connection error: ", exception);
            process.exit(1);
        }
    })();