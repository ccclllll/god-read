var http = require('https');
var querystring = require('querystring');
var cheerio = require('cheerio')

var post_data = querystring.stringify({
    searchkey: '完美世界'
});


var post_options = {
    host: 'www.xbiquge.la',
    port: '443',
    path: '/modules/article/waps.php',
    method: 'post',
    headers: {
        'Content-length': post_data.length,
        'Content-Type': 'application/x-www-form-urlencoded',
        origin: 'https://www.xbiquge.la',
        referer: 'https://www.xbiquge.la/paihangbang/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36',
        Cookie: 'Hm_lvt_8744b58bc1913cae0d8c4dc68f187d61=1645064904; Hm_lpvt_8744b58bc1913cae0d8c4dc68f187d61=1645064904; UM_distinctid=17f05825ece170-0fc41db3d2cc65-576153e-1fa400-17f05825ecfe28; CNZZDATA1280571925=947800082-1645056310-https%253A%252F%252Fwww.baidu.com%252F%7C1645056310; coupletAlllength=5; coupletAll=1; CNZZDATA1280571999=128033872-1645056495-https%253A%252F%252Fwww.baidu.com%252F%7C1645056495; Hm_lvt_b48494e860b198c9c71009978cfc755e=1645064905; Hm_lpvt_b48494e860b198c9c71009978cfc755e=1645064905; richviews_5531=o%252F1jtkm%252BfzyDQi40o6eiYcLaqiXZBkI%252BCnNjmd9iOQ7T4948FruMDe6ByKA%252FFP6%252B%252Ftg4VUj4jGIlVaSHh4XyqRIJLC6sfZYfiD7QFdPeKLuJobRMWry%252F37hi24sC6qldXhYSs9Z0a7KjuZtbnzRKt2EwR96YJ1j8PWVWOMmTSfuq1UmtzyIQv%252F5nSwNcCBCweMB%252BCZdu4Eu%252BEh0T2VOBtHZuGMkCIvTiAwGOiERUjbKfc1Ai1jTXe5A%252BeDO%252B6UfCEBam%252FIbFXJvUwekZhXxrfr8vjvrjuencLD4vHVbHWxR8e6aY2saw3DKGtI5KtpIyHdsssoE%252B38vsYQmg5Su8pg%253D%253D; 5531_2578_180.153.145.214=1; Hm_lvt_169609146ffe5972484b0957bd1b46d6=1645064905; Hm_lpvt_169609146ffe5972484b0957bd1b46d6=1645064912'
    }
};


//Setuptherequest
var post_req = http.request(post_options, function (res) {
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应头: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        var $ = cheerio.load(chunk);
        console.log($('tr')[1].children[0].next.children[0].children[0])
    });
    res.on('end', () => {
      console.log('响应中已无数据。');
    });

});

post_req.write(post_data);

post_req.end();
