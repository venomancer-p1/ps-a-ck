const mongoose = require('mongoose');


const Key = mongoose.model('Key', {
    api_key: String
});

module.exports = Key;