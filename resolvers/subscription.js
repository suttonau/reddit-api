const { pubSub } = require('../src/pubSub')

const postAdded = {
  subscribe: () => pubSub.asyncIterator('postAdded')
}

module.exports = { postAdded }