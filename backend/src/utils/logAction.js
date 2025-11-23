const { models } = require("../models");

async function logAction(action, userId, orgId, meta = {}) {
    const timestamp = new Date().toISOString();

    const actionMessages = {
        user_logged_in: `User '${userId}' logged in`,
        user_logged_out: `User '${userId}' logged out`,

        employee_created: `User '${userId}' added a new employee with ID ${meta.employee_id}`,
        employee_updated: `User '${userId}' updated employee ${meta.employee_id}`,
        employee_deleted: `User '${userId}' deleted employee ${meta.employee_id}`,

        employee_assigned_to_team: `User '${userId}' assigned employee ${meta.employee_id} to team ${meta.team_id}`,
        employee_unassigned_from_team: `User '${userId}' removed employee ${meta.employee_id} from team ${meta.team_id}`,

        team_created: `User '${userId}' created a new team with ID ${meta.team_id}`,
        team_updated: `User '${userId}' updated team ${meta.team_id}`,
        team_deleted: `User '${userId}' deleted team ${meta.team_id}`,

        employees_fetched: `User '${userId}' fetched all employees`,
        employee_fetched_single: `User '${userId}' fetched employee ${meta.employee_id}`,

        teams_fetched: `User '${userId}' fetched all teams`
    };

    const readableMessage =
        actionMessages[action] || `User '${userId}' ${action}`;

    console.log(`[${timestamp}] ${readableMessage}.`);
    
    try {
        await models.Log.create({
            action,
            user_id: userId,
            organisation_id: orgId,
            meta,
            timestamp,
        });
    } catch (err) {
        console.error("Log insert error:", err.message);
    }
}

module.exports = logAction;
