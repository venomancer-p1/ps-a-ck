const mongoose = require('mongoose');

const emailSchema = mongoose.Schema({
    domain: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
}, { strict: false })

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;