var Crawler = require("crawler");
const fileHelper = require('../utils/txtFileHelper')
const async = require('async')

function StoryParser(options) {
    let {
        step
    } = options
    this.step = step
}



/**
 * 构建获取章节列表的并行函数列表
 * @returns parallel
 */
StoryParser.prototype.getChapterParallel = function (corverUrl, storyStrategy) {
    let parallel = {}
    parallel[1] = function (cb) {
        storyStrategy.getChapter(corverUrl, (res) => {
            cb(null, res)
        })
    }
    return parallel
}

/**
 * 构建获取章节内容的并行函数列表
 * @param {*} chapters 
 * @returns 
 */
StoryParser.prototype.getChapterDetailParallel = function (chapters, storyStrategy, step = 10) {
    let that = this
    let parallel = {}
    for (let index = 0; index < chapters.length;) {
        let end = (index + step) < chapters.length ? (index + step) : chapters.length
        let list = chapters.slice(index, end)
        let _index = index
        parallel[_index] = function (cb) {
            storyStrategy.getAllChapterDetail(list, (res) => {
                cb(null, res)
            })
        }
        index = end
    }
    return parallel
}

StoryParser.prototype.run = function (chapterUrl, storyStrategy, cb) {
    const that = this
    let chapterParallel = this.getChapterParallel(chapterUrl, storyStrategy)
    const waterfallList = [
        // 获取所有章节
        function (done) {
            console.log('正在获取章节列表...')
            async.parallel(chapterParallel, function (err, result) {
                console.log('获取章节列表成功...')
                done(err, result) //将结果写入result
            });
        },
        function (result, done) {
            let chapters = []
            for (let key in result) {
                chapters = [...chapters, ...result[key].chapters]
            }
            let contentParallel = that.getChapterDetailParallel(chapters, storyStrategy, that.step)
            console.log('正在获取小说内容...')
            async.parallel(contentParallel, function (err, result) {
                console.log('获取小说内容成功...')
                done(err, result) //将结果写入result
            });
        },
    ];
    async.waterfall(waterfallList, (error, result) => {
        let storyContent = ''
        for (let key in result) {
            storyContent += result[key]
        }
        cb && cb(storyContent)
    });
}


/**
 * 为保证下载成功，采用分段下载的策略
 * @@param {number} step 每段下载几页的内容
 */
StoryParser.prototype.downloadStory = function (chapterUrl, storyStrategy) {
    let start = new Date()
    console.log('开始...')
    return new Promise((resolve, reject) => {
        this.run(chapterUrl, storyStrategy, (content) => {
            let end = new Date()
            console.log('小说生成成功，总耗时:' + (end.getTime() - start.getTime()))
            resolve(content)
        })
    })
}

StoryParser.prototype.search = function (searchKey, storyStrategy) {
    return new Promise((resolve, reject) => {
        storyStrategy.search(searchKey, (res) => {
            resolve(res)
        })
    })

}

/**
 * 所有章节
 * @param {*} chapterUrl 
 * @param {*} cb 
 */
StoryParser.prototype.allChapters = function (coverUrl, storyStrategy) {
    return new Promise((resolve, reject) => {
        storyStrategy.getChapter(coverUrl, (res) => {
            resolve(res.chapters)
        })
    })

}

/**
 * cover
 * @param {*} chapterUrl 
 * @param {*} cb 
 */
 StoryParser.prototype.cover = function (coverUrl, storyStrategy) {
    return new Promise((resolve, reject) => {
        storyStrategy.getChapter(coverUrl, (res) => {
            resolve(res)
        })
    })

}

/**
 * 单章节内容
 * @param {*} chapterUrl 
 * @param {*} cb 
 */
StoryParser.prototype.chapterContent = function (chapterUrl, storyStrategy) {
    return new Promise((resolve, reject) => {
        storyStrategy.getSingleChapterDetail(chapterUrl, (res) => {
            resolve(res)
        })
    })
}


module.exports = StoryParser