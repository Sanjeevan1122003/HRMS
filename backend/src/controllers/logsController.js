const { models } = require("../models");
const { Op } = require("sequelize");

async function logsData(req, res) {
  try {
    const orgId = req.user?.orgId;
    if (!orgId) return res.status(400).json({ error: "Organization not found" });

    const { user_id, action, startDate, endDate, page = 1, limit = 20 } = req.query;
    const where = { organisation_id: orgId };

    if (user_id) where.user_id = user_id;
    if (action) where.action = action;

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp[Op.gte] = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.timestamp[Op.lte] = end;
      }
    }

    const offset = (Number(page) - 1) * Number(limit);

    const logs = await models.Log.findAndCountAll({
      where,
      order: [["timestamp", "DESC"]],
      limit: Number(limit),
      offset,
    });

    return res.json({
      message: "Logs fetched successfully",
      total: logs.count,
      page: Number(page),
      pages: Math.ceil(logs.count / limit),
      data: logs.rows,
    });
  } catch (err) {
    console.error("Logs fetch error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
}

module.exports = { logsData };

