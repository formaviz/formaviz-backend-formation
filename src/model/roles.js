module.exports = (sequelize, DataTypes) => {
    const Roles = sequelize.define(
        'Roles',
        {
            idRole: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                comment: 'Role Id',
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                comment: 'Role name'
            }
        },
        {
            paranoid: true
        }
    );


    Roles.associate = models => {
        Roles.belongsToMany(models.Users, { through: 'UsersRoles' });
    };

    return Roles;
};
