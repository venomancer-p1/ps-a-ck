const router = require('express').Router()
const { isEmpty, isString } = require('lodash')
const Scrapingbee = require('../models/Scrapingbee')
const beeChecker = require('../checkers/scrapingbeeChecker')


//const mongoose = require('mongoose')
//let db = mongoose.connection.db;
// Rename the `test` collection to `foobar`
//await db.collection('Scrapingbees').rename('Scrapingbees');
//await Key.renameCollection("Scrapingbee")

router.post('/add', async (req, res) => {

    const { api_key } = req.body
    if (!api_key || isEmpty(api_key) || !isString(api_key)) return res.status(422).json({ success: false, message: "Provide valid parameters" })

    try {
        await Scrapingbee.create({
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
        await Scrapingbee.findOneAndRemove({ api_key: api_key })
        res.status(201).json({ success: true, message: 'Successfully removed!' })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})

router.get('/all', async (req, res) => {

    try {
        let all = await Scrapingbee.find();
        res.status(200).json(all)
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})


router.get('/random', async (req, res) => {

    try {
        //let random = await Scrapingdog.aggregate([{ $sample: { size: 1 } }]);
        let random = await beeChecker();
        res.status(200).json({ success: true, api_key: random })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})




module.exports = router;