import request from './request'
const storyService = {

    // http://172.30.67.69:3000/search?source=xbiqu&searchKey=%E5%AE%8C%E7%BE%8E%E4%B8%96%E7%95%8C
    search: async function (params) {
        return request({
            url: '/search',
            params,
            method: 'get'
        })
    },

    // storyName=%E5%AE%8C%E7%BE%8E%E4%B8%96%E7%95%8C%E4%B9%8B%E9%87%8D%E7%9E%B3%E5%B4%9B%E8%B5%B7&source=xbiqu&chapterUrl=https:%2F%2Fwww.xbiquge.la%2F91%2F91282%2F
    download: async function (params) {
        return request({
            url: '/download',
            params,
            method: 'get'
        })
    },

    // http://124.222.48.100:3000/chapters?coverUrl=https://www.xbiquge.la/25/25430/&source=xbiqu
    chapters: async function (params) {
        return request({
            url: '/chapters',
            params,
            method: 'get'
        })
    },


        // http://124.222.48.100:3000/cover?coverUrl=https://www.xbiquge.la/25/25430/&source=xbiqu
        getCover: async function (params) {
            return request({
                url: '/cover',
                params,
                method: 'get'
            })
        },
    // http://172.30.67.69:3000/chaptercontent?chapterDetailUrl=https://www.xbiquge.la/25/25430/12402762.html&source=xbiqu
    singleDetail: async function (params) {
        return request({
            url: '/chaptercontent',
            params,
            method: 'get'
        })
    },
}

export default storyService