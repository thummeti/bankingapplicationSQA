import mongoose from "mongoose";
const user = new mongoose.Schema({
  username: String,
  password: String,
  email:String,
  role:String,
  account: {
    type: mongoose.Types.ObjectId,
    ref:"Account"
  },
  img:String,
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

export default mongoose.model("User", user);
