const express = require("express");
const mongoose = require("mongoose");
const users = require("../MOCK_DATA.json");
const fs = require("fs");
const { type } = require("os");

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
app.get("/users", (req, res) => {
  const html = `
  <ul>
    ${users.map(user => `<li>${user.first_name + " " + user.last_name}</li>`).join("")}
  </ul>`;
  res.send(html);
})

//Rest api routes
app.get("/api/users", (req, res) => {
  return res.json(users);
})

app
  .route("/api/users/:id")
  .get((req, res) => {
    //get user with id
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.json(user);
    }
  })
  .patch((req, res) => {
    //edit user with id
    const id = Number(req.params.id);
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      const updatedUser = { ...users[userIndex], ...req.body };
      users[userIndex] = updatedUser;
      fs.writeFile("../MOCK_DATA.json", JSON.stringify(users), (error, data) => {
        return res.json({ status: "User Updated Successfully", user: updatedUser });
      });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  })
  .delete((req, res) => {
    //delete user with id
    const id = Number(req.params.id);
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      fs.writeFile("../MOCK_DATA.json", JSON.stringify(users), (error, data) => {
        return res.json({ status: "User Deleted Successfully", id });
      });
    } else {
      return res.status(404).json({ error: "User not found" });
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

  // const newUser = {
  //   id: users.length + 1,
  //   ...body
  // };
  // users.push(newUser);
  // fs.writeFile("../MOCK_DATA.json", JSON.stringify(users), (error) => {
  //   if (error) {
  //     return res.status(500).json({ error: "Failed to create user" });
  //   }
  //   return res.json({
  //     status: "User Created Successfully",
  //     id: newUser.id
  //   });
  // });
  // console.log(body);
})


app.listen(PORT, () => { console.log(`server started at port: ${PORT}`) })