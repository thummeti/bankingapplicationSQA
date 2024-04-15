import User from "../models/user.mjs"
import bcrypt from "bcryptjs";

export const setUpAdmin = async () => {
    User.findOne({ username: "admin" }).then(user => {
      if (!user) {
        const hashedPassword = bcrypt.hashSync("password", 10);
        const newUser = new User({
          username: "admin",
          password: hashedPassword,
          email: "admin@gmail.com",
          account: null,
          role: "admin"
        });
        newUser.save();
      }
    });
  };