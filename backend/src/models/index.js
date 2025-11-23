const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config({ quiet: true });

const DB_URL = process.env.DB_URL?.trim();

if (!DB_URL) {
  console.error("❌ ERROR: DB_URL is missing in environment variables.");
  process.exit(1);
}

const sequelize = new Sequelize(DB_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});


const models = {
  Organisation: require("./organisation")(sequelize, DataTypes),
  User: require("./user")(sequelize, DataTypes),
  Employee: require("./employee")(sequelize, DataTypes),
  Team: require("./team")(sequelize, DataTypes),
  EmployeeTeam: require("./employeeTeam")(sequelize, DataTypes),
  Log: require("./log")(sequelize, DataTypes),
};

Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB Connected Successfully");

    await sequelize.sync({ alter: true });
    console.log("✅ Tables Synced Successfully");
  } catch (err) {
    console.error("❌ Sequelize Init Error:", err);
  }
})();

module.exports = { sequelize, models };

