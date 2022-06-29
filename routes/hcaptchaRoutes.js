const router = require('express').Router()
const { isEmpty, isString } = require('lodash')
const Hcaptcha = require('../models/Hcaptcha')


router.post('/add', async (req, res) => {

    const { link } = req.body
    if (!link || isEmpty(link) || !isString(link))
        return res.status(422).json({ success: false, message: "Provide valid parameters" })

    try {
        await Hcaptcha.create({
            link: link,
            cookies: [],
            used: 0
        })
        res.status(201).json({ success: true, message: `${link} was added!` })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})

router.post('/addcookie', async (req, res) => {

    const { link, cookie, expires } = req.body
    if (!link || isEmpty(link) || !isString(link) ||
        !cookie || isEmpty(cookie) || !isString(cookie) ||
        !expires || isEmpty(expires) || !isString(expires))
        return res.status(422).json({ success: false, message: "Provide valid parameters" })

    try {
        await Hcaptcha.findOneAndUpdate(
            { link: link },
            { $push: { cookies: { cookie: cookie, expires: expires } } },
            { new: true }
        )
        res.status(201).json({ success: true, message: `${link} was added!` })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})

router.post('/delete', async (req, res) => {

    const { link } = req.body
    if (!link || isEmpty(link) || !isString(link))
        return res.status(422).json({ success: false, message: "Provide valid parameters" })

    try {
        await Hcaptcha.findOneAndRemove({ link: link })
        res.status(201).json({ success: true, message: 'Successfully removed!' })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})



router.get('/all', async (req, res) => {

    try {
        let all = await Hcaptcha.find(req.query);
        res.status(200).json(all)
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})


// router.get('/random', async (req, res) => {

//     try {
//         const query = url.parse(req.url).query;
//         const query_parsed = queryString.parse(query, { parseBooleans: true });
//         Object.keys(query_parsed).forEach((el) => {
//             if (query_parsed[el] === 'null') query_parsed[el] = { $exists: false }
//         })

//         const random = await Hcaptcha.aggregate([{ $match: query_parsed }, { $sample: { size: 1 } }]);
//         res.status(200).json({ success: true, Hcaptcha: random[0].Hcaptcha, password: random[0].password })
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message })
//     }

// })



module.exports = router;

