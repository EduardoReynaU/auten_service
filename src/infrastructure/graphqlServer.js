const { ApolloServer } = require('apollo-server');
const typeDefs = require('../adapters/input/graphql/typeDefs');
const createResolvers = require('../adapters/input/graphql/resolvers/userResolver');
const container = require('../config/container');

async function startServer() {
  const resolvers = createResolvers(container);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await server.listen({ port: process.env.PORT });
  console.log(`🚀 Servidor GraphQL listo en ${url}`);
}

module.exports = { startServer };
