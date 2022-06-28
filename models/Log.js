const mongoose = require('mongoose');

const LogSchema = mongoose.Schema({
    domain: { type: String },
}, { strict: false })

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;