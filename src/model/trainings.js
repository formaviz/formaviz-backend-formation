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
            expertise: {
                type: DataTypes.TEXT,
                comment: 'Training area of expertise'
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
                allowNull: false,
                comment: 'duration of training in nb of years'
            },
            schoolName: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: 'name of school'
            },
            schoolDescription: {
                type: DataTypes.TEXT,
                comment: 'presentation of school'
            },
            schoolAddress: {
                type: DataTypes.TEXT,
                comment: 'address of school'
            },
            schoolPostalCode: {
                type: DataTypes.INTEGER,
                allowNull: false,
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
        Trainings.belongsToMany(models.Levels,  { as: 'admissionLevels', through: 'admLevels', foreignKey: 'idTraining' });
    };

    return Trainings;
};
