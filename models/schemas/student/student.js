const { DataTypes } = require('sequelize');
const constants = require('../../../helper/constant');


module.exports = (dbConfig, Sequelize) => {
    const studentSchema = dbConfig.define('student',
        {

            studentId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    args: true,
                    msg: constants.ERROR_MESSAGES.DUBLICATE_EMAIL,
                }
            },
            isVerifed: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            lastLogin: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            mobile: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: {
                    args: true,
                    msg: constants.ERROR_MESSAGES.DUBLICATE_PHONE_NUMBER,
                }
            },
            gender: {
                type: DataTypes.STRING,
                allowNull: true
            },
            dob: {
                type: DataTypes.STRING,
                allowNull: true
            },
        },
        {
            createdAt: 'registerationDate',
            updatedAt: false
        }
    );
    return studentSchema
}