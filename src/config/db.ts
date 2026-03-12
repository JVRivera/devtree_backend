import mongoose from "mongoose";
import colors from 'colors'

export async function connectDB() {
  try {
    // URL para MongoDB local  
    const {connection} = await mongoose.connect(process.env.MONGO_URI);
    const url = `${connection.host}:${connection.port}`
    console.log(colors.yellow.bold(`MongoDB local conectado correctamente en ${url}`));
  } catch (error) {
    console.log(colors.yellow.red(error.message));
    process.exit(1)
  }
}