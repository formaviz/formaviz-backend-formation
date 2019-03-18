module.exports = (sequelize, DataTypes) => {
  const Ratings = sequelize.define(
    'Ratings',
    {
      idRating: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        comment: 'Rating id',
        primaryKey: true
      },
      comment: {
        type: DataTypes.TEXT,
        comment: 'User comment'
      },
      score: {
        type: DataTypes.INTEGER,
        comment: 'User rating',
        allowNull: false
      }
    },
    {
      paranoid: true,
        indexes: [
            {
                unique: true,
                fields: ['trainingId', 'userOfRating']
            }
        ]
    }
  );

  return Ratings;
};
