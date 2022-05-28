const express = require('express');
const path = require('path');
const db = require('./config/connection');

// import graphql refactored authMiddleware and apollo-server 
const { authMiddleware } = require('./utils/auth');
const { ApolloServer } = require('apollo-server-express');

// import typeDefs and Resolvers
const { typeDefs, resolvers } = require('./schemas')


const PORT = process.env.PORT || 3001;

// create ApolloServer and pass in schema so it knows what API looks like
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// implement new instance of ApolloServer with graphql schema 
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();

  // apply express server as middleware
  server.applyMiddleware({ app });

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }
  // if user makes a get request to any location that doesnt have a specific route, respond with production ready react front end
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  })

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at https://localhost/${PORT}${server.graphqlPath}`);
    });
  });
};

startApolloServer(typeDefs, resolvers);