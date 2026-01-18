import mongoose from 'mongoose';

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/systemhotel';

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error: any) {
    console.error('Error de conexión a MongoDB:', error.message);
    // No lanzamos error para que la app no se rompa, solo avisamos
  }
};
