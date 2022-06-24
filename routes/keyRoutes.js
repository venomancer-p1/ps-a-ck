const router = require('express').Router()
const Key = require('../models/Key');

router.post('/', async (req, res) => {

    const { api_key } = req.body

    if (!api_key) res.status(422).json({ success: false, message: "Provide valid parameters" })
    //if () res.status(422).json({ success: false, message: "duplicate" })

    await Key.create({
        api_key: api_key
    })
    res.json({ success: true, message: api_key })
    res.end();
})


module.exports = router;