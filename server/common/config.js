
const xbiqu = require('../service/strategy/xbiqu')
const sources = {

    xbiqu: {
        name: '新笔趣小说网',
        strategy: xbiqu,
        url: 'https://www.xbiquge.la/'
    }
}

module.exports =  {
    sources
}