const { DataTypes } = require('sequelize');

module.exports = (dbConfig, Sequelize) => {
    const educatorTestSeriesQuestionAssociationSchema = dbConfig.define('educatorTestSeriesQuestionAssociation',
        {

            testSeriesQuestionAssociationId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            questionId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            testSeriesId: {
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
    return educatorTestSeriesQuestionAssociationSchema
}