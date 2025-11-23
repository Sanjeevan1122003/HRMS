const express = require("express");
const {authMiddleware} = require("../middlewares/authMiddleware")
const { registerOrganisation, loginUser, logoutUser} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerOrganisation);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);

module.exports = router;
