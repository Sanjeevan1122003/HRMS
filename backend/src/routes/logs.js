const express = require("express");
const router = express.Router();

const {authMiddleware} = require("../middlewares/authMiddleware");
const { logsData } = require("../controllers/logsController");

router.get("/logs", authMiddleware, logsData);

module.exports = router;

