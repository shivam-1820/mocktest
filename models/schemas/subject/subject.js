const { DataTypes } = require('sequelize');

module.exports = (dbConfig, Sequelize) => {
    const subjectSchema = dbConfig.define('subject',
        {

            subjectId: {
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
                allowNull: true
            },
            descriptionEn: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            descriptionHi: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            subjectStatus: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            createdAt: false,
            updatedAt: false,
        }
    );
    return subjectSchema
}