module.exports = (sequelize, DataTypes) => {
    const Levels = sequelize.define(
        'Levels',
        {
            idLevel: {
                type: DataTypes.INTEGER,
                comment: 'Level id',
                primaryKey: true
            },
            grade: {
                type: DataTypes.STRING,
                comment: 'Name of grade'
            },
            level: {
                type: DataTypes.INTEGER,
                comment: 'Number of level'
            },
            nbECTS: {
                type: DataTypes.INTEGER,
                comment: 'Number of ECTS for level'
            },
            title: {
                type: DataTypes.STRING,
                comment: 'Title of grade'
            }
        },
        {
            paranoid: true
        }
    );

    Levels.associate = models => {
        Levels.hasMany(models.Trainings, { foreignKey: 'diplomaLevel' });
    };


    return Levels;
};

