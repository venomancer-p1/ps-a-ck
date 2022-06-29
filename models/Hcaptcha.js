const mongoose = require('mongoose');

const hcaptchaSchema = mongoose.Schema({
    link: { type: String, unique: true, required: true },
    cookies: { type: Array },
    used: { type: Number },
}, { strict: false })

const Hcaptcha = mongoose.model('Hcaptcha', hcaptchaSchema);

module.exports = Hcaptcha;