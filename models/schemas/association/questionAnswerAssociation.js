const { DataTypes } = require('sequelize');

module.exports = (dbConfig, Sequelize) => {
    const questionAnswerAssociationSchema = dbConfig.define('questionAnswerAssociation',
        {

            questionAnswerAssociationId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            questionId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            answerId: {
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
    return questionAnswerAssociationSchema
}