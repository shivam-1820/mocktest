const { DataTypes } = require('sequelize');
const constants = require('../../../helper/constant');

module.exports = (dbConfig, Sequelize) => {
    const studentEnrollmentSchema = dbConfig.define('studentEnrollment',
        {

            enrollmentId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            studentId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            academicPaperId: {
                type: Sequelize.UUID,
                allowNull: true,
            },
            type: {
                type: DataTypes.ENUM(
                    constants.ENROLLMENT_TYPE.FREE,
                    constants.ENROLLMENT_TYPE.PURCHASED
                ),
                allowNull: false
            },
            isTrial: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            paid: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            expiryDate: {
                type: DataTypes.DATE,
                allowNull: true
            },
        },
        {
            createdAt: 'purchaseDate',
            updatedAt: false,
        }
    );
    return studentEnrollmentSchema
}