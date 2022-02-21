const StoryParser = require('./core/StoryParser')
let parser = new StoryParser({
    step: 10
})

function getParser() {
    return parser
}

module.exports = getParser
