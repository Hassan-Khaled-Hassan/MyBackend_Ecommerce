const express = require("express");

const { ProtectAuth, isAllowedTo } = require("../Controller/AuthLogic");
const {
  AddUserAddress,
  DeleteUserAddress,
  GetUserAddresses,
} = require("../Controller/AddressController");

const router = express.Router();

router.use(ProtectAuth, isAllowedTo("user"));

router.post("/addAddress", AddUserAddress);
router.delete("/removeAddress/:AddressId", DeleteUserAddress);
router.get("/MyAddresses", GetUserAddresses);

module.exports = router;
