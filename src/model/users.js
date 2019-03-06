module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      idUser: {
        // Avoid usage of auto-increment numbers, UUID is a better choice
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        comment: 'User Id',
        primaryKey: true
      },
      firstName: {
        type: DataTypes.STRING,
        comment: 'User first name',
        // setter to standardize
        set(val) {
          this.setDataValue(
            'firstName',
            val.charAt(0).toUpperCase() + val.substring(1).toLowerCase()
          );
        }
      },
      lastName: {
        type: DataTypes.STRING,
        comment: 'User last name',
        // setter to standardize
        set(val) {
          this.setDataValue(
            'lastName',
            val.charAt(0).toUpperCase() + val.substring(1).toLowerCase()
          );
        }
      },
      email: {
        type: DataTypes.STRING,
        // Not null management
        allowNull: false,
        comment: 'User email',
        // Field validation
        validate: {
          isEmail: true
        }
      }
    },
    {
      // logical delete over physical delete
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ['email']
        }
      ]
    }
  );

  Users.associate = models => {
      Users.hasMany(models.Ratings, { foreignKey: 'userOfRating' });
      Users.belongsToMany(models.Roles, { through: 'UsersRoles' });
  };

  return Users;
};
