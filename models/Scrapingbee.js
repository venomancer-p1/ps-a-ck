const mongoose = require('mongoose');


const Scrapingbee = mongoose.model('Scrapingbee', {
    api_key: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = Scrapingbee;