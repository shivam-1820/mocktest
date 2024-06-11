const { DataTypes } = require('sequelize');

module.exports = (dbConfig, Sequelize) => {
    const courseExamAssociationSchema = dbConfig.define('courseExamAssociation',
        {

            courseExamAssociationId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            courseId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            examId: {
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
    return courseExamAssociationSchema
}