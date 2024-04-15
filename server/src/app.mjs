// app.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";

// Routes
import AccountRouter from "./routes/AccountRoutes.mjs";
import AuthRouter from "./routes/AuthRoutes.mjs";
import CardRouter from "./routes/CardRoutes.mjs";

// Models
import User from "./models/user.mjs";

const app = express();

// Session setup
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);


// Admin setup
setUpAdmin();

// CORS setup
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust according to your frontend app's location
    credentials: true,
  })
);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
import passportConfig from './passportConfig.mjs'; // Adjust the path as necessary
import { setUpAdmin } from "./config/config.mjs";
passportConfig(passport);

// Logging middleware for debugging purposes
app.use((req, res, next) => {
  console.log(req.url);
  console.log(req.headers);
  console.log(req.body);
  console.log("---------------------------------");
  next();
});

// Routes setup
app.use("/", AccountRouter);
app.use("/", AuthRouter);
app.use("/", CardRouter);

export default app;
