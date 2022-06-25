const router = require('express').Router()
const { isEmpty, isString } = require('lodash')
const Scrapingdog = require('../models/Scrapingdog')
const Scrapingdog_invalid_domain = require('../models/Scrapingdog_invalid_domain')

const dogChecker = require('../checkers/scrapingdogChecker')
//const mongoose = require('mongoose')
//let db = mongoose.connection.db;
// Rename the `test` collection to `foobar`
//await db.collection('scrapingdogs').rename('scrapingdogs');
//await Key.renameCollection("scrapingdog")

router.post('/add', async (req, res) => {

    const { api_key } = req.body
    if (!api_key || isEmpty(api_key) || !isString(api_key)) return res.status(422).json({ success: false, message: "Provide valid parameters" })

    try {
        await Scrapingdog.create({
            api_key: api_key
        })
        res.status(201).json({ success: true, message: `${api_key} added!` })

    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})

router.post('/delete', async (req, res) => {

    const { api_key } = req.body
    if (!api_key || isEmpty(api_key) || !isString(api_key)) return res.status(422).json({ success: false, message: "Provide valid parameters" })

    try {
        await Scrapingdog.findOneAndRemove({ api_key: api_key })
        res.status(201).json({ success: true, message: 'Successfully removed!' })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})

router.get('/all', async (req, res) => {

    try {
        let all = await Scrapingdog.find();
        res.status(200).json(all)
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})


router.get('/random', async (req, res) => {

    try {
        //let random = await Scrapingdog.aggregate([{ $sample: { size: 1 } }]);
        let random = await dogChecker();
        res.status(200).json({ success: true, api_key: random })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})

//------


router.post('/invalid/add', async (req, res) => {

    const { domain } = req.body
    if (!domain || isEmpty(domain) || !isString(domain)) return res.status(422).json({ success: false, message: "Provide valid parameters" })

    //origin
    // await Scrapingdog_invalid_domain.create({
    //     name: "all",
    //     description: "All banned domains on the site",
    //     domains: []
    // })

    try {

        await Scrapingdog_invalid_domain.findOneAndUpdate(
            { name: "all" },
            { $push: { domains: domain } },
            { new: true, strict: false }
        )
        res.status(201).json({ success: true, message: `${domain} added in the list!` })

    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})

router.get('/invalid/all', async (req, res) => {

    try {
        let all = await Scrapingdog_invalid_domain.findOne({ name: "all" });
        res.status(200).json({ success: true, array: all.domains })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})

module.exports = router;