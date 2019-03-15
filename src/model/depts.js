module.exports = (sequelize, DataTypes) => {
    const Depts = sequelize.define(
        'Depts',
        {
            idDept: {
                type: DataTypes.STRING,
                comment: 'Dept id',
                primaryKey: true
            },
            deptName: {
                type: DataTypes.STRING,
                comment: 'Dept name'
            },
            idRegion: {
                type: DataTypes.STRING,
                comment: 'Region id'
            },
            regionName: {
                type: DataTypes.STRING,
                comment: 'Dept name'
            }
        },
        {
            paranoid: true
        }
    );


    Depts.associate = models => {
        Depts.hasMany(models.Trainings, { foreignKey: 'deptId' });
    };

    return Depts;
};
