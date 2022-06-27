
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
            '9d1IUqukDdWpZMoIXPVkJeC+XEXvuDGQzWG9K3wNh64sd4NbS9UPj4ncBH9319WbrgZDYsU4yFimzb3OzTlHwrpf35pHyyx9TYu1s/yzpG3ssN1CG89ubSfJHb7b5khWaqDmP8NFphKnCvfn5ukp68nAd9gnYo5SAP2hQApypLH7DB5HVtlnxa66gIiJ5kWHdC1J5QItGymGSFEaW4z/iJNlSMKkZWnN7uGug4fo2cxAvjFZMzCq3efWalb2o1BQ1wUU3ABEmVyIdV7aKP+U7yjlzXetcm4OFHYVAsE/oA/QP7FlB4/hA07nxw36VpiOBkOi13PEnEpwAbdwNyhLr3yOCYavS2BON0+JLCoomYhwsdT58aitWWFMhx35DxT0dIfkptucd3lKi2JLiOHXOJN8F/tsT6gBDZzX8Kvvr1zxDBeO2nbN2G1UgM/c739tEzFgCeHX6vR41bJnaQzbenWrIvQZK5/ClgionPZfqp9LL3dgUsBeIpeZRNYM4A+usAN5MRyoiMjuhmaZW0/rWw/e1k/k8EWj5UCCbmC9q0SliaR3n9jpit3hAAnN5S4N2+Nt8Nv9CgALARancM5LWjrHj2B/spX8cKOZlN5S0hGWOJoX63x02sG7+mqvcwel3FTx7ecKn2XcZDbiV4ptJJ11m2nE4bx1Y7cn7UVkZru26ReHywmcfoS96xvPFnKSRqw0XpJDg5EBKGUiRKWuypUyLRQR4XhfdGmQlfTN+7LlyE599yiP/UtH4TVBVvoZ8nnjdP4waTvsUqO0SSv+ADPhAu5TK4ZAqL+RF9jnUpnrgWGfHuS8BYfXPix1k270F0/sQ51vyS9kzRsP59kMwCBaYUdO/A5ILkBtUaTmX/ynJxsVlQEyxZcWF8d1JqrX2zmer0X5tuyiJGPlai+l5Ucl0AiAZY8gmZDrMlNAKv89746DPgjSea20C/893dmoXcy8r2PEJdNIMYK3fIVDW+n6zTOdcYSqlpFmrIgycanyYFt9SuL12ra3ZEu9SxMLOfieTpA9PSEvGMlriMLM++D/qmm9iDx7QfDWTCHm9NdA/1iBv2p1QZmSMydPG4WQhcCJaA==tL6oajCNrJlvD24f',
            '7EgsETsD4L/iDlPA1sIfXh79nyLnH6G74z/lO5rAOA1QTmyLN2VPnwrS7hTP8mNyHuHz4xeLOnAbvdShTrnIHlW17PuubrL4ioAX7vbJWGlyFlgXstPJ6zK5Wwr6EREiHKEyFbkdCWhCGPay4bwBWGlesXcx9EfJmeqf6x3RYVxC54YMfH42Rub2XhH947jNmOA7RY7jSP3FKb4E4a5AoRgNxdy4O0X7kqeoi2IyoeKOE0CYcLJzNZWuxTG3ABdqlzhqrXaP6emPoeFIJ01mIVsr8vXXau6hTaRqWt+2ImWN6NHMBqqgvVUjAwycxJbbvwT3BFB8WFkgqP2BFtQu9nvRazxC1/GXgVBodpeJNIuSrInKR78w83jnXSlLGMvpZCyTOOg3tvgYsEpLPrpYr0uJyZdKlwyWfligaOWG8Wn390xTtdw1kZMz7BoTFk+b52L35/xClxlWtjEUUA/IuqjCv2kpXc5kaY6NvQV8gwebk5kr0FhF65+qi6OjQdqiZ0SZPUtkLEfPdWYJK/y35UHHPG7UVMFArElVP//fCFhpIZdXUeo3AkMcq+xhcoYgL4D324Rhge1hdf2qKQ0oOqV/lkd53fOXXtd+LXOgf+++I2QXi/2MXegICkzfWvHhWtg67UpbLamRc/mYDZwqrQipyyb4zLubQRlWZXUfP5hSW+DVApwa9W2BfinZdzG8ftc4Im4i/jHCl8p9gojo2erYbdsgAB5tecx3Yr3O2A4yaPJLRljjj8qvNj2VE0tSJ662RY66IAWMNBs/KvYzeVh1HbTYuXpznOy9BrZQdEtNs/y8NocqD359UnU/eGjl9gran0MMdJqwQzucYhYEFTgTQom7jPGtZ7BcOOElratKVco6gr8jEmxm4wAtOiIuspmB+TnjO3SV056wpUv+fow9yUxNLtDyVjNUp2Lds1cAZBcO6pfscgNHY3FngSnv98MDyJqC3vd3zUUxLEkmtoveA0tskMIxfYD2VkmBrUMOQOc2P8n+IvGNyGJWu+aaEs+30jgSKskGCDg4cl74oZEKuL/Es2qyQUEhEjg7IU0O+na1HMOdvtinLRPQX/m8U3YDdOQ5zrJs0/G7JGh0+0ABC/A=r+VidHdYMkn3/x2x',
            'O8Cs+B50fGydiquSTroSy63Nx3UCM1rK6TA3XjncURVxAmMpF/NbIJek8OCn4QJ9IDXZLPUi6iIIsAAeh2WU+ejfTa8xXp3glNtMFd3KgWZaur25TWrs4wBUigS1grd02P242MV/0jl+8gfxCz7xWXdQ2rqAg4aQhEmxftiJMFpKBn0IhtU50qmoMD1erBCRh/MfR3LFRwUWg1zmWgVto1bGV3Lm9dZ8EOeo64zrqzE1zV9TrSKnwwF31V9/cisbDYP0mVinJmy77NTKRHOQvcux3fJgU9f6pIpFn8APol2MfRvYtyW6uLQlsfxc/OcVFRgjYhwAhggOofMWgM/tXRe8CWO5cdquf+WNW2l4uNPN8aArtkxD0Xl58h52ZHOCi0zadRkRNTsMKJa5GAD1yklB3QDT7aHngTXKwIQZZhdHOSE7xQRVUOxIRTjbtgDKKQnu9kTA7hHreerCSHMKoU7ZpZa82HyJBqpCZAFVjSBuQ6fNGmNpEfplAb8dIOFJoaEe7m65nylnZUbIokz2LGi6NrCFexamWZIgszulKNWiogD8JxJaBtGPuHJt7MVlgV5yMhrwpXsmWYA9CnqnEXCMKoRMAa4Fl9ZyfqE4tbH9X1QAv6DqClu1p4ZM0zwjh1bijUUKDWp+VtET6fK7s2rbYsqmwd2mayVERm3NTo7kz0w8jZhFmtvbTK4A6Ri7WwE/QxFxt9d2N5OiluSew5b/2S9RR14nQ+NAWrIPbpXcTe9NVYSLn8a/6fQa05CfZeLpgCZWGw0xQETer1yL6RUHFBBhSSLUCZ1X/PT+erx+FIljFuRCiGkakeZ/tfruqUZxtwQYZiHDIqumn00smzwl4Y58R3TzZrW2Afiqdo453g3V+k5m1hiCD9MKFYh6/0mqb7Fcsl2Zn8LcVGTfNd1OCJgkpnF+d0+6ayjgRwwVvccAMl9xWoie8bgAnJiqUEtAqn5LTuWQ4V5Awjn8Bv7SO6MHnrpC3viifH1SvzYI7aAq6TPZB8zrJkQlFxu/TuGrE/9Pe0JkVC57+XQmK1WJ3VcCM07DpRd80FuOhQq7n/GFAX/ZGJ4tAGrj/cMedQs9tQERYNxO3p5v',
            '7QTVBdokA4qR43TYyb/q0JTT14P9+EKDBR+WFVV+bvOpt+M1pb7/m5U+PfvTxv2fqYfXvQSkSouQ93w7YdP6hRzi62uY9RqktCYJhn/GbnY7KxDEMl6AsOLku0ajdZyabNdbu7leeWfoCZk0FKJfAyg9CuW9o5QEJPxJXe+mBQS7VTbZj00SYhiD9YczZeXFnDw65xXljNhx3Mk37Z5SjWcWcztxipZQmx2UBx7OY+0a3ZiieyOvyynpzO262sHJCITKALjFO1nFmQ86j40kA9pO/C8ikedAtIudvp6oihdO8eeRc2uyLBaP96ekS3zEbUfKRrwMCmuALLYpQJFQKWhc73E6DUk0OuUNFTRXtQx8S3l0G4ysxTfrUH8jnUyUW55VXX+puJxa5rhwJldMwvB6iM3IA4SVBCyvgiN32qhyvZNeHYV+Aka/7mRN7K2r5ygqMFSmPRGV5BvoNCOvh5oZ1CoGTP0tTK7B0kgGLhjXS0xbO9Dx0rhvjjuueC4Aio3pBF++K3h8uhreFcV7WAIE1b/zg7K+ISScIngt1rAbHLkto9/DGIvWOe0lB+Sw653Nq1QdaUotb5kEFitJz0y4cUVqhyFsfvIIBVGa2osaPF5Lnv6eD3mVKnVZpiFaJ1n8YpF9EDgLXFFNbhxA1tp6sopzFDGlif192TONeZY9TsvxzHVDY/n3klAlVDLvkKViuLTlQhLSkh42hEeGV+pIFrGfJNARo9kyNtC9Zy29TBTtJDriSLzBLwn2p1GNKjqlspCQrh+Ezr9gHAqDJQCnGJf3e1PlKU6sZDTiEjyZrESXDJ7M2/hNWt7FMhxhfKX39Z6OJMX844C4fslbDRoRkj/z2YE5g4b5SOCJUcdvUC2VYMLMW62lj3HdTpt4zYZgV74zN/BLPqzf93bbaIfGjMUFYTqACyRnD0M3G4PhKpuCEktz6zT8AflVaW7pEm3R2mrP38xC81D4LqR8v2LDgchZy88+59qAkAn+jR9NtzRKLQck8TrwNhGtDgTrFi+xzqJQprnxA7OHmLqoZODrDmGf18AMNxPI0y9XOaHpUNUN',
            'hbRc8hsjjq9Pft1lt+ii0HRlQlpAgYvfS8lI0P2MhdbkdqnY0KDtk81whmLb5lp83n3qdFmevHggBSK+92rEAEokhaRbwKfKQIDfhk47N29cllXdmAHdW3HFH6UmEvQEDW+sBce6vJJIYCCI7ytbEgTdRuGJ/U10mFsxLEd2C+YnXC7PQlVfABGTSI8+NlAXuktqrkYA05wKziL6ZrhOQFBZeFtF9GWv2QpHJjoJnDMNpDdR3/dxeujJS8d4QXHwElAb2G7ZCXge8DEieZNO2t6qvhht57A3MOpfSpddsMMnwJ0596/Sy8ED+ie9RhfgDE7AVUDR5U0A3rOWpcRiB2Hn5Mts9BL3GrgFcCSv0/ez533BAsontA4VnMUJ5xW+/ZWMJj3IkUIoorq5V4ZJ7o2P6ZQihXrLz+2pbNMrhuXzhfC7gG4D3Cma3Ql/dz5i1drBLIe03XZD51Qeek0G849tEgQGYqayGE5K0/m4sdhnKpl6DegU2WKA8ub45D+aJGcby/9JSjDYaWb20lR6tF7DBcW2qrcYxPrDnG9JOM4fYRYoGLyWTMKEQADauJPvuv0LMUZhITtuXUw65ABaPnJ/CswyNh6Kdo81PYW0PT9eTufvCKChJ6UQy7+uJVqKz1OTeGEbh4ysDnN/3fPwHX6G/Z30uxVZFG2iqO58vfFYib6Uk9jhe5zGArXbzRy0BU79qaVrUB/in8CR/OZH8TX2BazYJIkuEacxck5PfvZmDY5glFQQenMxJSzCIsHpzSGV0GR5VDzmu4WxKBzSThT11f81V0r6jg9NiiLagfGrer8OXNbXxKlJcbGqYuJJtdXF26BqdNghCk3qmsGm5fRkfQM/tNTBzJx1Ki1iuwmCO2AjpnBUXnSeLLBhKql8mIDXg8VxawKAxCeSaV7J9sdbXplEmxjGhgmX/Dd2zx74rokQH3JBQ2vBprRlPAk7Wm9f/4hW3mRtUtuWxEmDw0XWiV9hkSNt4FkSGXJBwszLvsbqNV1Ko/FMfGLG2zulZgQpmHflKRHMKytDnRLRiYTOsBUKLJ9JiKN+w5tnVnuC+lQq8NHyz0dtAbRYD4eKPm6L4dwEkc/aHbPA'
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