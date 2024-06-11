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
            fName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    args: true,
                    msg: constants.ERROR_MESSAGES.DUBLICATE_EMAIL,
                },

            },
            otp: {
                type: DataTypes.STRING,
                allowNull: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            lastLogin: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
        },
        {
            createdAt: 'registerationDate',
            updatedAt: false
        }
    );
    return studentSchema
}