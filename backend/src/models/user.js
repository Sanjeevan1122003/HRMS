module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            organisation_id: { type: DataTypes.INTEGER },
            email: { type: DataTypes.STRING, allowNull: false, unique: true },
            password_hash: { type: DataTypes.STRING, allowNull: false },
            name: { type: DataTypes.STRING },
            created_at: { type: DataTypes.DATE, defaultValue: sequelize.literal("NOW()") }
        },
        {
            tableName: "users",
            timestamps: false
        }
    );

    User.associate = (models) => {
        User.belongsTo(models.Organisation, { foreignKey: "organisation_id" });
    };

    return User;
};
