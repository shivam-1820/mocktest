const { DataTypes } = require('sequelize');
const constants = require('../../../helper/constant')

module.exports = (dbConfig, Sequelize) => {
    const questionSchema = dbConfig.define('question',
        {

            questionId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            textEn: {
                type: DataTypes.TEXT('long'),
                allowNull: false
            },
            textHi: {
                type: DataTypes.TEXT('long'),
                allowNull: false
            },
            questionType: {
                type: DataTypes.ENUM(
                    constants.CONTANT_TYPE.IMAGE,
                    constants.CONTANT_TYPE.TEXT,
                    constants.CONTANT_TYPE.BOTH
                ),
                allowNull: false

            },
            optionType: {
                type: DataTypes.ENUM(
                    constants.OPTION_TYPE.MULTIPLE_CHOICE,
                    constants.OPTION_TYPE.SHORT_ANSWER,
                    constants.OPTION_TYPE.TRUE_OR_FALSE
                ),
                allowNull: false

            },
            image: {
                type: DataTypes.STRING,
                defaultValue: ''
            },
            isImportant: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            questionStatus: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            createdAt: false,
            updatedAt: false,
        }
    );
    return questionSchema
}