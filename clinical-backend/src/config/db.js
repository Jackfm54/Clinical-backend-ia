const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB connecté sur : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur de connexion à MongoDB : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
