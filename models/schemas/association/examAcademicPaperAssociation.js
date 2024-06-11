const { DataTypes } = require('sequelize');

module.exports = (dbConfig, Sequelize) => {
    const examAcademicPaperAssociationSchema = dbConfig.define('examAcademicPaperAssociation',
        {

            examAcademicPaperAssociationId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            examId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            academicPaperId: {
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
    return examAcademicPaperAssociationSchema
}