
const delay = require('delay');
const axios = require('axios');
var crypto = require('crypto');
const querystring = require('querystring');
var httpsProxyAgent = require('https-proxy-agent');
const fs = require('fs');
const cookies = fs.readFileSync('cookies.txt').toString().replace(/\r\n/g, '\n').split('\n');
const _util = require('htvenom')

function random_item(items) {
    return items[Math.floor(Math.random() * items.length)];
}

const scrapingbee = require('scrapingbee');


async function get(url, sitekey, rtoken, apikey) {

    // var isPremium = true;
    // let fifty_fifty = Math.round(Math.random()) + 1;
    // if (fifty_fifty == 2) isPremium = false

    //var rtoken = '03AGdBq25dZUmWMctr24iBxe1NpJHKqozCHY10mQEKG0lmWNfyFmeYEradGKTXtvHVRL00DXxzJ2xT_NlQMLx56CwLdQ2r3LC9Zpz-e5UGGdCKu91iBag8K9i25Vx52WUVgpIxt16CDmLahZOEGpBtsZyRFzLrIb4USRSSy9bY340C_3JCa8CKIO4xfk2To3ZQ6DzXPMcljS6eA21q78XAjz__5RuQ_PJCbmOJf8PgsWtsRzMJ_X8bgNTFFvO0N4GX6nRYwc2LmCoMc7GBG1OfAJaAMarfLEnsgyDe08mI-f7NkV12XbXz7ohjS27HuiwYoOMF5lhyIu8zB-3c65nsNwODWscFTZ1kew4QmusCIwnxUNhnUJmfBIMpp0Gm9VypEQTJoAUus_giZqCAN-rb6MrynSclCBt01rNwR1pYRNQW5x8tIBd5F7ZnBRW9uI1STPQFFuTW_zklW9jdAwLODJUI6sRd0ir7wjDG9ploTUxmFn24LBIV51RQJgZkkg-II2DQvYE_ymKIBxWXPm_0chPUX18UCs8UPN5qkACz0hAkd8tQo3-03AyGeiq03TB3_xX-Sp-QIto6JSpxyZRHLmjz3FxngIcgOHPzinGrZKWlFwOAFOfuLCOu9qY66BGdo7_1rcwG-dek6qCYnV7_K9_JF4xRbSfNAEW4O5qUv5yuZQ4gBw1-4cV8t4ffqXhBC36QVB4vhw9KOteyLYqDbwNJR5crCz9Wxxuk0mMgv8pzjl3weNw3Eo4qaR2zWO1iyHVkNH-pxKDUv4JNJ6CZ3ErcQDnQW4jC_XWAUtde800DFeWE-lBpXgmzHxuP5k30nso9NbZqSNZ5uOq903pEBoGuFOIAQ1hytsWLAYuTw5APaowcYRuLOqhwQflqGAtyfr81-8F75NbVlUx9UR-3g53z4QiSpVMj6BBjM-FwwFxpoJ1m3QJTGZGHZhnYKkG0NTzdjZB9s5325AXCjU6SHdsXTQXO6NRTEordVojtO_mHzB0rnmNazK5QqM5X9KTbOIAtYkRQqFJbc5AJ3ZwVnoHwMX7jJduKzIeW34UcAHaILaJ82YpQ2dDFW3dm1UyFB2pt5Bj5rXV6OWJywC7nZ6AngiEJUMyPT1jrasLHYQPgptSO27YwpLHKzGayUUlpbA0OgD0rV0W6j4RnMFwE-0bu_YNtIAK51A';
    //var sitekey = '6LfW6wATAAAAAHLqO2pb8bDBahxlMxNdo9g947u9';

    var client = new scrapingbee.ScrapingBeeClient(apikey);
    var response = await client.get({
        url: url,

        params: {
            //'wait': '5000',
            //'forward_headers_pure': 'True',
            //'own_proxy': 'http://2FT0OZ5F0AWE8OK1OLC4NOO1RMSLLVWX4BYQWF3M0RHDMEI723GH0VWXEUJ99KQ0UAWYHN8HS1JX23SF:render_js=False@proxy.scrapingbee.com:8886',
            //'forward_headers': 'True',

            //'device': 'mobile',


            'js_scenario': {
                "instructions": [

                    //REPLACE CAPTCHA

                    { "wait_for": "#recaptcha-demo" },
                    { 'evaluate': 'const original = document.getElementById("recaptcha-demo")' },
                    { 'evaluate': `const parent = document.querySelector('div[class=""]')` },
                    { 'evaluate': 'parent.removeChild(original)' },
                    { 'evaluate': 'const e = document.createElement("div");' },
                    { 'evaluate': 'parent.prepend(e)' },
                    { 'evaluate': `grecaptcha.render(e, {"sitekey" : "${sitekey}" });` },
                    { "wait": 500 },
                    { "wait": 2500 },

                    { 'evaluate': `document.querySelector("iframe").contentWindow.document.querySelector("#recaptcha-token").value = "${rtoken}"` },

                    // 
                    // { "wait_for": ".g-recaptcha" },
                    //{ "wait": 1000 },

                    { 'evaluate': 'document.querySelector("iframe").contentWindow.document.querySelector("#recaptcha-anchor").click()' },
                    { "wait": 2500 },
                    { 'evaluate': 'document.querySelectorAll("iframe")[2].contentWindow.document.querySelector("#recaptcha-audio-button").click()' },
                    { "wait": 2500 },
                    { 'evaluate': 'const AudioSource = document.querySelectorAll("iframe")[2].contentWindow.document.querySelector("#audio-source").src' },
                    { "wait": 1000 },


                    //GET AUDIO DATA
                    { 'evaluate': 'var buffer;' },
                    { 'evaluate': 'const response = fetch(AudioSource).then((r)=> r.arrayBuffer()).then((b)=>buffer=b)' },
                    { "wait": 2500 },

                    // { 'evaluate': 'const buffer = await response.arrayBuffer()' },
                    // { "wait": 2000 },
                    // { 'evaluate': 'const data = new Uint8Array(buffer)' },
                    // { "wait": 2000 },
                    { 'evaluate': 'const data = new Uint8Array(buffer)' },
                    //{ "wait": 3000 },
                    //{ 'evaluate': 'alert("supi")' },
                    // //RECOGNIZE AUDIO
                    { 'evaluate': 'var res;' },
                    { 'evaluate': "fetch('https://api.wit.ai/speech?v=20220623', { method: 'POST', body: data, headers: { Authorization: 'Bearer IWWMJOGDRR3GZL66ZOER5X2RG6EX4XTR','Content-Type': 'audio/mpeg3'}}).then((r)=> r.text()).then((t)=>res=t)" },
                    { "wait": 2500 },

                    // // { 'evaluate': 'const res = await raw.text()' },
                    // { "wait": 3000 },
                    { 'evaluate': "const answer = Array.from(res.matchAll('\"text\": \"(.*)\",')).at(-1)[1].trim()" },
                    { "wait": 500 },
                    { 'evaluate': 'document.querySelectorAll("iframe")[2].contentWindow.document.querySelector("#audio-response").value = answer' },
                    { "wait": 500 },
                    //{ 'evaluate': 'document.write("<h1>Hello World !!!"+answer+"</h1><p>Have a nice day!</p>");' },

                    { 'evaluate': 'document.querySelectorAll("iframe")[2].contentWindow.document.querySelector("#recaptcha-verify-button").click()' },
                    { "wait": 500 },
                    { 'evaluate': 'const token = document.querySelector("#g-recaptcha-response-1").value' },
                    { "wait": 500 },
                    { 'evaluate': 'document.write(token);' },
                    { "wait": 500 },
                ]
            },

            'timeout': '60000',
            //'wait_for': '.g-recaptcha',
            //'block_ads': 'True',
            'window_width': '100',
            'window_height': '100',
            //'device': 'mobile',
            'forward_headers': 'True',
            'custom_google': 'True',
            //'json_response': 'True',
            'premium_proxy': 'True',
            //'stealth_proxy': 'True',
            'block_resources': 'False',

            //'screenshot': 'True'
        },
    })

    return response;
}

async function getToken(sitekey, rtoken, apikey) {

    BEEING_USED.push(apikey);
    return new Promise(async (resolve, reject) => {
        try {

            await get('https://www.google.com/recaptcha/api2/demo', sitekey, rtoken, apikey).then(function (response) {
                var decoder = new TextDecoder();
                var text = decoder.decode(response.data).replaceAll(/<(.|\n)*?>/g, '');
                if (text !== '') {
                    BEEING_USED = _util.remove_item(apikey, BEEING_USED);
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