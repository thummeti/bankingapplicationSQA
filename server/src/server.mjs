// server.js
import app from "./app.mjs"; // Adjust the path to your app.js file
import connectDB from "./config/db.mjs";

const PORT = process.env.PORT || 4000;

// MongoDB connection
connectDB("mongodb://127.0.0.1:27017/bank");

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
