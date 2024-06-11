const { DataTypes } = require('sequelize');

module.exports = (dbConfig, Sequelize) => {
    const questionAcademicPaperAssociationSchema = dbConfig.define('questionAcademicPaperAssociation',
        {

            questionAcademicPaperAssociationId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            questionId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            academicPaperId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            subjectId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            associationStatus: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            createdAt: false,
            updatedAt: false,
        }
    );
    return questionAcademicPaperAssociationSchema
}