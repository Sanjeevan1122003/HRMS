const { models } = require("../models");
const logAction = require("../utils/logAction");

async function createEmployee(req, res) {
    const { first_name, last_name, email, phone } = req.body;
    const orgId = req.user?.orgId;
    const userId = req.user?.userId;

    try {
        if (!first_name || !last_name || !email || !phone) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const exists = await models.Employee.findOne({
            where: { email, organisation_id: orgId }
        });

        if (exists) {
            return res.status(409).json({ error: "Employee with this email already exists." });
        }

        const employee = await models.Employee.create({
            first_name,
            last_name,
            email,
            phone,
            organisation_id: orgId
        });

        // LOG ACTION (order fixed)
        await logAction(
            "employee_created",
            userId,
            orgId,
            { employee_id: employee.id, first_name }
        );

        return res.status(201).json({
            message: "Employee data added successfully.",
            data: employee
        });

    } catch (err) {
        console.error("createEmployee Error:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}

async function getEmployeesData(req, res) {
    const orgId = req.user?.orgId;
    const userId = req.user?.userId;

    try {
        const employees = await models.Employee.findAll({
            where: { organisation_id: orgId }
        });

        await logAction(
            "employees_fetched",
            userId,
            orgId,
            { count: employees.length }
        );

        return res.status(200).json({ data: employees, message: "Successfully fetched employees data." });

    } catch (err) {
        console.error("getEmployees Error:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}

async function getEmployeeData(req, res) {
    const { id } = req.params;
    const orgId = req.user?.orgId;
    const userId = req.user?.userId;

    try {
        const employee = await models.Employee.findOne({
            where: { id, organisation_id: orgId }
        });

        if (!employee) {
            return res.status(404).json({ error: "Employee not found." });
        }

        await logAction(
            "employee_fetched_single",
            userId,
            orgId,
            { employee_id: id }
        );

        return res.status(200).json({ data: employee, message: "Employee data fetched successfully"});

    } catch (err) {
        console.error("getEmployeeData Error:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}

async function updateEmployeeData(req, res) {
    const { id } = req.params;
    const { first_name, last_name, email, phone } = req.body;
    const orgId = req.user?.orgId;
    const userId = req.user?.userId;

    try {
        const employee = await models.Employee.findOne({
            where: { id, organisation_id: orgId }
        });

        if (!employee) {
            return res.status(404).json({ error: "Employee not found." });
        }

        const oldData = employee.toJSON();

        await employee.update({
            first_name: first_name || employee.first_name,
            last_name: last_name || employee.last_name,
            email: email || employee.email,
            phone: phone || employee.phone
        });

        await logAction(
            "employee_updated",
            userId,
            orgId,
            { employee_id: id, before: oldData, after: employee }
        );

        return res.status(200).json({
            message: "Employee updated successfully.",
            data: employee
        });

    } catch (err) {
        console.error("updateEmployee Error:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}

async function deleteEmployee(req, res) {
    const { id } = req.params;
    const orgId = req.user?.orgId;
    const userId = req.user?.userId;

    try {
        const employee = await models.Employee.findOne({
            where: { id, organisation_id: orgId }
        });

        if (!employee) {
            return res.status(404).json({ error: "Employee not found." });
        }

        await employee.destroy();

        await logAction(
            "employee_deleted",
            userId,
            orgId,
            { employee_id: id }
        );

        return res.status(200).json({
            message: "Employee deleted successfully."
        });

    } catch (err) {
        console.error("deleteEmployee Error:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}



module.exports = {
    createEmployee,
    getEmployeesData,
    getEmployeeData,
    updateEmployeeData,
    deleteEmployee
};
