require('dotenv').config();
const { startServer } = require('./graphqlServer');
const connectDB = require('./database');

(async () => {
  await connectDB();
  await startServer();
})();
