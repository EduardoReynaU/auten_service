const express = require('express');
const http = require('http');
const { ApolloServer } = require('@apollo/subgraph'); // Cambiado a Apollo Federation
const { buildSubgraphSchema } = require('@apollo/subgraph');
const jwt = require('jsonwebtoken');
const typeDefs = require('../adapters/input/graphql/typeDefs');
const createResolvers = require('../adapters/input/graphql/resolvers/userResolver');
const container = require('../config/container');

const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

async function startServer() {
  const app = express();
  const resolvers = createResolvers(container);

  // 🔁 Ruta para redirigir el code de GitHub al frontend
  app.get('/callback', (req, res) => {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send('No se proporcionó el código');
    }
    res.redirect(`${FRONTEND_URL}/login?code=${code}`);
  });

  // 📦 Crear esquema federado
  const schema = buildSubgraphSchema({ typeDefs, resolvers });

  // 🚀 Servidor Apollo federado
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');

      if (!token) return { user: null };

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return { user: decoded };
      } catch (error) {
        console.warn('Token inválido o expirado');
        return { user: null };
      }
    }
  });

  await server.start();
  server.applyMiddleware({ app });

  const httpServer = http.createServer(app);
  const PORT = process.env.PORT || 3000;

  httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor GraphQL federado en http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🔁 Redirección /callback activa`);
  });
}

module.exports = { startServer };
