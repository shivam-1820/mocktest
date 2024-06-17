const { DataTypes } = require('sequelize');
const constants = require('../../../helper/constant');

module.exports = (dbConfig, Sequelize) => {
    const studentAssessmentRecordSchema = dbConfig.define('studentAssessmentRecord',
        {

            assessmentRecordId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            studentId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            courseId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            academicPaperId: {
                type: Sequelize.UUID,
                allowNull: true,
            },
            subjectId: {
                type: Sequelize.UUID,
                allowNull: true,
            },
            chapterId: {
                type: Sequelize.UUID,
                allowNull: true,
            },
            questionId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            selectedAnswerId: {
                type: Sequelize.UUID,
                allowNull: true,
            },
            answerMarkedAs: {
                type: DataTypes.ENUM(
                    constants.ANSWERSTATUS.CORRECT,
                    constants.ANSWERSTATUS.WRONG,
                    constants.ANSWERSTATUS.SKIPPED
                ),
                allowNull: false
            },
            assessmentStatus: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            createdAt: true,
            updatedAt: false,
        }
    );
    return studentAssessmentRecordSchema
}