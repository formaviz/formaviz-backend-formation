module.exports = (sequelize, DataTypes) => {
  const Groups = sequelize.define(
    'Groups',
    {
      title: {
        type: DataTypes.STRING,
        comment: 'Group title'
      },
      description: {
        // keep string datatype because of short description
        type: DataTypes.STRING,
        comment: 'Group description'
      },
      metadatas: {
        type: DataTypes.JSON
      }
    },
    {
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ['title']
        }
      ]
    }
  );

  Groups.associate = models => {
    Groups.belongsToMany(models.Users, { through: 'Member' });
  };

  return Groups;
};
