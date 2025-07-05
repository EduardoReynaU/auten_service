const express = require('express');
const http = require('http');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServer } = require('@apollo/server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const typeDefs = require('../adapters/input/graphql/typeDefs');
const createResolvers = require('../adapters/input/graphql/resolvers/userResolver');
const container = require('../config/container');

const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

async function startServer() {
  const app = express();
  const resolvers = createResolvers(container);

  // Redirección del code de GitHub al frontend
  app.get('/callback', (req, res) => {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send('No se proporcionó el código');
    }
    res.redirect(`${FRONTEND_URL}/login?code=${code}`);
  });

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });

  await server.start();

  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');

        if (!token) return { user: null };

        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          return { user: decoded };
        } catch (err) {
          console.warn('Token inválido o expirado');
          return { user: null };
        }
      },
    })
  );

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor Apollo Subgraph corriendo en http://localhost:${PORT}/graphql`);
    console.log(`🔁 Redirección /callback activa`);
  });
}

module.exports = { startServer };
