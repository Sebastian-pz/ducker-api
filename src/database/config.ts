import mongoose from 'mongoose';

const dbConnection = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(
      process.env.MONGO_CNN ? process.env.MONGO_CNN : 'No uri'
    );
    console.log('Database working good! 🎈');
  } catch (error) {
    console.log(`Error starting the database: ${error}`);
  }
};

export default dbConnection;
