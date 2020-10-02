const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const { execute, subscribe } = require('graphql')
const { createServer, request } = require('http')
const { makeExecutableSchema } = require('graphql-tools')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const cors = require('cors')
const bodyParser = require('body-parser')
const resolvers = require('../resolvers')
const { pubSub } = require('./pubSub')

const port = process.env.PORT || 4000

const typeDefs = gql`
  type Post {
    title: String!
    link: String!
    imageUrl: String!
    id: ID!
  }
  type Query {
    posts: [Post]
  }
  type Mutation {
    addPost(title: String!, link: String!, imageUrl: String!): ID
    editPost(id: ID!, title: String!, link: String!, imageUrl: String!): Post
    deletePost(id: ID!): ID
  }
  type Subscription {
    postAdded: Post
    postEdited: Post
    postDeleted: ID
  }
`

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const apolloServer = new ApolloServer({
  schema,
  context: request => {
    return {
      ...request,
      pubSub   
    }
  }
})

const app = express()
const server = createServer(app)
apolloServer.applyMiddleware({ app })
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

server.listen({ port }, () => {
  console.log(`Server is running at http://localhost:${port}`)
  new SubscriptionServer({
    schema,
    execute,
    subscribe,
    keepAlive: 10000
  },
  {
    server: server
  })
})