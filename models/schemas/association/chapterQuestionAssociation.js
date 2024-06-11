const { DataTypes } = require('sequelize');

module.exports = (dbConfig, Sequelize) => {
    const chapterQuestionAssociationSchema = dbConfig.define('chapterQuestionAssociation',
        {

            chapterQuestionAssociationId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            chapterId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            questionId: {
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
    return chapterQuestionAssociationSchema
}