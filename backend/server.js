const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./src/routes/auth.js");
const employeeRoutes = require("./src/routes/employees.js")
const teamRoutes = require("./src/routes/teams.js")
const logsRoutes = require("./src/routes/logs.js")


dotenv.config({ quiet: true });

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.FRONT_END_URL, credentials: true }));

app.use("/api/auth", authRoutes)

app.use("/api/employees", employeeRoutes);

app.use("/api/teams", teamRoutes)

app.use("/api", logsRoutes)

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
