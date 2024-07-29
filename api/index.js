const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const { type } = require("os");
const { ObjectId } = require("mongodb")

const app = express();
const PORT = 8000;

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/employees-db-1")
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("MongoDB Error", error))

//Database Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    lowercase: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  isActive: {
    type: Boolean,
    required: true,
  }
});

//Model for mongos
const User = mongoose.model("user", userSchema)

//Middleware
app.use(express.urlencoded({ extended: false }));

//Routes
app.get("/users", async (req, res) => {
  const allDbUsers = await User.find({});
  const html = `
  <ul>
    ${allDbUsers.map(user => `<li>${user.firstName + " " + user.lastName} - ${user.email} - ${user.isActive ? "Online" : "Offline"}</li>`).join("")}
  </ul>`;
  res.send(html);
})

//Rest api routes
app.get("/api/users", async (req, res) => {
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
})

app
  .route("/api/users/:id")
  .get(async (req, res) => {
    //get user with id
    try {
      const objectId = new ObjectId(req.params.id);
      const user = await User.findById(objectId)
      console.log("User = ", user);
    if (user === null) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.json(user);
    }
    } catch (error){
      console.error("Error retrieving user:", error);
    return res.status(500).json({ error: "Internal server error" });
    }
  })

  .patch(async (req, res) => {
    //update user with id
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.json(user);
    }
  })
  
  .delete(async (req, res) => {
    //delete user with id
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.json({ status: "User Deleted Successfully"});
    }
  })

app.post("/api/users", async (req, res) => {
  // create or add a new user
  const body = req.body;

  // validate input data
  if (!body.firstName ||
    !body.lastName ||
    !body.email ||
    !body.gender ||
    !body.jobTitle ||
    !body.isActive) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const result = await User.create({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    jobTitle: body.jobTitle,
    gender: body.gender,
    isActive: body.isActive,
  })

  console.log("Result: " + JSON.stringify(result));
  return res.status(201).json({ massage: "Success" });

})


app.listen(PORT, () => { console.log(`server started at port: ${PORT}`) })