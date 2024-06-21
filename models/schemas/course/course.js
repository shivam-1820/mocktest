const { DataTypes } = require('sequelize');

module.exports = (dbConfig, Sequelize) => {
    const courseSchema = dbConfig.define('course',
        {

            courseId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            nameEn: {
                type: DataTypes.STRING,
                allowNull: false
            },
            nameHi: {
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
            courseStatus: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            image: {
                type: DataTypes.STRING,
                defaultValue: ''
            },
        },
        {
            createdAt: false,
            updatedAt: false,
        }
    );
    return courseSchema
}