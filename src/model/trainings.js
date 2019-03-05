module.exports = (sequelize, DataTypes) => {
    const Trainings = sequelize.define(
        'Trainings',
        {
            idTraining: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                comment: 'Training id',
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                comment: 'Training name',
                allowNull: false,
                set(val) {
                    this.setDataValue(
                        'name',
                        val.toUpperCase()
                    );
                }
            },
            description: {
                type: DataTypes.TEXT,
                comment: 'Training description'
            },
            admLevel: {
                type: DataTypes.TEXT,
                comment: 'Eligible training backgrounds'
            },
            partTime: {
                type: DataTypes.BOOLEAN,
                comment: 'true if part-time course'
            },
            logoPath: {
                type: DataTypes.STRING,
                comment: 'Uri to training logo'
            },
            link: {
                type: DataTypes.STRING,
                comment: 'link to training page'
            },
            duration: {
                type: DataTypes.INTEGER,
                comment: 'duration of training in nb of years'
            },
            schoolName: {
                type: DataTypes.STRING,
                comment: 'name of school'
            },
            schoolDescription: {
                type: DataTypes.TEXT,
                comment: 'presentation of school'
            },
            schoolPostalCode: {
                type: DataTypes.INTEGER,
                comment: 'school city CP'
            },
            schoolCity: {
                type: DataTypes.STRING,
                comment: 'school city'
            },
            lowestScore: {
                type: DataTypes.INTEGER,
                comment: 'lowest score of training'
            },
            highestScore: {
                type: DataTypes.INTEGER,
                comment: 'highest score of training'
            },
            averageScore: {
                type: DataTypes.FLOAT,
                comment: 'average score of training'
            },
        },
        {
            paranoid: true
        }
    );

    Trainings.associate = models => {
        Trainings.hasMany(models.Ratings, { foreignKey: 'trainingId'});
    };

    return Trainings;
};