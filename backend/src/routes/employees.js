const express = require("express");
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createEmployee, getEmployeesData, getEmployeeData, updateEmployeeData, deleteEmployee} = require("../controllers/employeeController")

const router = express.Router();

router.post("/", authMiddleware, createEmployee);
router.get("/", authMiddleware, getEmployeesData)
router.get("/:id", authMiddleware, getEmployeeData)
router.put("/:id", authMiddleware, updateEmployeeData)
router.delete("/:id", authMiddleware, deleteEmployee)

module.exports = router