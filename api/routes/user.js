const express = require("express");
const User = require("../models/user");

const router = express.Router();


//Routes
// router.get("/users", async (req, res) => {
//   const allDbUsers = await User.find({});
//   const html = `
//   <ul>
//     ${allDbUsers.map(user => `<li>${user.firstName + " " + user.lastName} - ${user.email} - ${user.isActive ? "Online" : "Offline"}</li>`).join("")}
//   </ul>`;
//   res.send(html);
// })

router.route("/")
  .get(async (req, res) => {
    const allDbUsers = await User.find({});
    return res.json(allDbUsers);
  })

  .post(async (req, res) => {
    const body = req.body;

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

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      console.log("User = ", user);
      if (user === null) {
        return res.status(404).json({ error: "User not found" });
      } else {
        return res.json(user);
      }
    } catch (error) {
      console.error("Error retrieving user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  })

  .patch(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.json(user);
    }
  })

  .delete(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.json({ status: "User Deleted Successfully" });
    }
  })


module.exports = router;
