module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Groups',
    {
      title: {
        type: DataTypes.STRING,
        comment: 'Group title',
      },
      description: {
        // keep string datatype because of short description
        type: DataTypes.STRING,
        comment: 'Group description',
      },
      metadatas: {
        type: DataTypes.JSON,
      },
    },
    {
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ['title'],
        },
      ],
    }
  );
