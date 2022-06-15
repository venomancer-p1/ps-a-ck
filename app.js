/**
 * npm module deps
 */
const express = require('express');
const delay = require('delay');
const axios = require('axios');



var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 8000;



//


const start = require('./proxy-scraper.js');
var ALL_ALIVE = [];
var timeout;
async function update() {
    if (timeout) clearTimeout(timeout);
    const t1 = new Date();

    await start(ALL_ALIVE);

    if (ALL_ALIVE.length > 0) {
        console.log(`[MAIN] I'm Tired, I'll take 5 min of break`);
        await delay(300000)
    }
    timeout = setTimeout(update, Math.max(0, 1000 - new Date + t1));
}
update();


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

const extendTimeoutMiddleware = (req, res, next) => {
    const space = ' ';
    let isFinished = false;
    let isDataSent = false;

    // Only extend the timeout for API requests
    if (!req.url.includes('/get')) {
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
            clearInterval(check);
            console.log(ALL_ALIVE)
            res.write(`{"status": "success", "proxy":"${random_item(ALL_ALIVE)}"}`);
            res.end();
        }
    }, 500);

})

app.get('/all', async (req, res) => {

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(`{"status": "success", "total":"${ALL_ALIVE.length}", "proxies":"${ALL_ALIVE}"}`);
    res.end();

})
/*
app.get('/p/first', async (req, res) => {

    res.writeHead(202, { 'Content-Type': 'application/json' });
    if (!req.query.email || !req.query.pass) {
        res.set('Content-Type', 'text/html');
        return res.status(404).send('<h3>Not Found<h3><br><strong>Please use /p/first?email=YOUR_EMAIL&pass=YOUR_PASS</strong>')
    }
    res.setTimeout(150000, function () {
        console.log('Request has timed out.');
        res.sendStatus(408);
    });
    req.on('close', () => {
        return res.end();
    });
    req.on('end', () => {
        return res.end();
    });
    try {

        let start = Date.now();
        const client = new protonmail.ProtonmailClient();

        // login to the protonmail
        await client.login({
            username: req.query.email,
            loginPassword: req.query.pass,
        });

        // fetch private keys in order to decrypt messages
        await client.fetchKeys({
            password: req.query.pass,
        });

        // fetch the first 2 messages
        const messagesResponse = await client.messages.list({
            LabelID: protonmail.DefaultLabels.All,
            Limit: 2,
            Page: 0,
        });

        // take the first one
        const firstMessage = messagesResponse.Messages[0];
        // get the full message with body
        const m = await client.messages.get(firstMessage.ID);

        // decrypt message
        const m_decrypted = await client.decryptMessage(m.Message);

        let stop = Date.now();
        const $ = cheerio.load(m_decrypted, {
            xml: {
                normalizeWhitespace: true,
            },
        });
        let txt = $('body').text();
        message = txt.replaceAll(/(\r\n|\r|\n)/g, '\n').replaceAll(/\s\s+|\xA0|&nbsp;/g, ' ');

        await client.logout();

        res.write(`{"status": "success", "duration":"${(stop - start) / 1000}s", "message":"${message}"}`);
        res.end();



    } catch (error) {
        console.log(error)
        res.write(`{"status": "failed", "reason":"Internal Error"}`);
        res.end();
    }

})*/


// TODO: allow server config
app.listen(port, host, function () {
    console.log('server listening on ' + host + ':' + port);
});
