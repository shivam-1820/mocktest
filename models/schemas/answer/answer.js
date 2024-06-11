const { DataTypes } = require('sequelize');
const constants = require('../../../helper/constant')

module.exports = (dbConfig, Sequelize) => {
    const answerSchema = dbConfig.define('answer',
        {

            answerId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            textEn: {
                type: DataTypes.STRING,
                allowNull: false
            },
            textHi: {
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
            type: {
                type: DataTypes.ENUM(
                    constants.CONTANT_TYPE.IMAGE,
                    constants.CONTANT_TYPE.TEXT,
                    constants.CONTANT_TYPE.BOTH
                ),
                allowNull: false

            },
            image: {
                type: DataTypes.STRING,
                allowNull: true
            },
            isImportant: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            answerStatus: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            createdAt: false,
            updatedAt: false,
        }
    );
    return answerSchema
}