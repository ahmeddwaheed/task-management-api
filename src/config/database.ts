import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/task-management';

async function connectToDatabase() {
  try {
    await mongoose.connect(uri);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); 
  }
}

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

export { connectToDatabase };