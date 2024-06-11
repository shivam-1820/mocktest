const { DataTypes } = require('sequelize');

module.exports = (dbConfig, Sequelize) => {
    const subjectAcademicPaperAssociationSchema = dbConfig.define('subjectAcademicPaperAssociation',
        {

            subjectAcademicPaperAssociationId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            subjectId: {
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
    return subjectAcademicPaperAssociationSchema
}