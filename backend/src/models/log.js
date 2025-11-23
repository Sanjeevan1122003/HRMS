module.exports = (sequelize, DataTypes) => {
    const Log = sequelize.define(
        "Log",
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            organisation_id: DataTypes.INTEGER,
            user_id: DataTypes.INTEGER,
            action: DataTypes.STRING,
            meta: DataTypes.JSONB,
            timestamp: { type: DataTypes.DATE, defaultValue: sequelize.literal("NOW()") }
        },
        {
            tableName: "logs",
            timestamps: false
        }
    );

    Log.associate = (models) => {
        Log.belongsTo(models.Organisation, { foreignKey: "organisation_id" });
        Log.belongsTo(models.User, { foreignKey: "user_id" });
    };

    return Log;
};
