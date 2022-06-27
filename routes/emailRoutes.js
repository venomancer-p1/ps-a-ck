const router = require('express').Router()
const { isEmpty, isString } = require('lodash')
const Email = require('../models/Email')
const url = require('url');
const queryString = require('query-string');

const acceptable_domains = ['protonmail.com', 'proton.me', 'pm.me']
router.post('/add', async (req, res) => {

    const { email, password } = req.body
    if (!email || !password || isEmpty(email) || isEmpty(password) || !isString(email) || !isString(password))
        return res.status(422).json({ success: false, message: "Provide valid parameters" })

    try {
        const domain = email.match(/(?<=@).+?(?=$)/)[0];
        if (!acceptable_domains.includes(domain)) throw new Error('Domain not acceptable!')
        await Email.create({
            domain: domain,
            email: email,
            password: password
        })
        res.status(201).json({ success: true, message: `${email} added!` })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})

router.post('/delete', async (req, res) => {

    const { email } = req.body
    if (!email || isEmpty(email) || !isString(email))
        return res.status(422).json({ success: false, message: "Provide valid parameters" })

    try {
        await Email.findOneAndRemove({ email: email })
        res.status(201).json({ success: true, message: 'Successfully removed!' })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})

router.post('/set', async (req, res) => {

    const { email, fields } = req.body
    if (!email || isEmpty(email) || !isString(email) || !fields || isEmpty(fields) || !isString(fields))
        return res.status(422).json({ success: false, message: "Provide valid parameters" })
    try {
        let set = new Function("return " + fields)();
        await Email.findOneAndUpdate(
            { email: email },
            { $set: set },
            { new: true }
        )
        res.status(201).json({ success: true, message: 'Successfully updated!' })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})

router.post('/unset', async (req, res) => {

    const { email, fields } = req.body
    if (!email || isEmpty(email) || !isString(email) || !fields || isEmpty(fields) || !isString(fields))
        return res.status(422).json({ success: false, message: "Provide valid parameters" })
    try {
        let set = new Function("return " + fields)();
        await Email.findOneAndUpdate(
            { email: email },
            { $unset: set },
            { new: true }
        )
        res.status(201).json({ success: true, message: 'Successfully updated!' })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})

router.get('/all', async (req, res) => {

    try {
        let all = await Email.find(req.query);
        res.status(200).json(all)
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})


router.get('/random', async (req, res) => {

    try {
        const query = url.parse(req.url).query;
        const query_parsed = queryString.parse(query, { parseBooleans: true });
        Object.keys(query_parsed).forEach((el) => {
            if (query_parsed[el] === 'null') query_parsed[el] = { $exists: false }
        })

        const random = await Email.aggregate([{ $match: query_parsed }, { $sample: { size: 1 } }]);
        res.status(200).json({ success: true, email: random[0].email, password: random[0].password })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})



module.exports = router;

