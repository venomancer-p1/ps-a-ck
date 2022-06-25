const Scrapingbee = require('../models/Scrapingbee')
const dogChecker = require('../checkers/scrapingdogChecker')
const unirest = require('unirest');

async function beeChecker() {
    return new Promise(async (resolve, reject) => {
        try {

            let limit = 0;
            let data;
            let api_key;
            let random_bee_key;
            do {

                let dog_key = await dogChecker().catch(console.log);
                if (!dog_key) {
                    limit++;
                    continue;
                }
                random_bee_key = await Scrapingbee.aggregate([{ $sample: { size: 1 } }]);
                api_key = random_bee_key[0].api_key;
                data = await unirest.get(`https://app.scrapingbee.com/api/v1/usage?api_key=${api_key}`).proxy(`http://scrapingdog:${dog_key}@proxy.scrapingdog.com:8081`)
                    .then(async (response) => {
                        let body = response.body
                        if (!body || body.used_api_credit >= body.max_api_credit - 1 || body.message) {
                            if (random_bee_key[0].retry === undefined) {
                                await Scrapingbee.findOneAndUpdate(
                                    { api_key: api_key },
                                    { $set: { retry: 2 } },
                                    { new: true, strict: false }
                                )
                            } else {
                                await Scrapingbee.findOneAndUpdate(
                                    { api_key: api_key },
                                    { $inc: { retry: 1 } },
                                    { new: true, strict: false }
                                )
                            }
                            if (random_bee_key[0].retry >= 3) {
                                console.log(`->${api_key} REMOVED due to invalidity`)
                                await Scrapingbee.findOneAndRemove({ api_key: api_key })
                            }
                            return false
                        }
                        console.log('bee credits =', body.used_api_credit)
                        return true
                    })
                    .catch(err => console.log(err))

                if (limit >= 15)
                    throw new Error('The sBEE database is problaby without valid elements')
                limit++;

            } while (!data);

            if (random_bee_key[0].retry) {
                await Scrapingbee.findOneAndUpdate({ api_key: api_key }, { $unset: { retry: true } }, { strict: false })
            }
            resolve(api_key)


        } catch (error) {
            reject(error)
        }
    });

}


module.exports = beeChecker;