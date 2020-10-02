const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const { execute, subscribe } = require('graphql')
const { createServer, request } = require('http')
const { makeExecutableSchema } = require('graphql-tools')
const { SubcriptionServer } = require('subscriptions-transport-ws')
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
    post: [Posts]
  }
  type Mutation {
    addPost(title: String!, link: String!, imageUrl: String!): ID
    editPost(id: ID!, title: String!, link: String!, imageUrl: String!): Post
    deletePost(id: ID!): ID
  }
  type Subscription {
    postAdded: Post
  }
`

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const apolloServer = new ApolloServer({
  schema,
  context: request => {
    ...request,
    pubSub
  }
})

const app = express()
const server = createServer(app)
apolloServer.applyMiddleware({ app })
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

server.listen({port}, () => {
  console.log("Server is running at http://localhost:4000")
  new SubcriptionServer({
    schema,
    execute,
    subscribe,
    keepAlive: 10000
  },
  {
    server: server
  })
})