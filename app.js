/**
 * npm module deps
 */
const express = require('express')
const mongoose = require('mongoose')

const delay = require('delay')
const axios = require('axios')
const proxy_check = require('./proxy-checker.js')
const h_getToken = require('./hcaptcha.js')
const r_getToken = require('./recaptcha.js')


//

const _util = require('htvenom')

var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 8001;

//


const start = require('./proxy-scraper.js');
BEEING_USED = [];
ALL_ALIVE = [];
BLACK_LIST = ['66.94.116.111:3128'];
var timeout;
/*async function update() {
    if (timeout) clearTimeout(timeout);
    const t1 = new Date();

    await start();

    if (global.ALL_ALIVE.length > 0) {
        console.log(`[MAIN] I'm Tired, I'll take 5 min of break`);
        await delay(300000)
    }
    timeout = setTimeout(update, Math.max(0, 1000 - new Date + t1));
}
update();*/

//setInterval(function () { console.log(BEEING_USED) }, 10000);

const workers = [
    {
        name: 'icegolemproto1',
        api: '814bc103-ffbd-4587-b800-eacc893588fe'
    },
    {
        name: 'icegolemproto2',
        api: '458763b7-59cb-4d0e-926f-f60a153b695b'
    },
    {
        name: 'icegolemproto3',
        api: '8578d803-f2fb-4d18-9770-1067bc545da7'
    },
    {
        name: 'icegolemproto4',
        api: '65f1162d-27fa-421c-8683-1f1925ace357'
    },
    {
        name: 'icegolemproto5',
        api: '0afdab67-5b23-4415-8d88-8595d4ec3844'
    },

    //-

    {
        name: 'firegolemproto1',
        api: '0bcad1cb-b5dd-4bc2-9673-8fb71ef79284'
    },
    {
        name: 'firegolemproto2',
        api: 'e95537c1-6393-4da4-871e-3cee8d62cf00'
    },
    {
        name: 'firegolemproto3',
        api: 'f575a73b-0fb7-4744-b69c-e1409e50d949'
    },
    {
        name: 'firegolemproto4',
        api: 'b6838ed9-6f5b-491d-85cd-16fba30a90e7'
    },
    {
        name: 'firegolemproto5',
        api: '39b3348e-9099-4063-82b1-e563f6fdf5d1'
    },
];

setInterval(async function () {

    //Ping server to avoid idle
    //axios.get("http://" + process.env.app_name + ".herokuapp.com/ip");


    //Cron Job
    // for (worker of workers) {

    //     await axios.get(`https://${worker.name}.herokuapp.com/p/dog`)
    //         .then((res) => {
    //             if (res.data.status === 'success') {
    //                 Key.create({
    //                     api_key: res.data.api_key
    //                 })
    //             }
    //         })
    //         .catch((err) => console.log(err))
    //         .finally(async () => {
    //             await axios.delete(`https://api.heroku.com/apps/${worker.name}/build-cache`, {
    //                 headers: {
    //                     "accept": "application/vnd.heroku+json; version=3",
    //                     "content-type": "application/json",
    //                     "authorization": "Bearer " + worker.api,
    //                 }
    //             })
    //             await axios.delete(`https://api.heroku.com/apps/${worker.name}/dynos`, {
    //                 headers: {
    //                     "accept": "application/vnd.heroku+json; version=3",
    //                     "content-type": "application/json",
    //                     "authorization": "Bearer " + worker.api,
    //                 }
    //             })
    //         });

    // }


}, 1500000); // every 25 minutes (1500000)

//setInterval(function () { ALL_ALIVE.push('beautiful'); ALL_ALIVE.push('awesome'); ALL_ALIVE.push('amazing'); ALL_ALIVE.push('increíble') }, 60000);

/**
 * helps
 */
function random_item(items) {
    return items[Math.floor(Math.random() * items.length)];
}
/**
 * bootstrap express app
 */
const app = new express();

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

/**
 * Routes
 */
const scrapingdogRoutes = require('./routes/scrapingdogRoutes')
const scrapingbeeRoutes = require('./routes/scrapingbeeRoutes')
const emailRoutes = require('./routes/emailRoutes')
app.use('/scrapingdog', scrapingdogRoutes)
app.use('/scrapingbee', scrapingbeeRoutes)
app.use('/mail', emailRoutes)

