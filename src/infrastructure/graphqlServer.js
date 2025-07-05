const express = require('express');
const http = require('http');
const cors = require('cors');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServer } = require('@apollo/server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const typeDefs = require('../adapters/input/graphql/typeDefs');
const createResolvers = require('../adapters/input/graphql/resolvers/userResolver');
const container = require('../config/container');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

async function startServer() {
  const app = express();
  const resolvers = createResolvers(container);

  // 🔧 Middleware necesario
  app.use(cors());
  app.use(express.json()); // <- este es el importante para evitar el error

  // Ruta de redirección para GitHub OAuth
  app.get('/callback', (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send('No se proporcionó el código');
    res.redirect(`${FRONTEND_URL}/login?code=${code}`);
  });

  // 🧠 Apollo Server con Federation
  const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  });

  await server.start();

  // Contexto con autenticación JWT
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');

        if (!token) return { user: null };

        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          return { user: decoded };
        } catch (err) {
          console.warn('Token inválido');
          return { user: null };
        }
      },
    })
  );

  const httpServer = http.createServer(app);
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor GraphQL listo en http://localhost:${PORT}/graphql`);
    console.log(`🔁 Callback activo en /callback`);
  });
}

module.exports = { startServer };
