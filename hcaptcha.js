
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
            '12Nb6dLJ0Iji9yZ/EVrE1jKYDGnNz9VKWUKY147BNlz2zFnkHrEbqznFqtUrYY3qUtholxtspASdeUlyeauc3nps7KXO1g8vsIBbpVP+kYRtFhTImMqJLj2KZKe3NcoqIehQqclvDt01fodnoOE/MFPSQp3N/VctIIhXJH4z/Y1fxEkeLJtGqyJBXj3ET9FsYssLySC55pEahRSIUkXek57946ZWpDXRPsSzbukL8J9uUaBQWT7w0smb5qE9UotfcDpwh3xYunWuX69TPUpjGJTRAFdAyOQvEIob2bI30SWzq1K82h3rSu07EiHtyKedAIs61M1EyY0S/20rGQ6Bum3yAQ137zU2hx2q8na8I5vXGrNy9zS3f1UvdZK0f9hVlGEWxAmh1mc4UxJsxtpCS0eidrmscZzS2GYLG3AtspplO6paDjIqo+eVY1Dk5MmJ4zvPXffCAqcjePXo/h9+y7Qd4KC7VBLQZE9Cb2UeVXefN0vKrF54qV45adTUSi+V6FMQQNj8CpbbFw702cdOdzXXFBXTjykK7XkIynuOkAY70wf9UdHAEygEqqUn29OaPK5BStQbyh2XDSMOMSOR41s+psYrAjsqa9mEcSn4qdfwW9YMVEtmb3AOjUstWyCMkqrdsbkf8+6fVruVTCmJLepuFilG5iUCjk/NbBzvtYVCnPVfbNL3HPnK9S8IB7E2cMO8ZQj0FDrcRGfdsr27fXku/t7dDL1gkXppicvpLFvb27ZgZD8eQgg9qWkHTn8dAquHGUlGh7TkBRLBp8Uu7uS6UbQsW53ylQrWwTfGq1tKULYgAqFXMnIdF+uRRCQMzs3DoCq3yW8ktQWla6qG8pOQqPShkHoF+bjJnyhSuYlwGA7HZDL4LOEJLzRa256v5PSv6movV+eb4LUcJYnKf3hWG015gvRLhjh9mhxIJXoYsB6dRUNDvJ0xpVjaCXYtFzvwR9aP1B+Rbz04PtH0nX2srhOuBjjoPj5kHXymysKhW+Hu03ODTfVnQ2kOtABJ+A4nQyAueiZ9swmfCJaFkwEYm5dJzCxj/8T0RTBKuSHvFtJdYXR1xLnnRyCWeO9ZVFq47fpOSEreysYeqkO0Ytv2w9XUMx0T0FmDI0qVrgSSDzip',
            'X45FwJcSiZJDoYqPzgs5uq/CKPO/Hq2HUsd/OjCm7iWkZHJkiDHTo9ZRdNbPXmx2oep12E7aMGF1zQ9d3iAc2zyFfV57q1Flm5X2SJx6Q21gJUAc7FvZMPiMVYPfr7TRw9PJIlC1gbUyWFp6Sfr/4isYUzQQsd8rby/jFKSckqVE5GhscLEZ45fZzZZYzZWZ9s7VtB7Oyu19s2g30FqTb4DYd5BU/O0DU4mUleLEB7eIfU2udKtPbtHHs5Nfaz/ZfAp6QTt4nSWJ8y1CfxfF+TWZ8XDfnU53AbKkNa6d+G/1uKk/5jj02zQ9U5nq5xmv2q6isV8eos/7/iLfdp0diHGVLwvFMEAPjQ20dlYBBB9UIxhHL7xg8JBp4QZ+xADvNoQtW38g+wXtX5IAeT06thnklM0eVZAmYbWiLzpSy1nOxJhblRdyFOr9LYgfRJLsBG8lCWEnSUwjFocLZnBIuM+jHu14m493d598K+rGt/mA4kUfqCkF2v0oL4QHOPBvgKvGN/Y2rBvvuAQMhVJloEtu6llKgeQV3/kZfDHtf9aOoXNrADKHD3deil2m67AP1fG8UWDzwbI3VyxtdzP46oM/r/y4RjS8gcyR+E0gUkhe26h1f4GPgSe2MfuExe6bObt5+miYUPj+/Oa0bHwpNSuT7JH6Nr3Vhb3zCnZeWNwy2dqeSVpySajiNXXrc4aZ5zquiTCHL6X1FwhjATA4+2d2bd3BKQsHj3chgUOxdrR/L91246UX5AtGCIvamuf+wsmyDKa1ZwnBXdMpmYTwWhhzwaYDX8sQetcK5+TGWBIiOnv6xz07lllBHVN04k3ayFGZKp0L1TsbPdTUxx2+MXNDg8tWmP1nbmmCqE7Nq7m4Vmz/auWpPLkzbqYnyDNBYq0g2QuUZhSJqpQt+nvT9iYX7ZHNB7gz8BRM67DPG5MZ+IWWJIzs0v5sDyJGsWTCc8pbamkst3sUm24YsF5f4oQfcPMEQ1UXfXZwuhdEzvLC5ar0XmY+0C9R/CliGvBwPlhNvKGfSYJN2z9fohZ1sirjsVp/zDRikiKz9Ay4JKgjdroSLKdijkRgnzAKgpdIp2woJg==4iNzpm5OLa90I5aR',
            'fMgyb1Q1AfXWP4n02F5ZN9YPe0o3COovXTw2pfeFEUKvBIw9NnQqwkyURvOFoJapHVwWT2vmgQTIKvVRfoEI3zkJOOOqy6pM4MVcxq71d7o+p2fEAuXJ8qdVKmiMXB8G7NtJRjuCYMjm0/1NSLi32l5bp430WWC0eJ233p7e+Hz1E93UeS39/jiSIx7OadFBfzXk6wibA0sWBMfyPL5YnRGDTkPUAkPj2pSNTtKY2EkCD4mYlg033W9wWQ76nUz+hYs6eQc6majufMSa7zE1St3EtCPDPUZT64zNNLXtrDXQKnIS77/XQSA+TL0lIKrx+exjDsWXtJX9k4z1Tg2eKZro0jPUyX10JtBbj0ogyFToQW31OHS+ktHlxnHnCEuBS9NqnXfmyIL15AjKcPHsQA9yoLl/bTqEMnawQ38YO+VNxhA/mrI761gN6QUzHlvDMCObSIk9oMRRB4f39Ob0fagpqfDi2yannpn0/1k7fXLioNigIipWYZDRmQbqo7LaOPPuQF8063q8jd9ba3L6aH5oCgXqJjQWF1dVfKjU+z2NOTyauym6TYTF9nv5nsaQM+h/q6oOahhL0f5FkL1f3L3JS1mAHfrRYXxVQvWg/vfwRHST7/3uz7miAUwvaBq3Ptra5TdUn1sWaIbf4nVUTE7JwSxscsP4L/kzx36QQc+8RqAcNqguJRQ3LQjs1dguIJQOxJ2tORB4L1OSp0GekpuqwP72gc5q63DdTuOboD1H7UDZT1yQnOVsWXDtnfU//MpVP9bMtWnKusSKbg83Zrdm0IGRG9Yj59AmQlb/gd1LuHhXyiPVHwKUuzJiDhp4pnweGoGW9EJQa3bPqPGKYb0emH04caVlkOPDWKgBplK6iTcx62Ukdf+mmdJiLe5xZrICNUwzlxEGwg9Th2Wp2CPoC81hIo8V/ZlWVIRSgiD659jt+qkuQh9mJvXSD5emW+lT2hK+iZkK9NGmoyRb9W27yFyqtotLzDqAtpfD44jqUQhq/UJzHgKOWH8tu05BuczRALRmyBh/Qaomc5VBhTChYlETbAdNR0Mc2TT+cdV+SudvIz7dgw==ZSTvEBDU9Ez44q+M',
            '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Unp0Kl5H4ajgtsi6'
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