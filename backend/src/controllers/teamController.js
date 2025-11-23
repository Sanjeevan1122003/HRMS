const { models } = require("../models");
const logAction = require("../utils/logAction");
const { Op } = require("sequelize");

async function getTeams(req, res) {
    const orgId = req.user?.orgId;
    const userId = req.user?.userId;

    try {
        const teams = await models.Team.findAll({
            where: { organisation_id: orgId },
            order: [["created_at", "DESC"]],
        });

        await logAction("teams_fetched", userId, orgId, { count: teams.length });

        return res.status(200).json({
            message: "Teams fetched successfully.",
            data: teams,
        });

    } catch (err) {
        console.error("getTeams Error:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}

async function createTeam(req, res) {
    const { name, description } = req.body;
    const orgId = req.user?.orgId;
    const userId = req.user?.userId;

    try {
        if (!name) {
            return res.status(400).json({ error: "Team name is required." });
        }

        const exists = await models.Team.findOne({
            where: { name, organisation_id: orgId },
        });

        if (exists) {
            return res.status(409).json({ error: "A team with this name already exists." });
        }

        const team = await models.Team.create({
            name,
            description,
            organisation_id: orgId
        });

        await logAction("team_created", userId, orgId, {
            team_id: team.id,
            name
        });

        return res.status(201).json({
            message: "Team created successfully.",
            data: team,
        });

    } catch (err) {
        console.error("createTeam Error:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}

async function updateTeam(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;
    const orgId = req.user?.orgId;
    const userId = req.user?.userId;

    try {
        const team = await models.Team.findOne({
            where: { id, organisation_id: orgId }
        });

        if (!team) {
            return res.status(404).json({ error: "Team not found." });
        }

        if (name) {
            const duplicate = await models.Team.findOne({
                where: {
                    name,
                    organisation_id: orgId,
                    id: { [Op.ne]: id }
                }
            });

            if (duplicate) {
                return res.status(409).json({
                    error: "Another team with this name already exists."
                });
            }
        }

        const oldData = team.toJSON();

        await team.update({
            name: name || team.name,
            description: description || team.description
        });

        await logAction("team_updated", userId, orgId, {
            team_id: id,
            before: oldData,
            after: team
        });

        return res.status(200).json({
            message: "Team updated successfully.",
            data: team,
        });

    } catch (err) {
        console.error("updateTeam Error:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}

async function deleteTeam(req, res) {
    const { id } = req.params;
    const orgId = req.user?.orgId;
    const userId = req.user?.userId;

    try {
        const team = await models.Team.findOne({
            where: { id, organisation_id: orgId }
        });

        if (!team) {
            return res.status(404).json({ error: "Team not found." });
        }

        await team.destroy();

        await logAction("team_deleted", userId, orgId, {
            team_id: id
        });

        return res.status(200).json({
            message: "Team deleted successfully.",
        });

    } catch (err) {
        console.error("deleteTeam Error:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}

async function assignEmployeesToTeam(req, res) {
    const { teamId } = req.params;
    const orgId = req.user?.orgId;
    const userId = req.user?.userId;
    let { employeeId, employeeIds } = req.body;

    try {
        if (employeeId) employeeIds = [employeeId];
        if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
            return res.status(400).json({ error: "employeeId or employeeIds[] is required." });
        }

        const team = await models.Team.findOne({ where: { id: teamId, organisation_id: orgId } });
        if (!team) return res.status(404).json({ error: "Team not found." });

        let assigned = [];
        let skipped = [];

        for (let empId of employeeIds) {
            const emp = await models.Employee.findOne({
                where: { id: empId, organisation_id: orgId }
            });

            if (!emp) {
                skipped.push({ empId, reason: "Employee not found" });
                continue;
            }

            const exists = await models.EmployeeTeam.findOne({
                where: { employee_id: empId, team_id: teamId }
            });

            if (exists) {
                skipped.push({ empId, reason: "Already assigned" });
                continue;
            }

            await models.EmployeeTeam.create({
                employee_id: empId,
                team_id: teamId
            });

            assigned.push(empId);

            await logAction(
                "employee_assigned_to_team",
                userId,
                orgId,
                { employee_id: empId, team_id: teamId }
            );
        }

        return res.status(200).json({
            message: "Assignment completed.",
            assigned,
            skipped
        });

    } catch (err) {
        console.error("assignEmployees Error:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}

async function assignEmployeesData(req, res) {
    const { teamId } = req.params;
    const orgId = req.user?.orgId;

    try {
        if (!teamId || isNaN(teamId)) {
            return res.status(400).json({ error: "Valid teamId is required." });
        }

        const team = await models.Team.findOne({
            where: { id: teamId, organisation_id: orgId }
        });

        if (!team) {
            return res.status(404).json({ error: "Team not found." });
        }

        const assignedEmployees = await models.EmployeeTeam.findAll({
            where: { team_id: teamId },
            include: [
                {
                    model: models.Employee,
                    where: { organisation_id: orgId },
                    attributes: ["id", "first_name", "last_name", "email", "phone"]
                }
            ]
        });

        const employees = assignedEmployees.map((item) => ({
            employee_id: item.Employee.id,
            first_name: item.Employee.first_name,
            last_name: item.Employee.last_name,
            email: item.Employee.email,
            phone: item.Employee.phone,
            assigned_at: item.assigned_at
        }));

        return res.status(200).json({
            message: "Assigned employees fetched successfully.",
            employees
        });

    } catch (err) {
        console.error("assignEmployeesData Error:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}

async function unassignEmployeesFromTeam(req, res) {
    const { teamId } = req.params;
    const orgId = req.user?.orgId;
    const userId = req.user?.userId;

    let { employeeId, employeeIds } = req.body;

    try {
        if (employeeId) employeeIds = [employeeId];
        if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
            return res.status(400).json({ error: "employeeId or employeeIds[] is required." });
        }

        const team = await models.Team.findOne({
            where: { id: teamId, organisation_id: orgId }
        });

        if (!team) return res.status(404).json({ error: "Team not found." });

        let removed = [];
        let skipped = [];

        for (let empId of employeeIds) {
            const exists = await models.EmployeeTeam.findOne({
                where: { employee_id: empId, team_id: teamId }
            });

            if (!exists) {
                skipped.push({ empId, reason: "Not assigned" });
                continue;
            }

            await exists.destroy();
            removed.push(empId);

            await logAction(
                "employee_unassigned_from_team",
                userId,
                orgId,
                { employee_id: empId, team_id: teamId }
            );
        }

        return res.status(200).json({
            message: "Unassignment completed.",
            removed,
            skipped
        });

    } catch (err) {
        console.error("unassignEmployees Error:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}
module.exports = {
    getTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    assignEmployeesToTeam,
    assignEmployeesData,
    unassignEmployeesFromTeam
};
