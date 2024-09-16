const express = require("express");
const {
  createUser,
  getUsers,
  getUser,
  EditUser,
  DeleteUser,
  uploadUserImage,
  resizeImage,
  updateUserPass,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require("../Controller/UserLogic");

const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updateUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../Validators/UserValidator");
const { ProtectAuth, isAllowedTo } = require("../Controller/AuthLogic");

const router = express.Router();


router.use(ProtectAuth);

// logged user updateLoggedUserData
router.get(
  "/UserData",
  getLoggedUserData,
  getUser
);
router.put("/changePass", updateLoggedUserPassword);

router.put(
  "/changeUserData",
  uploadUserImage,
  resizeImage,
  updateLoggedUserValidator,
  updateLoggedUserData
);
router.delete("/deleteMe", deleteLoggedUserData);
// =============================
// Admin
router.use(isAllowedTo("admin", "manager"));
router.post(
  "/createUser",
  uploadUserImage,
  resizeImage,
  createUserValidator,
  createUser
);
router.get("/AllUsers", getUsers);
router.get(
  "/Specific-User/:id",
  getUserValidator,
  getUser
);
router.put(
  "/Edit-UserData/:id",
  uploadUserImage,
  resizeImage,
  updateUserValidator,
  EditUser
);
router.put("/Edit-UserPass/:id",updateUserPasswordValidator, updateUserPass);
router.delete(
  "/Delete-User/:id",
  deleteUserValidator,
  DeleteUser
);



module.exports = router;
