const express = require("express");
const { connectMongoDb } = require("./connecction");
const { logResReq } = require("./middlewares")
const userRouter = require("./routes/user");

const app = express();
const PORT = 8000;

// MongoDB connection
connectMongoDb("mongodb://127.0.0.1:27017/employees-db-1")
  .then(() => { console.log("MongoDB Connected") })

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(logResReq("log.txt"));


//Routes
app.use("/api/users", userRouter);


app.listen(PORT, () => { console.log(`server started at port: ${PORT}`) })