const extendTimeoutMiddleware = (req, res, next) => {
    const space = ' ';
    let isFinished = false;
    let isDataSent = false;

    // Only extend the timeout for API requests
    if (!req.url.includes('/get') && !req.url.includes('/token') && !req.url.includes('/rcaptcha')) {
        next();
        return;
    }

    res.once('finish', () => {
        isFinished = true;
    });

    res.once('end', () => {
        isFinished = true;
    });

    res.once('close', () => {
        isFinished = true;
    });

    res.on('data', (data) => {
        // Look for something other than our blank space to indicate that real
        // data is now being sent back to the client.
        if (data !== space) {
            isDataSent = true;
        }
    });

    const waitAndSend = () => {
        setTimeout(() => {
            // If the response hasn't finished and hasn't sent any data back....
            if (!isFinished && !isDataSent) {
                // Need to write the status code/headers if they haven't been sent yet.
                /*if (!res.headersSent) {
                  res.writeHead(202, { 'Content-Type': 'text/html' });
                }*/

                res.write(space);

                // Wait another 15 seconds
                waitAndSend();
            }
        }, 15000);
    };

    waitAndSend();
    next();
};


app.use(extendTimeoutMiddleware);

app.get('/ip', async (req, res) => {
    try {
        let ip = await axios.get('https://api.my-ip.io/ip');
        res.status(200).send(ip.data);
    } catch (error) {
        console.log(error)
        res.status(500).send('server Error');
    }
})


app.get('/get', async (req, res) => {

    res.writeHead(202, { 'Content-Type': 'application/json' });
    var check = setInterval(function () {
        if (ALL_ALIVE.length > 0) {
            random = random_item(ALL_ALIVE);
            proxy_check(random).then((r) => {
                clearInterval(check);
                res.write(`{"status": "success", "proxy":"${random}"}`);
                res.end();
            }).catch((e) => { console.log(e) })
        }
    }, 500);

    req.on('close', () => {
        clearInterval(check);
        return res.end();
    });
    req.on('end', () => {
        clearInterval(check);
        return res.end();
    });

})

app.get('/all', async (req, res) => {

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(`{"status": "success", "total":"${ALL_ALIVE.length}", "proxies":"${JSON.stringify(ALL_ALIVE)}"}`);
    res.end();

})

app.get('/token', async (req, res) => {

    //res.writeHead(200, { 'Content-Type': 'application/json' });
    //res.write(`{"status": "success", "total":"${ALL_ALIVE.length}", "proxies":"${JSON.stringify(ALL_ALIVE)}"}`);
    //res.end();

    res.writeHead(202, { 'Content-Type': 'application/json' });
    let done = false;
    // var checka = setInterval(function () {
    //     if (!done) {
    //         random = random_item(ALL_ALIVE);
    h_getToken().then((r) => {
        done = true
        clearInterval(checka);
        res.write(`{"status": "success", "token":"${r}"}`);
    }).catch((e) => { console.log(e) }).finally(() => res.end())
    //     }
    // }, 500);

    // req.on('close', () => {
    //     clearInterval(checka);
    //     return res.end();
    // });
    // req.on('end', () => {
    //     clearInterval(checka);
    //     return res.end();
    // });
    // res.on('end', () => {
    //     clearInterval(checka);
    //     return res.end();
    // })
    // res.on('close', () => {
    //     clearInterval(checka);
    //     return res.end();
    // });
    /*
        var http = require('http')
    
        var body = JSON.stringify({
            foo: "bar"
        })
        `https://hcaptcha.com/getcaptcha?s=${sitekey}`
        
    
        request.end(body)*/

})


app.get('/rcaptcha', async (req, res) => {

    if (!req.query.sitekey || !req.query.token || !req.query.apikey) {
        res.set('Content-Type', 'text/html');
        return res.status(404).send('<h3>Not Found<h3>')
    }
    res.writeHead(202, { 'Content-Type': 'application/json' });

    try {
        console.log('rcaptcha started')

        let result = await _util.pRetry({
            promise: r_getToken,
            params: [req.query.sitekey, req.query.token, req.query.apikey],
            options: {
                timeout: 40000, //promise timeout in ms
                retries: 3, //N of retries
                message: '[RECAPTCHA] TIMED OUT' //custom timeout message
            }
        })

        res.write(`{"status": "success", "token":"${result}"}`);
        res.end();

    } catch (error) {

        res.write(`{"status": "failed", "reason":"${error.message}"}`);
        res.end();

    }
})



app.get('/', async (req, res) => {

    res.json({ message: 'Hello World!' })

})



// TODO: allow server config

//mongoose.connect(`${process.env.DBuri}`)
mongoose
    .connect(`${process.env.db_uri}`)
    .then(() => {
        console.log('[SERVER] Database conneted')
        app.listen(port, host, function () {
            console.log('[SERVER] Listening on ' + host + ':' + port);
        });

    })
    .catch((err) => console.log(err))


//