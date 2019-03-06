module.exports = (sequelize, DataTypes) => {
    const Roles = sequelize.define(
        'Roles',
        {
            idRole: {
                type: DataTypes.INTEGER,
                comment: 'Role Id',
                primaryKey: true,
                autoIncrement: true
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
