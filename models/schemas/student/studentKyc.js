const { DataTypes } = require('sequelize');
const constants = require('../../../helper/constant');

module.exports = (dbConfig, Sequelize) => {
    const studentKycSchema = dbConfig.define('studentKYC',
        {
            studentKycId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            studentId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            avtar: {
                type: DataTypes.STRING,
                defaultValue: ''
            },
            dob: {
                type: DataTypes.STRING,
                allowNull: false
            },
            degree: {
                type: DataTypes.STRING,
                allowNull: false
            },
            secondaryMarks: {                                       // In percentage
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            higherSecondaryMarks: {                                 // In percentage
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            gender: {
                type: DataTypes.ENUM(
                    constants.GENDERS.MALE,
                    constants.GENDERS.FEMALE,
                    constants.GENDERS.OTHER
                ),
                allowNull: false
            },
            qualification: {
                type: DataTypes.ENUM(
                    constants.QUALIFICATION.GRADUATION,
                    constants.QUALIFICATION.PHD,
                    constants.QUALIFICATION.POST_GRADUATION,
                    constants.QUALIFICATION.TENTH,
                    constants.QUALIFICATION.TWELFTH
                ),
                allowNull: false
            },
            number: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: {
                    args: true,
                    msg: constants.ERROR_MESSAGES.DUBLICATE_PHONE_NUMBER,
                },
            },
        }, {
        createdAt: false,
        updatedAt: false,
    });
    return studentKycSchema;
}