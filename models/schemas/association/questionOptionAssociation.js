const { DataTypes } = require('sequelize');

module.exports = (dbConfig, Sequelize) => {
    const questionOptionAssociationSchema = dbConfig.define('questionOptionAssociation',
        {

            questionOptionAssociationId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            questionId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            optionId: {
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
    return questionOptionAssociationSchema
}