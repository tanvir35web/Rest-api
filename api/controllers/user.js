const User = require("../models/user");


async function handleGetAllUsers(req, res) {
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
}

async function handleGetUserById(req, res) {
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
}

async function handleUpdateUserbyId(req, res) {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  } else {
    return res.json(user);
  }
}

async function handleDeleteUserbyId(req, res) {
  const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.json({ status: "User Deleted Successfully" });
    }
}

async function handleCreateNewUser(req, res) {
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

    return res.status(201).json({ massage: "Success", id: result._id });
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserbyId,
  handleDeleteUserbyId,
  handleCreateNewUser,
}