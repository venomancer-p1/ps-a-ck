const router = require('express').Router()
const { isEmpty, isString } = require('lodash')
const Log = require('../models/Log')


function getDate() {
    let UNIX = Date.now()
    let dateObj = new Date(UNIX)
    return dateObj.toLocaleString('pt-BR', {
        timeZone: 'America/Boa_Vista',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(/\//g, '-').replace(/\s/, ' | ')
}

router.post('/add', async (req, res) => {

    const { message } = req.body
    if (!message || isEmpty(message) || !isString(message))
        return res.status(422).json({ success: false, message: "Provide valid parameters" })
    //origin
    // await Log.create({
    //     name: "API Logs",
    // })
    try {
        const date = getDate();
        console.log(date);
        await Log.findOneAndUpdate(
            { name: 'API Logs' },
            { $set: { [date]: message } },
            { new: true }
        )
        res.status(201).json({ success: true, message: `log added!` })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})

router.get('/clear', async (req, res) => {
    try {
        await Log.deleteMany({})
        await Log.create({ name: "API Logs" })
        res.status(201).json({ success: true, message: `log is clean!` })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

router.get('/show', async (req, res) => {
    try {
        let all = await Log.find();
        res.status(201).send(all)
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})



module.exports = router;

