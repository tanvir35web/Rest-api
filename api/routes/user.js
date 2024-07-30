const express = require("express");
const User = require("../models/user");
const { handleGetAllUsers, handleGetUserById, handleUpdateUserbyId, handleDeleteUserbyId, handleCreateNewUser } = require("../controllers/user");

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

router
  .route("/")
  .get(handleGetAllUsers)
  .post(handleCreateNewUser)

router
  .route("/:id")
  .get(handleGetUserById)
  .patch(handleUpdateUserbyId)
  .delete(handleDeleteUserbyId)


module.exports = router;
