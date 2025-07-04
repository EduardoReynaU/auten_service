const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

module.exports = async function connectDB() {
  try {
    const fullUri = `${MONGODB_URI}/${DB_NAME}`;
    await mongoose.connect(fullUri, {
      dbName: DB_NAME
    });

    console.log(`✅ Conectado a MongoDB con Mongoose: ${fullUri}`);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB', error);
    process.exit(1);
  }
};
