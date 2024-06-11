const { DataTypes } = require('sequelize');

module.exports = (dbConfig, Sequelize) => {
    const examSubjectAssociationSchema = dbConfig.define('examSubjectAssociation',
        {

            examSubjectAssociationId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            examId: {
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
    return examSubjectAssociationSchema
}