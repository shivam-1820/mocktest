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
                allowNull: true
            },
            descriptionEn: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            descriptionHi: {
                type: DataTypes.TEXT,
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
            isFree: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            price: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            duration: {                                 // in second
                type: DataTypes.STRING,
                allowNull: false,
                set(value) {
                    const time = this.setDataValue('duration', value * 60)
                }
            }
        },
        {
            createdAt: true,
            updatedAt: false,
        }
    );
    return academicPaperSchema
}