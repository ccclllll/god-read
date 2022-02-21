const router = require('koa-router')()
const {
  sources
} = require('../common/config')
const {
  download
} = require('../service/story')
const getParser = require('../service/story')
// 搜索
router.get('/search', async (ctx, next) => {
  ctx.set('Content-type', 'application/json')
  let {
    source,
    searchKey
  } = ctx.query
  // console.log(ctx.query.source)
  let strategy = sources[source].strategy
  if (!source) {
    ctx.body = {
      code: 200,
      success: false,
      data: null,
      message: '小说源设置错误'
    }
  } else {
    let result = await getParser().search(searchKey, strategy)
    console.log(result)
    ctx.body = {
      code: 200,
      success: true,
      data: result,
      message: '成功'
    }
  }
})

// 获取所有源
router.get('/sources', async (ctx, next) => {

  ctx.body = body = {
    code: 200,
    success: true,
    data: sources,
    message: '成功'
  }
})

// 获取所有章节
router.get('/chapters', async (ctx, next) => {
  let {
   coverUrl,
    source,
  } = ctx.query
  let result = await getParser().allChapters(coverUrl, sources[source].strategy)
  ctx.body = body = {
    code: 200,
    success: true,
    data: result,
    message: '成功'
  }
})



// 获取所有章节
router.get('/cover', async (ctx, next) => {
  let {
   coverUrl,
    source,
  } = ctx.query
  let result = await getParser().cover(coverUrl, sources[source].strategy)
  ctx.body = body = {
    code: 200,
    success: true,
    data: result,
    message: '成功'
  }
})

// 获取单章节详情
router.get('/chaptercontent', async (ctx, next) => {
  let {
    chapterDetailUrl,
    source,
  } = ctx.query
  let result = await getParser().chapterContent(chapterDetailUrl, sources[source].strategy)
  ctx.body = body = {
    code: 200,
    success: true,
    data: result,
    message: '成功'
  }
})

// 下载小说
router.get('/download', async (ctx, next) => {
  let {
    storyName,
    source,
    chapterUrl
  } = ctx.query
  console.log(storyName)
  let Readable = require('stream').Readable;
  let stream = new Readable();
  stream._read = function noop() {}; // redundant? see update below

  let content = await getParser().downloadStory(chapterUrl, sources[source].strategy)
  let filename = storyName
  filename = encodeURI(filename, "GBK")
  filename = filename.toString('iso8859-1')
  stream.push(content)
  stream.push(null);
  ctx.set('Content-disposition', 'attachment; filename=' + filename)
  ctx.set('Content-type', 'application/force-download')
  ctx.body = stream
})

module.exports = router