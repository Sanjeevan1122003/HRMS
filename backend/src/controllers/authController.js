const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { models } = require("../models");
const logAction = require("../utils/logAction");


const generateToken = (userId, orgId) => {
  return jwt.sign({ userId, orgId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const registerOrganisation = async (req, res) => {
  const { orgName, adminName, email, password } = req.body;

  try {
    if (!orgName || !adminName || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existing = await models.User.findOne({ where: { email } });

    if (existing) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const organisation = await models.Organisation.create({
      name: orgName,
    });

    const orgId = organisation.id;

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await models.User.create({
      organisation_id: orgId,
      name: adminName,
      email,
      password_hash: hashedPass,
    });

    const userId = user.id;

    const token = generateToken(userId, orgId);

    res.setHeader("Authorization", `Bearer ${token}`);

    await logAction(
      "Organisation Registered",
      orgId,
      userId,
      { userId, orgId, orgName }
    );

    return res.status(201).json({
      message: "Organisation registered successfully.",
      token,
      orgId,
      userId,
    });

  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password, orgName } = req.body;

  try {
    if (!email || !password || !orgName) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const organisation = await models.Organisation.findOne({
      where: { name: orgName },
    });

    if (!organisation) {
      return res.status(404).json({ error: "Organisation not found." });
    }

    const orgId = organisation.id;

    const user = await models.User.findOne({
      where: { email, organisation_id: orgId },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const token = generateToken(user.id, orgId);

    res.setHeader("Authorization", `Bearer ${token}`);

    await logAction(
      "User Logged In",
      orgId,
      user.id,
      { email, userId: user.id }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      userId: user.id,
      orgId,
    });

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const logoutUser = async (req, res) => {
  const userId = req.user?.userId;
  const orgId = req.user?.orgId;

  try {
    if (!userId || !orgId) {
      return res.status(400).json({ error: "Invalid user session." });
    }

    res.setHeader("Authorization", "");

    await logAction(
      "User Logged Out",
      orgId,
      userId,
      { userId }
    );

    return res.status(200).json({
      message: "Logout successful."
    });

  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  registerOrganisation,
  loginUser,
  logoutUser
};
