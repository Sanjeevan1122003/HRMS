const express = require("express");
const { authMiddleware } = require('../middlewares/authMiddleware');
const {getTeams,createTeam,updateTeam,deleteTeam, assignEmployeesToTeam, unassignEmployeesFromTeam, assignEmployeesData} = require("../controllers/teamController");

const router = express.Router();

router.get("/",authMiddleware, getTeams);
router.post("/", authMiddleware, createTeam);
router.put("/:id", authMiddleware, updateTeam);
router.delete("/:id", authMiddleware, deleteTeam);
router.post("/:teamId/assign", authMiddleware, assignEmployeesToTeam)
router.get("/:teamId/employees", authMiddleware, assignEmployeesData)
router.delete("/:teamId/unassign", authMiddleware, unassignEmployeesFromTeam)

module.exports = router;
