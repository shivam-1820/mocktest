const { DataTypes } = require('sequelize');

module.exports = (dbConfig, Sequelize) => {
    const educatorTestSeriesSchema = dbConfig.define('educatorTestSeries',
        {

            testSeriesId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            titleEn: {
                type: DataTypes.STRING,
                allowNull: false
            },
            titleHi: {
                type: DataTypes.STRING,
                allowNull: false
            },
            descriptionEn: {
                type: DataTypes.STRING,
                allowNull: true
            },
            descriptionHi: {
                type: DataTypes.STRING,
                allowNull: true
            },
            educatorId: {
                type: Sequelize.UUID,
                allowNull: false
            },
            examId: {
                type: Sequelize.UUID,
                allowNull: false
            },
            testSeriesStatus: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            createdAt: true,
            updatedAt: false,
        }
    );
    return educatorTestSeriesSchema
}