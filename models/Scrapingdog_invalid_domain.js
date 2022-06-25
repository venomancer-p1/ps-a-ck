const mongoose = require('mongoose');


const Scrapingdog = mongoose.model('Scrapingdog_invalid_domain', {
    name: { type: String, unique: true },
    description: { type: String, unique: true },
    domains: {
        type: Array,
        required: true,
        unique: true
    }
});

module.exports = Scrapingdog;