
const delay = require('delay');
const axios = require('axios');
var crypto = require('crypto');
const querystring = require('querystring');
const dogChecker = require('./checkers/scrapingdogChecker')
const fs = require('fs');
const cookies = fs.readFileSync('cookies.txt').toString().replace(/\r\n/g, '\n').split('\n');
const unirest = require('unirest');

function random_item(items) {
    return items[Math.floor(Math.random() * items.length)];
}

let headers = {
    "Host": "hcaptcha.com",
    "Connection": "keep-alive",
    "sec-ch-ua": 'Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92',
    "Accept": "application/json",
    "sec-ch-ua-mobile": "?0",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
    "Content-type": "application/json; charset=utf-8",
    "Origin": "https://newassets.hcaptcha.com",
    "Sec-Fetch-Site": "same-site",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
    "Referer": "https://newassets.hcaptcha.com/",
    "Accept-Language": "en-US,en;q=0.9"
}

function N_Data(requ) {
    let x = "0123456789/:abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    requ = requ.split(".")

    requ = {
        "header": JSON.parse(Buffer.from(requ[0] + "=======", 'base64').toString('utf-8')),
        "payload": JSON.parse(Buffer.from(requ[1] + "=======", 'base64').toString('utf-8')),
        "raw": {
            "header": requ[0],
            "payload": requ[1],
            "signature": requ[2]
        }
    }

    function a(r) {
        for (let t = r.length - 1; t >= 0; t--) {
            //console.log(arr[i]);
            if (r[t] < (x.length - 1)) {
                r[t] += 1
                return true
            }
            r[t] = 0
        }
        return false
    }
    function i(r) {
        t = ""
        for (let n = 0; n < r.length; n++) {
            t += x[r[n]]
        }
        return t
    }
    function o(r, e) {
        var a, hashed, n, o, t;
        n = e;
        //crypto.createHash('sha1')
        hashed = crypto.createHash('sha1').update(Buffer.from(e, 'utf-8'));
        hashed2 = crypto.createHash('sha1').update(Buffer.from(e, 'utf-8'));
        //console.log(Buffer.from(e, 'utf-8'))
        o = hashed.digest('hex');
        t = hashed2.digest();
        //console.log(t)
        /*
        hashed = hashlib.sha1(e.encode());
        o = hashed.hexdigest();
        t = hashed.digest();*/
        e = null;
        n = -1;
        o = [];

        for (n = n + 1; n < (8 * t.length); n++) {
            e = t[Math.floor(n / 8)] >> n % 8 & 1;
            o.push(e);
        }

        a = o.slice(0, r);
        function index2(x, y) {
            if (x.includes(y)) {
                return x.indexOf(y)
            }
            return -1;
        }
        //console.log((0 === a[0]) && (index2(a, 1) >= (r - 1)) || (-1 === index2(a, 1)))
        return (0 == a[0]) && (index2(a, 1) >= (r - 1)) || (-1 == index2(a, 1));
    }

    function get() {
        for (let e = 0; e < 25; e++) {
            n = Array.from({ length: e }, (_, i) => 0)
            while (a(n)) {
                u = requ["payload"]["d"] + "::" + i(n)
                if (o(requ["payload"]["s"], u)) {
                    return i(n)
                }
            }
        }
    }

    let result = get();
    hsl = [
        "1",
        requ["payload"]["s"].toString(),
        new Date().toISOString().slice(0, 19).replaceAll("T", "").replaceAll("-", "").replaceAll(":", ""),
        requ["payload"]["d"],
        "",
        result
    ].join(':')

    return hsl;
}
async function REQ_Data(host, sitekey) {
    try {
        let r = await axios.get(`https://hcaptcha.com/checksiteconfig?host=${host}&sitekey=${sitekey}&sc=1&swa=1`, { headers: headers })
        r = r.data
        if (r["pass"])
            return r["c"];
        else
            return false;
    } catch (error) {
        return false;
    }
}
async function Get_Captcha(host, sitekey, n, requ) {

    try {


        json = {
            "sitekey": sitekey,
            "v": "b1129b9",
            "host": host,
            "n": n,
            'motiondata': '{"st":1628923867722,"mm":[[203,16,1628923874730],[155,42,1628923874753],[137,53,1628923874770],[122,62,1628923874793],[120,62,1628923875020],[107,62,1628923875042],[100,61,1628923875058],[93,60,1628923875074],[89,59,1628923875090],[88,59,1628923875106],[87,59,1628923875131],[87,59,1628923875155],[84,56,1628923875171],[76,51,1628923875187],[70,47,1628923875203],[65,44,1628923875219],[63,42,1628923875235],[62,41,1628923875251],[61,41,1628923875307],[58,39,1628923875324],[54,38,1628923875340],[49,36,1628923875363],[44,36,1628923875380],[41,35,1628923875396],[40,35,1628923875412],[38,35,1628923875428],[38,35,1628923875444],[37,35,1628923875460],[37,35,1628923875476],[37,35,1628923875492]],"mm-mp":13.05084745762712,"md":[[37,35,1628923875529]],"md-mp":0,"mu":[[37,35,1628923875586]],"mu-mp":0,"v":1,"topLevel":{"st":1628923867123,"sc":{"availWidth":1680,"availHeight":932,"width":1680,"height":1050,"colorDepth":30,"pixelDepth":30,"availLeft":0,"availTop":23},"nv":{"vendorSub":"","productSub":"20030107","vendor":"Google Inc.","maxTouchPoints":0,"userActivation":{},"doNotTrack":null,"geolocation":{},"connection":{},"webkitTemporaryStorage":{},"webkitPersistentStorage":{},"hardwareConcurrency":12,"cookieEnabled":true,"appCodeName":"Mozilla","appName":"Netscape","appVersion":"5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36","platform":"MacIntel","product":"Gecko","userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36","language":"en-US","languages":["en-US","en"],"onLine":true,"webdriver":false,"serial":{},"scheduling":{},"xr":{},"mediaCapabilities":{},"permissions":{},"locks":{},"usb":{},"mediaSession":{},"clipboard":{},"credentials":{},"keyboard":{},"mediaDevices":{},"storage":{},"serviceWorker":{},"wakeLock":{},"deviceMemory":8,"hid":{},"presentation":{},"userAgentData":{},"bluetooth":{},"managed":{},"plugins":["internal-pdf-viewer","mhjfbmdgcfjbbpaeojofohoefgiehjai","internal-nacl-plugin"]},"dr":"https://discord.com/","inv":false,"exec":false,"wn":[[1463,731,2,1628923867124],[733,731,2,1628923871704]],"wn-mp":4580,"xy":[[0,0,1,1628923867125]],"xy-mp":0,"mm":[[1108,233,1628923867644],[1110,230,1628923867660],[1125,212,1628923867678],[1140,195,1628923867694],[1158,173,1628923867711],[1179,152,1628923867727],[1199,133,1628923867744],[1221,114,1628923867768],[1257,90,1628923867795],[1272,82,1628923867811],[1287,76,1628923867827],[1299,71,1628923867844],[1309,68,1628923867861],[1315,66,1628923867877],[1326,64,1628923867894],[1331,62,1628923867911],[1336,60,1628923867927],[1339,58,1628923867944],[1343,56,1628923867961],[1345,54,1628923867978],[1347,53,1628923867994],[1348,52,1628923868011],[1350,51,1628923868028],[1354,49,1628923868045],[1366,44,1628923868077],[1374,41,1628923868094],[1388,36,1628923868110],[1399,31,1628923868127],[1413,25,1628923868144],[1424,18,1628923868161],[1436,10,1628923868178],[1445,3,1628923868195],[995,502,1628923871369],[722,324,1628923874673],[625,356,1628923874689],[523,397,1628923874705],[457,425,1628923874721]],"mm-mp":164.7674418604651},"session":[],"widgetList":["0a1l5c3yudk4"],"widgetId":"0a1l5c3yudk4","href":"https://discord.com/register","prev":{"escaped":false,"passed":false,"expiredChallenge":false,"expiredResponse":false}}',
            "hl": "en",
            "c": JSON.stringify(requ)
        }
        data = querystring.stringify(json);
        var cookies_ = [
            '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mlv+5rMyvUdH/h3h'
        ]
        headers_ = {
            "Host": "hcaptcha.com",
            "Connection": "keep-alive",
            "sec-ch-ua": 'Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92',
            "Accept": "application/json",
            "sec-ch-ua-mobile": "?0",
            "Content-length": data.length.toString(),
            "Cookie": `hc_accessibility=${random_item(cookies_)};`,
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
            "Content-type": "application/x-www-form-urlencoded",
            "Origin": "https://newassets.hcaptcha.com",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            "Referer": "https://newassets.hcaptcha.com/",
            "Accept-Language": "en-US,en;q=0.9"
        }
        //${random_item(cookies)}

        //r = await axios.post(`https://hcaptcha.com/getcaptcha?s=${sitekey}`, data, { headers: headers_ })
        let dog_key = await dogChecker().catch(console.log);
        var r = await unirest.post(`https://hcaptcha.com/getcaptcha?s=${sitekey}`).proxy(`http://scrapingdog:${dog_key}-country=random@proxy.scrapingdog.com:8081`).headers(headers_).send(data)
        return r.body
        /*
                function myPromise(timeout) {
                    return new Promise(async (resolve, reject) => {
                        // Set up the timeout
                        const timer = setTimeout(() => {
                            console.log('timedout')
                            resolve(null);
                        }, timeout);
                        try {
                            r = await axios.post(`https://hcaptcha.com/getcaptcha?s=${sitekey}`, data, {
                                headers: headers_,
                                proxy: false,
                                agent: false,
                                httpsAgent: new httpsProxyAgent.HttpsProxyAgent('http://' + proxy)
                            })
                            resolve(r.data)
                            //clearTimeout(timer);
                        } catch (error) {
                            resolve(null)
                        } finally {
                            clearTimeout(timer)
                        }
        
                    });
                }
                let ret = await myPromise(10000);
                return ret;*/

    } catch (error) {
        console.log(error)
    }

}

async function getToken() {

    //require('https').get('https://google.com:443', function (res) { console.log(res.statusCode) }).on('error', console.log)
    return new Promise(async (resolve, reject) => {
        try {


            requ = await REQ_Data("account-api.proton.me", "f99ae21a-1f92-46a4-938e-da6a6afb72ec")
            requ["type"] = "hsl"
            n = N_Data(requ["req"])
            resu = await Get_Captcha("account-api.proton.me", "f99ae21a-1f92-46a4-938e-da6a6afb72ec", n, requ)
            let captcha;
            if (resu["generated_pass_UUID"]) {
                captcha = resu["generated_pass_UUID"]
                resolve(captcha)
            } else {
                reject('FAILED TO GET TOKEN')
            }

        } catch (error) {
            reject('FAILED TO GET TOKEN')
        }
    })
}

module.exports = getToken;