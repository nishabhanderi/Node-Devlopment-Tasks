const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const cors = require ("cors");
const rateLimit = require("express-rate-limit");
const userRoutes = require ("./routes/userRoutes");
const logger = require ("./middleware/loggerMiddleware.js");
const errorHandler = require("./middleware/errorMiddleware.js");


const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.set("trust proxy", 1);   

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:100,
  message: " Too many request,try again later"
});
app.use(limiter);

app.use(logger);

app.use("/",userRoutes);
app.use(errorHandler);


 const MONGO_URL = process.env.MONGO_URL;

 

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


const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`server is listing to port ${PORT}`);
});