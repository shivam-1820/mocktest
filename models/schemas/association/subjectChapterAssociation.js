const { DataTypes } = require('sequelize');

module.exports = (dbConfig, Sequelize) => {
    const subjectChapterAssociationSchema = dbConfig.define('subjectChapterAssociation',
        {

            subjectChapterAssociationId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            subjectId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            chapterId: {
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
    return subjectChapterAssociationSchema
}