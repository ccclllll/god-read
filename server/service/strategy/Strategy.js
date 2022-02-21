const Crawler = require('Crawler')

function Strategy(BaseUrl) {
    this.BASE = BaseUrl
}

Strategy.prototype.getCrawler = function (callback) {
    return new Crawler({
        maxConnections: 10,
        retries: 20,
        timeout: 50000,
        rateLimit: 600,
        retryTimeout: 600,
        // 这个回调每个爬取到的页面都会触发
        callback: function (error, res, done) {
            callback(error, res)
            done();
        }
    });
}

/**
 * 得到目录页目录跳转信息
 * @param {*} chapterUrl 
 * @param {*} callback 
 */
Strategy.prototype.getChapter = function (coverUrl, callback) {
    console.log(coverUrl)
    const c = this.getCrawler((error, res) => {
        if (error) {
            callback(null)
        } else {
            var $ = res.$;
            //console.log('211111111111111')
            let chapter = this.parseChapter($)
            // console.log(chapter)
            callback(chapter)
        }
    })
    c.queue([coverUrl]);
}

/**
 * 获得章节小说详细内容
 * @param {*} chapterDetailUrl 
 * @param {*} callback 
 */
Strategy.prototype.getAllChapterDetail = function (chapters, callback) {
    if (chapters.length <= 0) return
    let allContent = ''
    let queueIndex = 0
    let c = this.getCrawler((error, res) => {
        if (error) {
            console.log(error);
            callback(null)
        } else {
            const $ = res.$;
            let detailRes = this.parseChapterDetail($, chapters[queueIndex].name)
            allContent = allContent + detailRes.content
            queueIndex = queueIndex + 1
            if (queueIndex < chapters.length) {
                c.queue(chapters[queueIndex].url);
            } else {
                callback(allContent)
            }

        }
    })

    c.queue(chapters[queueIndex].url);
}


/**
 * 获得章节小说详细内容
 * @param {*} chapterDetailUrl 
 * @param {*} callback 
 */
Strategy.prototype.getSingleChapterDetail = function (chapterUrl, callback) {
    let c = this.getCrawler((error, res) => {
        if (error) {
            console.log(error);
            callback(null)
        } else {
            const $ = res.$;
            let detailRes = this.parseChapterDetail($)
            callback(detailRes)
        }
    })

    c.queue(chapterUrl);
}


module.exports = Strategy