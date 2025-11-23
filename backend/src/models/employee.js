module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define(
        "Employee",
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            organisation_id: { type: DataTypes.INTEGER },
            first_name: DataTypes.STRING,
            last_name: DataTypes.STRING,
            email: DataTypes.STRING,
            phone: DataTypes.STRING,
            created_at: { type: DataTypes.DATE, defaultValue: sequelize.literal("NOW()") }
        },
        {
            tableName: "employees",
            timestamps: false
        }
    );

    Employee.associate = (models) => {
        Employee.belongsTo(models.Organisation, { foreignKey: "organisation_id" });

        Employee.belongsToMany(models.Team, {
            through: models.EmployeeTeam,
            foreignKey: "employee_id"
        });
    };

    return Employee;
};
