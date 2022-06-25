const Scrapingdog = require('../models/Scrapingdog')
const unirest = require('unirest');

async function dogChecker() {
    return new Promise(async (resolve, reject) => {
        try {

            let limit = 0;
            let data;
            let api_key;
            let random_dog_key;
            do {

                random_dog_key = await Scrapingdog.aggregate([{ $sample: { size: 1 } }]);
                api_key = random_dog_key[0].api_key;
                data = await unirest.get(`https://api.scrapingdog.com/account?api_key=${api_key}`).proxy(`http://scrapingdog:${api_key}@proxy.scrapingdog.com:8081`)
                    .then(async (response) => {
                        let body = response.body
                        if (!body || body.requestUsed >= body.requestLimit - 1) {
                            if (random_dog_key[0].retry === undefined) {
                                await Scrapingdog.findOneAndUpdate(
                                    { api_key: api_key },
                                    { $set: { retry: 1 } },
                                    { new: true, strict: false }
                                )
                            } else {
                                await Scrapingdog.findOneAndUpdate(
                                    { api_key: api_key },
                                    { $inc: { retry: 1 } },
                                    { new: true, strict: false }
                                )
                            }
                            if (random_dog_key[0].retry >= 3) {
                                console.log(`->${api_key} REMOVED due to invalidity`)
                                await Scrapingdog.findOneAndRemove({ api_key: api_key })
                            }
                            return false
                        }
                        console.log('dog credits =', body.requestUsed)
                        return true
                    })
                    .catch(err => console.log(err))

                if (limit >= 15)
                    throw new Error('The sDOG database is problaby without valid elements')
                limit++;

            } while (!data);

            if (random_dog_key[0].retry) {
                await Scrapingdog.findOneAndUpdate({ api_key: api_key }, { $unset: { retry: true } }, { strict: false })
            }
            resolve(api_key)


        } catch (error) {
            reject(error)
        }
    });

}


module.exports = dogChecker;