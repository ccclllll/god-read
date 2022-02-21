const Strategy = require('./Strategy')
const {
    inherit
} = require('../utils/common')

const {
    search
} = require('./utils')

function XibiquStrategy(BaseUrl) {
    Strategy.call(this, BaseUrl)
}

inherit(XibiquStrategy, Strategy)


/**
 * 解析详细内容
 * @param {*} $ 
 * @param {*} url 
 * @returns 
 */
XibiquStrategy.prototype.parseChapterDetail = function ($, title = '') {

    //let title = $('.bookname').children()[0].children[0].data
    //console.log(title)
    let content = $('#content')
    let contentStr = '    '
    content[0].children && content[0].children.forEach((child, index) => {
        if (index > 1 && child.data) {
            contentStr = contentStr + child.data + '\r\n'
        }
    })
    contentStr = '    ' + title + '\r\n' + contentStr 
    contentStr = contentStr.replace(/NaN/g, '')
    return {
        title,
        content: contentStr
    }
}


/**
 * 解析目录页dom
 * @param {*} $ 
 * @returns 
 */
XibiquStrategy.prototype.parseChapter = function ($) {
    let res = []
    let children = $("#list").children()
    // console.log(children[0])
    children[0].children.forEach(child => {

        if (child.children && child.children[0]) {
            let item = child.children[0]
            //console.log(item)
            let resObj = {
                url: this.BASE.replace(/\/$/, '') + item.attribs['href'],
                name: item.children[0].data
            }
            res.push(resObj)
        }
    })

    let bookImg = $("#fmimg").children()[0].attribs['src']
    let desc =  $("#intro").children()[1].children[0].data
    let author =  $("#info").children()[1].children[0].data
    let bookName =  $("#info").children()[0].children[0].data
    return {
        bookImg,
        author,
        bookName,
        desc,
        chapters: res
    }
}

/**
 * 搜索
 * @param {*} key 
 * @returns 
 */
XibiquStrategy.prototype.search = function (searchkey, cb) {

    search({
        postData: {
            searchkey
        },
        host: 'www.xbiquge.la',
        path: '/modules/article/waps.php',
        port: '443',
        success: ($) => {
            let trs = $('tr')
            let books = []
            // 解析dom
            for (let index = 0; index < trs.length; index++) {
                if (index > 0) {
                    let book = {}
                    let trChildren = trs.get(index).children
                    for (let index = 0; index < trChildren.length; index++) {

                        let tag = trChildren[index]

                        if (tag.name == 'td' && tag.attribs['class'] == 'even') {
                            if (tag.children[0].name == 'a') {
                                book.bookCoverUrl = tag.children[0].attribs.href
                                book.bookName = tag.children[0].children[0].data
                            } else {

                                book.author = tag.children[0].data
                            }
                        }

                        if (tag.name == 'td' && tag.attribs['class'] == 'odd') {
                            if (tag.children[0].name == 'a') {
                                book.newChapterUrl = tag.children[0].attribs.href
                                book.newChapter = tag.children[0].children[0].data
                            } else {
                                book.date = tag.children[0].data
                            }
                        }
                    }

                    books.push(book)
                }
            }
            cb(books)
        },
        fail: () => {
            cb(null)
        }

    })

}


module.exports = new XibiquStrategy('https://www.xbiquge.la/')