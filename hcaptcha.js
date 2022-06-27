
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
        headers_ = {
            "Host": "hcaptcha.com",
            "Connection": "keep-alive",
            "sec-ch-ua": 'Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92',
            "Accept": "application/json",
            "sec-ch-ua-mobile": "?0",
            "Content-length": data.length.toString(),
            "Cookie": `hc_accessibility=wBrT7xElqCHB+NK4IH2otP58DKZtZjYueqz1eLCihwnzaRuxl6auQ2nWXrUtiA6epzOQVRLWcNzqxtA5TYBZ2RscXTCCAzk88J2mTeebTTUDdMN/RF1qgfG4NU03tZ0MLg4L40vGA3eyesE3pJH8Ernh0jDBN7n30UZgXuCm7Fb96/dhKkZp0fToK8j87cDpq9bxGV4phembYUxH4LGmJIJx6XZwjJ88z542Bh/8FExMqYUZuXKhom6MiBEsfAufB2gBYaz2CP4OgkxOGSST8d/HsrO92kQ85ZFxNbywQHZ4c+5VNrgWFRMP3T0mNWN2+XaCuLXo7Hus+OoHGI5M7jj/UINlHgDd1OnGbQExFCdQhk3XYaJd+uljflogcBws12CuqULxP79FPTEus34QMVlYC4l/B0Km/ffWyIxWskvti8IzHgv9tqghSEMTTB8SaX0t88JgmGJm+tUoQyrgK7CnGFBqfXaJeJlHxnYDD6Z0Up3pexs+jhxja9neXbaXaXgFGUInwpdn1abm9uk+wkngmRg1iEsJh5e7Jy6aU+8hLNreBBmvfIy81ngmzqRLpw5DOJCxer7xVQn7wBxh0vdAfTgVHqrOPyDeVV7DuKV4DUkNPj1QnhV+fQwS58xF4E7eucRP8/D1TWgGOKY4rfqi57o7lz61iD2/oQ3B0VUQgxa3J6HV8VwE3rfUvmJaBbx6JQaYCaUOXl4fLTHERwMe32IsQ2WUfChN3P8EwbLIpHHXwDREKa/PNkF6RyioQEEQRIHkgqrZqsBAw4mfFzVSQIW+XRCRCPdZaYlEeqYfB6DwrjbbeOZkh5CH4kw5h95FWbauskEqQvnDac0Xn0MAfUrMp3o39fgARbH24EOobmKzj5C46l2EHY2FnNLFZuF4LsfshQo9dufjcwDp2OJ5wRSu5q2V9FFZdkw/oAJukqFsTzJAsa4myyaNa3rX9QCatzSKQksvIPY8EGMDB7+hr0NUIyEwFw/434WbG4wb/fMeFYm8zleBc4N+Bj/QqqKfWFZUt1xs2zNcxn/q/cSNOMeAAC5zLNFSCSjTFcg2hwIfeH6A0rhhcCt2ykFtIC/wzQ==SS+L3wvU3aTdIIFU;`,
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
        var r = await unirest.post(`https://hcaptcha.com/getcaptcha?s=${sitekey}`).proxy(`http://scrapingdog:${dog_key}@proxy.scrapingdog.com:8081`).headers(headers_).send(data)
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