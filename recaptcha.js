
const delay = require('delay');
const axios = require('axios');
var crypto = require('crypto');
const querystring = require('querystring');
var httpsProxyAgent = require('https-proxy-agent');
const fs = require('fs');
const cookies = fs.readFileSync('cookies.txt').toString().replace(/\r\n/g, '\n').split('\n');

function random_item(items) {
    return items[Math.floor(Math.random() * items.length)];
}

const scrapingbee = require('scrapingbee');


async function get(url, sitekey, rtoken, apikey) {

    var isPremium = true;
    let fifty_fifty = Math.round(Math.random()) + 1;
    if (fifty_fifty == 2) isPremium = false


    var client = new scrapingbee.ScrapingBeeClient(apikey);
    var response = await client.get({
        url: url,
        params: {

            'js_scenario': {
                "instructions": [

                    //REPLACE CAPTCHA
                    { "wait_for": ".g-recaptcha" },
                    { 'evaluate': 'const original = document.getElementById("recaptcha-demo")' },
                    { 'evaluate': `const parent = document.querySelector('div[class=""]')` },
                    { 'evaluate': 'parent.removeChild(original)' },
                    { 'evaluate': 'const e = document.createElement("div");' },
                    { 'evaluate': 'parent.prepend(e)' },
                    { 'evaluate': `grecaptcha.render(e, {"sitekey" : "${sitekey}" });` },
                    { "wait": 1500 },
                    { 'evaluate': `document.querySelector("iframe").contentWindow.document.querySelector("#recaptcha-token").value = "${rtoken}"` },
                    { 'evaluate': 'document.querySelector("iframe").contentWindow.document.querySelector("#recaptcha-anchor").click()' },
                    { "wait": 1500 },
                    { 'evaluate': 'document.querySelectorAll("iframe")[2].contentWindow.document.querySelector("#recaptcha-audio-button").click()' },
                    { "wait": 1500 },
                    { 'evaluate': 'const AudioSource = document.querySelectorAll("iframe")[2].contentWindow.document.querySelector("#audio-source").src' },
                    { "wait": 1000 },


                    //GET AUDIO DATA
                    { 'evaluate': 'var buffer;' },
                    { 'evaluate': 'const response = fetch(AudioSource).then((r)=> r.arrayBuffer()).then((b)=>buffer=b)' },
                    { "wait": 1500 },
                    { 'evaluate': 'const data = new Uint8Array(buffer)' },
                    { 'evaluate': 'var res;' },
                    { 'evaluate': "fetch('https://api.wit.ai/speech?v=20220623', { method: 'POST', body: data, headers: { Authorization: 'Bearer IWWMJOGDRR3GZL66ZOER5X2RG6EX4XTR','Content-Type': 'audio/mpeg3'}}).then((r)=> r.text()).then((t)=>res=t)" },
                    { "wait": 1500 },
                    { 'evaluate': "const answer = Array.from(res.matchAll('\"text\": \"(.*)\",')).at(-1)[1].trim()" },
                    { "wait": 500 },
                    { 'evaluate': 'document.querySelectorAll("iframe")[2].contentWindow.document.querySelector("#audio-response").value = answer' },
                    { "wait": 500 },
                    { 'evaluate': 'document.querySelectorAll("iframe")[2].contentWindow.document.querySelector("#recaptcha-verify-button").click()' },
                    { "wait": 500 },
                    { 'evaluate': 'const token = document.querySelector("#g-recaptcha-response-1").value' },
                    { "wait": 500 },
                    { 'evaluate': 'document.write(token);' },
                    { "wait": 500 },

                ]
            },
            'premium_proxy': `${isPremium ? 'True' : 'False'}`,
            'timeout': '40000',
            'custom_google': 'True',
            'block_resources': 'False',
        },
    })

    return response;
}

async function getToken(sitekey, rtoken, apikey, apikey) {

    return new Promise(async (resolve, reject) => {
        try {

            await get('https://www.google.com/recaptcha/api2/demo', sitekey, rtoken, apikey).then(function (response) {
                var decoder = new TextDecoder();
                var text = decoder.decode(response.data).replaceAll(/<(.|\n)*?>/g, '');
                if (text !== '') {
                    resolve(text)
                }
                else {
                    console.log(`[ERROR] [RECAPTCHA] RETURNED AN EMPTY STRING - TOKEN NOT VALID`)
                    reject('[RECAPTCHA] RETURNED AN EMPTY STRING - TOKEN NOT VALID')
                }
            })

        } catch (error) {
            console.log(`[ERROR] [RECAPTCHA] ${error.message}`)
            reject('[RECAPTCHA] FAILED TO GET TOKEN')
        }
    })

}

module.exports = getToken;