
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
        let dog_key = await dogChecker().catch(console.log);
        var r = await unirest.get(`https://hcaptcha.com/checksiteconfig?host=${host}&sitekey=${sitekey}&sc=1&swa=1`).proxy(`http://scrapingdog:${dog_key}@proxy.scrapingdog.com:8081`).headers(headers)
        //let r = await axios.get(`https://hcaptcha.com/checksiteconfig?host=${host}&sitekey=${sitekey}&sc=1&swa=1`, { headers: headers })
        r = r.body
        if (r["pass"])
            return r["c"];
        else
            return false;
    } catch (error) {
        return false;
    }
}
async function Get_Captcha(host, sitekey, n, requ, index) {

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
            '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lswxjDdJfI+EEnT9',
            'tIhltVjyVtV4I7z302ESZMOSasy272JfAAszwPWMJkCmiaOxpjMMlpHjtV8dz3HXGhfqspN1D1DZwmegO14b/8oGe42G0gLjxdGoaHxRpHPNdq9a9jTOl0tPD5Pa2MMv4fwsw4gOMzZELRNHQ+1vCakiXYstWD6sCcdaYlDKAUFST5dOgMToiSaMRPQbUNILPO6/bVIHjEFl6JJ62ydBX/U5F4O/rmnNf1eAy9EeKIALbX6uRa/h7XNLlsU+uDY/VFf8PcuwyRcSnMgI2CMLdUt8tDRWrIPYxfrNNzkh9KuY9zt88kDMFddcCGINlyrPMuNdNJ33doGGKzM05Fpf4OPvg3hmZUtkZ1BRv7C7XzOrILurQVs3dpH7AIuvV9kf5L0mJlbCnnjzAsWV57RUU0BgToBhWBGinvL79N4jQqP3ZowHM8o8sXMO6OOpzCcJjxRVvUcZqheEiBLJA2vGz6ywQfU3G+0hU4ak1Y5s2YmyOy7csehiEN5B0Gkfts0s1nqqVg28NlNjhvt4/8vq1yWEVR9QdZDabw/VSt7kw50DCn0w116c1qKUPUKw+oYrdFWpKcjy6cMk4yV6rL+WC0KvE2z2aqIMpzD7Bd0n7FBcPFcIEXcd0icYvAy3N4baG3cFq+XSmPXWEUn8Crbnz7r1zOI61yrM3u1cHBtugs4gc2zIwP5lexqbfCrp7uoiIarQHojA1z0jVTtOTtZfPK8yLF5lVZ9lZ6ur9Q+H/AL1AY+E0GBvlChxdd4K0YzayI/O1hFpJxs5B+hV1Re6bcdbLjD479JWqdYxvHVG36TNjWlVVfXv5ExR32PSDL0hcikLRl1ZEkmxpRxMr8i5OzNtEmglh/WYYoKLUVFjGMGI5VsynE0Yjco2YnQkjuP+XvzxLF1S62ORE2E1/G68mdoUJo+kRUM+8pn63ZoPLDKUd3MGQJb+XCsRYB1gfkL6hpXbnl3aEPRhUF8MP+49zFpNrvUwcTdB8aZ67ee4dfpl7cPFgBMkEobtUTYn0wBkMGd5p7BMT1FbPgQNd7xG2ygKPsEgenQl3+BV3qPBkxAJ2+OXc/HJTtT7Jmg=QsZzMzcwMPlsTtEz',
            'XSuPvCxdHLEHvV7N0XAdt+BRKOPU6gA+KlJpD/w2PyBzJCfk4KDxvJLl2GTQM4RPvzSBAKxIwgW7HYsQ6w99bd7ZuCMV19IicNseA7mSovNqwe91Vzi3TPxliHfApD3rBKNIZSwIXwwRetTb38D2vTcMI7ogoqoMfWDoes1sEf0fgmW88GZwCuyvi4L8myE4gPtn2rWWj1jX3RMxHsuN3bALA/1BfxCBVUpccBY1gIL9ToN0g6xabh2Odsur2R5gfCwmW5HhVIjX+2O4RyXTDze6CHdzhh2A4uORM9Jx/zVfNafhRPEtbMZ+O3FHVEUPJmS4w9O7MuqTLa9bMx+gSvZarOj0MFrJpiFXGnslLiEGPhSYlavpqx8Jhc6f9YOqZ6ruCDzyvM1CItxNT0gusIj7SA4/t62oFIGs0FSNRk5EUYdvL1yYx/mJ1o2xzZUtc7yJA1510pQksZVB6kLXe1bqyTlg/dZuCVU2P290QMQNTQnH3zu/KC9U0lAJNRQPWXAge91V1qletkkPo8Mb3O8lo3EtEpRDmdHu+CPW+Uw1SsAev7JlRgJAGgqQ4EsOmkggfzaAkVgrHk7CVUCfxufCSoykjgOCOfLDngcf/Pa1QxvD+mIxibXzjDnnGkZ+xsBWECyOOtjRY5hQyDdBSoPpnP/3gAtr+0YPK6lAfweSl9p3n0wWGCwFzcNOMnvHJ59RXM62LAGDwj3FAAnuars9dnQWZdQmj6wejFe9iP2tSJ0kPEwkrssaJwPDo1N3s4CFpuP/N6L7eGTM7G9Yex17icFOG6rlp37nyUoL0AOBcg3dg8tsuR53vtCYs1Een6k66/5txLZ0aJ6XixQ8vf7WrK+yleHFYKqzTaS99FBkx7HLafgkG3cM3cPLcBETqYwu0Dfqdo++vvy6H3CMbtmqS8VwkrVqwXEhrzmnJyShArTbM3O+tkERFx0/Ntum7eRqdVvk+NpGOvxIAjUffqaxXt5fKn1Ghp3rozYd8BjtPZyKpEh93UAZJw+DC8OiHqio+4FjWQhRay97VABUDfHNwVG8wDlF0prdWH0RwJc=d6n+7ZvpB0RH3eOp',
            '52lJKy1XpkM/Mlka6P2DijD4Bn/ldS1voP6eJ0M6oJ2wW51o88uWV1yeoP/yKyeDvDV/FYzbgaCM2ysc71rEJH/J58GmqxaB8xtEZwVhRy6iYNN8+L0IPo1D35tpE18FbET/tmIf5JzrfXz3kqB8S71g8Bfw/pAimSIU1PuYDeRhKJzTmN4yCn/mYgbW+5zCzSdglGMWaCtKFV52yO+8HaKK7ieI6dEbU3REbFg6gF5JVeTDnmw20TGSUtjLuEyiVjhyrKhsU0ico6cl+R1CGe7D1heOH7LW611QyDow5z3cnNx8e+Uc1UAym3LPNgrNEa7T8G7Fed+1yywlKXelHVnjsuh4js0C8e/WHJmFcrUpwYh5CR40NrdJCVk/qB8LVeqgSOnLUIqDJrmz4X7jWRkM4k8TaAAkFU6ogTZ4w5tqYOa57pJ/RD1pNzr02/myvxcWMMyGrD6zqTniTMsL0zfl/S2W1V+veGDa8wItJjqKStK7wsIJjI4oWa5YkhAXFvY6EDae17xfHKtnB8YHCOl+IfYT4V15C7mR5qUJEwMHudWs9Di0UgWRWb6wQI5EJotmGpLCvFQnhAZptVcWOVUNDqPglsWUlpXoiWZpoN2muyc8LkInK48/5q2eQF9+n+Ns/5H71dtlqnTIkhyh3SFzyyn5LNYfVO+evmQrU5gVXiUK8FQhWdENSPYEvA4eUuogfD0wlEkyOHjScn7HthjrLddnXd7HHi8mbR8h0JeraQzSpjpSdWkqaWHCDm9mYS36G4cNmqo1sx927OzAk76pXOGpnccpZ6jX7+3lSfvReXwFTW3tqHmSmQyTFcrsNyy7zA2jEuqJHKIKctjqwCzlkcDNdPG6cggco5rC/xM3yv0rwXHevfm4xyAVPebJOboKaqyBg24ggLDJMnRIeaMybW4ISyIdJ2pKadKX1iOgTyZ278RPofL1tThyGM+wmWTIjePXmDznjsgf2V2IkYT5EyQPQUAaCPM2KQjD2p9ylhqLJtkqf87NwOJYYfqULD4Poj67+5W08IQdYRAkOgiZm05alLjE89zGuef9JT/SrAhyR4fHhPlhwt5tGCK8tf0n3AgViAKjXD+T'
        ]
        headers_ = {
            "Host": "hcaptcha.com",
            "Connection": "keep-alive",
            "sec-ch-ua": 'Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92',
            "Accept": "application/json",
            "sec-ch-ua-mobile": "?0",
            "Content-length": data.length.toString(),
            "Cookie": `hc_accessibility=${cookies_[parseInt(index)]};`,
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

async function getToken(index) {

    //require('https').get('https://google.com:443', function (res) { console.log(res.statusCode) }).on('error', console.log)
    return new Promise(async (resolve, reject) => {
        try {


            requ = await REQ_Data("account-api.proton.me", "f99ae21a-1f92-46a4-938e-da6a6afb72ec")
            requ["type"] = "hsl"
            n = N_Data(requ["req"])
            resu = await Get_Captcha("account-api.proton.me", "f99ae21a-1f92-46a4-938e-da6a6afb72ec", n, requ, index)
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