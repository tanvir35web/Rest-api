const express = require("express");
const users = require("../MOCK_DATA.json");
const fs = require("fs");

const app = express();
const PORT = 8000;

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

app.post("/api/users", (req, res) => {
  // create or add a new user
  const body = req.body;

  // validate input data
  if (!body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.ip_address ||
    !body.job_title ||
    !body.country ||
    !body.is_active) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newUser = {
    id: users.length + 1,
    ...body
  };

  users.push(newUser);

  fs.writeFile("../MOCK_DATA.json", JSON.stringify(users), (error) => {
    if (error) {
      return res.status(500).json({ error: "Failed to create user" });
    }
    return res.json({
      status: "User Created Successfully",
      id: newUser.id
    });
  });
  console.log(body);
})


app.listen(PORT, () => { console.log(`server started at port: ${PORT}`) })