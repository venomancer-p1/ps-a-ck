
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
            'XrBt1e5ZXfYfPHGbga7NANmCjK88B3Dk+LoSuZ4crMjpDnI8WGw4GHEM2WwOph8Z9nlEYdqc6xEE0IWXNLGT2Nj2Yo2WpOC1WaXHFVvabeLaRf0NTt3NOX3xrLW5Iw7ig8I3eqw40Y7wggAQcgMpbq5BeHSB8D3NHRxMyLm5aoM8t/y7cGm5yt9wmfzJR/xet4TOf9GkCRAuY+crkJtrw1qYjlYGICBqo7HJ0e+C5NEZVuQxXcVJYF13TdxrgT1J3fnUfpdfmNNFaZB9+vgLGhcnrsz5DddCFUz/Oiz+ClcczoPprsUNj9jFgWTZpyvjVfOHmeDESlY3B3kpoOPF/W+RBhST/ddqQuSH1KH4qeQjFapuIPznTbHX9x0+JR01gEvkvRVdSW3E3w1KGBGvvZXV/knbUnvK4NsI9GC619n6MIvLDcZ9WMKrEEOckbexxP093fSSJEi4CWaFV4xOTV5au4G2+0n/uuHXD4RrzubK1Axh5U/ChtR0ikRMXyQ3aqGNGu/Pvh+rEVG9A3XXWLSVDjpBY0/fA5wH8LsXWqoA6dc/tuop+gtiRDN5lSf36MUHiQ6kUtWc6cfa89IqXq3ZeRWd8bLzn0EBcjS57Ca4042W6O6tCcPOHuTY6833ZhpgCTBpKe3uPysqNSkjhQVtnrjbqVNA4GHMX3EN2kAWS22B/7OUg9OhgA0yWtALtLXh/QRBUX3hzLWbXFBE4SzdsukykYM1v4MMvYg3lMpJs/Zz8xNur3HVENE1/AlX3m5iEqynWDmVYZ1sAfZjYlRGTAHiOJQ2ajH7zTitcNWUKBkMl3T2ggMW2vUGZpcov48QILcrks6o7KSGlbllqo6cZ/d2rlK3O2NUmTKXCFmt4HK7DNA1fscfZs1lEFQCgjLUrTLNvshBIrfz3omS0H7pTXyGfyur37+xj4NuqYxz6IWUU9+PfBBiDvakqkjJgkThMgu/DrhiWtanMfGQSQ71jdLpeHf4wLRb/Z9NSmNIbVfKm+MmGoQSvrUDgvhpSWdHquvOe4cwLzUntKgkXYUDXHPispZZ73jkNX8aIBsZJsrWbgLqT/qthJuptqPih5dqXgG/foA=KVST19bj9p/46Bsf',
            '13P+lI4qxyu2CiwB1VEP+iReic8fLGka7Hhs//RlIVISXzvlZK4k1daeW851GzMoqn4y6nnErAy9nTTF23PZ5nOjKcboJcUA96vGQSqIczZVpDvfhQCt6OQ1XG6wYPbuCx+PHYdVcU7g+xnbSgL0Ll1GLDgTRpGrr5QiqZa1e89iS3ozEgiTSZzMV2y61GDNhsxdLlPeEs6G9fX2SXzeA4sTLcPylrcG61ycz7AScDV3pClaB94epVU2s3P+3X1EB8ZFcrk5dxSKbzb8NlImOFucmHOqgB3kEUUBDA1swo0PSvqRoEuzgynIAfPPKBym60tX2k7A/B3jV2VrqqnZz+DaXpWc69BOwoZRz4z+x7Apwukgk7DYUtTxiVmTZxR9wTBhadVPJ1P6jhRWZdawmWGiXsTAApbSptOe0yVEJvnhcUuoPzYRk34EHcztuwEbduTKVz4YfQAKlDuXc+QpR7PcifBinCeiJ1Bpdjg6wvGTXV042kBTEQIO0T49f076ckh50lnSNTapA/9JjiFvMARXeRR5yBd+JNpBRIChTMi4Cq1CMAYhie+3nEBhOVI44OhPuBzD/EFN6e4eoHpi+CcUyt32Hmfb0Z9HCa9Y+K7W9dBLDi/eQzfuS5EFCmdV56FujoDtgNPdXjzjZL0HzNHLa3/nrPs7W+UWT53yNK7NpjzIAPJyVl4iF7BZ5OiSVOoo0nWtUaZJXgbWgjjLS7Lawee6NzEJgNOpf9FFq9rvfIm10x5ZCMXDUwThCY6AtdeeGWHZ9Gv/IBErWNcGsIX8A5nDGH5fK9aw5WY4dX68xDgubfzRnwVMGU34O/DykszC5TxGs3vjZ+4CoQ97gB7E4Ur4BfP9k9HFmwnMfvOCHcYGLSKYr4nYQQmLvjDwK6T4YpXM8S3WmDbbiKsNKqRpYhn1nWCFX/wn3VpxDfzd6kiEk6FqJbJcwPM9pl8cs0eti/SvKZTY2iL8B51nwwNUZSQq5APzzgno3+CTrsuDRozqUJXytc2A/Y6e2yX7wf4tfVa5DrWdiRlXQ5AwrjOgwEMa3Mi/R8T2GteOjB/6+JqNoeT5mgYOJeK8ZPgJHve9QEReTnHTWpB3Kpg7hg==27IdQBA1M/U6I207',
            'tPp6Nms4Y22Dz/sO5UYLHNQlc4EoIWDogCTYFSM1gks6t/x5oYzV8y7WEJKcDEO1RS3Em0HFviWnyxCFbO3nLIR7u9JAsahgb6QreEkOdtMPFWXjZAHXd0/2Hv3WljoRib7nhEepnNclg4TXBMw6M3sp/3qZnIXMAGrEcmslaBssJrKob2Ps5Jluvqo0DvIo51LhkkVtIQao0Ug8LrAC+2as7tmJVUO49fkeCJ47JclC2pkfM+TCbZCjDgV3BIosAW8KForafhZolHWYGj0ILx0YSvCGfOAenrz1hPgBm0+Nnsmxp9QmjYb49wZVDJ3UmvLzey0VuBbZwWMUjbnBv3ZkAvVjvlGDdqeY0eYaUEOA0o0DV3j7nViNSQ8h/6vQ6i2/3CWW0COfmGpBYCN+EPA9CUBYnnaobDiS4chZrX3krcXXfI9qMwvvsER39DvXy4Amg3/EhmVby04cu+5r18ASRmWIK4WXyX6bz0Bqy8e223l8TNFa+YYy5I3pUP6R/9RKI3ArY9qNhO51EjU6yH39v6GO9OyyQBEfa9Mqe7YTsX14LbAjxC9rJiAg8jaiIvr2osbAPLpXf+/HRnAy4Vo74do6UsMzkk7HyO6HWxocidNy6R9jaIczFkWEYMnJRGttjLhE6FaidHJgARsVIGJcsNQ51wZ0juEWcS0QcbcoxHh0ePbRDzA0xx5HdGwDuZD6/09ae8hrmxB7vpzoL4l8ze7Se+J90kld5SI7i1pfgLZLFnoUk2oYzF5utMynew0ZkoA4Yyv8btYbH83i9YOZGzl7p553sIxe1LN8THgFofRyA3p62DnaeacVcfhEv04p439XuSjOlbXjhBkfizjjKc5CarvhMv3qTPx6jw48+A3mSzmEiNVqPQ75UqxjB6yDitbNP3t76Arn0qRjQ+NlyKkUq4Ukl3UZ2337onu9s1NttIxPPXt9Bb8ljfONWQZ4v5PI+Rp0MJraZhXyHPl4Ew+/xn4Bt0QjnqJ1VOCoy/ia459PhG7GG2Mac7K9NdPkS9dH3Y2cyZUI3aN+LfdhpcvaYOw6eyHcqh6LGX1wgpXiIIrwLHpEDKKXAE1C9tnTczf+zccOqHzKIBfYg8nb4gc=nucDkACvsDA9b9m2',
            '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qpquzwDDfLRT0bGQ'
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