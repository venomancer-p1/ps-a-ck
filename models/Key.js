const mongoose = require('mongoose');


const Key = mongoose.model('Key', {
    api_key: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = Key;