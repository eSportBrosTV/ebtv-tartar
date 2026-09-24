const mongoose = require('mongoose');
const ProviderService = require('../core/ProviderService');

class DatabaseProvider extends ProviderService {
    constructor() {
        super('Database');
    }

    isConnected() {
        return mongoose.connection.readyState === 1;
    }
}

module.exports = DatabaseProvider;
