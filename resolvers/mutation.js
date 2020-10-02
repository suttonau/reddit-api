const { Posts } = require('../models')
const { pubSub } = require('../src/pubSub')

const addPost = async (_, { title, link, imageUrl }) => {
  const post = await Posts.create({
    title,
    link,
    imageUrl
  })
  pubSub.publish('postAdded', {
    postAdded: {
      id: post.id
      title,
      link,
      imageUrl
    }
  })
  return post.id
}

const editPost = async (_, { id, title, link, imageUrl }) => {
  // Post.update filter with where: clause
  // where id === id
  const [updated] = await Posts.update({
    title,
    link,
    imageUrl
  },
  {
    where: { id: id } 
  })
  if (updated) {
    const updatedPost = await Posts.findOne({ where: { id: id }})
    return updatedPost
  }
  throw new Error('Post Not Updated')
}

const deletePost = async (_, { id }) => {
  const deleted = await Posts.destroy({
    where: { id: id }
  })
  if (deleted) {
    return id
  }
  throw new Error('Post not deleted')
}

module.exports = {
  postAdded,
  editPost,
  deletePost
}