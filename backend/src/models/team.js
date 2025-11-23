module.exports = (sequelize, DataTypes) => {
    const Team = sequelize.define(
        "Team",
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            organisation_id: { type: DataTypes.INTEGER },
            name: { type: DataTypes.STRING, allowNull: false },
            description: DataTypes.TEXT,
            created_at: { type: DataTypes.DATE, defaultValue: sequelize.literal("NOW()") }
        },
        {
            tableName: "teams",
            timestamps: false
        }
    );

    Team.associate = (models) => {
        Team.belongsTo(models.Organisation, { foreignKey: "organisation_id" });

        Team.belongsToMany(models.Employee, {
            through: models.EmployeeTeam,
            foreignKey: "team_id"
        });
    };

    return Team;
};
