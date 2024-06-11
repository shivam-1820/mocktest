const { DataTypes } = require('sequelize');
const constant = require('../../../helper/constant');

module.exports = (dbConfig, Sequelize) => {
    const academicPaperSchema = dbConfig.define('academicPaper',
        {

            academicPaperId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            titleEn: {
                type: DataTypes.STRING,
                allowNull: false
            },
            titleHi: {
                type: DataTypes.STRING,
                allowNull: false
            },
            descriptionEn: {
                type: DataTypes.STRING,
                allowNull: true
            },
            descriptionHi: {
                type: DataTypes.STRING,
                allowNull: true
            },
            paperType: {
                type: DataTypes.ENUM(
                    constant.PAPER_TYPE.DUMMY,
                    constant.PAPER_TYPE.PRACTICE,
                    constant.PAPER_TYPE.PREVIOUS,
                    constant.PAPER_TYPE.SAMPLE
                ),
                allowNull: false
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            createdBy: {
                type: DataTypes.ENUM(
                    constant.ROLES.ADMIN,
                    constant.ROLES.EDUCATOR
                ),
                allowNull: false
            },
            createdById: {
                type: Sequelize.UUID,
                allowNull: true
            },
            paperStatus: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            createdAt: true,
            updatedAt: false,
        }
    );
    return academicPaperSchema
}