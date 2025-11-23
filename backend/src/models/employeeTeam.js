module.exports = (sequelize, DataTypes) => {
    const EmployeeTeam = sequelize.define(
        "EmployeeTeam",
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            employee_id: { type: DataTypes.INTEGER },
            team_id: { type: DataTypes.INTEGER },
            assigned_at: { type: DataTypes.DATE, defaultValue: sequelize.literal("NOW()") }
        },
        {
            tableName: "employee_teams",
            timestamps: false
        }
    );

    EmployeeTeam.associate = (models) => {
        EmployeeTeam.belongsTo(models.Employee, { foreignKey: "employee_id" });
        EmployeeTeam.belongsTo(models.Team, { foreignKey: "team_id" });
    };

    return EmployeeTeam;
};
