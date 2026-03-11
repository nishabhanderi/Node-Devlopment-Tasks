const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const cors = require ("cors");
const rateLimit = require("express-rate-limit");
const userRoutes = require ("./routes/userRoutes");
const logger = require ("./middleware/loggerMiddleware.js");
const errorHandler = require("./middleware/errorMiddlrware.js");


const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 100,
  max:100,
  message: " Too many request,try again later"
});
app.use(limiter);

app.use(logger);

app.use("/api",require("./routes/userRoutes"));
app.use(errorHandler);


 const MONGO_URL = "mongodb://127.0.0.1:27017/internDB";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
    
  }
};
connectDB();


app.get("/", (req,res)=>{
res.send("Hello User");
});


app.listen(8080,()=>{
    console.log("server is listing to port 8080");
});