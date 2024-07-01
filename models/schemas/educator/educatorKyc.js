const { DataTypes } = require('sequelize');
const constants = require('../../../helper/constant');

module.exports = (dbConfig, Sequelize) => {
    const educatorKycSchema = dbConfig.define('educatorKYC',
        {
            educatorKycId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            educatorId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            avatar: {
                type: DataTypes.STRING,
                defaultValue: constants.DEFAULT.USER_IMAGE
            },
            dob: {
                type: DataTypes.STRING,
                allowNull: false
            },
            degree: {
                type: DataTypes.STRING,
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
            specialization: {
                type: Sequelize.UUID,
                allowNull: true
            }
        }, {
        createdAt: false,
        updatedAt: false,
    });
    return educatorKycSchema;
}