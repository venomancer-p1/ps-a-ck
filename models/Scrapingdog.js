const mongoose = require('mongoose');


const Scrapingdog = mongoose.model('Scrapingdog', {
    api_key: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = Scrapingdog;