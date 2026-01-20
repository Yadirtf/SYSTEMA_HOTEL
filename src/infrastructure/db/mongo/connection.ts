import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Por favor, defina la variable de entorno MONGODB_URI');
}

/** 
 * Global es usado aquí para mantener la conexión cacheada a través de las recargas
 * de funciones serverless en Vercel.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Desactivar el buffering para que falle rápido si no hay conexión
      maxPoolSize: 10,       // Limitar el pool para serverless
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Conexión a MongoDB establecida');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Error conectando a MongoDB:', e);
    throw e;
  }

  return cached.conn;
}
