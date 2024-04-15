import mongoose from "mongoose";

const connectDB = async (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoCreate: true, 
  });
};

export default connectDB;